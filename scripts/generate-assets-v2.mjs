import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

ensureDir(resolve(ROOT, "assets/brand"));
ensureDir(resolve(ROOT, "assets/projects/codesense"));
ensureDir(resolve(ROOT, "assets/projects/coffee-wpf"));
ensureDir(resolve(ROOT, "assets/research"));

function cleanXml(str) {
  return str.replace(/&(?!(amp|lt|gt|quot|apos);)/g, "&amp;");
}

function safeWrite(dest, content) {
  writeFileSync(dest, cleanXml(content), "utf8");
}

// ==========================================
// 1. HERO (Dark & Light) — High Readability
// All text >= 18px! Name: 56px, Roles: 32px/26px, Body: 20px
// Dark background: Pure Black #000000
// ==========================================
function generateHeroV2(theme = "dark") {
  const isDark = theme === "dark";
  const bg = isDark ? "#000000" : "#FFFFFF";
  const border = isDark ? "#1F2937" : "#CBD5E1";
  const gridColor = isDark ? "#1E293B" : "#E2E8F0";
  const gridOpacity = isDark ? "0.35" : "0.5";
  const textPrimary = isDark ? "#FFFFFF" : "#0F172A";
  const textSecondary = isDark ? "#CBD5E1" : "#334155";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const accentPrimary = isDark ? "#58A6FF" : "#0969DA";
  const accentAi = isDark ? "#22D3EE" : "#0891B2";
  const accentResearch = isDark ? "#A78BFA" : "#7C3AED";
  const accentSuccess = isDark ? "#3FB950" : "#16A34A";
  const nodeBg = isDark ? "#080E17" : "#F8FAFC";
  const nodeBorder = isDark ? "#23384D" : "#CBD5E1";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400" role="img" aria-label="Trần Dương Gia Bảo Profile Header">
  <defs>
    <pattern id="heroGrid_${theme}" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M 36 0 L 0 0 0 36" fill="none" stroke="${gridColor}" stroke-width="1" opacity="${gridOpacity}"/>
    </pattern>
    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
      .scan { animation: scanLine 8s linear infinite; }
      .pulse-dot { animation: beaconPulse 2.4s ease-in-out infinite; }
      .flow-dash { stroke-dasharray: 8 10; animation: flowDashAnim 4s linear infinite; }
      @keyframes scanLine {
        0% { transform: translateX(-240px); opacity: 0.1; }
        50% { opacity: 0.35; }
        100% { transform: translateX(1240px); opacity: 0.1; }
      }
      @keyframes beaconPulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
      @keyframes flowDashAnim {
        to { stroke-dashoffset: -36; }
      }
      @media (prefers-reduced-motion: reduce) {
        .scan, .pulse-dot, .flow-dash { animation: none; }
      }
    </style>
  </defs>

  <!-- Frame Base -->
  <rect width="1200" height="400" rx="20" fill="${bg}"/>
  <rect width="1200" height="400" rx="20" fill="url(#heroGrid_${theme})"/>
  <rect x="1" y="1" width="1198" height="398" rx="19" fill="none" stroke="${border}" stroke-width="1.8"/>

  <!-- Scanning Ray -->
  <g class="scan" opacity="0.3">
    <rect x="-180" y="0" width="180" height="400" fill="${accentAi}" opacity="0.04"/>
    <line x1="0" y1="16" x2="0" y2="384" stroke="${accentAi}" stroke-width="1.5"/>
  </g>

  <!-- Top Metadata Bar (All fonts >= 18px) -->
  <g transform="translate(60, 52)">
    <circle cx="6" cy="0" r="6" fill="${accentSuccess}" class="pulse-dot"/>
    <text x="24" y="6" class="mono" font-size="18" font-weight="700" letter-spacing="2" fill="${accentPrimary}">PEO051 // PROFILE</text>
    <text x="1080" y="6" text-anchor="end" class="mono" font-size="18" font-weight="600" fill="${textMuted}">HO CHI MINH CITY, VN</text>
    <line x1="0" y1="20" x2="1080" y2="20" stroke="${border}" stroke-width="1.2"/>
  </g>

  <!-- Left Main Content -->
  <g transform="translate(60, 140)">
    <!-- Name: 56px Bold -->
    <text x="0" y="0" class="sans" font-size="56" font-weight="800" fill="${textPrimary}" letter-spacing="-1">TRẦN DƯƠNG GIA BẢO</text>

    <!-- Roles: 32px / 26px -->
    <text x="0" y="52" class="sans" font-size="32" font-weight="700" fill="${accentPrimary}">
      Software Engineering
      <tspan font-size="26" font-weight="600" fill="${textSecondary}"> · Applied AI · Research</tspan>
    </text>

    <!-- Description: 20px -->
    <text x="0" y="96" class="sans" font-size="20" font-weight="400" fill="${textSecondary}">
      Information Technology student building practical software systems and exploring applied AI.
    </text>

    <!-- Academic Meta: 19px -->
    <g transform="translate(0, 142)">
      <circle cx="6" cy="-6" r="4" fill="${accentPrimary}"/>
      <text x="20" y="0" class="mono" font-size="19" font-weight="600" fill="${textMuted}">HUIT · Information Technology</text>
    </g>
  </g>

  <!-- Right Topology Flow (3 Large Minimal Nodes) -->
  <g transform="translate(800, 130)">
    <rect width="340" height="190" rx="16" fill="${nodeBg}" stroke="${nodeBorder}" stroke-width="1.5"/>
    
    <!-- Header -->
    <text x="24" y="38" class="mono" font-size="18" font-weight="700" letter-spacing="1.5" fill="${accentPrimary}">SYSTEM FOCUS</text>

    <!-- Connectors -->
    <path d="M 68 114 L 140 114" class="flow-dash" stroke="${accentPrimary}" stroke-width="2.5" fill="none"/>
    <path d="M 198 114 L 270 114" class="flow-dash" stroke="${accentAi}" stroke-width="2.5" fill="none"/>

    <!-- Node 1: .NET -->
    <g transform="translate(24, 88)">
      <rect width="64" height="52" rx="10" fill="${isDark ? "#0A1726" : "#EEF2FF"}" stroke="${accentPrimary}" stroke-width="1.6"/>
      <text x="32" y="33" text-anchor="middle" class="sans" font-size="20" font-weight="800" fill="${textPrimary}">.NET</text>
    </g>

    <!-- Node 2: AI -->
    <g transform="translate(140, 88)">
      <rect width="64" height="52" rx="10" fill="${isDark ? "#061F26" : "#ECFEFF"}" stroke="${accentAi}" stroke-width="1.6"/>
      <text x="32" y="33" text-anchor="middle" class="sans" font-size="20" font-weight="800" fill="${textPrimary}">AI</text>
    </g>

    <!-- Node 3: R&D -->
    <g transform="translate(252, 88)">
      <rect width="64" height="52" rx="10" fill="${isDark ? "#1C132E" : "#F5F3FF"}" stroke="${accentResearch}" stroke-width="1.6"/>
      <text x="32" y="33" text-anchor="middle" class="sans" font-size="20" font-weight="800" fill="${textPrimary}">R&amp;D</text>
    </g>

    <text x="24" y="168" class="mono" font-size="18" font-weight="600" fill="${accentSuccess}">ACTIVE DEVELOPMENT</text>
  </g>
</svg>`;
}

// ==========================================
// 2. CODESENSE AI ARCHITECTURE (Simple 4-node)
// All fonts >= 18px! Nodes: 24px, Labels: 18px
// ==========================================
function generateCodeSenseArch() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="220" viewBox="0 0 1200 220" role="img" aria-label="CodeSense AI Architecture Pipeline">
  <defs>
    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
      .flow { stroke-dasharray: 6 8; animation: moveFlow 4s linear infinite; }
      @keyframes moveFlow { to { stroke-dashoffset: -28; } }
      @media (prefers-reduced-motion: reduce) { .flow { animation: none; } }
    </style>
  </defs>

  <rect width="1200" height="220" rx="16" fill="#000000" stroke="#1F2937" stroke-width="1.5"/>

  <!-- Top Title -->
  <text x="50" y="44" class="mono" font-size="19" font-weight="700" letter-spacing="1.5" fill="#22D3EE">ARCHITECTURE // CODESENSE AI PIPELINE</text>

  <!-- Connectors -->
  <path d="M 290 125 L 340 125" class="flow" stroke="#22D3EE" stroke-width="2.5" fill="none"/>
  <polygon points="340,120 350,125 340,130" fill="#22D3EE"/>

  <path d="M 580 125 L 630 125" class="flow" stroke="#22D3EE" stroke-width="2.5" fill="none"/>
  <polygon points="630,120 640,125 630,130" fill="#22D3EE"/>

  <path d="M 870 125 L 920 125" class="flow" stroke="#22D3EE" stroke-width="2.5" fill="none"/>
  <polygon points="920,120 930,125 920,130" fill="#22D3EE"/>

  <!-- Node 1: Student Client -->
  <g transform="translate(50, 75)">
    <rect width="240" height="100" rx="12" fill="#080E17" stroke="#22D3EE" stroke-width="1.5"/>
    <text x="120" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">Student Client</text>
    <text x="120" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">Next.js 14 · Code Editor</text>
  </g>

  <!-- Node 2: Backend Orchestrator -->
  <g transform="translate(340, 75)">
    <rect width="240" height="100" rx="12" fill="#080E17" stroke="#58A6FF" stroke-width="1.5"/>
    <text x="120" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">Backend API</text>
    <text x="120" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">FastAPI · Session JWT</text>
  </g>

  <!-- Node 3: Socratic Engine -->
  <g transform="translate(630, 75)">
    <rect width="240" height="100" rx="12" fill="#080E17" stroke="#A78BFA" stroke-width="1.5"/>
    <text x="120" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">Socratic Engine</text>
    <text x="120" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">LLM Scaffolding</text>
  </g>

  <!-- Node 4: Progressive Hints & DB -->
  <g transform="translate(920, 75)">
    <rect width="230" height="100" rx="12" fill="#080E17" stroke="#3FB950" stroke-width="1.5"/>
    <text x="115" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">Hints &amp; Database</text>
    <text x="115" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">3 Tiers · PostgreSQL</text>
  </g>
</svg>`;
}

