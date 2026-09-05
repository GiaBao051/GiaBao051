import { mkdir, writeFile } from "node:fs/promises";

const USER = process.env.PROFILE_USER || "Peo051";
const TOKEN = process.env.GITHUB_TOKEN || "";
const OUT = new URL("../assets/generated/", import.meta.url);
const API_VERSION = "2026-03-10";

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": API_VERSION,
  "User-Agent": `${USER}-profile-renderer`,
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const escapeXml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const compact = (n = 0) =>
  new Intl.NumberFormat("en", {
    notation: n >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(n);

async function rest(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) {
    throw new Error(`REST ${response.status}: ${path}`);
  }
  return response.json();
}

async function graphql(query, variables) {
  if (!TOKEN) throw new Error("GraphQL requires GITHUB_TOKEN.");

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join("; "));
  }
  return payload.data;
}

function levelIndex(level) {
  return {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  }[level] ?? 0;
}

function syntheticDaysFromEvents(events) {
  const map = new Map();
  const now = new Date();

  for (let i = 0; i < 364; i++) {
    const d = new Date(now);
    d.setUTCDate(now.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, 0);
  }

  for (const event of events) {
    const key = event.created_at?.slice(0, 10);
    if (!map.has(key)) continue;

    const weight =
      event.type === "PushEvent"
        ? Math.max(1, event.payload?.commits?.length || 1)
        : ["PullRequestEvent", "IssuesEvent", "CreateEvent"].includes(event.type)
          ? 1
          : 0;

    map.set(key, (map.get(key) || 0) + weight);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, contributionCount]) => ({
      date,
      contributionCount,
      level:
        contributionCount === 0 ? 0 :
        contributionCount <= 2 ? 1 :
        contributionCount <= 5 ? 2 :
        contributionCount <= 9 ? 3 : 4,
    }));
}

async function loadLiveData() {
  const query = `
    query Profile($login: String!) {
      user(login: $login) {
        login
        name
        followers { totalCount }
        repositories(first: 100, orderBy: { field: PUSHED_AT, direction: DESC }) {
          totalCount
          nodes {
            name
            url
            stargazerCount
            forkCount
            isFork
            isArchived
            isPrivate
            pushedAt
            primaryLanguage {
              name
              color
            }
          }
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await graphql(query, { login: USER });
    const user = data.user;
    const repos = user.repositories.nodes.filter(
      (repo) => !repo.isPrivate && !repo.isFork
    );
    const days = user.contributionsCollection.contributionCalendar.weeks
      .flatMap((week) => week.contributionDays)
      .map((day) => ({
        date: day.date,
        contributionCount: day.contributionCount,
        level: levelIndex(day.contributionLevel),
      }));

    return {
      source: "graphql",
      user: {
        login: user.login,
        name: user.name || user.login,
        followers: user.followers.totalCount,
      },
      repos,
      contributions: user.contributionsCollection.contributionCalendar.totalContributions,
      days,
    };
  } catch (error) {
    console.warn(`GraphQL unavailable, using REST fallback: ${error.message}`);

    const [user, repos, events] = await Promise.all([
      rest(`/users/${USER}`),
      rest(`/users/${USER}/repos?per_page=100&sort=pushed&type=owner`),
      rest(`/users/${USER}/events/public?per_page=100`),
    ]);

    return {
      source: "rest-fallback",
      user: {
        login: user.login,
        name: user.name || user.login,
        followers: user.followers,
      },
      repos: repos.filter((repo) => !repo.fork).map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        stargazerCount: repo.stargazers_count,
        forkCount: repo.forks_count,
        isFork: repo.fork,
        isArchived: repo.archived,
        isPrivate: repo.private,
        pushedAt: repo.pushed_at,
        primaryLanguage: repo.language ? { name: repo.language, color: null } : null,
      })),
      contributions: null,
      days: syntheticDaysFromEvents(events),
    };
  }
}

function summarize(data) {
  const repos = data.repos.filter((repo) => !repo.isArchived);
  const profileRepo = USER.toLowerCase();

  const activeRepos = repos
    .filter((repo) => repo.name.toLowerCase() !== profileRepo)
    .sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));

  const current = activeRepos[0] || repos[0] || null;

  const stars = repos.reduce((sum, repo) => sum + (repo.stargazerCount || 0), 0);
  const forks = repos.reduce((sum, repo) => sum + (repo.forkCount || 0), 0);

  const languageCounts = new Map();
  for (const repo of repos) {
    const language = repo.primaryLanguage?.name;
    if (!language) continue;
    languageCounts.set(language, (languageCounts.get(language) || 0) + 1);
  }

  const languages = [...languageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const recent28 = data.days.slice(-28);
  const contributions28 = recent28.reduce((sum, day) => sum + day.contributionCount, 0);

  return {
    repoCount: repos.length,
    stars,
    forks,
    followers: data.user.followers,
    contributions: data.contributions,
    contributions28,
    currentRepo: current?.name || "No recent public repository",
    currentRepoUrl: current?.url || `https://github.com/${USER}`,
    lastPush: current?.pushedAt || null,
    languages,
    days: data.days,
    source: data.source,
  };
}

