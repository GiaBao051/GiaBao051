import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

ensureDir(resolve(ROOT, "assets/brand"));
ensureDir(resolve(ROOT, "assets/diagrams"));
ensureDir(resolve(ROOT, "assets/projects"));

// ==========================================
// 1. BRAND MONOGRAM (assets/brand/monogram.svg)
// ==========================================
function generateMonogram() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="Gia Bảo Monogram">
  <defs>
    <linearGradient id="monoGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#58A6FF"/>
      <stop offset="50%" stop-color="#22D3EE"/>
      <stop offset="100%" stop-color="#A78BFA"/>
    </linearGradient>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F1B2A"/>
      <stop offset="100%" stop-color="#08131F"/>
    </linearGradient>
  </defs>

  <rect x="2" y="2" width="116" height="116" rx="22" fill="url(#bgGrad)" stroke="#1E344A" stroke-width="1.5"/>
  <rect x="8" y="8" width="104" height="104" rx="16" fill="none" stroke="#233B53" stroke-width="0.8" stroke-dasharray="3 3" opacity="0.6"/>

  <!-- Technical Marks -->
  <line x1="2" y1="20" x2="20" y2="2" stroke="#58A6FF" stroke-width="1.5" opacity="0.8"/>
  <line x1="100" y1="118" x2="118" y2="100" stroke="#22D3EE" stroke-width="1.5" opacity="0.8"/>
  <circle cx="110" cy="10" r="2.5" fill="#22D3EE"/>
  <circle cx="10" cy="110" r="2.5" fill="#58A6FF"/>

  <!-- G & B Paths -->
  <!-- G: Outer curve and horizontal bar -->
  <path d="M 52 38 L 38 38 C 29 38 23 44 23 53 L 23 67 C 23 76 29 82 38 82 L 52 82 C 60 82 66 76 66 67 L 66 60 L 46 60"
        fill="none" stroke="url(#monoGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- B: Spine and double loop -->
  <path d="M 68 38 L 84 38 C 91 38 96 42 96 48 C 96 54 91 58 84 58 L 68 58 L 85 58 C 92 58 98 63 98 70 C 98 77 92 82 85 82 L 68 82 Z"
        fill="none" stroke="url(#monoGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>

  <circle cx="68" cy="60" r="3" fill="#3FB950"/>
