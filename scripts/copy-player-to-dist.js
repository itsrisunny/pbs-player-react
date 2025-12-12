// scripts/copy-player-to-dist.js
// CommonJS so it runs with "node" in most node setups.
const fs = require("fs");
const path = require("path");

const src = path.resolve(process.cwd(), "src", "player.js");
const outDir = path.resolve(process.cwd(), "dist");
const dest = path.join(outDir, "player.js");

if (!fs.existsSync(src)) {
  console.error("ERROR: src/player.js not found. Place your downloaded player.js at src/player.js");
  process.exit(1);
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log("Copied src/player.js -> dist/player.js");