// ==========================================
// 3. COFFEE SHOP WPF ARCHITECTURE (Simple 4-node)
// All fonts >= 18px!
// ==========================================
function generateCoffeeArch() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="220" viewBox="0 0 1200 220" role="img" aria-label="Coffee Shop Management System Architecture">
  <defs>
    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
      .flow2 { stroke-dasharray: 6 8; animation: moveFlow2 4s linear infinite; }
      @keyframes moveFlow2 { to { stroke-dashoffset: -28; } }
      @media (prefers-reduced-motion: reduce) { .flow2 { animation: none; } }
    </style>
  </defs>

  <rect width="1200" height="220" rx="16" fill="#000000" stroke="#1F2937" stroke-width="1.5"/>

  <!-- Top Title -->
  <text x="50" y="44" class="mono" font-size="19" font-weight="700" letter-spacing="1.5" fill="#58A6FF">ARCHITECTURE // COFFEE MANAGEMENT &amp; PAYMENT SYSTEM</text>

  <!-- Connectors -->
  <path d="M 290 125 L 340 125" class="flow2" stroke="#58A6FF" stroke-width="2.5" fill="none"/>
  <polygon points="340,120 350,125 340,130" fill="#58A6FF"/>

  <path d="M 580 125 L 630 125" class="flow2" stroke="#58A6FF" stroke-width="2.5" fill="none"/>
  <polygon points="630,120 640,125 630,130" fill="#58A6FF"/>

  <path d="M 870 125 L 920 125" class="flow2" stroke="#58A6FF" stroke-width="2.5" fill="none"/>
  <polygon points="920,120 930,125 920,130" fill="#58A6FF"/>

  <!-- Node 1: WPF Client -->
  <g transform="translate(50, 75)">
    <rect width="240" height="100" rx="12" fill="#080E17" stroke="#58A6FF" stroke-width="1.5"/>
    <text x="120" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">WPF Client</text>
    <text x="120" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">.NET 8 · MVVM · POS</text>
  </g>

  <!-- Node 2: Database -->
  <g transform="translate(340, 75)">
    <rect width="240" height="100" rx="12" fill="#080E17" stroke="#3FB950" stroke-width="1.5"/>
    <text x="120" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">SQL Server Core</text>
    <text x="120" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">Dapper ORM · Inventory</text>
  </g>

  <!-- Node 3: Payment API -->
  <g transform="translate(630, 75)">
    <rect width="240" height="100" rx="12" fill="#080E17" stroke="#58A6FF" stroke-width="1.5"/>
    <text x="120" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">Payment Web API</text>
    <text x="120" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">ASP.NET Core 8</text>
  </g>

  <!-- Node 4: VietQR PayOS -->
  <g transform="translate(920, 75)">
    <rect width="230" height="100" rx="12" fill="#080E17" stroke="#22D3EE" stroke-width="1.5"/>
    <text x="115" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">PayOS VietQR</text>
    <text x="115" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">HMAC-SHA256 Webhook</text>
  </g>
