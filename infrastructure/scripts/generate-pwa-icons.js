#!/usr/bin/env node

/**
 * Generate PWA Icons Script
 *
 * This script generates all required PWA icons from an SVG source file.
 * It creates multiple PNG sizes for different devices and purposes.
 *
 * Usage: node scripts/generate-pwa-icons.js [source-svg-path]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Icon sizes needed for PWA
const ICON_SIZES = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// Shortcut icon sizes
const SHORTCUT_SIZES = [
  { size: 96, name: 'shortcut-send.png' },
  { size: 96, name: 'shortcut-bills.png' },
  { size: 96, name: 'shortcut-business.png' },
  { size: 96, name: 'shortcut-remit.png' },
];

// Badge icon
const BADGE_SIZE = { size: 72, name: 'badge-72x72.png' };

// Colors for different shortcuts
const SHORTCUT_COLORS = {
  'send': '#3B82F6',      // blue
  'bills': '#10B981',     // green
  'business': '#8B5CF6',  // purple
  'remit': '#F59E0B',     // orange
};

function main() {
  const sourceSvg = process.argv[2] || path.join(__dirname, '../public/icons/icon-144x144.svg');
  const iconsDir = path.join(__dirname, '../public/icons');

  if (!fs.existsSync(sourceSvg)) {
    console.error(`❌ Source SVG not found: ${sourceSvg}`);
    console.log('Creating placeholder icons instead...');
    createPlaceholderIcons(iconsDir);
    return;
  }

  console.log('🎨 Generating PWA icons from SVG...');
  console.log(`Source: ${sourceSvg}`);
  console.log(`Output: ${iconsDir}\n`);

  // Check if ImageMagick or sharp is available
  let useSharp = false;
  try {
    require.resolve('sharp');
    useSharp = true;
    console.log('✓ Using sharp for image conversion');
  } catch {
    try {
      execSync('magick --version', { stdio: 'pipe' });
      console.log('✓ Using ImageMagick for image conversion');
    } catch {
      console.error('❌ Neither sharp nor ImageMagick found.');
      console.log('Creating placeholder icons instead...');
      createPlaceholderIcons(iconsDir);
      return;
    }
  }

  // Generate main icons
  console.log('\n📱 Generating app icons...');
  ICON_SIZES.forEach(({ size, name }) => {
    const outputPath = path.join(iconsDir, name);
    if (useSharp) {
      generateWithSharp(sourceSvg, outputPath, size);
    } else {
      generateWithImageMagick(sourceSvg, outputPath, size);
    }
    console.log(`  ✓ ${name}`);
  });

  // Generate badge icon
  console.log('\n🏷️  Generating badge icon...');
  const badgePath = path.join(iconsDir, BADGE_SIZE.name);
  if (useSharp) {
    generateWithSharp(sourceSvg, badgePath, BADGE_SIZE.size);
  } else {
    generateWithImageMagick(sourceSvg, badgePath, BADGE_SIZE.size);
  }
  console.log(`  ✓ ${BADGE_SIZE.name}`);

  // Generate shortcut icons with colors
  console.log('\n🚀 Generating shortcut icons...');
  SHORTCUT_SIZES.forEach(({ size, name }) => {
    const outputPath = path.join(iconsDir, name);
    const shortcutType = name.split('-')[1].split('.')[0]; // e.g., 'send' from 'shortcut-send.png'
    const color = SHORTCUT_COLORS[shortcutType] || '#3B82F6';

    if (useSharp) {
      generateWithSharp(sourceSvg, outputPath, size, color);
    } else {
      generateWithImageMagick(sourceSvg, outputPath, size, color);
    }
    console.log(`  ✓ ${name} (${color})`);
  });

  console.log('\n✅ All PWA icons generated successfully!');
  console.log('\n📋 Next steps:');
  console.log('  1. Review the generated icons in web/public/icons/');
  console.log('  2. Test the PWA installation on different devices');
  console.log('  3. Run: pnpm run test:pwa');
}

function generateWithSharp(inputPath, outputPath, size, tintColor = null) {
  const sharp = require('sharp');

  let pipeline = sharp(inputPath)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    });

  if (tintColor) {
    // Apply tint to the image
    pipeline = pipeline.tint(tintColor);
  }

  pipeline
    .png()
    .toFile(outputPath);
}

function generateWithImageMagick(inputPath, outputPath, size, backgroundColor = 'none') {
  const cmd = `magick "${inputPath}" -resize ${size}x${size} -background ${backgroundColor} -gravity center -extent ${size}x${size} "${outputPath}"`;
  execSync(cmd, { stdio: 'pipe' });
}

function createPlaceholderIcons(iconsDir) {
  console.log('\n🎨 Creating placeholder PNG icons...');

  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Create a simple placeholder SVG content
  const createPlaceholderSVG = (size, color = '#3B82F6', text = 'K') => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${color}" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.6}" font-weight="bold" fill="white" text-anchor="middle" dy="0.35em">${text}</text>
</svg>`;
  };

  // Generate main icons
  console.log('📱 Generating placeholder app icons...');
  ICON_SIZES.forEach(({ size, name }) => {
    const svgContent = createPlaceholderSVG(size);
    const svgPath = path.join(iconsDir, name.replace('.png', '.svg'));
    fs.writeFileSync(svgPath, svgContent);
    console.log(`  ✓ ${name.replace('.png', '.svg')} (placeholder)`);
  });

  // Generate badge
  console.log('\n🏷️  Generating placeholder badge icon...');
  const badgeSvg = createPlaceholderSVG(BADGE_SIZE.size, '#1E40AF', 'K');
  fs.writeFileSync(path.join(iconsDir, BADGE_SIZE.name.replace('.png', '.svg')), badgeSvg);
  console.log(`  ✓ ${BADGE_SIZE.name.replace('.png', '.svg')} (placeholder)`);

  // Generate shortcuts
  console.log('\n🚀 Generating placeholder shortcut icons...');
  SHORTCUT_SIZES.forEach(({ size, name }) => {
    const shortcutType = name.split('-')[1].split('.')[0];
    const color = SHORTCUT_COLORS[shortcutType] || '#3B82F6';
    const icon = shortcutType[0].toUpperCase();

    const svgContent = createPlaceholderSVG(size, color, icon);
    const svgPath = path.join(iconsDir, name.replace('.png', '.svg'));
    fs.writeFileSync(svgPath, svgContent);
    console.log(`  ✓ ${name.replace('.png', '.svg')} (${color})`);
  });

  console.log('\n✅ Placeholder SVG icons created!');
  console.log('\n⚠️  Note: These are placeholder SVGs. For production:');
  console.log('  1. Install sharp: pnpm add -D sharp');
  console.log('  2. Or install ImageMagick: https://imagemagick.org/');
  console.log('  3. Run this script again to generate PNG icons');
  console.log('  4. Or manually convert SVGs to PNGs');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
