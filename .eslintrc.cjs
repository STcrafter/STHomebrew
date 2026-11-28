module.exports = {
  // ESLint 8 is a deliberate debt: move to flat config before the next Node bump
  // or when npm audit starts blocking. Node 18 is EOL since April 2025.
  env: { browser: true, es2020: true },
  ignorePatterns: ['src/data/**', 'dist/**'],
  overrides: [
    { files: ['vite.config.js', 'scripts/**', 'tests/**'], env: { node: true } },
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  rules: {
    'react/prop-types': 'off', // если не используете PropTypes
    'react/react-in-jsx-scope': 'off', // для React 17+
  },
};