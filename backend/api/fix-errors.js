const fs = require('fs');
const path = require('path');

const apiSrcPath = path.join(__dirname, 'src');

// Function to fix error references in content
function fixErrorReferences(content, filePath) {
  let modified = false;

  // Pattern 1: Fix catch blocks with error.message and error.status
  const catchBlockPattern = /catch\s*\(\s*error\s*\)\s*\{[\s\S]*?(?=\n\s*\}[\s\S]*?(?:\n\s*@|$))/g;

  content = content.replace(catchBlockPattern, (catchBlock) => {
    if (catchBlock.includes('error.message') || catchBlock.includes('error.status')) {
      if (!catchBlock.includes('extractError(error)')) {
        // Add extractError call after catch opening brace
        const lines = catchBlock.split('\n');
        const indent = lines[1]?.match(/^(\s*)/)?.[1] || '      ';
        lines.splice(1, 0, `${indent}const err = extractError(error);`);

        // Replace error.message with err.message and error.status with err.status
        let fixed = lines.join('\n')
          .replace(/error\.message/g, 'err.message')
          .replace(/error\.status/g, 'err.status');

        modified = true;
        return fixed;
      }
    }
    return catchBlock;
  });

  // Add import if modified and import doesn't exist
  if (modified && !content.includes("import { extractError }")) {
    // Calculate relative path to utils/error.utils
    const dir = path.dirname(filePath);
    const utilsPath = path.join(apiSrcPath, 'utils', 'error.utils');
    const relativePath = path.relative(dir, utilsPath)
      .replace(/\\/g, '/')
      .replace(/\.ts$/, '');

    const importStatement = `import { extractError } from '${relativePath.startsWith('.') ? relativePath : './' + relativePath}';\n`;

    // Find last import statement
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLine = content.indexOf('\n', lastImportIndex);
      if (endOfLine !== -1) {
        content = content.slice(0, endOfLine + 1) + importStatement + content.slice(endOfLine + 1);
      }
    }
  }

  return { content, modified };
}

// Recursively process all TypeScript files
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', '.git'].includes(file)) {
        fixedCount += processDirectory(fullPath);
      }
    } else if (file.endsWith('.ts') && file !== 'error.utils.ts') {
      const content = fs.readFileSync(fullPath, 'utf8');
      const result = fixErrorReferences(content, fullPath);

      if (result.modified) {
        fs.writeFileSync(fullPath, result.content, 'utf8');
        console.log(`✓ Fixed: ${path.relative(apiSrcPath, fullPath)}`);
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

console.log('Starting error reference fix...\n');
const total = processDirectory(apiSrcPath);
console.log(`\n✅ Fixed ${total} files`);
