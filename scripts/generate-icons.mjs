import sharp from "sharp";
import { readFileSync } from "fs";
import { join } from "path";

const svgBuffer = readFileSync(join(process.cwd(), "public/icon.svg"));

const sizes = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 32, name: "favicon-32.png" },
];

for (const { size, name } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(process.cwd(), "public", name));
  console.log(`OK ${name} (${size}x${size})`);
}

console.log("\n全アイコン生成完了");