</svg>`;
}

// ==========================================
// 2. HERO (Dark & Light)
// ==========================================
function generateHero(theme = "dark") {
  const isDark = theme === "dark";
  const bg = isDark ? "#07111F" : "#F8FAFC";
  const border = isDark ? "#1E344A" : "#CBD5E1";
  const gridColor = isDark ? "#16304B" : "#94A3B8";
  const gridOpacity = isDark ? "0.32" : "0.22";
  const textPrimary = isDark ? "#F0F6FC" : "#0F172A";
  const textSecondary = isDark ? "#A8B8C7" : "#334155";
  const textMuted = isDark ? "#71869A" : "#64748B";
  const cardBg = isDark ? "#0D1B2D" : "#FFFFFF";
  const cardBorder = isDark ? "#223B53" : "#E2E8F0";
  const accentPrimary = isDark ? "#58A6FF" : "#0969DA";
  const accentAi = isDark ? "#22D3EE" : "#0891B2";
  const accentResearch = isDark ? "#A78BFA" : "#7C3AED";
  const accentSuccess = isDark ? "#3FB950" : "#16A34A";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="370" viewBox="0 0 1200 370" role="img" aria-label="Trần Dương Gia Bảo — Engineering Dossier">
  <defs>
    <linearGradient id="heroGrad_${theme}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accentPrimary}"/>
      <stop offset="50%" stop-color="${accentAi}"/>
      <stop offset="100%" stop-color="${accentResearch}"/>
    </linearGradient>
    <pattern id="grid_${theme}" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="${gridColor}" stroke-width="1" opacity="${gridOpacity}"/>
    </pattern>
    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif; }
      .scan { animation: scanLine 7s linear infinite; }
      .pulse-beacon { animation: beaconPulse 2.2s ease-in-out infinite; }
      .flow-path { stroke-dasharray: 6 8; animation: flowDash 3.5s linear infinite; }
      @keyframes scanLine {
        0% { transform: translateX(-240px); opacity: 0.1; }
        50% { opacity: 0.4; }
        100% { transform: translateX(1240px); opacity: 0.1; }
      }
      @keyframes beaconPulse {
        0%, 100% { opacity: 0.4; transform: scale(0.92); }
        50% { opacity: 1; transform: scale(1.08); }
      }
      @keyframes flowDash {
        to { stroke-dashoffset: -28; }
      }
      @media (prefers-reduced-motion: reduce) {
        .scan, .pulse-beacon, .flow-path { animation: none; }
      }
    </style>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="370" rx="20" fill="${bg}"/>
  <rect width="1200" height="370" rx="20" fill="url(#grid_${theme})"/>
  <rect x="1" y="1" width="1198" height="368" rx="19" fill="none" stroke="${border}" stroke-width="1.5"/>

  <!-- Scanning Ray -->
  <g class="scan" opacity="0.35">
    <rect x="-180" y="0" width="180" height="370" fill="url(#heroGrad_${theme})" opacity="0.04"/>
    <line x1="0" y1="12" x2="0" y2="358" stroke="${accentAi}" stroke-width="1.2"/>
  </g>

  <!-- Top Header Metadata Line -->
  <g transform="translate(56, 42)">
    <circle cx="4" cy="4" r="4.5" fill="${accentSuccess}" class="pulse-beacon"/>
    <text x="18" y="8" class="mono" font-size="11" font-weight="700" letter-spacing="2" fill="${accentPrimary}">PEO051 / ENGINEERING DOSSIER</text>
    <text x="310" y="8" class="mono" font-size="11" font-weight="500" fill="${textMuted}">// IDENTITY RECORD</text>
    <text x="1088" y="8" text-anchor="end" class="mono" font-size="11" font-weight="600" fill="${textMuted}">RELEASE v2026.09</text>
    <line x1="0" y1="20" x2="1088" y2="20" stroke="${border}" stroke-width="1" stroke-dasharray="4 4"/>
  </g>

  <!-- Left Hero Details -->
  <g transform="translate(56, 110)">
    <!-- Identity Name -->
    <text x="0" y="0" class="sans" font-size="36" font-weight="800" fill="${textPrimary}" letter-spacing="-0.5">TRẦN DƯƠNG GIA BẢO</text>

    <!-- Positioning & Focus -->
    <text x="0" y="42" class="sans" font-size="20" font-weight="700" fill="${textPrimary}">
      SOFTWARE ENGINEERING <tspan fill="${accentAi}">×</tspan> APPLIED AI <tspan fill="${accentResearch}">×</tspan> RESEARCH
    </text>

    <!-- Philosophy -->
    <g transform="translate(0, 78)">
      <rect x="0" y="0" width="440" height="32" rx="8" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1"/>
      <text x="14" y="20" class="mono" font-size="12" font-weight="600" fill="${textSecondary}">
        build systems <tspan fill="${accentPrimary}">·</tspan> study algorithms <tspan fill="${accentAi}">·</tspan> measure results
      </text>
    </g>

    <!-- Academic Coordinates -->
    <g transform="translate(0, 134)">
      <circle cx="5" cy="5" r="3" fill="${accentPrimary}"/>
      <text x="16" y="9" class="mono" font-size="12" font-weight="600" fill="${textSecondary}">HUIT</text>
      <text x="60" y="9" class="mono" font-size="12" font-weight="400" fill="${textMuted}">· Information Technology · Ho Chi Minh City</text>
      <text x="375" y="9" class="mono" font-size="11" font-weight="500" fill="${textMuted}">[10.76°N, 106.66°E]</text>
    </g>
  </g>

  <!-- Right Hero Topology Card -->
  <g transform="translate(710, 84)">
    <rect width="434" height="236" rx="16" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
    
    <!-- Header of Topo Card -->
    <g transform="translate(24, 30)">
      <text x="0" y="0" class="mono" font-size="11" font-weight="700" letter-spacing="1.5" fill="${accentPrimary}">SYSTEM ARCHITECTURE TOPOLOGY</text>
      <circle cx="386" cy="-4" r="3.5" fill="${accentSuccess}"/>
    </g>

    <!-- Interactive Nodes and Dynamic Pipeline -->
    <g transform="translate(24, 76)">
      <!-- Connecting Flow Lines -->
      <path d="M 75 32 L 145 32" class="flow-path" stroke="${accentPrimary}" stroke-width="2" fill="none"/>
      <path d="M 225 32 L 295 32" class="flow-path" stroke="${accentAi}" stroke-width="2" fill="none"/>
      <path d="M 185 58 L 185 96" class="flow-path" stroke="${accentResearch}" stroke-width="2" fill="none"/>

      <!-- Node 1: .NET / Systems -->
      <g transform="translate(0, 8)">
        <rect width="82" height="48" rx="10" fill="${isDark ? "#132338" : "#EEF2FF"}" stroke="${accentPrimary}" stroke-width="1.4"/>
        <text x="41" y="24" text-anchor="middle" class="sans" font-size="12" font-weight="700" fill="${textPrimary}">.NET 8</text>
        <text x="41" y="38" text-anchor="middle" class="mono" font-size="9" font-weight="600" fill="${accentPrimary}">CORE SYS</text>
      </g>

      <!-- Node 2: Applied AI -->
      <g transform="translate(144, 8)">
        <rect width="82" height="48" rx="10" fill="${isDark ? "#0E2838" : "#ECFEFF"}" stroke="${accentAi}" stroke-width="1.4"/>
        <text x="41" y="24" text-anchor="middle" class="sans" font-size="12" font-weight="700" fill="${textPrimary}">AI APP</text>
        <text x="41" y="38" text-anchor="middle" class="mono" font-size="9" font-weight="600" fill="${accentAi}">SOCRATIC</text>
      </g>

      <!-- Node 3: Research / HUIM -->
      <g transform="translate(288, 8)">
        <rect width="98" height="48" rx="10" fill="${isDark ? "#221A3B" : "#F5F3FF"}" stroke="${accentResearch}" stroke-width="1.4"/>
        <text x="49" y="24" text-anchor="middle" class="sans" font-size="12" font-weight="700" fill="${textPrimary}">HUIM R&amp;D</text>
        <text x="49" y="38" text-anchor="middle" class="mono" font-size="9" font-weight="600" fill="${accentResearch}">DATA MINING</text>
      </g>

      <!-- Sub-node: Synthesis / Evaluation -->
      <g transform="translate(130, 96)">
        <rect width="110" height="34" rx="8" fill="${isDark ? "#11252C" : "#F0FDF4"}" stroke="${accentSuccess}" stroke-width="1.2"/>
        <text x="55" y="21" text-anchor="middle" class="mono" font-size="10" font-weight="700" fill="${accentSuccess}">BENCHMARKS</text>
      </g>
    </g>

    <!-- Bottom Telemetry Ticker inside Card -->
    <g transform="translate(24, 212)">
      <line x1="0" y1="-14" x2="386" y2="-14" stroke="${cardBorder}" stroke-width="1"/>
      <text x="0" y="0" class="mono" font-size="10" font-weight="500" fill="${textMuted}">PIPELINE STATUS: VERIFIED</text>
      <text x="386" y="0" text-anchor="end" class="mono" font-size="10" font-weight="600" fill="${accentPrimary}">3 FLAGSHIP REPOS</text>
    </g>
  </g>
</svg>`;
}

