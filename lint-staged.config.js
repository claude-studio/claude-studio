// 프로젝트의 변동이 있을 때, 해당 파일에서 lint-staged를 수정하게 됩니다.
// eslint는 turbo run lint --filter 로 패키지별 실행 (Turborepo 권장 방식)
// typecheck는 패키지별 tsconfig 직접 호출
module.exports = {
  // packages/ui
  'packages/ui/**/*.+(ts|tsx)': [
    () => 'pnpm turbo run lint --filter=@repo/ui',
    () => 'pnpm tsc -p packages/ui/tsconfig.json --noEmit',
  ],

  // packages/shared
  'packages/shared/**/*.+(ts|tsx)': [
    () => 'pnpm turbo run lint --filter=@repo/shared',
    () => 'pnpm tsc -p packages/shared/tsconfig.json --noEmit',
  ],

  // packages/pixel-agents
  'packages/pixel-agents/**/*.+(ts|tsx)': [
    () => 'pnpm turbo run lint --filter=@repo/pixel-agents',
    () => 'pnpm tsc -p packages/pixel-agents/tsconfig.json --noEmit',
  ],

  // apps/studio
  'apps/studio/src/renderer/**/*.+(ts|tsx)': [
    () => 'pnpm turbo run lint --filter=@repo/studio',
    () => 'pnpm tsc -p apps/studio/src/renderer/tsconfig.json --noEmit',
  ],

  // apps/web
  'apps/web/**/*.+(ts|tsx)': [
    () => 'pnpm turbo run lint --filter=@repo/web',
    () => 'pnpm tsc -p apps/web/tsconfig.json --noEmit',
  ],

  // prettier: 변경된 모든 파일에 적용
  '**/*.+(ts|tsx|js|jsx|json|md)': ['pnpm exec prettier --write'],
};
