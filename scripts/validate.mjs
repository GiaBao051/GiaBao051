import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const content = readFileSync(resolve(ROOT, "README.md"), "utf8");

// 1. Check for forbidden keywords
console.log("=== CHECKING FORBIDDEN STRINGS ===");
const forbidden = [
  "GIBOR",
  "Calculator",
  "QuanLiBaiDoXe",
  "capsule-render",
  "readme-typing-svg",
  "github-profile-summary-cards",
  "streak?username"
];
let forbiddenFound = 0;
for (const word of forbidden) {
  if (content.includes(word)) {
    console.error(`FORBIDDEN WORD FOUND: "${word}"`);
    forbiddenFound++;
  }
}
if (forbiddenFound === 0) {
  console.log("PASSED: No forbidden strings found in README.md.");
}

// 2. Check local asset paths
console.log("\n=== CHECKING LOCAL ASSET PATHS ===");
const localRegex = /\.\/assets\/[^\s\)\"\']+/g;
const matches = content.match(localRegex) || [];
const uniqueAssets = [...new Set(matches)];
let missingAssets = 0;
for (const asset of uniqueAssets) {
  const fullPath = resolve(ROOT, asset);
  if (existsSync(fullPath)) {
    console.log(`EXISTS: ${asset}`);
  } else {
    console.error(`MISSING: ${asset}`);
    missingAssets++;
  }
}
if (missingAssets === 0) {
  console.log(`PASSED: All ${uniqueAssets.length} referenced local assets exist.`);
}

// 3. Check XML validity of all SVG assets
console.log("\n=== CHECKING SVG XML SYNTAX ===");
const svgs = [
  "assets/brand/monogram.svg",
  "assets/brand/hero-dark.svg",
  "assets/brand/hero-light.svg",
  "assets/projects/codesense/architecture.svg",
  "assets/projects/coffee-wpf/architecture.svg",
  "assets/research/huim.svg",
  "assets/generated/metrics.svg",
  "assets/generated/activity.svg",
];
let svgErrors = 0;
for (const s of svgs) {
  const p = resolve(ROOT, s);
  if (!existsSync(p)) {
    console.error(`MISSING SVG: ${s}`);
    svgErrors++;
    continue;
  }
  const raw = readFileSync(p, "utf8");
  const badAmp = raw.match(/&(?!(amp|lt|gt|quot|apos);)/g);
  if (badAmp) {
    console.error(`UNESCAPED AMPERSAND IN: ${s}`);
    svgErrors++;
  }
  if (!raw.includes("<svg") || !raw.includes("</svg>")) {
    console.error(`MALFORMED ROOT TAG IN: ${s}`);
    svgErrors++;
  }
}
if (svgErrors === 0) {
  console.log(`PASSED: All ${svgs.length} SVGs are well-formed.`);
}

// 4. Check External URLs
console.log("\n=== CHECKING EXTERNAL REPOSITORIES & URLS ===");
const urls = [
  "https://github.com/Peo051/love-sense-ai",
  "https://github.com/Peo051/Coffee_Shop_Management_WPF",
  "https://github.com/Peo051/Coffee_Shop_Management_Web",
  "https://github.com/Peo051/YOLOv8_Detect_SignLanguage",
  "https://github.com/Peo051/HUIMiner",
  "https://github.com/Peo051/CLHMiner",
  "https://github.com/Peo051/FEACP",
  "https://github.com/Peo051/portfolio",
  "https://peo051.github.io/portfolio/",
  "https://love-sense-ai.vercel.app",
];
for (const u of urls) {
  try {
    const res = await fetch(u, { method: "HEAD", headers: { "User-Agent": "Validator" } });
    console.log(`STATUS ${res.status}: ${u}`);
  } catch (err) {
    console.warn(`FETCH FAILED: ${u} (${err.message})`);
  }
}

console.log("\n=== ALL SYSTEM CHECKS COMPLETED ===");