</svg>`;
}

// ==========================================
// 4. HUIM RESEARCH PIPELINE (Simple 4-stage)
// All fonts >= 18px!
// ==========================================
function generateHuimResearch() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="240" viewBox="0 0 1200 240" role="img" aria-label="HUIM Research Pipeline">
  <defs>
    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
      .flow3 { stroke-dasharray: 6 8; animation: moveFlow3 4s linear infinite; }
      @keyframes moveFlow3 { to { stroke-dashoffset: -28; } }
      @media (prefers-reduced-motion: reduce) { .flow3 { animation: none; } }
    </style>
  </defs>

  <rect width="1200" height="240" rx="16" fill="#000000" stroke="#1F2937" stroke-width="1.5"/>

  <!-- Top Title & Award -->
  <g transform="translate(50, 44)">
    <text x="0" y="0" class="mono" font-size="19" font-weight="700" letter-spacing="1.5" fill="#A78BFA">RESEARCH PIPELINE // HIGH-UTILITY ITEMSET MINING</text>
    <text x="1100" y="0" text-anchor="end" class="sans" font-size="18" font-weight="700" fill="#3FB950">🏅 Encouragement Prize · HUIT (AY 2025–2026)</text>
  </g>

  <!-- Connectors -->
  <path d="M 290 145 L 340 145" class="flow3" stroke="#A78BFA" stroke-width="2.5" fill="none"/>
  <polygon points="340,140 350,145 340,150" fill="#A78BFA"/>

  <path d="M 580 145 L 630 145" class="flow3" stroke="#A78BFA" stroke-width="2.5" fill="none"/>
  <polygon points="630,140 640,145 630,150" fill="#A78BFA"/>

  <path d="M 870 145 L 920 145" class="flow3" stroke="#A78BFA" stroke-width="2.5" fill="none"/>
  <polygon points="920,140 930,145 920,150" fill="#A78BFA"/>

  <!-- Stage 1: Transaction DB -->
  <g transform="translate(50, 95)">
    <rect width="240" height="105" rx="12" fill="#080E17" stroke="#A78BFA" stroke-width="1.5"/>
    <text x="120" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">Transaction DB</text>
    <text x="120" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">Positive / Negative Utility</text>
  </g>

  <!-- Stage 2: Utility-List -->
  <g transform="translate(340, 95)">
    <rect width="240" height="105" rx="12" fill="#080E17" stroke="#22D3EE" stroke-width="1.5"/>
    <text x="120" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">Utility Structures</text>
    <text x="120" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">Utility-Lists · Pruning</text>
  </g>

  <!-- Stage 3: Algorithms -->
  <g transform="translate(630, 95)">
    <rect width="240" height="105" rx="12" fill="#080E17" stroke="#58A6FF" stroke-width="1.5"/>
    <text x="120" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">HUIM Algorithms</text>
    <text x="120" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">HUIMiner · CLHMiner · FEACP</text>
  </g>

  <!-- Stage 4: Benchmarks -->
  <g transform="translate(920, 95)">
    <rect width="230" height="105" rx="12" fill="#080E17" stroke="#3FB950" stroke-width="1.5"/>
    <text x="115" y="42" text-anchor="middle" class="sans" font-size="22" font-weight="700" fill="#FFFFFF">Evaluation</text>
    <text x="115" y="74" text-anchor="middle" class="mono" font-size="18" font-weight="500" fill="#94A3B8">Runtime &amp; Memory Metrics</text>
  </g>
</svg>`;
}

// Generate new assets
console.log("Generating redesigned Hero SVGs (Text >= 18px, Pure Black #000000)...");
safeWrite(resolve(ROOT, "assets/brand/hero-dark.svg"), generateHeroV2("dark"));
safeWrite(resolve(ROOT, "assets/brand/hero-light.svg"), generateHeroV2("light"));

console.log("Generating simple architecture SVGs...");
safeWrite(resolve(ROOT, "assets/projects/codesense/architecture.svg"), generateCodeSenseArch());
safeWrite(resolve(ROOT, "assets/projects/coffee-wpf/architecture.svg"), generateCoffeeArch());
safeWrite(resolve(ROOT, "assets/research/huim.svg"), generateHuimResearch());

console.log("All v2 SVG assets generated successfully.");
