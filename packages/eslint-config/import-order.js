import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importPlugin from 'eslint-plugin-import';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // React 관련 패키지 최우선
            ['^react$', '^next'],
            // 외부 @-scoped 패키지 (내부 alias 제외)
            ['^@(?!/|~)'],
            // 기타 외부 패키지
            ['^[a-z]'],
            // 내부 alias (@/, ~/)
            ['^@/', '^~'],
            // 상위 경로 import
            ['^\\.\\.(?!/?$)', '^\\.\\.\/?$'],
            // 동일 경로 상대 import
            ['^\\.\\./(?=.*\\/)(?!\\/?$)', '^\\.(?!\\/?$)', '^\\.\\/?$'],
            // 스타일 import
            ['^.+\\.s?css$'],
            // side-effect import
            ['^\\u0000'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },
];
