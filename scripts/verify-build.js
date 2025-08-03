#!/usr/bin/env node

/**
 * Build verification script
 * This script verifies that the build outputs are correct and functional
 */

const fs = require('fs');
const path = require('path');

function checkFileExists(filePath) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${filePath}`);
  return exists;
}

function checkBuildOutputs() {
  console.log('🔍 Verifying build outputs...\n');

  const requiredFiles = [
    'dist/cjs/index.js',
    'dist/cjs/index.js.map',
    'dist/esm/index.js', 
    'dist/esm/index.js.map',
    'dist/types/index.d.ts',
    'dist/types/types.d.ts',
    'dist/types/config/frameworks.d.ts',
    'dist/types/config/tailwindframeworks.d.ts',
    'dist/types/utils/files.d.ts',
    'dist/types/utils/helpers.d.ts',
    'dist/types/utils/commands.d.ts',
    'bin/create-mycustomlib.js'
  ];

  let allFilesExist = true;

  requiredFiles.forEach(file => {
    if (!checkFileExists(file)) {
      allFilesExist = false;
    }
  });

  if (!allFilesExist) {
    console.log('\n❌ Some build files are missing!');
    process.exit(1);
  }

  console.log('\n✅ All build files exist!');
}

function testImports() {
  console.log('\n🧪 Testing imports...\n');

  try {
    // Test CommonJS import
    const cjsModule = require(path.resolve('dist/cjs/index.js'));
    console.log('✅ CommonJS import successful');
    console.log(`   Exports: ${Object.keys(cjsModule).join(', ')}`);

    // Test specific exports
    if (cjsModule.FRAMEWORKS) {
      console.log('✅ FRAMEWORKS export found');
    } else {
      console.log('❌ FRAMEWORKS export missing');
    }

    if (typeof cjsModule.getVariantByName === 'function') {
      console.log('✅ getVariantByName function export found');
    } else {
      console.log('❌ getVariantByName function export missing');
    }

    if (cjsModule.VERSION) {
      console.log(`✅ VERSION export found: ${cjsModule.VERSION}`);
    } else {
      console.log('❌ VERSION export missing');
    }

  } catch (error) {
    console.log('❌ CommonJS import failed:', error.message);
    process.exit(1);
  }

  // Test TypeScript declarations
  try {
    const typesFile = fs.readFileSync('dist/types/index.d.ts', 'utf8');
    if (typesFile.includes('export') && typesFile.includes('FRAMEWORKS')) {
      console.log('✅ TypeScript declarations look good');
    } else {
      console.log('❌ TypeScript declarations incomplete');
    }
  } catch (error) {
    console.log('❌ Failed to read TypeScript declarations:', error.message);
  }

  // Test CLI binary
  try {
    const binFile = fs.readFileSync('bin/create-mycustomlib.js', 'utf8');
    if (binFile.includes('#!/usr/bin/env node') && binFile.length > 100) {
      console.log('✅ CLI binary generated successfully');
    } else {
      console.log('❌ CLI binary incomplete or missing shebang');
    }
  } catch (error) {
    console.log('❌ Failed to read CLI binary:', error.message);
  }
}

function checkPackageJson() {
  console.log('\n📋 Checking package.json configuration...\n');

  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check exports field
    if (pkg.exports && pkg.exports['.']) {
      console.log('✅ exports field configured');
      
      if (pkg.exports['.'].import && pkg.exports['.'].require) {
        console.log('✅ Dual package exports configured');
      } else {
        console.log('❌ Incomplete dual package exports');
      }
    } else {
      console.log('❌ exports field missing or incomplete');
    }

    // Check main fields
    if (pkg.main && pkg.module && pkg.types) {
      console.log('✅ main, module, and types fields configured');
    } else {
      console.log('❌ Missing main/module/types fields');
    }

    // Check files field
    if (pkg.files && pkg.files.includes('dist')) {
      console.log('✅ files field includes dist directory');
    } else {
      console.log('❌ files field missing or incomplete');
    }

  } catch (error) {
    console.log('❌ Failed to parse package.json:', error.message);
    process.exit(1);
  }
}

function main() {
  console.log('🔧 Build Verification Script for create-mycustomlib\n');

  checkBuildOutputs();
  testImports();
  checkPackageJson();

  console.log('\n🎉 Build verification complete!');
  console.log('\nYour CLI package is ready for publishing. Run:');
  console.log('  npm publish');
  console.log('\nOr test it locally:');
  console.log('  npm link');
  console.log('  create-mycustomlib --help');
}

if (require.main === module) {
  main();
}