function renderMetrics(summary) {
  const stats = [
    ["PUBLIC REPOS", summary.repoCount],
    ["FOLLOWERS", summary.followers],
    ["STARS", summary.stars],
    [
      summary.contributions == null ? "ACTIVITY / 28D" : "CONTRIBUTIONS",
      summary.contributions == null ? summary.contributions28 : summary.contributions,
    ],
  ];

  const statsSvg = stats.map(([label, value], i) => {
    const x = 58 + i * 205;
    return `
      <g transform="translate(${x} 105)">
        <text class="metric-value" y="0">${escapeXml(compact(value))}</text>
        <text class="metric-label" y="29">${escapeXml(label)}</text>
      </g>`;
  }).join("");

  const langTotal = Math.max(1, summary.languages.reduce((s, x) => s + x.count, 0));
  let langOffset = 0;
  const langBars = summary.languages.map((lang, i) => {
    const width = Math.max(18, Math.round((lang.count / langTotal) * 295));
    const y = 218 + i * 25;
    const result = `
      <g>
        <text x="890" y="${y}" class="lang-name">${escapeXml(lang.name)}</text>
        <rect x="1003" y="${y - 11}" width="145" height="8" rx="4" fill="#15263A"/>
        <rect x="1003" y="${y - 11}" width="${Math.min(145, width)}" height="8" rx="4" class="lang-bar">
          <animate attributeName="width" from="0" to="${Math.min(145, width)}" dur="${0.55 + i * 0.08}s" fill="freeze"/>
        </rect>
      </g>`;
    langOffset += width;
    return result;
  }).join("");

  const pushed = summary.lastPush
    ? new Date(summary.lastPush).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Ho_Chi_Minh",
      })
    : "—";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360" role="img" aria-label="Live GitHub engineering metrics">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="360">
      <stop stop-color="#07111F"/>
      <stop offset=".62" stop-color="#09192A"/>
      <stop offset="1" stop-color="#0B202C"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" x2="1">
      <stop stop-color="#58A6FF"/>
      <stop offset=".52" stop-color="#22D3EE"/>
      <stop offset="1" stop-color="#A78BFA"/>
    </linearGradient>
    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M28 0H0V28" fill="none" stroke="#16304B" stroke-width="1" opacity=".32"/>
    </pattern>
    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .title { font: 700 22px Inter, Segoe UI, Arial, sans-serif; fill: #F4F8FC; }
      .eyebrow { font: 600 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 2px; fill: #58A6FF; }
      .metric-value { font: 700 31px Inter, Segoe UI, Arial, sans-serif; fill: #F7FAFD; }
      .metric-label { font: 600 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 1.4px; fill: #7E96AD; }
      .signal { font: 600 15px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #DDEAF5; }
      .small { font: 500 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #7891A9; }
      .lang-name { font: 600 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #A9BDD0; }
      .lang-bar { fill: url(#accent); }
      .pulse { animation: pulse 2.4s ease-in-out infinite; transform-origin: center; }
      .scan { animation: scan 6s linear infinite; }
      @keyframes pulse { 0%,100% { opacity:.35 } 50% { opacity:1 } }
      @keyframes scan { from { transform: translateX(-280px) } to { transform: translateX(1280px) } }
      @media (prefers-reduced-motion: reduce) {
        .pulse, .scan { animation: none; }
      }
    </style>
  </defs>

  <rect width="1200" height="360" rx="24" fill="url(#bg)"/>
  <rect x="1" y="1" width="1198" height="358" rx="23" fill="none" stroke="#223A53"/>
  <rect width="1200" height="360" rx="24" fill="url(#grid)"/>

  <g class="scan" opacity=".42">
    <rect x="-210" y="0" width="210" height="360" fill="url(#accent)" opacity=".05"/>
    <line x1="0" y1="16" x2="0" y2="344" stroke="#22D3EE" stroke-width="1"/>
  </g>

  <text x="58" y="49" class="eyebrow">LIVE / ENGINEERING TELEMETRY</text>
  <text x="58" y="80" class="title">GitHub signal, rendered by this repository</text>

  ${statsSvg}

  <line x1="58" y1="171" x2="1142" y2="171" stroke="#1D344A"/>

  <g transform="translate(58 207)">
    <circle cx="5" cy="4" r="5" fill="#3FB950" class="pulse"/>
    <text x="21" y="9" class="eyebrow" fill="#3FB950">CURRENT SIGNAL</text>
    <text x="0" y="51" class="signal">${escapeXml(summary.currentRepo)}</text>
    <text x="0" y="76" class="small">last public push · ${escapeXml(pushed)}</text>

    <text x="0" y="125" class="small">source · ${escapeXml(summary.source)}</text>
    <text x="165" y="125" class="small">forks · ${escapeXml(compact(summary.forks))}</text>
    <text x="285" y="125" class="small">28d contributions · ${escapeXml(compact(summary.contributions28))}</text>
  </g>

  <text x="890" y="198" class="eyebrow">LANGUAGE FOOTPRINT</text>
  ${langBars}

  <path d="M816 193V327" stroke="#1D344A"/>
</svg>`;
}

function renderActivity(summary) {
  const days = summary.days.slice(-84);
  const width = 1200;
  const x0 = 54;
  const y0 = 85;
  const gap = 4;
  const cell = 14;

  const colors = ["#132235", "#163B4D", "#176B75", "#20A7A0", "#5EEAD4"];

  const cells = days.map((day, index) => {
    const col = Math.floor(index / 7);
    const row = index % 7;
    const x = x0 + col * (cell + gap);
    const y = y0 + row * (cell + gap);
    const delay = (index % 17) * 0.025;
    return `
      <g>
        <rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3"
              fill="${colors[day.level]}" opacity=".96">
          <animate attributeName="opacity" values=".55;1;.78" dur="2.8s" begin="${delay}s" repeatCount="indefinite"/>
        </rect>
        <title>${escapeXml(day.date)} · ${day.contributionCount} contribution(s)</title>
      </g>`;
  }).join("");

  const total84 = days.reduce((s, d) => s + d.contributionCount, 0);
  const activeDays = days.filter((d) => d.contributionCount > 0).length;
  const maxDay = days.reduce((best, day) =>
    day.contributionCount > best.contributionCount ? day : best,
    { contributionCount: 0, date: "—" }
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="235" viewBox="0 0 ${width} 235" role="img" aria-label="Animated 12-week GitHub contribution pulse">
  <defs>
    <linearGradient id="wave" x1="0" x2="1">
      <stop stop-color="#58A6FF"/>
      <stop offset=".5" stop-color="#22D3EE"/>
      <stop offset="1" stop-color="#A78BFA"/>
    </linearGradient>
    <style>
      .eyebrow { font: 600 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 2px; fill: #58A6FF; }
      .label { font: 500 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #7F97AE; }
      .value { font: 700 18px Inter, Segoe UI, Arial, sans-serif; fill: #EDF5FC; }
      .sweep { animation: sweep 5.5s linear infinite; }
      @keyframes sweep { from { transform: translateX(-40px) } to { transform: translateX(860px) } }
      @media (prefers-reduced-motion: reduce) { .sweep { animation:none; } }
    </style>
  </defs>

  <rect width="${width}" height="235" rx="22" fill="#081522"/>
  <rect x="1" y="1" width="${width - 2}" height="233" rx="21" fill="none" stroke="#20364C"/>

  <text x="54" y="44" class="eyebrow">ACTIVITY / LAST 12 WEEKS</text>
  <text x="54" y="65" class="label">Contribution pulse generated from GitHub data</text>

  ${cells}

  <g class="sweep" opacity=".6">
    <line x1="54" y1="77" x2="54" y2="215" stroke="#5EEAD4" stroke-width="1.5"/>
    <circle cx="54" cy="77" r="3" fill="#5EEAD4"/>
  </g>

  <line x1="855" y1="34" x2="855" y2="203" stroke="#1C3348"/>

  <text x="900" y="67" class="label">CONTRIBUTIONS / 84D</text>
  <text x="900" y="94" class="value">${escapeXml(compact(total84))}</text>

  <text x="900" y="128" class="label">ACTIVE DAYS</text>
  <text x="900" y="155" class="value">${escapeXml(activeDays)}</text>

  <text x="1035" y="128" class="label">PEAK DAY</text>
  <text x="1035" y="155" class="value">${escapeXml(compact(maxDay.contributionCount))}</text>
  <text x="1035" y="177" class="label">${escapeXml(maxDay.date)}</text>

  <line x1="900" y1="195" x2="1138" y2="195" stroke="url(#wave)" stroke-width="2"/>
</svg>`;
}

function renderStatus(summary) {
  return {
    generatedAt: new Date().toISOString(),
    user: USER,
    source: summary.source,
    metrics: {
      publicRepos: summary.repoCount,
      followers: summary.followers,
      stars: summary.stars,
      forks: summary.forks,
      contributions: summary.contributions,
      contributionsLast28Days: summary.contributions28,
      currentRepository: summary.currentRepo,
      currentRepositoryUrl: summary.currentRepoUrl,
      lastPush: summary.lastPush,
      languages: summary.languages,
    },
  };
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const data = await loadLiveData();
  const summary = summarize(data);

  await Promise.all([
    writeFile(new URL("metrics.svg", OUT), renderMetrics(summary), "utf8"),
    writeFile(new URL("activity.svg", OUT), renderActivity(summary), "utf8"),
    writeFile(
      new URL("status.json", OUT),
      JSON.stringify(renderStatus(summary), null, 2) + "\n",
      "utf8"
    ),
  ]);

  console.log(`Rendered profile visuals for ${USER} via ${summary.source}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
