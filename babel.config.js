module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'nativewind/babel',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/utils': './src/utils',
          '@/services': './src/services',
          '@/store': './src/store',
          '@/hooks': './src/hooks',
          '@/types': './src/types',
          '@/assets': './src/assets',
          '@/mock': './src/mock',
          '@/navigation': './src/navigation',
          '@/providers': './src/providers',
        },
      },
    ],
  ],
};