// ==========================================
// 3. ENGINEERING DNA (Dark & Light)
// ==========================================
function generateEngineeringDNA(theme = "dark") {
  const isDark = theme === "dark";
  const bg = isDark ? "#07111F" : "#F8FAFC";
  const border = isDark ? "#1E344A" : "#CBD5E1";
  const textPrimary = isDark ? "#F0F6FC" : "#0F172A";
  const textSecondary = isDark ? "#A8B8C7" : "#334155";
  const textMuted = isDark ? "#71869A" : "#64748B";
  const cardBg = isDark ? "#0E1A2B" : "#FFFFFF";
  const cardBorder = isDark ? "#223B53" : "#E2E8F0";
  const accentPrimary = isDark ? "#58A6FF" : "#0969DA";
  const accentAi = isDark ? "#22D3EE" : "#0891B2";
  const accentResearch = isDark ? "#A78BFA" : "#7C3AED";
  const accentSuccess = isDark ? "#3FB950" : "#16A34A";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="320" viewBox="0 0 1200 320" role="img" aria-label="Engineering DNA &amp; Capability Architecture">
  <defs>
    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif; }
      .dna-line { stroke-dasharray: 4 4; }
    </style>
  </defs>

  <!-- Frame Base -->
  <rect width="1200" height="320" rx="18" fill="${bg}"/>
  <rect x="1" y="1" width="1198" height="318" rx="17" fill="none" stroke="${border}" stroke-width="1.5"/>

  <!-- Header -->
  <g transform="translate(48, 38)">
    <text x="0" y="0" class="mono" font-size="11" font-weight="700" letter-spacing="2" fill="${accentPrimary}">01 // ARCHITECTURAL DNA</text>
    <text x="210" y="0" class="mono" font-size="11" font-weight="500" fill="${textMuted}">RELATIONSHIP MATRIX · NOT JUST A SKILL WALL</text>
  </g>

  <!-- Central Root: Software Engineering -->
  <g transform="translate(470, 70)">
    <rect width="260" height="54" rx="12" fill="${cardBg}" stroke="${accentPrimary}" stroke-width="1.8"/>
    <text x="130" y="25" text-anchor="middle" class="sans" font-size="14" font-weight="800" fill="${textPrimary}">SOFTWARE ENGINEERING</text>
    <text x="130" y="42" text-anchor="middle" class="mono" font-size="10" font-weight="600" fill="${accentPrimary}">.NET 8 · APIs · Relational Databases</text>
  </g>

  <!-- Trunk Connector Lines -->
  <path d="M 600 124 L 600 148" stroke="${border}" stroke-width="2" fill="none"/>
  <path d="M 270 148 L 930 148" stroke="${border}" stroke-width="2" fill="none"/>
  <path d="M 270 148 L 270 174" stroke="${accentAi}" stroke-width="2" fill="none"/>
  <path d="M 930 148 L 930 174" stroke="${accentResearch}" stroke-width="2" fill="none"/>

  <!-- Left Pillar: Product Systems & Applied AI -->
  <g transform="translate(80, 174)">
    <rect width="380" height="108" rx="14" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
    <rect x="0" y="0" width="6" height="108" rx="3" fill="${accentAi}"/>
    
    <g transform="translate(24, 26)">
      <text x="0" y="0" class="sans" font-size="14" font-weight="700" fill="${textPrimary}">PRODUCT SYSTEMS &amp; APPLIED AI</text>
      <text x="0" y="20" class="mono" font-size="11" font-weight="600" fill="${accentAi}">Desktop POS &amp; Adaptive Tutoring</text>
      <text x="0" y="44" class="sans" font-size="12" font-weight="400" fill="${textSecondary}">• Next.js + FastAPI + LLM Orchestration (CodeSense AI)</text>
      <text x="0" y="64" class="sans" font-size="12" font-weight="400" fill="${textSecondary}">• WPF Desktop + ASP.NET Core API + VietQR PayOS</text>
    </g>
  </g>

  <!-- Center Connecting Bridge -->
  <g transform="translate(480, 196)">
    <rect width="240" height="64" rx="10" fill="${isDark ? "#0A1726" : "#F1F5F9"}" stroke="${border}" stroke-width="1"/>
    <text x="120" y="26" text-anchor="middle" class="mono" font-size="11" font-weight="700" fill="${accentSuccess}">SYSTEMATIC RIGOR</text>
    <text x="120" y="44" text-anchor="middle" class="sans" font-size="11" font-weight="500" fill="${textMuted}">Design Patterns ⇄ Data Structures</text>
  </g>

  <!-- Right Pillar: Data Systems & Research -->
  <g transform="translate(740, 174)">
    <rect width="380" height="108" rx="14" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
    <rect x="374" y="0" width="6" height="108" rx="3" fill="${accentResearch}"/>

    <g transform="translate(24, 26)">
      <text x="0" y="0" class="sans" font-size="14" font-weight="700" fill="${textPrimary}">DATA MINING &amp; RESEARCH</text>
      <text x="0" y="20" class="mono" font-size="11" font-weight="600" fill="${accentResearch}">High-Utility Itemset Mining (HUIM)</text>
      <text x="0" y="44" class="sans" font-size="12" font-weight="400" fill="${textSecondary}">• Utility-Lists, Search-Space Pruning &amp; Taxonomy</text>
      <text x="0" y="64" class="sans" font-size="12" font-weight="400" fill="${textSecondary}">• HUIMiner, CLHMiner, FEACP Algorithm Benchmarks</text>
    </g>
  </g>
