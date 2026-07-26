const js = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier');
const jestPlugin = require('eslint-plugin-jest');
const globals = require('globals');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  // Global ignores
  {
    ignores: ['node_modules/**', 'coverage/**', 'prisma/**', 'dist/**', 'build/**'],
  },
  // Base recommended rules
  js.configs.recommended,
  // Node.js globals
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          caughtErrors: 'none',
        },
      ],
      'no-use-before-define': ['error', 'nofunc'],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'multi-line'],
    },
  },
  // Jest test files
  {
    files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],
    ...jestPlugin.configs['flat/recommended'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  // Config files can use devDependencies
  {
    files: ['eslint.config.js', 'jest.config.js', '*.config.js'],
    rules: {
      'no-console': 'off',
    },
  },
  // Prettier must be last to override formatting rules
  eslintConfigPrettier,
];
