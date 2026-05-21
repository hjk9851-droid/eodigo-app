/**
 * 아이콘 생성 스크립트
 * 실행: node generate-icons.js
 * 필요: npm install sharp
 *
 * SVG → 각 해상도별 PNG 생성
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [
  { density: 'mdpi',    size: 48,  round: 48  },
  { density: 'hdpi',    size: 72,  round: 72  },
  { density: 'xhdpi',   size: 96,  round: 96  },
  { density: 'xxhdpi',  size: 144, round: 144 },
  { density: 'xxxhdpi', size: 192, round: 192 },
];

const svgPath = path.join(__dirname, 'icon.svg');
const resDir = path.join(__dirname, 'app', 'src', 'main', 'res');

async function generate() {
  for (const { density, size, round } of sizes) {
    const outDir = path.join(resDir, `mipmap-${density}`);
    fs.mkdirSync(outDir, { recursive: true });

    // 일반 아이콘
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, 'ic_launcher.png'));

    // 라운드 아이콘 (원형 마스크)
    const mask = Buffer.from(
      `<svg><circle cx="${round/2}" cy="${round/2}" r="${round/2}"/></svg>`
    );
    await sharp(svgPath)
      .resize(round, round)
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toFile(path.join(outDir, 'ic_launcher_round.png'));

    console.log(`✅ ${density}: ${size}x${size}`);
  }
  console.log('\n아이콘 생성 완료!');
}

generate().catch(console.error);