</svg>`;
}

// ==========================================
// 4. FLAGSHIP 01 — CODESENSE AI (Dark & Light)
// ==========================================
function generateCodeSenseCard(theme = "dark") {
  const isDark = theme === "dark";
  const bg = isDark ? "#07111F" : "#F8FAFC";
  const border = isDark ? "#1E344A" : "#CBD5E1";
  const textPrimary = isDark ? "#F0F6FC" : "#0F172A";
  const textSecondary = isDark ? "#A8B8C7" : "#334155";
  const textMuted = isDark ? "#71869A" : "#64748B";
  const cardBg = isDark ? "#0D1A2B" : "#FFFFFF";
  const cardBorder = isDark ? "#223B53" : "#E2E8F0";
  const accentAi = isDark ? "#22D3EE" : "#0891B2";
  const accentPrimary = isDark ? "#58A6FF" : "#0969DA";
  const accentSuccess = isDark ? "#3FB950" : "#16A34A";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="390" viewBox="0 0 1200 390" role="img" aria-label="CodeSense AI System Architecture">
  <defs>
    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif; }
      .flow-arrow { stroke-dasharray: 5 5; animation: dashMove 4s linear infinite; }
      @keyframes dashMove { to { stroke-dashoffset: -20; } }
      @media (prefers-reduced-motion: reduce) { .flow-arrow { animation: none; } }
    </style>
  </defs>

  <rect width="1200" height="390" rx="18" fill="${bg}"/>
  <rect x="1" y="1" width="1198" height="388" rx="17" fill="none" stroke="${border}" stroke-width="1.5"/>

  <!-- Section Header -->
  <g transform="translate(48, 38)">
    <rect x="0" y="-18" width="118" height="24" rx="6" fill="${isDark ? "#0E2A38" : "#E0F2FE"}" stroke="${accentAi}" stroke-width="1"/>
    <text x="59" y="-2" text-anchor="middle" class="mono" font-size="10" font-weight="700" fill="${accentAi}">FLAGSHIP 01</text>
    
    <text x="136" y="0" class="sans" font-size="20" font-weight="800" fill="${textPrimary}">CodeSense AI</text>
    <text x="290" y="0" class="sans" font-size="15" font-weight="600" fill="${accentAi}">— Adaptive Programming Tutor</text>
    <text x="1104" y="0" text-anchor="end" class="mono" font-size="11" font-weight="600" fill="${textMuted}">REPO: Peo051/love-sense-ai</text>
    
    <text x="0" y="24" class="sans" font-size="13" font-weight="400" fill="${textSecondary}">
      Socratic tutoring workflow for beginner C# OOP learners: progressive hinting, AST analysis, and isolated student sessions.
    </text>
  </g>

  <!-- Architecture Pipeline Container -->
  <g transform="translate(48, 106)">
    <!-- 4 Pipeline Stages -->
    
    <!-- Stage 1: Student Client -->
    <g transform="translate(0, 0)">
      <rect width="230" height="165" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
      <rect x="0" y="0" width="230" height="32" rx="12" fill="${isDark ? "#112235" : "#F1F5F9"}"/>
      <text x="14" y="21" class="mono" font-size="11" font-weight="700" fill="${accentPrimary}">01 // STUDENT CLIENT</text>
      
      <g transform="translate(14, 52)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="${textPrimary}">Next.js 14 App Router</text>
        <text x="0" y="22" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• TypeScript + Tailwind CSS</text>
        <text x="0" y="42" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Code Editor Interface</text>
        <text x="0" y="62" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Progressive Hint UI</text>
        <text x="0" y="82" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Client-side State Cache</text>
      </g>
    </g>

    <!-- Connector 1 -> 2 -->
    <path d="M 230 82 L 278 82" class="flow-arrow" stroke="${accentAi}" stroke-width="2" fill="none"/>
    <polygon points="278,78 288,82 278,86" fill="${accentAi}"/>

    <!-- Stage 2: Backend Orchestrator -->
    <g transform="translate(288, 0)">
      <rect width="250" height="165" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
      <rect x="0" y="0" width="250" height="32" rx="12" fill="${isDark ? "#0F2636" : "#F0FDFA"}"/>
      <text x="14" y="21" class="mono" font-size="11" font-weight="700" fill="${accentAi}">02 // BACKEND SERVICE</text>

      <g transform="translate(14, 52)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="${textPrimary}">FastAPI REST Engine</text>
        <text x="0" y="22" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Async Python Runtime</text>
        <text x="0" y="42" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Session Lifecycle Manager</text>
        <text x="0" y="62" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Rate Limiting &amp; Sanitization</text>
        <text x="0" y="82" class="mono" font-size="11" font-weight="500" fill="${accentSuccess}">• Firebase Auth Validator</text>
      </g>
    </g>

    <!-- Connector 2 -> 3 -->
    <path d="M 538 82 L 586 82" class="flow-arrow" stroke="${accentAi}" stroke-width="2" fill="none"/>
    <polygon points="586,78 596,82 586,86" fill="${accentAi}"/>

    <!-- Stage 3: AI Service & LLM -->
    <g transform="translate(596, 0)">
      <rect width="250" height="165" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
      <rect x="0" y="0" width="250" height="32" rx="12" fill="${isDark ? "#1C1B38" : "#F5F3FF"}"/>
      <text x="14" y="21" class="mono" font-size="11" font-weight="700" fill="${isDark ? "#A78BFA" : "#7C3AED"}">03 // AI TUTOR CORE</text>

      <g transform="translate(14, 52)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="${textPrimary}">Socratic LLM Workflow</text>
        <text x="0" y="22" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• C# OOP Concept Mapper</text>
        <text x="0" y="42" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Prompt Scaffolding (No raw code)</text>
        <text x="0" y="62" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Error Diagnostic Prompting</text>
        <text x="0" y="82" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Response Guardrails</text>
      </g>
    </g>

    <!-- Connector 3 -> 4 -->
    <path d="M 846 82 L 894 82" class="flow-arrow" stroke="${accentAi}" stroke-width="2" fill="none"/>
    <polygon points="894,78 904,82 894,86" fill="${accentAi}"/>

    <!-- Stage 4: Evaluation & Persistence -->
    <g transform="translate(904, 0)">
      <rect width="200" height="165" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
      <rect x="0" y="0" width="200" height="32" rx="12" fill="${isDark ? "#13232C" : "#F0FDF4"}"/>
      <text x="14" y="21" class="mono" font-size="11" font-weight="700" fill="${accentSuccess}">04 // EVAL &amp; DB</text>

      <g transform="translate(14, 52)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="${textPrimary}">PostgreSQL Core</text>
        <text x="0" y="22" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• SQLAlchemy ORM</text>
        <text x="0" y="42" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• 3-Tier Progressive Hints</text>
        <text x="0" y="62" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Session History</text>
        <text x="0" y="82" class="mono" font-size="11" font-weight="500" fill="${accentSuccess}">• Privacy Controls</text>
      </g>
    </g>
  </g>

  <!-- Bottom Signals Bar -->
  <g transform="translate(48, 305)">
    <rect width="1104" height="54" rx="10" fill="${isDark ? "#0A1726" : "#F1F5F9"}" stroke="${cardBorder}" stroke-width="1"/>
    
    <g transform="translate(20, 32)">
      <text x="0" y="0" class="mono" font-size="11" font-weight="700" fill="${accentAi}">SIGNALS // </text>
      <text x="76" y="0" class="sans" font-size="12" font-weight="600" fill="${textPrimary}">Target: Beginner C# OOP</text>
      <text x="250" y="0" class="mono" font-size="11" fill="${textMuted}">|</text>
      <text x="270" y="0" class="sans" font-size="12" font-weight="600" fill="${textPrimary}">Method: Socratic Guidance (No direct code answer)</text>
      <text x="640" y="0" class="mono" font-size="11" fill="${textMuted}">|</text>
      <text x="660" y="0" class="sans" font-size="12" font-weight="600" fill="${textPrimary}">Deployment: Vercel (Front) + Render (API)</text>
    </g>
  </g>
</svg>`;
}

