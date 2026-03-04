import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';
import importOrderConfig from './import-order.js';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...importOrderConfig,
  prettierConfig,
  {
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'unused-imports': unusedImports,
    },
    rules: {
      'react/jsx-uses-react': 'off', // react-jsx transform 사용 시 React import 불필요
      'react/react-in-jsx-scope': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
);
