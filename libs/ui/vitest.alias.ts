import * as path from 'path';

export const sharedAlias = {
  'gd-design-core': path.resolve(__dirname, '../design-core/src/index.ts'),
  '@': path.resolve(__dirname, './src'),
  '@types': path.resolve(__dirname, './src/types/'),
  '@constants': path.resolve(__dirname, './src/constants/'),
  '@utils': path.resolve(__dirname, './src/utils/'),
  '@hooks': path.resolve(__dirname, './src/hooks/'),
  '@tokens': path.resolve(__dirname, './src/tokens/'),
  '@assets': path.resolve(__dirname, './src/assets/'),
  '@components': path.resolve(__dirname, './src/components/'),
  '@stories': path.resolve(__dirname, './src/stories/'),
  '@testUtils': path.resolve(__dirname, './src/test-utils.tsx'),
  '@playUtils': path.resolve(__dirname, './src/utils/play'),
} as const;
