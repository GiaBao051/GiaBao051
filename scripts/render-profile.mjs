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
    const x = 50 + i * 275;
    return `
      <g transform="translate(${x} 125)">
        <text class="metric-value" y="0">${escapeXml(compact(value))}</text>
        <text class="metric-label" y="32">${escapeXml(label)}</text>
      </g>`;
  }).join("");

  const topLangs = summary.languages.slice(0, 3);
  const langText = topLangs.map((l) => `${l.name} (${l.count})`).join("  ·  ");

  const pushed = summary.lastPush
    ? new Date(summary.lastPush).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Ho_Chi_Minh",
      })
    : "—";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="340" viewBox="0 0 1200 340" role="img" aria-label="Live GitHub engineering metrics">
  <defs>
    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
      .eyebrow { font: 700 19px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 2px; fill: #58A6FF; }
      .metric-value { font: 800 44px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; fill: #FFFFFF; }
      .metric-label { font: 700 18px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 1.2px; fill: #94A3B8; }
      .signal { font: 700 24px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; fill: #FFFFFF; }
      .small { font: 500 18px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #94A3B8; }
      .pulse { animation: pulseAnim 2.4s ease-in-out infinite; }
      @keyframes pulseAnim { 0%,100% { opacity:.4 } 50% { opacity:1 } }
      @media (prefers-reduced-motion: reduce) { .pulse { animation: none; } }
    </style>
  </defs>

  <!-- Pure Black Background -->
  <rect width="1200" height="340" rx="20" fill="#000000"/>
  <rect x="1" y="1" width="1198" height="338" rx="19" fill="none" stroke="#1F2937" stroke-width="1.8"/>

  <g transform="translate(50, 48)">
    <circle cx="6" cy="-5" r="5" fill="#3FB950" class="pulse"/>
    <text x="22" y="0" class="eyebrow">LIVE GITHUB METRICS // TELEMETRY</text>
  </g>

  ${statsSvg}

  <line x1="50" y1="190" x2="1150" y2="190" stroke="#1F2937" stroke-width="1.5"/>

  <!-- Lower Details -->
  <g transform="translate(50, 235)">
    <text x="0" y="0" class="eyebrow" fill="#22D3EE">LATEST ACTIVE REPOSITORY</text>
    <text x="0" y="36" class="signal">${escapeXml(summary.currentRepo)}</text>
    <text x="0" y="70" class="small">Last public push: ${escapeXml(pushed)}</text>
  </g>

  <g transform="translate(680, 235)">
    <text x="0" y="0" class="eyebrow" fill="#A78BFA">CORE LANGUAGES</text>
    <text x="0" y="36" class="signal">${escapeXml(langText || "C#  ·  TypeScript  ·  Python")}</text>
    <text x="0" y="70" class="small">Tracked from public repositories</text>
  </g>
</svg>`;
}

function renderActivity(summary) {
  const days = summary.days.slice(-84);
  const width = 1200;
  const x0 = 50;
  const y0 = 95;
  const gap = 6;
  const cell = 18;

  const colors = ["#0A121D", "#0E3047", "#125A6B", "#1DA598", "#5EEAD4"];

  const cells = days.map((day, index) => {
    const col = Math.floor(index / 7);
    const row = index % 7;
    const x = x0 + col * (cell + gap);
    const y = y0 + row * (cell + gap);
    return `
      <g>
        <rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="4"
              fill="${colors[day.level]}" stroke="#132335" stroke-width="0.8">
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

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="280" viewBox="0 0 ${width} 280" role="img" aria-label="12-week GitHub contribution activity">
  <defs>
    <style>
      .eyebrow { font: 700 19px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 2px; fill: #58A6FF; }
      .label { font: 600 18px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #94A3B8; }
      .value { font: 800 28px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; fill: #FFFFFF; }
    </style>
  </defs>

  <rect width="${width}" height="280" rx="20" fill="#000000"/>
  <rect x="1" y="1" width="${width - 2}" height="278" rx="19" fill="none" stroke="#1F2937" stroke-width="1.8"/>

  <text x="50" y="52" class="eyebrow">ACTIVITY // LAST 12 WEEKS</text>

  ${cells}

  <line x1="820" y1="40" x2="820" y2="240" stroke="#1F2937" stroke-width="1.5"/>

  <g transform="translate(860, 80)">
    <text x="0" y="0" class="label">CONTRIBUTIONS (84D)</text>
    <text x="0" y="36" class="value">${escapeXml(compact(total84))}</text>

    <text x="0" y="85" class="label">ACTIVE DAYS</text>
    <text x="0" y="121" class="value">${escapeXml(activeDays)}</text>
  </g>

  <g transform="translate(1030, 80)">
    <text x="0" y="0" class="label">PEAK RECORD</text>
    <text x="0" y="36" class="value">${escapeXml(compact(maxDay.contributionCount))}</text>
    <text x="0" y="70" class="label">${escapeXml(maxDay.date)}</text>
  </g>
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
