const fs = require('fs');
const path = require('path');

// List of files that need fixing based on the build output
const filesToFix = [
  'src/advanced-payments/merchant-qr/merchant-qr.controller.ts',
  'src/advanced-payments/nfc-payments/nfc-payments.controller.ts',
  'src/advanced-payments/payment-requests/payment-requests.controller.ts',
  'src/advanced-payments/payment-requests/payment-requests.service.ts',
  'src/advanced-payments/payment-security/payment-security.controller.ts',
  'src/advanced-payments/qr-payments/qr-payments.controller.ts',
  'src/advanced-payments/qr-payments/qr-payments.service.ts',
  'src/payments/payments.controller.ts',
  'src/auth/auth.test.ts',
  'src/auth/strategies/jwt.strategy.ts',
];

function fixFile(filePath) {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;

  // Check if file already has the import
  const hasImport = content.includes("import { extractError } from '../utils/error.utils'") ||
                    content.includes("import { extractError } from '../../utils/error.utils'") ||
                    content.includes("import { extractError } from '../../../utils/error.utils'");

  // Calculate the correct import path based on file depth
  const depth = filePath.split('/').length - 2; // -2 because src is the base and filename doesn't count
  const importPath = '../'.repeat(depth) + 'utils/error.utils';

  // Add import if not present
  if (!hasImport && content.includes('error.message') || content.includes('error.status')) {
    // Find the last import statement
    const importRegex = /import\s+.*from\s+['"].*['"];?\n/g;
    const imports = content.match(importRegex);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertPosition = lastImportIndex + lastImport.length;

      content = content.slice(0, insertPosition) +
        `import { extractError } from '${importPath}';\n` +
        content.slice(insertPosition);

      modified = true;
      console.log(`✅ Added import to ${filePath}`);
    }
  }

  // Fix error.message and error.status references within catch blocks
  // Pattern 1: error.message in throw statements
  const pattern1 = /catch\s*\(\s*error\s*\)\s*\{([^}]*?)(?=\n\s*throw)/gs;
  content = content.replace(pattern1, (match, catchBody) => {
    if (!catchBody.includes('const err = extractError(error)')) {
      modified = true;
      return match.replace('{', '{\n      const err = extractError(error);');
    }
    return match;
  });

  // Pattern 2: Replace error.message with err.message
  const pattern2 = /(\s+)error\.message/g;
  if (pattern2.test(content)) {
    content = content.replace(pattern2, '$1err.message');
    modified = true;
  }

  // Pattern 3: Replace error.status with err.status
  const pattern3 = /(\s+)error\.status/g;
  if (pattern3.test(content)) {
    content = content.replace(pattern3, '$1err.status');
    modified = true;
  }

  // Pattern 4: Specific patterns in error handling
  // Replace console.error('...', error.message) patterns
  content = content.replace(/console\.error\(([^,]+),\s*err\.message\)/g,
    'console.error($1, err.message)');

  // Replace logger.error patterns
  content = content.replace(/this\.logger\.error\(`([^`]+)`,\s*err\.message\)/g,
    'this.logger.error(`$1`, err.message)');

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✨ Fixed ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  No changes needed for ${filePath}`);
    return false;
  }
}

// Main execution
console.log('🔧 Starting automated error fixing...\n');

let fixedCount = 0;
let errorCount = 0;

for (const file of filesToFix) {
  try {
    if (fixFile(file)) {
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
    errorCount++;
  }
}

console.log(`\n✅ Fixed ${fixedCount} files`);
if (errorCount > 0) {
  console.log(`❌ Errors encountered: ${errorCount}`);
}
console.log('\n🎉 Done!');
