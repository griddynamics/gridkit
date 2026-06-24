#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');

const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: create-component <ComponentName>');
  process.exit(1);
}
const camelCaseToTitleCase = (str) =>
  str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (char) => char.toUpperCase());

inquirer
  .prompt([
    {
      type: 'list',
      name: 'componentType',
      message: 'Choose component type:',
      choices: ['core', 'layout', 'domainSpecific', 'widget', 'templates'],
    },
  ])
  .then((answers) => {
    const componentType = answers.componentType;

    const componentDirectory = path.join(
      process.cwd(),
      'libs',
      'ui',
      'src',
      'components',
      componentType,
      componentName
    );
    const tokensDirectory = path.join(process.cwd(), 'libs', 'ui', 'src', 'tokens');

    if (fs.existsSync(componentDirectory)) {
      console.error(`Directory '${componentDirectory}' already exists.`);
      process.exit(1);
    }

    fs.mkdirSync(componentDirectory, { recursive: true });
    fs.mkdirSync(tokensDirectory, { recursive: true });

    const placeholderComponentStorybookRoot = camelCaseToTitleCase(componentType);
    const placeholderComponentNameLowercase = componentName.toLowerCase();
    const templatesDir = path.join(__dirname, 'templates');

    const files = [
      { name: `${componentName}.tsx`, template: 'component.tsx.template' },
      { name: `${componentName}.types.ts`, template: 'types.ts.template' },
      { name: `${componentName}Styled.tsx`, template: 'styled.tsx.template' },
      { name: `constants.ts`, template: 'constants.ts.template' },
      { name: `index.ts`, template: 'index.ts.template' },
      { name: `${componentName}.test.tsx`, template: 'test.tsx.template' },
      { name: `${componentName}.stories.tsx`, template: 'stories.tsx.template' },
    ];
    const tokenFiles = [{ name: `${placeholderComponentNameLowercase}.ts`, template: 'componentToken.ts.template' }];

    files.forEach((file) => {
      const templatePath = path.join(templatesDir, file.template);
      let templateContent = fs.readFileSync(templatePath, 'utf-8');

      // Replace placeholders
      templateContent = templateContent.replace(/&PLACEHOLDER_COMPONENT_NAME&/g, componentName);
      templateContent = templateContent.replace(/&PLACEHOLDER_COMPONENT_TYPE&/g, componentType);
      templateContent = templateContent.replace(
        /&PLACEHOLDER_COMPONENT_NAME_LOWERCASE&/g,
        placeholderComponentNameLowercase
      );
      templateContent = templateContent.replace(
        /&PLACEHOLDER_COMPONENT_STORYBOOK_ROOT&/g,
        placeholderComponentStorybookRoot
      );

      const filePath = path.join(componentDirectory, file.name);
      fs.writeFileSync(filePath, templateContent);
      console.log(`Created ${filePath}`);
    });

    tokenFiles.forEach((file) => {
      const templatePath = path.join(templatesDir, file.template);
      let templateContent = fs.readFileSync(templatePath, 'utf-8');

      // Replace placeholders
      templateContent = templateContent.replace(
        /&PLACEHOLDER_COMPONENT_NAME_LOWERCASE&/g,
        placeholderComponentNameLowercase
      );

      const filePath = path.join(tokensDirectory, file.name);
      fs.writeFileSync(filePath, templateContent);
      console.log(`Created ${filePath}`);
    });

    // Add the new component to the index.ts file of the componentType folder
    const indexFilePath = path.join(process.cwd(), 'libs', 'ui', 'src', 'components', componentType, 'index.ts');
    const indexTokensFilePath = path.join(process.cwd(), 'libs', 'ui', 'src', 'tokens', 'index.ts');
    const themeDefaultFilePath = path.join(process.cwd(), 'libs', 'ui', 'src', 'tokens', 'defaultTheme.ts');

    // Ensure the index.ts files exist; if not, create them
    if (!fs.existsSync(indexFilePath)) {
      fs.writeFileSync(indexFilePath, '// Auto-generated exports\n');
      console.log(`Created ${indexFilePath}`);
    }
    if (!fs.existsSync(indexTokensFilePath)) {
      fs.writeFileSync(indexTokensFilePath, '// Auto-generated exports\n');
      console.log(`Created ${indexTokensFilePath}`);
    }
    if (!fs.existsSync(themeDefaultFilePath)) {
      fs.writeFileSync(themeDefaultFilePath, '// Auto-generated exports\n');
      console.log(`Created ${themeDefaultFilePath}`);
    }

    // Read the current content of the files
    let indexContent = fs.readFileSync(indexFilePath, 'utf-8');
    let indexTokensContent = fs.readFileSync(indexTokensFilePath, 'utf-8');
    let themeDefaultContent = fs.readFileSync(themeDefaultFilePath, 'utf-8');

    // Define the export statement to add
    const exportComponentStatement = `export * from './${componentName}';\n`;
    const importTokenStatement = `import { ${placeholderComponentNameLowercase} } from './${placeholderComponentNameLowercase}';`;
    const exportTokenStatement = `export * from './${placeholderComponentNameLowercase}';\n`;
    const exportDefaultTokensStatement = `export const defaultTokens = {`;
    const exportDefaultThemeStatement = `export const defaultTheme = {`;

    let tokenLines = indexTokensContent.trim().split('\n');

    if (!tokenLines.includes(exportTokenStatement)) {
      console.log(tokenLines);
      tokenLines.unshift(exportTokenStatement);
    } else {
      console.log(`Export for ${placeholderComponentNameLowercase} tokens already exists in ${indexTokensFilePath}`);
    }

    if (!tokenLines.includes(importTokenStatement)) {
      tokenLines.unshift(importTokenStatement);
    } else {
      console.log(`Import for ${placeholderComponentNameLowercase} tokens already exists in  ${indexTokensFilePath}`);
    }

    if (tokenLines.includes(exportDefaultTokensStatement)) {
      if (!tokenLines.includes(`${placeholderComponentNameLowercase},`)) {
        tokenLines = tokenLines.map((line) =>
          line.includes(exportDefaultTokensStatement)
            ? line.replace(
                exportDefaultTokensStatement,
                `${exportDefaultTokensStatement}\n${placeholderComponentNameLowercase},`
              )
            : line
        );
      } else {
        console.log(
          `Export for ${placeholderComponentNameLowercase} tokens already exists in defaultTokens of ${indexTokensFilePath}`
        );
      }
    } else {
      tokenLines.push(`${exportDefaultTokensStatement}\n  ${placeholderComponentNameLowercase}, \n}`);
    }

    let themeLines = themeDefaultContent.trim().split('\n');

    if (!themeLines.includes(importTokenStatement)) {
      themeLines.unshift(importTokenStatement);
    } else {
      console.log(`Import for ${placeholderComponentNameLowercase} tokens already exists in  ${themeDefaultFilePath}`);
    }

    if (themeLines.includes(exportDefaultThemeStatement)) {
      if (!themeLines.includes(`${placeholderComponentNameLowercase},`)) {
        themeLines = themeLines.map((line) =>
          line.includes(exportDefaultThemeStatement)
            ? line.replace(
                exportDefaultThemeStatement,
                `${exportDefaultThemeStatement}\n${placeholderComponentNameLowercase},`
              )
            : line
        );
      } else {
        console.log(
          `Export for ${placeholderComponentNameLowercase} tokens already exists in defaultTokens of ${themeDefaultFilePath}`
        );
      }
    } else {
      themeLines.push(`${exportDefaultThemeStatement}\n  ${placeholderComponentNameLowercase}, \n}`);
    }

    // Split the content into lines
    const componentLines = indexContent.trim().split('\n');

    // Add the new export statement to respective files if it doesn't already exist
    if (!componentLines.includes(exportComponentStatement.trim())) {
      componentLines.push(exportComponentStatement.trim());
    } else {
      console.log(`Export for ${componentName} already exists in ${indexFilePath}`);
    }

    // Sort the export statements alphabetically
    componentLines.sort();

    // Reconstruct the content
    indexContent = componentLines.join('\n') + '\n';
    indexTokensContent = tokenLines.join('\n') + '\n';
    themeDefaultContent = themeLines.join('\n') + '\n';

    // Write the updated content back to the files
    try {
      fs.writeFileSync(indexFilePath, indexContent);
      console.log(`Updated ${indexFilePath} with sorted exports`);
      fs.writeFileSync(indexTokensFilePath, indexTokensContent);
      console.log(`Updated ${indexTokensFilePath} with sorted exports`);
      fs.writeFileSync(themeDefaultFilePath, themeDefaultContent);
      console.log(`Updated ${themeDefaultFilePath} with defaultTokens`);
    } catch (error) {
      console.error('Failed to update files:', error);
      process.exit(1);
    }

    // Format all files in the component directory and the updated index.ts file with Prettier
    try {
      execSync(`npx prettier --write "${componentDirectory}/**/*.{ts,tsx}" "${indexFilePath}"`, { stdio: 'inherit' });
      execSync(`npx prettier --write "${tokensDirectory}/**/*.{ts,tsx}"`, { stdio: 'inherit' });
      console.log('Prettier formatting applied.');
      execSync(` nx format:write --dirs=${tokensDirectory} && nx run ui:lint --fix`, { stdio: 'inherit' });
      console.log('Linter formatting applied.');
    } catch (error) {
      console.error('Prettier formatting failed, skipping:', error.message);
    }

    console.log(`Component structure '${componentName}' created successfully in '${componentType}'.`);
  });
