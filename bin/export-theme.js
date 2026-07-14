const { writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');
const { cwd } = require('process');

const { defaultTheme } = require('../dist/libs/ui/tokens/defaultTheme.js');

function writeTheme(outputDir, filename) {
  mkdirSync(outputDir, { recursive: true });
  const outputFile = join(outputDir, filename);
  const themeJson = JSON.stringify(defaultTheme, null, 2);
  writeFileSync(outputFile, themeJson, 'utf8');
  console.log(`Theme exported to: ${outputFile} (${(themeJson.length / 1024).toFixed(2)} KB)`);
}

function compileTheme() {
  try {
    writeTheme(join(cwd(), 'libs/ui/.storybook/public'), 'defaultTheme.json');
  } catch (error) {
    console.error('Failed to compile theme:', error);
    process.exit(1);
  }
}

compileTheme();
