import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { configs as airbnbConfigs } from 'eslint-config-airbnb-extended';
import nextConfig from 'eslint-config-next';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// airbnb-extended is the flat-native, maintained successor to the abandoned
// eslint-config-airbnb-base. We take only its core JS rule blocks so behavior
// matches the prior airbnb-base setup, dropping any block whose name matches
// `stylistic` or `import-x`:
//   - the `stylistic` block (@stylistic/* rules) and the
//     `base-disable-legacy-stylistic-js-config` block — all formatting is owned
//     by Prettier (loaded last), as before where eslint-config-prettier
//     disabled airbnb-base's format rules.
//   - the `import-x` block — import rules continue to come from
//     eslint-config-next's eslint-plugin-import, exactly as before.
// The remaining blocks reference only core ESLint rules (no plugins).
const airbnbBaseCore = airbnbConfigs.base.recommended.filter(
  (config) => !/stylistic|import-x/.test(config.name || '')
);

// jest + prettier still ship in the legacy eslintrc format, so they load via
// FlatCompat. Prettier stays last so it disables formatting rules.
const legacyConfig = compat.config({
  extends: ['plugin:prettier/recommended', 'plugin:jest/recommended'],
  settings: {
    'import/core-modules': ['styled-jsx/css'],
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['@Tests', './tests'],
          ['@Mocks', './tests/mocks'],
          ['@Server', './server'],
          ['@Icons', './public/static/icons'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json'],
      },
    },
  },
  rules: {
    'no-plusplus': 'off',
    'max-classes-per-file': ['error', 2],
    'class-methods-use-this': 'off',
    'react/prop-types': 'off',
    'import/prefer-default-export': 'off',
    'func-names': ['warn', 'as-needed'],
    'no-use-before-define': ['error', 'nofunc'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/accessible-emoji': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/lang': 'error',
    'jsx-a11y/media-has-caption': 'error',
    camelcase: [
      'error',
      {
        allow: ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content'],
        properties: 'never',
      },
    ],
    '@next/next/no-img-element': 'off',
    'react/no-unknown-property': [
      'error',
      { ignore: ['jsx', 'global', 'styles', 'resize'] },
    ],
    // ESLint v9 changed the `no-unused-vars` `caughtErrors` default from
    // "none" to "all", newly flagging unused `catch` bindings. Restore the
    // previous default while keeping airbnb's other options.
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        caughtErrors: 'none',
      },
    ],
  },
});

const config = [
  // Replaces .eslintignore. Flat config only ignores node_modules/.git by
  // default (the legacy runner also skipped dot-directories and build output),
  // so those are restored explicitly here.
  {
    ignores: [
      'static/scripts/**',
      'src/services/scripts/**',
      'public/static/**',
      '.next/**',
      'out/**',
      'build/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'tests-result/**',
    ],
  },
  // Legacy flat config defaulted `reportUnusedDisableDirectives` to off; flat
  // config turns it on. Keep it off to preserve prior lint output.
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  // airbnb-extended core JS rules (replaces eslint-config-airbnb-base).
  ...airbnbBaseCore,
  // eslint-config-next v16 ships a native flat config (react, react-hooks,
  // import, jsx-a11y, @next/next). Imported directly rather than via FlatCompat.
  ...nextConfig,
  ...legacyConfig,
  // eslint-config-next v16 pulls eslint-plugin-react-hooks v7, whose recommended
  // set newly enables the React Compiler rules. Opt out of them to preserve the
  // prior behavior (only rules-of-hooks + exhaustive-deps). Adopting these is a
  // separate, deliberate effort — see PROD-3753 follow-ups.
  {
    rules: {
      'react-hooks/static-components': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/void-use-memo': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/config': 'off',
      'react-hooks/gating': 'off',
    },
  },
  // Custom globals carried over from the former .eslintrc.json.
  {
    languageOptions: {
      globals: {
        globalThis: 'readonly',
        fbq: 'readonly',
        branch: 'readonly',
        ttq: 'readonly',
        ire: 'readonly',
        podscribe: 'readonly',
      },
    },
  },
  // Config/tooling files legitimately import devDependencies.
  {
    files: [
      'eslint.config.mjs',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.cjs',
    ],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  // The Express custom server has no React; eslint-plugin-react-hooks
  // otherwise misreads `router.use(...)` as the React `use` hook.
  {
    files: ['server/**/*.js'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  // Playwright fixtures receive a `use` callback; react-hooks misreads it
  // as the React `use` hook.
  {
    files: ['tests/e2e/**/*.js', 'tests/fixtures/**/*.js'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  // Was tests/.eslintrc.json (applied to everything under tests/).
  {
    files: ['tests/**/*.js'],
    rules: {
      'global-require': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'no-await-in-loop': 'off',
    },
  },
  // Was the `overrides` block in .eslintrc.json (files: *.test.js).
  {
    files: ['**/*.test.js'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
];

export default config;
