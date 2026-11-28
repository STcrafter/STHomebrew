module.exports = {
  // ESLint 8 is a deliberate debt: CI has already moved 18 -> 24 for jsdom 31
  // (^22.22.2 || ^24.15.0 || >=26), so migrate to flat config before any further
  // Node bump or when npm audit starts blocking. Node 18 has been EOL since April 2025.
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