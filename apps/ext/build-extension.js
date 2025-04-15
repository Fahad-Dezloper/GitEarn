import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, './dist');
const assetsDir = path.join(distDir, 'assets');
const manifestPath = path.join(__dirname, './manifest.json');
const distManifestPath = path.join(distDir, 'manifest.json');

// Make sure dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Error: dist directory does not exist. Make sure Vite build succeeded.');
  process.exit(1);
}

// Check if manifest.json exists
if (!fs.existsSync(manifestPath)) {
  console.error('❌ Error: manifest.json not found in project root.');
  process.exit(1);
}

// Copy manifest.json to dist
try {
  fs.copyFileSync(manifestPath, distManifestPath);
  console.log('✅ manifest.json copied to dist directory');
} catch (error) {
  console.error('❌ Error copying manifest.json:', error);
  process.exit(1);
}

// Find the correct CSS file in dist/assets/
let cssFile = null;

if (fs.existsSync(assetsDir)) {
  cssFile = fs.readdirSync(assetsDir).find(file =>
    file.endsWith('.css') && file.startsWith('index')
  );
}

if (!cssFile) {
  console.error('❌ Error: No CSS file found in dist/assets.');
  process.exit(1);
}

// Load and update manifest.json
try {
  const manifest = JSON.parse(fs.readFileSync(distManifestPath, 'utf-8'));

  // Update CSS file reference
  if (manifest.content_scripts) {
    manifest.content_scripts.forEach(script => {
      if (script.css) {
        script.css = [`assets/${cssFile}`];
      }
    });
  }

  // Save updated manifest.json
  fs.writeFileSync(distManifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ Updated manifest.json with CSS: assets/${cssFile}`);
} catch (error) {
  console.error('❌ Error updating manifest.json:', error);
  process.exit(1);
}

console.log('🚀 Extension build process completed successfully.');
