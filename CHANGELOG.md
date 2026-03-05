# Changelog

## [1.0.0](https://github.com/claude-studio/claude-studio/releases/tag/v1.0.0) (2026-03-06)

### Features

* claude studio electron 대시보드 초기 구현 ([a17ac3e](https://github.com/claude-studio/claude-studio/commit/a17ac3e))
* 스킬 페이지 및 Dialog 추가, 설정 페이지 구성 ([f55be1d](https://github.com/claude-studio/claude-studio/commit/f55be1d))
* stats-cache.json 기반 claude code 사용 기간 통계 추가 ([19d40bf](https://github.com/claude-studio/claude-studio/commit/19d40bf))
* stats-cache.json 기반 사용 시작일 및 D+N 표시 추가 ([8ce60d2](https://github.com/claude-studio/claude-studio/commit/8ce60d2))
* cacheStats, toolUsage, conversationStats 타입 추가 ([736c46f](https://github.com/claude-studio/claude-studio/commit/736c46f))
* 캐시 토큰, 툴 사용량, 대화 패턴 데이터 수집 추가 ([3362efe](https://github.com/claude-studio/claude-studio/commit/3362efe))
* 캐시 절약, 툴 사용량, 대화 패턴 ui 컴포넌트 추가 ([3b8d0f9](https://github.com/claude-studio/claude-studio/commit/3b8d0f9))
* 개요 페이지에 캐시 절약, 툴 사용량, 대화 패턴 섹션 추가 ([27f19d5](https://github.com/claude-studio/claude-studio/commit/27f19d5))
* 개요 페이지에 모델별 일별 비용 차트 추가 ([546a9cc](https://github.com/claude-studio/claude-studio/commit/546a9cc))
* 비용 페이지에 월별 비교 및 프로젝트별 비용 순위 추가 ([e83d9ba](https://github.com/claude-studio/claude-studio/commit/e83d9ba))
* 세션 상세에 API 오류 및 서브에이전트 메시지 구분 추가 ([a0b6e97](https://github.com/claude-studio/claude-studio/commit/a0b6e97))
* 캐시 절약 현황 필드에 툴팁 추가 ([e1bdbcb](https://github.com/claude-studio/claude-studio/commit/e1bdbcb))
* 사이드바 버전 v1.1.0 업데이트 및 GitHub 링크 추가 ([ea86390](https://github.com/claude-studio/claude-studio/commit/ea86390))
* 프로젝트 상세 날짜별 세션 타임라인 뷰 추가 ([321e71a](https://github.com/claude-studio/claude-studio/commit/321e71a))
* 세션 목록 검색, 오류/서브에이전트 필터 동기화, 에러 상태 처리 ([ffcebb4](https://github.com/claude-studio/claude-studio/commit/ffcebb4))
* pages 공유 컴포넌트화 및 teams IPC 연결 ([aec92d4](https://github.com/claude-studio/claude-studio/commit/aec92d4))
* teams 페이지 inbox 메시지 및 태스크 아코디언 추가 ([e836549](https://github.com/claude-studio/claude-studio/commit/e836549))
* 세션 상세 레이아웃 개선 및 web앱 정리 ([10d7697](https://github.com/claude-studio/claude-studio/commit/10d7697))

### Bug Fixes

* 신규 섹션 레이아웃 변경 - 캐시/툴 2열, 대화 패턴 전체 너비 ([66df4a6](https://github.com/claude-studio/claude-studio/commit/66df4a6))
* 대화 패턴 라벨 줄이기 및 툴 사용 순위 레이아웃 개선 ([a8771fa](https://github.com/claude-studio/claude-studio/commit/a8771fa))
* 데이터 페이지 한글화 및 synthetic 모델 필터링 강화 ([52ec46d](https://github.com/claude-studio/claude-studio/commit/52ec46d))
* 프로젝트명에 worktree, 서브디렉토리 suffix 표시 ([e6506ad](https://github.com/claude-studio/claude-studio/commit/e6506ad))
* 캐시 절약 비용을 모델 가중평균 단가로 계산 ([482c4ba](https://github.com/claude-studio/claude-studio/commit/482c4ba))
* 모델 뱃지 short name 표시, 프로젝트 비용 툴팁 전체 이름 노출 ([54da216](https://github.com/claude-studio/claude-studio/commit/54da216))
* electron-builder repository 필드 추가 ([6c1dfc4](https://github.com/claude-studio/claude-studio/commit/6c1dfc4))
* pnpm action-setup version 충돌 제거 ([1ad2624](https://github.com/claude-studio/claude-studio/commit/1ad2624))

### Performance Improvements

* 중복 디스크 스캔 제거 및 페이지 전환 속도 개선 ([9efa49b](https://github.com/claude-studio/claude-studio/commit/9efa49b))

### Documentation

* 임시 README 추가 ([29eb974](https://github.com/claude-studio/claude-studio/commit/29eb974))
* readme 업데이트 ([cd0206a](https://github.com/claude-studio/claude-studio/commit/cd0206a))
* update README with latest features ([d378548](https://github.com/claude-studio/claude-studio/commit/d378548))
* macOS 설치 안내 추가 및 릴리즈 노트 자동 업데이트 ([13edc0e](https://github.com/claude-studio/claude-studio/commit/13edc0e))

### Other Changes

* eslint import-order 설정 및 react namespace import 정리 ([dff72a2](https://github.com/claude-studio/claude-studio/commit/dff72a2))
* 미사용 export 및 dead code 제거 ([b152b69](https://github.com/claude-studio/claude-studio/commit/b152b69))
* prettier 포맷 적용 ([abc33f0](https://github.com/claude-studio/claude-studio/commit/abc33f0))
