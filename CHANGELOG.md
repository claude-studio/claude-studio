# Changelog

## [1.3.0](https://github.com/claude-studio/claude-studio/compare/claude-studio-v1.2.0...claude-studio-v1.3.0) (2026-03-10)


### Other Changes

* feature-plan 폴더 제거 ([6dbf037](https://github.com/claude-studio/claude-studio/commit/6dbf037a9052ab7556e7c075fe4d0b45300d3e3c))
* github profile 스크린샷 추가 ([96a01b2](https://github.com/claude-studio/claude-studio/commit/96a01b2789f31bb364c4028ce1ed19734f6ead87))


### Features

* **skills:** setup-project 스킬 추가 ([4f8c8c9](https://github.com/claude-studio/claude-studio/commit/4f8c8c978d124bd76f5996f5b4106cacb52247db))

## [1.2.0](https://github.com/claude-studio/claude-studio/compare/claude-studio-v1.1.0...claude-studio-v1.2.0) (2026-03-09)


### Other Changes

* cmux 없는 환경에서 hook 에러 방지 ([04df6f2](https://github.com/claude-studio/claude-studio/commit/04df6f24bdfc71ffe393c0a00bf28957b0b02198))
* esm 전환 및 electron preload cjs 빌드 설정 ([14fc4d2](https://github.com/claude-studio/claude-studio/commit/14fc4d2b7775e397827dbe837e84f1e8156b869f))
* husky + lint-staged pre-commit 파이프라인 구축 ([e9d9877](https://github.com/claude-studio/claude-studio/commit/e9d9877cd87f210801e2e7de2ce4023f568f94c5))
* husky post-commit hook 추가 (동적 workspace) ([47c23e9](https://github.com/claude-studio/claude-studio/commit/47c23e9066bc6d339a75e8e428cffc54653ddb71))
* pnpm-lock.yaml 동기화 (ui package.json 변경 반영) ([41d4dbe](https://github.com/claude-studio/claude-studio/commit/41d4dbe14953ec8b89400179e0ce1fb34ccfefa4))
* post-commit hook 요일 한글 표기로 변경 ([9e26178](https://github.com/claude-studio/claude-studio/commit/9e261788a3364a3d20831a53c69df77dae117a16))


### Features

* /verify-refs 레퍼런스 검증 스킬 추가 ([8188917](https://github.com/claude-studio/claude-studio/commit/8188917f2c6def3a26f826e8946eb3e6bd512083))
* glass bento 리디자인 + 사이드바 개편 ([#5](https://github.com/claude-studio/claude-studio/issues/5)) ([17349c3](https://github.com/claude-studio/claude-studio/commit/17349c3bf83c9aaff0fd10b6210eaf1af68491b5))
* glass bento 리디자인 + 사이드바 개편 후속 UI 개선 ([b5bf486](https://github.com/claude-studio/claude-studio/commit/b5bf486920e15a3bca6a9b301a70f97df7a18d04))
* vercel 배포 스킬 3종 추가 ([3e87298](https://github.com/claude-studio/claude-studio/commit/3e8729806d8a3c116b02d3367892b4dc99e0825b))
* **verify-refs:** phase 3에 team-lead readme 갱신 플로우 추가 ([775db16](https://github.com/claude-studio/claude-studio/commit/775db164a5db7ca7f5e8f8b7c575ccccaa1f99f0))
* **web:** studio UI와 일치하도록 레이아웃 및 사이드바 목업 업데이트 ([42ce5f4](https://github.com/claude-studio/claude-studio/commit/42ce5f415a4df0d7596f9adea6b48cf8979fd3f2))
* 라이브 모니터링 플러그인 + hook server 연동 ([2a8f50b](https://github.com/claude-studio/claude-studio/commit/2a8f50bed4df48f7bb967823ef3c4d39745b219e))


### Bug Fixes

* **studio:** pngjs 번들 포함 및 renderer 포트 9999 설정 ([021d418](https://github.com/claude-studio/claude-studio/commit/021d418985dada3bc48360635220f114568ebe6b))


### Documentation

* .claude/reference/ 카테고리별 레퍼런스 추가 및 CLAUDE.md 개편 ([f08f1cf](https://github.com/claude-studio/claude-studio/commit/f08f1cf206b27bf62071150e21ec1f97c4e04463))
* live monitoring hooks integration 계획 문서 추가 ([e4b4a8a](https://github.com/claude-studio/claude-studio/commit/e4b4a8af5aa15fdedffe1a8a536abeef2313eaef))
* packages/ui 패키지 격리 규칙 문서 반영 ([163b030](https://github.com/claude-studio/claude-studio/commit/163b030b18eedc0627d67e2aecc219193213a7cc))
* readme 프로젝트 구조 및 레퍼런스 문서 목록 수정 ([9d05399](https://github.com/claude-studio/claude-studio/commit/9d0539930a15fb820d8360d29dac9027d4ec92ac))
* 레퍼런스 문서 코드 동기화 업데이트 ([837f0ed](https://github.com/claude-studio/claude-studio/commit/837f0edfabe530285cc8d648f6417d0fa51af5d2))
* 아키텍처 중심으로 README 전면 재작성 ([3718b21](https://github.com/claude-studio/claude-studio/commit/3718b21c957bc343870c53e11ff59ec87cd7f1e4))


### Code Refactoring

* **studio:** 라우트 컴포넌트를 pages/widgets로 분리 ([ae97a00](https://github.com/claude-studio/claude-studio/commit/ae97a00b32a5d9a22858ae6b0464c45b51170f96))
* **ui:** packages/ui 레거시 pages 제거 및 overview 개선 ([171bf0b](https://github.com/claude-studio/claude-studio/commit/171bf0b338bafe6403998f682d0917597fe40d5d))


### Continuous Integration

* release-please에서 build/publish job 제거 ([6f32f22](https://github.com/claude-studio/claude-studio/commit/6f32f2227fe4e31cf246b10a73f47b54456aadef))

## [1.1.0](https://github.com/claude-studio/claude-studio/compare/claude-studio-v1.0.0...claude-studio-v1.1.0) (2026-03-08)


### Other Changes

* add vercel deployment config ([f692217](https://github.com/claude-studio/claude-studio/commit/f692217866681a5acc3838f69233ae5432ae2d98))
* initial commit ([fec2659](https://github.com/claude-studio/claude-studio/commit/fec2659a79c7d23e14ae0a91ec941d1fd7c9e6f4))
* remove invalid engines field from vercel.json ([7923b13](https://github.com/claude-studio/claude-studio/commit/7923b131efc0e43f3b149733856c270437611031))


### Features

* **studio:** 라이브 에이전트 베타기능 추가 ([e25eb86](https://github.com/claude-studio/claude-studio/commit/e25eb869e0183aad3f572598aa9e707db9e4e21f))
* **web:** vercel 배포 설정 및 랜딩 페이지 에셋 추가 ([ccf5a62](https://github.com/claude-studio/claude-studio/commit/ccf5a62b51c799e3c0e8dc63a23d3e6eb308d709))
* **web:** 랜딩 페이지 UI 개선 ([687f9df](https://github.com/claude-studio/claude-studio/commit/687f9dfcd95c72f262397f2149e029eaf7f0c133))
* **web:** 랜딩페이지 구현 ([3eefb83](https://github.com/claude-studio/claude-studio/commit/3eefb83493a469876d3b85243d9230b9ef71655b))


### Bug Fixes

* **web:** improve cta section mobile layout ([d86589e](https://github.com/claude-studio/claude-studio/commit/d86589ef177e5afec824af13a98203c98f57b7b4))
* **web:** vercel output directory 경로 수정 ([fd4b739](https://github.com/claude-studio/claude-studio/commit/fd4b7391ab3da7a59d2b609ed4a9d8935087fdab))
* **web:** vercel.json 제거 (루트 설정으로 통합) ([e598069](https://github.com/claude-studio/claude-studio/commit/e598069866735f22b8ea2564923a1bbf265fe529))
* **web:** 반응형 레이아웃 개선 ([44bcb2d](https://github.com/claude-studio/claude-studio/commit/44bcb2dff549c6f7a482d1db4273ada2394f72ea))
* **web:** 텍스트 줄바꿈 개선 ([9ca8f33](https://github.com/claude-studio/claude-studio/commit/9ca8f33a95e66a030ef8ad45abe37339b789b8e8))


### Documentation

* 라이브 에이전트 베타기능 반영 README 업데이트 ([0363cc9](https://github.com/claude-studio/claude-studio/commit/0363cc9d819917ca2c392f2b7c9d7eb27667bbca))


### Code Refactoring

* **web:** 랜딩 페이지 코드 품질 개선 ([264ffe1](https://github.com/claude-studio/claude-studio/commit/264ffe19e3552cc5b67f04bbf746b434753df116))

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