// ==========================================
// 5. FLAGSHIP 02 — COFFEE SYSTEM (Dark & Light)
// ==========================================
function generateCoffeeCard(theme = "dark") {
  const isDark = theme === "dark";
  const bg = isDark ? "#07111F" : "#F8FAFC";
  const border = isDark ? "#1E344A" : "#CBD5E1";
  const textPrimary = isDark ? "#F0F6FC" : "#0F172A";
  const textSecondary = isDark ? "#A8B8C7" : "#334155";
  const textMuted = isDark ? "#71869A" : "#64748B";
  const cardBg = isDark ? "#0D1A2B" : "#FFFFFF";
  const cardBorder = isDark ? "#223B53" : "#E2E8F0";
  const accentPrimary = isDark ? "#58A6FF" : "#0969DA";
  const accentSuccess = isDark ? "#3FB950" : "#16A34A";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="390" viewBox="0 0 1200 390" role="img" aria-label="Coffee Shop Management System Architecture">
  <defs>
    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif; }
      .flow-arrow { stroke-dasharray: 5 5; animation: dashMove2 4s linear infinite; }
      @keyframes dashMove2 { to { stroke-dashoffset: -20; } }
      @media (prefers-reduced-motion: reduce) { .flow-arrow { animation: none; } }
    </style>
  </defs>

  <rect width="1200" height="390" rx="18" fill="${bg}"/>
  <rect x="1" y="1" width="1198" height="388" rx="17" fill="none" stroke="${border}" stroke-width="1.5"/>

  <!-- Section Header -->
  <g transform="translate(48, 38)">
    <rect x="0" y="-18" width="118" height="24" rx="6" fill="${isDark ? "#132338" : "#EEF2FF"}" stroke="${accentPrimary}" stroke-width="1"/>
    <text x="59" y="-2" text-anchor="middle" class="mono" font-size="10" font-weight="700" fill="${accentPrimary}">FLAGSHIP 02</text>
    
    <text x="136" y="0" class="sans" font-size="20" font-weight="800" fill="${textPrimary}">Coffee Shop Management System</text>
    <text x="510" y="0" class="sans" font-size="15" font-weight="600" fill="${accentPrimary}">— Desktop POS &amp; Payment Service</text>
    <text x="1104" y="0" text-anchor="end" class="mono" font-size="11" font-weight="600" fill="${textMuted}">REPO: Peo051/Coffee_Shop_Management_WPF</text>
    
    <text x="0" y="24" class="sans" font-size="13" font-weight="400" fill="${textSecondary}">
      WPF (.NET 8) desktop client with MVVM architecture, Dapper ORM, SQL Server, and ASP.NET Core PayOS VietQR payment webhook integration.
    </text>
  </g>

  <!-- Architecture 3-Column Layout -->
  <g transform="translate(48, 106)">
    <!-- Column 1: WPF Desktop Client -->
    <g transform="translate(0, 0)">
      <rect width="360" height="165" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
      <rect x="0" y="0" width="360" height="32" rx="12" fill="${isDark ? "#112235" : "#F1F5F9"}"/>
      <text x="16" y="21" class="mono" font-size="11" font-weight="700" fill="${accentPrimary}">01 // WPF DESKTOP CLIENT (.NET 8)</text>

      <g transform="translate(16, 52)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="${textPrimary}">MVVM Client Layer</text>
        <text x="0" y="22" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Views (XAML Desktop UI, POS, Tables, Staff)</text>
        <text x="0" y="42" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• ViewModels (INotifyPropertyChanged, Commands)</text>
        <text x="0" y="62" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Services (Shift Reconcile, Inventory, Recipes)</text>
        <text x="0" y="82" class="mono" font-size="11" font-weight="500" fill="${accentPrimary}">• Repositories (Dapper Micro-ORM Access)</text>
      </g>
    </g>

    <!-- Connector 1 <-> 2 -->
    <path d="M 360 82 L 418 82" class="flow-arrow" stroke="${accentPrimary}" stroke-width="2" fill="none"/>
    <polygon points="418,78 428,82 418,86" fill="${accentPrimary}"/>

    <!-- Column 2: SQL Server Database -->
    <g transform="translate(428, 0)">
      <rect width="250" height="165" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
      <rect x="0" y="0" width="250" height="32" rx="12" fill="${isDark ? "#142533" : "#F8FAFC"}"/>
      <text x="16" y="21" class="mono" font-size="11" font-weight="700" fill="${accentSuccess}">02 // SQL SERVER DB</text>

      <g transform="translate(16, 52)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="${textPrimary}">Relational Schema</text>
        <text x="0" y="22" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Orders &amp; Invoices Ledger</text>
        <text x="0" y="42" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Real-time Inventory Deduct</text>
        <text x="0" y="62" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Customer Loyalty Points</text>
        <text x="0" y="82" class="mono" font-size="11" font-weight="500" fill="${accentSuccess}">• Shift Cash Reconciliation</text>
      </g>
    </g>

    <!-- Connector 2 <-> 3 -->
    <path d="M 678 82 L 736 82" class="flow-arrow" stroke="${accentPrimary}" stroke-width="2" fill="none"/>
    <polygon points="736,78 746,82 736,86" fill="${accentPrimary}"/>

    <!-- Column 3: Payment Service & Webhook -->
    <g transform="translate(746, 0)">
      <rect width="358" height="165" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
      <rect x="0" y="0" width="358" height="32" rx="12" fill="${isDark ? "#102835" : "#F0FDFA"}"/>
      <text x="16" y="21" class="mono" font-size="11" font-weight="700" fill="${accentPrimary}">03 // PAYMENT API &amp; VIETQR</text>

      <g transform="translate(16, 52)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="${textPrimary}">ASP.NET Core Web API</text>
        <text x="0" y="22" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• PayOS SDK Integration (VietQR dynamic gen)</text>
        <text x="0" y="42" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Webhook Listener for real-time payment</text>
        <text x="0" y="62" class="mono" font-size="11" font-weight="500" fill="${accentSuccess}">• HMAC-SHA256 Signature Verification</text>
        <text x="0" y="82" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Automatic Order State Transition to Paid</text>
      </g>
    </g>
  </g>

  <!-- Bottom Signals Bar -->
  <g transform="translate(48, 305)">
    <rect width="1104" height="54" rx="10" fill="${isDark ? "#0A1726" : "#F1F5F9"}" stroke="${cardBorder}" stroke-width="1"/>
    
    <g transform="translate(20, 32)">
      <text x="0" y="0" class="mono" font-size="11" font-weight="700" fill="${accentPrimary}">FEATURES // </text>
      <text x="86" y="0" class="sans" font-size="12" font-weight="600" fill="${textPrimary}">POS Quầy</text>
      <text x="160" y="0" class="mono" font-size="11" fill="${textMuted}">·</text>
      <text x="175" y="0" class="sans" font-size="12" font-weight="600" fill="${textPrimary}">Kho &amp; Định lượng</text>
      <text x="290" y="0" class="mono" font-size="11" fill="${textMuted}">·</text>
      <text x="305" y="0" class="sans" font-size="12" font-weight="600" fill="${textPrimary}">Khách hàng &amp; Điểm</text>
      <text x="445" y="0" class="mono" font-size="11" fill="${textMuted}">·</text>
      <text x="460" y="0" class="sans" font-size="12" font-weight="600" fill="${textPrimary}">Khuyến mãi linh hoạt</text>
      <text x="610" y="0" class="mono" font-size="11" fill="${textMuted}">·</text>
      <text x="625" y="0" class="sans" font-size="12" font-weight="600" fill="${textPrimary}">Đối soát ca làm</text>
      <text x="735" y="0" class="mono" font-size="11" fill="${textMuted}">·</text>
      <text x="750" y="0" class="sans" font-size="12" font-weight="600" fill="${accentSuccess}">Thanh toán PayOS VietQR Webhook</text>
    </g>
  </g>
