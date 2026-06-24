import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import airbnb from 'eslint-config-airbnb';
import airbnbTypescript from 'eslint-config-airbnb-typescript';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginReact from 'eslint-plugin-react';

export default tseslint.config(
  { ignores: ['dist', 'apps/agent-service/docs/**', '**/.next/'] },
  {
    root: true,
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      airbnb,
      airbnbTypescript,
      'plugin:prettier/recommended',
      prettier,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
      'jsx-a11y': eslintPluginJsxA11y,
      react: eslintPluginReact,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-hooks/rules-of-hooks': 'error',
      'prettier/prettier': [
        'error',
        { semi: true, singleQuote: true, trailingComma: 'es5', tabWidth: 2, printWidth: 100 },
      ],
      'max-len': [
        'error',
        {
          code: 120,
          tabWidth: 2,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreUrls: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'array-element-newline': ['error', { multiline: true, minItems: 3 }],
      'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
      'object-curly-newline': [
        'error | warn',
        {
          ObjectExpression: { multiline: true, minProperties: 3, consistent: true },
          ObjectPattern: { multiline: true, minProperties: 3, consistent: true },
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'function-paren-newline': ['error', 'multiline'],
      'import/no-default-export': 'error',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
      'react/react-in-jsx-scope': 'off',
      endOfLine: 'auto',
      insertFinalNewline: true,
    },
  }
);
