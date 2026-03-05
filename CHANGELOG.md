# Changelog

## [1.6.0](https://github.com/claude-studio/claude-studio/compare/claude-studio-v1.5.0...claude-studio-v1.6.0) (2026-03-05)


### Other Changes

* cmux 레퍼런스 문서 강화 (공식 문서 기반) ([b2c2b82](https://github.com/claude-studio/claude-studio/commit/b2c2b82ee8ecdd0eaa77ded8faa154c080541483))
* cmux 레퍼런스 파일 프로젝트 .claude/tools에 추가 ([3f808a5](https://github.com/claude-studio/claude-studio/commit/3f808a580e66d1bc125d09d85e8d3f4c93991c15))
* cmux 전체 레퍼런스 도구 테이블 추가 ([1ef57bb](https://github.com/claude-studio/claude-studio/commit/1ef57bb44f28251cb46624824ea41894c9e948f6))
* eslint import-order 설정 및 react namespace import 정리 ([dff72a2](https://github.com/claude-studio/claude-studio/commit/dff72a291e830c1173b81160bfe3fdb145a34676))
* **main:** release claude-studio 1.1.0 ([#1](https://github.com/claude-studio/claude-studio/issues/1)) ([a24b941](https://github.com/claude-studio/claude-studio/commit/a24b9410de8e91f0d69644831f262b743974bbd6))
* **main:** release claude-studio 1.2.0 ([#2](https://github.com/claude-studio/claude-studio/issues/2)) ([afb2ee7](https://github.com/claude-studio/claude-studio/commit/afb2ee7d0c0f958faaa961a32e6ef4256679131f))
* **main:** release claude-studio 1.3.0 ([#3](https://github.com/claude-studio/claude-studio/issues/3)) ([1ddd55d](https://github.com/claude-studio/claude-studio/commit/1ddd55dba5f0e75360427829f61169d61b96a781))
* **main:** release claude-studio 1.3.1 ([#4](https://github.com/claude-studio/claude-studio/issues/4)) ([0655ccf](https://github.com/claude-studio/claude-studio/commit/0655ccf1b61b53fd5cf20287389f89047848174a))
* **main:** release claude-studio 1.4.0 ([#5](https://github.com/claude-studio/claude-studio/issues/5)) ([4f1e6c9](https://github.com/claude-studio/claude-studio/commit/4f1e6c9a0dc48c5594ad28c4f119face524ef9d9))
* **main:** release claude-studio 1.5.0 ([#6](https://github.com/claude-studio/claude-studio/issues/6)) ([35e8056](https://github.com/claude-studio/claude-studio/commit/35e8056c2aead90720f10d07d4827f502943cb1d))
* release v1.0.0 초기화 및 CHANGELOG 재작성 ([efdaac4](https://github.com/claude-studio/claude-studio/commit/efdaac44231faf0c6624792ae3fb30af67ef2d5f))
* studio 버전 1.0.0으로 동기화 ([f7a176c](https://github.com/claude-studio/claude-studio/commit/f7a176cc1d1d589fbe89afbc56b84f297ddd6067))
* 미사용 export 및 dead code 제거 ([b152b69](https://github.com/claude-studio/claude-studio/commit/b152b69175f3e623398ad519c0f991d6d3030f43))
* 프로젝트 CLAUDE.md 추가 및 cmux browser 도구 레퍼런스 구성 ([ce11a9a](https://github.com/claude-studio/claude-studio/commit/ce11a9a3c3ecf2b26390fd07be7bf26fa254a008))


### Features

* cacheStats, toolUsage, conversationStats 타입 추가 ([736c46f](https://github.com/claude-studio/claude-studio/commit/736c46fcaad76cfa74304ca1ec3bd81dc0466db4))
* claude studio electron 대시보드 초기 구현 ([a17ac3e](https://github.com/claude-studio/claude-studio/commit/a17ac3ee9defcaeb530c1486794066912a957e5a))
* pages 공유 컴포넌트화 및 teams IPC 연결 ([aec92d4](https://github.com/claude-studio/claude-studio/commit/aec92d4226d78dd59b48d0170534a59a8e621853))
* stats-cache.json 기반 claude code 사용 기간 통계 추가 ([19d40bf](https://github.com/claude-studio/claude-studio/commit/19d40bfd6ae8fb25294726ce50862d0bae1da39b))
* stats-cache.json 기반 사용 시작일 및 D+N 표시 추가 ([8ce60d2](https://github.com/claude-studio/claude-studio/commit/8ce60d2e6dd0d627703100c9a238240fe1aada2f))
* teams 페이지 inbox 메시지 및 태스크 아코디언 추가 ([e836549](https://github.com/claude-studio/claude-studio/commit/e8365493d9c7dbef093f4e71d72d80b65e072b9d))
* 개요 페이지에 모델별 일별 비용 차트 추가 ([546a9cc](https://github.com/claude-studio/claude-studio/commit/546a9cc054053b6130f784aee2a6c47a2bbd7c3e))
* 개요 페이지에 캐시 절약, 툴 사용량, 대화 패턴 섹션 추가 ([27f19d5](https://github.com/claude-studio/claude-studio/commit/27f19d547d38b55eb078f1e3870c2fd893e32212))
* 비용 페이지에 월별 비교 및 프로젝트별 비용 순위 추가 ([e83d9ba](https://github.com/claude-studio/claude-studio/commit/e83d9bada09810549a82bce7c4def2100ad85d9a))
* 사이드바 버전 v1.1.0 업데이트 및 GitHub 링크 추가 ([ea86390](https://github.com/claude-studio/claude-studio/commit/ea86390078631d908c6478cd29f2e9adc06d36a8))
* 세션 목록 검색, 오류/서브에이전트 필터 동기화, 에러 상태 처리 ([ffcebb4](https://github.com/claude-studio/claude-studio/commit/ffcebb4466769c4afbbd2e8bd6b4e74f3ff6221b))
* 세션 상세 레이아웃 개선 및 web앱 정리 ([10d7697](https://github.com/claude-studio/claude-studio/commit/10d76976c8e8998387379ae095d78a16c8ebf218))
* 세션 상세에 API 오류 및 서브에이전트 메시지 구분 추가 ([a0b6e97](https://github.com/claude-studio/claude-studio/commit/a0b6e9739e64d15aa67ba8ee5ba6533880b81039))
* 스킬 페이지 및 Dialog 추가, 설정 페이지 구성 ([f55be1d](https://github.com/claude-studio/claude-studio/commit/f55be1da0a8acb1dd948d27c3d993694ab478159))
* 스킬 페이지 및 Dialog 추가, 설정 페이지 구성 ([bd13990](https://github.com/claude-studio/claude-studio/commit/bd13990a749cb6ebd74e90232b35e62a948fc34a))
* 캐시 절약 현황 필드에 툴팁 추가 ([e1bdbcb](https://github.com/claude-studio/claude-studio/commit/e1bdbcb8c9fbb932fbc3866514467f3d73b153a5))
* 캐시 절약, 툴 사용량, 대화 패턴 ui 컴포넌트 추가 ([3b8d0f9](https://github.com/claude-studio/claude-studio/commit/3b8d0f998ab4f9fd87c895f35041ef72e7bfb209))
* 캐시 토큰, 툴 사용량, 대화 패턴 데이터 수집 추가 ([3362efe](https://github.com/claude-studio/claude-studio/commit/3362efe53d2c06e97e9696c49662de72d018769a))
* 프로젝트 상세 날짜별 세션 타임라인 뷰 추가 ([321e71a](https://github.com/claude-studio/claude-studio/commit/321e71a8e3e21d21062834a1f6f44d80ae7e8602))


### Bug Fixes

* electron-builder repository 필드 추가 ([6c1dfc4](https://github.com/claude-studio/claude-studio/commit/6c1dfc4c0cbb6c5bce8a9a65b8abc901ad4ad79c))
* pnpm action-setup version 충돌 제거 ([1ad2624](https://github.com/claude-studio/claude-studio/commit/1ad2624c71f230aa8cd4ec45bfa3252a05024572))
* 대화 패턴 라벨 줄이기 및 툴 사용 순위 레이아웃 개선 ([a8771fa](https://github.com/claude-studio/claude-studio/commit/a8771fa5f0c366211862de96fad2f2384d487ea3))
* 데이터 페이지 한글화 및 synthetic 모델 필터링 강화 ([52ec46d](https://github.com/claude-studio/claude-studio/commit/52ec46db401486cad2b0bb115626667747218103))
* 모델 뱃지 short name 표시, 프로젝트 비용 툴팁 전체 이름 노출 ([54da216](https://github.com/claude-studio/claude-studio/commit/54da216577e99e3ff919ebda51d30287db0e6045))
* 신규 섹션 레이아웃 변경 - 캐시/툴 2열, 대화 패턴 전체 너비 ([66df4a6](https://github.com/claude-studio/claude-studio/commit/66df4a6a79d4849f8605cb42d463dd62ed2fb9b9))
* 캐시 절약 비용을 모델 가중평균 단가로 계산 ([482c4ba](https://github.com/claude-studio/claude-studio/commit/482c4ba19061142e08da306b9bdc7ad95ef42989))
* 프로젝트명에 worktree, 서브디렉토리 suffix 표시 ([e6506ad](https://github.com/claude-studio/claude-studio/commit/e6506add43b54021800692511defa04eb9beb9f7))


### Documentation

* macOS 설치 안내 추가 및 릴리즈 노트 자동 업데이트 ([13edc0e](https://github.com/claude-studio/claude-studio/commit/13edc0e7854776c34126af08b968e5821124adbf))
* readme 업데이트 ([cd0206a](https://github.com/claude-studio/claude-studio/commit/cd0206adf8b5615e0097f452f95140764e808801))
* update README with latest features ([d378548](https://github.com/claude-studio/claude-studio/commit/d378548b8dd4968f41de14ca36433b9f164bd7f4))
* 임시 README 추가 ([29eb974](https://github.com/claude-studio/claude-studio/commit/29eb97453691f664197d29da10a38c04ad3cb19a))


### Performance Improvements

* 중복 디스크 스캔 제거 및 페이지 전환 속도 개선 ([9efa49b](https://github.com/claude-studio/claude-studio/commit/9efa49b2a4ac05abd6a4e671f227d7ba4dd52f91))


### Continuous Integration

* build trigger를 release-please 태그 기준으로 변경 ([f871612](https://github.com/claude-studio/claude-studio/commit/f871612a2bdab554b8f693882942201ba5059019))
* build 트리거 태그 패턴을 v*으로 통일 ([843feb7](https://github.com/claude-studio/claude-studio/commit/843feb7b8a13bcd0747b8423ae6be55cf4aa2bc6))
* build 트리거를 workflow_dispatch 전용으로 변경 ([ae00787](https://github.com/claude-studio/claude-studio/commit/ae007875b190c1a2d8e744c0589f74116e4013b3))
* workflow 개선 - matrix 통합, release_created 트리거, shell injection 방지 ([2567868](https://github.com/claude-studio/claude-studio/commit/2567868bfe0a3102955a57e24af61f397b584e7b))
* workflow_dispatch 트리거 추가 및 태그 기반 버전 추출 개선 ([0b330c5](https://github.com/claude-studio/claude-studio/commit/0b330c5b39ee54ec1c1143f990982062f1705b86))
* 태그에서 버전 추출하여 studio package.json 업데이트 ([ee35dc1](https://github.com/claude-studio/claude-studio/commit/ee35dc1f2144d83eb91c9e28f2dbcc51db04dd33))

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
