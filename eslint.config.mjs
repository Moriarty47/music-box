import {
  commonRules,
  solid,
  tailwind,
  useESLintConfig,
} from '@n3bula/eslint-config';

export default useESLintConfig({
  solid: true,
  formatters: {
    css: true,
    html: true,
    prettierOptions: {
      printWidth: 80,
    },
  },
}, solid({
  files: ['**/src/**/*.ts', '**/src/**/*.tsx'],
  overrides: {
    ...commonRules,
    'antfu/top-level-function': 'off',
    'ts/consistent-type-definitions': 'off',
  },
}), tailwind());