</svg>`;
}

// ==========================================
// 6. FLAGSHIP 03 — HUIM RESEARCH (Dark & Light)
// ==========================================
function generateHuimCard(theme = "dark") {
  const isDark = theme === "dark";
  const bg = isDark ? "#07111F" : "#F8FAFC";
  const border = isDark ? "#1E344A" : "#CBD5E1";
  const textPrimary = isDark ? "#F0F6FC" : "#0F172A";
  const textSecondary = isDark ? "#A8B8C7" : "#334155";
  const textMuted = isDark ? "#71869A" : "#64748B";
  const cardBg = isDark ? "#0D1A2B" : "#FFFFFF";
  const cardBorder = isDark ? "#223B53" : "#E2E8F0";
  const accentResearch = isDark ? "#A78BFA" : "#7C3AED";
  const accentAi = isDark ? "#22D3EE" : "#0891B2";
  const accentSuccess = isDark ? "#3FB950" : "#16A34A";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="390" viewBox="0 0 1200 390" role="img" aria-label="HUIM Research Program Pipeline">
  <defs>
    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif; }
      .flow-arrow { stroke-dasharray: 5 5; animation: dashMove3 4s linear infinite; }
      @keyframes dashMove3 { to { stroke-dashoffset: -20; } }
      @media (prefers-reduced-motion: reduce) { .flow-arrow { animation: none; } }
    </style>
  </defs>

  <rect width="1200" height="390" rx="18" fill="${bg}"/>
  <rect x="1" y="1" width="1198" height="388" rx="17" fill="none" stroke="${border}" stroke-width="1.5"/>

  <!-- Section Header -->
  <g transform="translate(48, 38)">
    <rect x="0" y="-18" width="118" height="24" rx="6" fill="${isDark ? "#211B3B" : "#F5F3FF"}" stroke="${accentResearch}" stroke-width="1"/>
    <text x="59" y="-2" text-anchor="middle" class="mono" font-size="10" font-weight="700" fill="${accentResearch}">FLAGSHIP 03</text>
    
    <text x="136" y="0" class="sans" font-size="20" font-weight="800" fill="${textPrimary}">HUIM Research Program</text>
    <text x="410" y="0" class="sans" font-size="15" font-weight="600" fill="${accentResearch}">— High-Utility Itemset Mining</text>
    
    <!-- Prize Badge -->
    <g transform="translate(730, -18)">
      <rect width="374" height="24" rx="6" fill="${isDark ? "#172A24" : "#ECFDF5"}" stroke="${accentSuccess}" stroke-width="1"/>
      <text x="187" y="16" text-anchor="middle" class="sans" font-size="11" font-weight="700" fill="${accentSuccess}">🏅 Student Research Competition HUIT · Encouragement Prize</text>
    </g>
    
    <text x="0" y="24" class="sans" font-size="13" font-weight="400" fill="${textSecondary}">
      Topic: "Optimizing Time in Mining High Utility Itemsets on Positive and Negative Profit Transaction Databases".
    </text>
  </g>

  <!-- Research Pipeline 4 Columns -->
  <g transform="translate(48, 106)">
    <!-- Column 1: Input & Data Modeling -->
    <g transform="translate(0, 0)">
      <rect width="240" height="165" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
      <rect x="0" y="0" width="240" height="32" rx="12" fill="${isDark ? "#112235" : "#F1F5F9"}"/>
      <text x="14" y="21" class="mono" font-size="11" font-weight="700" fill="${textPrimary}">01 // TRANSACTION DB</text>

      <g transform="translate(14, 52)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="${textPrimary}">Database &amp; Profits</text>
        <text x="0" y="22" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Transactions with Quantities</text>
        <text x="0" y="42" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Positive &amp; Negative Profits</text>
        <text x="0" y="62" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Transaction Utility (TU)</text>
        <text x="0" y="82" class="mono" font-size="11" font-weight="500" fill="${accentAi}">• Subtree Utility Evaluation</text>
      </g>
    </g>

    <!-- Connector 1 -> 2 -->
    <path d="M 240 82 L 288 82" class="flow-arrow" stroke="${accentResearch}" stroke-width="2" fill="none"/>
    <polygon points="288,78 298,82 288,86" fill="${accentResearch}"/>

    <!-- Column 2: Data Structure Representation -->
    <g transform="translate(298, 0)">
      <rect width="250" height="165" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
      <rect x="0" y="0" width="250" height="32" rx="12" fill="${isDark ? "#181E38" : "#EEF2FF"}"/>
      <text x="14" y="21" class="mono" font-size="11" font-weight="700" fill="${accentResearch}">02 // UTILITY STRUCTURES</text>

      <g transform="translate(14, 52)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="${textPrimary}">Utility-List &amp; Taxonomy</text>
        <text x="0" y="22" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• UtilityList [TID, iutils, rutils]</text>
        <text x="0" y="42" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Taxonomy Trees &amp; Nodes</text>
        <text x="0" y="62" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Upper-Bound Pruning Rules</text>
        <text x="0" y="82" class="mono" font-size="11" font-weight="500" fill="${accentResearch}">• Negative Item Split Handling</text>
      </g>
    </g>

    <!-- Connector 2 -> 3 -->
    <path d="M 548 82 L 596 82" class="flow-arrow" stroke="${accentResearch}" stroke-width="2" fill="none"/>
    <polygon points="596,78 606,82 596,86" fill="${accentResearch}"/>

    <!-- Column 3: Algorithms Family -->
    <g transform="translate(606, 0)">
      <rect width="270" height="165" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
      <rect x="0" y="0" width="270" height="32" rx="12" fill="${isDark ? "#211A3A" : "#F5F3FF"}"/>
      <text x="14" y="21" class="mono" font-size="11" font-weight="700" fill="${accentResearch}">03 // ALGORITHM ENGINES</text>

      <g transform="translate(14, 52)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="${textPrimary}">HUIM Series Implementations</text>
        <text x="0" y="22" class="mono" font-size="11" font-weight="600" fill="${accentResearch}">• HUIMiner (Utility-list baseline)</text>
        <text x="0" y="42" class="mono" font-size="11" font-weight="600" fill="${accentResearch}">• CLHMiner (Cross-level taxonomy)</text>
        <text x="0" y="62" class="mono" font-size="11" font-weight="600" fill="${accentResearch}">• FEACP (Efficient candidate pruning)</text>
        <text x="0" y="82" class="mono" font-size="11" font-weight="500" fill="${textMuted}">• Java High-performance loops</text>
      </g>
    </g>

    <!-- Connector 3 -> 4 -->
    <path d="M 876 82 L 924 82" class="flow-arrow" stroke="${accentResearch}" stroke-width="2" fill="none"/>
    <polygon points="924,78 934,82 924,86" fill="${accentResearch}"/>

    <!-- Column 4: Benchmarking & Proof -->
    <g transform="translate(934, 0)">
      <rect width="170" height="165" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.2"/>
      <rect x="0" y="0" width="170" height="32" rx="12" fill="${isDark ? "#122624" : "#ECFDF5"}"/>
      <text x="14" y="21" class="mono" font-size="11" font-weight="700" fill="${accentSuccess}">04 // METRICS</text>

      <g transform="translate(14, 52)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="${textPrimary}">Profiling</text>
        <text x="0" y="22" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• MemoryLogger</text>
        <text x="0" y="42" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Execution Time (ms)</text>
        <text x="0" y="62" class="mono" font-size="11" font-weight="500" fill="${textSecondary}">• Candidate Count</text>
        <text x="0" y="82" class="mono" font-size="11" font-weight="500" fill="${accentSuccess}">• MinUtil Sensitivity</text>
      </g>
    </g>
  </g>

  <!-- Bottom Signals Bar -->
  <g transform="translate(48, 305)">
    <rect width="1104" height="54" rx="10" fill="${isDark ? "#0A1726" : "#F1F5F9"}" stroke="${cardBorder}" stroke-width="1"/>
    
    <g transform="translate(20, 32)">
      <text x="0" y="0" class="mono" font-size="11" font-weight="700" fill="${accentResearch}">PAPERS &amp; REPOS // </text>
      <text x="140" y="0" class="mono" font-size="12" font-weight="600" fill="${textPrimary}">Peo051/HUIMiner</text>
      <text x="290" y="0" class="mono" font-size="11" fill="${textMuted}">·</text>
      <text x="310" y="0" class="mono" font-size="12" font-weight="600" fill="${textPrimary}">Peo051/CLHMiner</text>
      <text x="460" y="0" class="mono" font-size="11" fill="${textMuted}">·</text>
      <text x="480" y="0" class="mono" font-size="12" font-weight="600" fill="${textPrimary}">Peo051/FEACP</text>
      <text x="610" y="0" class="mono" font-size="11" fill="${textMuted}">|</text>
      <text x="630" y="0" class="sans" font-size="12" font-weight="600" fill="${textSecondary}">Advisors: ThS. Vũ Văn Vinh, HV. Phạm Tấn Thuận (04/2026)</text>
    </g>
  </g>
</svg>`;
}

