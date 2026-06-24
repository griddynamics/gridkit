/// <reference types='vitest' />
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import dts from 'vite-plugin-dts';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { visualizer } from 'rollup-plugin-visualizer';
import preserveDirectives from 'rollup-preserve-directives';
import tsconfigPaths from 'vite-tsconfig-paths';
import { sharedAlias } from './vitest.alias';

export default defineConfig(() => {
  const enableVisualizer = process.env.VISUALIZER === 'true';

  // Custom plugin to copy AI markdown and JSON files to ai/ directory
  const copyAiMarkdownPlugin = () => {
    const findAiAssets = (dir: string, baseDir: string = dir): string[] => {
      const files: string[] = [];
      try {
        const entries = readdirSync(dir);
        for (const entry of entries) {
          const fullPath = path.join(dir, entry);
          const stat = statSync(fullPath);
          if (stat.isDirectory()) {
            files.push(...findAiAssets(fullPath, baseDir));
          } else if (entry.endsWith('.md') || entry.endsWith('.json')) {
            files.push(fullPath);
          }
        }
      } catch {
        // Ignore errors
      }
      return files;
    };

    return {
      name: 'copy-ai-markdown',
      writeBundle() {
        const aiDir = path.join(__dirname, 'src/ai');
        const outDir = path.join(__dirname, '../../dist/libs/ui');

        if (!existsSync(aiDir)) {
          return;
        }

        const mdFiles = findAiAssets(aiDir);

        mdFiles.forEach((sourcePath) => {
          // Get relative path from src/ai
          const relativePath = path.relative(path.join(__dirname, 'src/ai'), sourcePath);
          // Copy to ai/ (without src/ prefix) to match TypeScript output structure
          const destPath = path.join(outDir, 'ai', relativePath);
          const destDir = path.dirname(destPath);

          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
          }

          copyFileSync(sourcePath, destPath);
        });
      },
    };
  };

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/libs/ui',
    optimizeDeps: {
      include: ['@emotion/react'], // Force tree-shaking
    },
    plugins: [
      tsconfigPaths(),
      react({ jsxImportSource: '@emotion/react' }),
      babel({
        plugins: [['@emotion/babel-plugin', { sourceMap: false, autoLabel: 'never', cssPropOptimization: true }]],
      }),
      nxCopyAssetsPlugin(['*.md', 'llms.txt', 'gridKit_logo.png', 'package.json']),
      copyAiMarkdownPlugin(),
      dts({ entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json') }),
      visualizer({ open: enableVisualizer, filename: 'stats.html', template: 'treemap' }),
      preserveDirectives(),
    ],
    build: {
      outDir: '../../dist/libs/ui',
      emptyOutDir: true,
      reportCompressedSize: true,
      cssCodeSplit: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      lib: {
        name: 'ui',
        entry: {
          index: 'src/index.ts',
          'ai/index': 'src/ai/index.ts',
        },
      },
      rollupOptions: {
        output: [
          // ESM output — .js files, consumed via "import" condition
          {
            format: 'es',
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: '[name].js',
            chunkFileNames: 'chunks/[name].js',
            assetFileNames: (assetInfo) => (assetInfo.name?.endsWith('.css') ? '[name].[ext]' : 'assets/[name].[ext]'),
          },
          // CJS output — .cjs files, consumed via "require" condition
          {
            format: 'cjs',
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: '[name].cjs',
            chunkFileNames: 'chunks/[name].cjs',
            assetFileNames: (assetInfo) => (assetInfo.name?.endsWith('.css') ? '[name].[ext]' : 'assets/[name].[ext]'),
          },
        ],
        treeshake: {
          preset: 'recommended',
          moduleSideEffects: (id) => {
            return /@emotion/.test(id);
          },
        },
        onwarn(warning, warn) {
          // Avatar.User is a compound component with an intentional mutual import between
          // atoms/Avatar and molecules/AvatarUser. Suppress only those cross-chunk reexport warnings.
          if (warning.code === 'CYCLIC_CROSS_CHUNK_REEXPORT' && warning.message.includes('AvatarUser')) {
            return;
          }
          warn(warning);
        },
        preserveEntrySignatures: 'strict',
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          /^@emotion\/.+/,
          /^@visx\/.+/,
          /^d3-.+/,
          /^embla-.+/,
          'uuid',
        ],
      },
    },
    resolve: {
      alias: sharedAlias,
    },
  };
});
