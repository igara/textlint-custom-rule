module.exports = {
  plugins: {
    '@textlint/text': {
      extensions: [
        '.php',
        '.ctp',
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.css',
        '.scss',
        '.md',
        '.txt',
        '.csv',
        '.json',
        '.yaml',
        '.yml',
        '.sql',
      ],
    },
  },
  rules: {
    '@igara/writing-guideline': {
      severity: 'warning',
    },
  },
};