function cleanXml(str) {
  return str.replace(/&(?!(amp|lt|gt|quot|apos);)/g, "&amp;");
}

function safeWrite(dest, content) {
  writeFileSync(dest, cleanXml(content), "utf8");
}

// Generate all assets
console.log("Generating brand assets...");
safeWrite(resolve(ROOT, "assets/brand/monogram.svg"), generateMonogram());
safeWrite(resolve(ROOT, "assets/brand/hero-dark.svg"), generateHero("dark"));
safeWrite(resolve(ROOT, "assets/brand/hero-light.svg"), generateHero("light"));

console.log("Generating diagram assets...");
safeWrite(resolve(ROOT, "assets/diagrams/engineering-dna-dark.svg"), generateEngineeringDNA("dark"));
safeWrite(resolve(ROOT, "assets/diagrams/engineering-dna-light.svg"), generateEngineeringDNA("light"));

console.log("Generating project architecture assets...");
safeWrite(resolve(ROOT, "assets/projects/codesense-ai-dark.svg"), generateCodeSenseCard("dark"));
safeWrite(resolve(ROOT, "assets/projects/codesense-ai-light.svg"), generateCodeSenseCard("light"));

safeWrite(resolve(ROOT, "assets/projects/coffee-system-dark.svg"), generateCoffeeCard("dark"));
safeWrite(resolve(ROOT, "assets/projects/coffee-system-light.svg"), generateCoffeeCard("light"));

safeWrite(resolve(ROOT, "assets/projects/huim-research-dark.svg"), generateHuimCard("dark"));
safeWrite(resolve(ROOT, "assets/projects/huim-research-light.svg"), generateHuimCard("light"));

console.log("All vector assets generated successfully.");
