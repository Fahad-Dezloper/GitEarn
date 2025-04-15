import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure dist directory exists
if (!fs.existsSync(path.join(__dirname, './dist'))) {
  console.error('Error: dist directory does not exist. Make sure Vite build succeeded.');
  process.exit(1);
}

// Create icons directory if it doesn't exist
// const iconsDir = path.join(__dirname, '../dist/icons');
// if (!fs.existsSync(iconsDir)) {
//   fs.mkdirSync(iconsDir, { recursive: true });
// }

// Check if manifest.json exists
const manifestPath = path.join(__dirname, './manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('Error: manifest.json not found in project root.');
  process.exit(1);
}

// Copy manifest.json
try {
  fs.copyFileSync(
    manifestPath,
    path.join(__dirname, './dist/manifest.json')
  );
  console.log('manifest.json copied to dist directory');
} catch (error) {
  console.error('Error copying manifest.json:', error);
  process.exit(1);
}

console.log('Note: No icons have been added to the extension.');
console.log('Extension files copied to dist directory');