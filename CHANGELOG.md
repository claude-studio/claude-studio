# Changelog

## [1.5.0](https://github.com/FRONT-JB/claude-studio/compare/claude-studio-v1.4.0...claude-studio-v1.5.0) (2026-03-04)


### Other Changes

* eslint import-order 설정 및 react namespace import 정리 ([dff72a2](https://github.com/FRONT-JB/claude-studio/commit/dff72a291e830c1173b81160bfe3fdb145a34676))
* 미사용 export 및 dead code 제거 ([b152b69](https://github.com/FRONT-JB/claude-studio/commit/b152b69175f3e623398ad519c0f991d6d3030f43))


### Features

* teams 페이지 inbox 메시지 및 태스크 아코디언 추가 ([e836549](https://github.com/FRONT-JB/claude-studio/commit/e8365493d9c7dbef093f4e71d72d80b65e072b9d))

## [1.4.0](https://github.com/FRONT-JB/claude-studio/compare/claude-studio-v1.3.1...claude-studio-v1.4.0) (2026-03-04)


### Features

* pages 공유 컴포넌트화 및 teams IPC 연결 ([aec92d4](https://github.com/FRONT-JB/claude-studio/commit/aec92d4226d78dd59b48d0170534a59a8e621853))

## [1.3.1](https://github.com/FRONT-JB/claude-studio/compare/claude-studio-v1.3.0...claude-studio-v1.3.1) (2026-03-04)


### Documentation

* macOS 설치 안내 추가 및 릴리즈 노트 자동 업데이트 ([13edc0e](https://github.com/FRONT-JB/claude-studio/commit/13edc0e7854776c34126af08b968e5821124adbf))

## [1.3.0](https://github.com/FRONT-JB/claude-studio/compare/claude-studio-v1.2.0...claude-studio-v1.3.0) (2026-03-04)


### Features

* 세션 목록 검색, 오류/서브에이전트 필터 동기화, 에러 상태 처리 ([ffcebb4](https://github.com/FRONT-JB/claude-studio/commit/ffcebb4466769c4afbbd2e8bd6b4e74f3ff6221b))


### Bug Fixes

* 모델 뱃지 short name 표시, 프로젝트 비용 툴팁 전체 이름 노출 ([54da216](https://github.com/FRONT-JB/claude-studio/commit/54da216577e99e3ff919ebda51d30287db0e6045))
* 캐시 절약 비용을 모델 가중평균 단가로 계산 ([482c4ba](https://github.com/FRONT-JB/claude-studio/commit/482c4ba19061142e08da306b9bdc7ad95ef42989))


### Performance Improvements

* 중복 디스크 스캔 제거 및 페이지 전환 속도 개선 ([9efa49b](https://github.com/FRONT-JB/claude-studio/commit/9efa49b2a4ac05abd6a4e671f227d7ba4dd52f91))

## [1.2.0](https://github.com/FRONT-JB/claude-studio/compare/claude-studio-v1.1.0...claude-studio-v1.2.0) (2026-03-04)


### Features

* cacheStats, toolUsage, conversationStats 타입 추가 ([736c46f](https://github.com/FRONT-JB/claude-studio/commit/736c46fcaad76cfa74304ca1ec3bd81dc0466db4))
* stats-cache.json 기반 claude code 사용 기간 통계 추가 ([19d40bf](https://github.com/FRONT-JB/claude-studio/commit/19d40bfd6ae8fb25294726ce50862d0bae1da39b))
* stats-cache.json 기반 사용 시작일 및 D+N 표시 추가 ([8ce60d2](https://github.com/FRONT-JB/claude-studio/commit/8ce60d2e6dd0d627703100c9a238240fe1aada2f))
* 개요 페이지에 모델별 일별 비용 차트 추가 ([546a9cc](https://github.com/FRONT-JB/claude-studio/commit/546a9cc054053b6130f784aee2a6c47a2bbd7c3e))
* 개요 페이지에 캐시 절약, 툴 사용량, 대화 패턴 섹션 추가 ([27f19d5](https://github.com/FRONT-JB/claude-studio/commit/27f19d547d38b55eb078f1e3870c2fd893e32212))
* 비용 페이지에 월별 비교 및 프로젝트별 비용 순위 추가 ([e83d9ba](https://github.com/FRONT-JB/claude-studio/commit/e83d9bada09810549a82bce7c4def2100ad85d9a))
* 사이드바 버전 v1.1.0 업데이트 및 GitHub 링크 추가 ([ea86390](https://github.com/FRONT-JB/claude-studio/commit/ea86390078631d908c6478cd29f2e9adc06d36a8))
* 세션 상세에 API 오류 및 서브에이전트 메시지 구분 추가 ([a0b6e97](https://github.com/FRONT-JB/claude-studio/commit/a0b6e9739e64d15aa67ba8ee5ba6533880b81039))
* 스킬 페이지 및 Dialog 추가, 설정 페이지 구성 ([f55be1d](https://github.com/FRONT-JB/claude-studio/commit/f55be1da0a8acb1dd948d27c3d993694ab478159))
* 스킬 페이지 및 Dialog 추가, 설정 페이지 구성 ([bd13990](https://github.com/FRONT-JB/claude-studio/commit/bd13990a749cb6ebd74e90232b35e62a948fc34a))
* 캐시 절약 현황 필드에 툴팁 추가 ([e1bdbcb](https://github.com/FRONT-JB/claude-studio/commit/e1bdbcb8c9fbb932fbc3866514467f3d73b153a5))
* 캐시 절약, 툴 사용량, 대화 패턴 ui 컴포넌트 추가 ([3b8d0f9](https://github.com/FRONT-JB/claude-studio/commit/3b8d0f998ab4f9fd87c895f35041ef72e7bfb209))
* 캐시 토큰, 툴 사용량, 대화 패턴 데이터 수집 추가 ([3362efe](https://github.com/FRONT-JB/claude-studio/commit/3362efe53d2c06e97e9696c49662de72d018769a))
* 프로젝트 상세 날짜별 세션 타임라인 뷰 추가 ([321e71a](https://github.com/FRONT-JB/claude-studio/commit/321e71a8e3e21d21062834a1f6f44d80ae7e8602))


### Bug Fixes

* 대화 패턴 라벨 줄이기 및 툴 사용 순위 레이아웃 개선 ([a8771fa](https://github.com/FRONT-JB/claude-studio/commit/a8771fa5f0c366211862de96fad2f2384d487ea3))
* 데이터 페이지 한글화 및 synthetic 모델 필터링 강화 ([52ec46d](https://github.com/FRONT-JB/claude-studio/commit/52ec46db401486cad2b0bb115626667747218103))
* 신규 섹션 레이아웃 변경 - 캐시/툴 2열, 대화 패턴 전체 너비 ([66df4a6](https://github.com/FRONT-JB/claude-studio/commit/66df4a6a79d4849f8605cb42d463dd62ed2fb9b9))
* 프로젝트명에 worktree, 서브디렉토리 suffix 표시 ([e6506ad](https://github.com/FRONT-JB/claude-studio/commit/e6506add43b54021800692511defa04eb9beb9f7))


### Documentation

* update README with latest features ([d378548](https://github.com/FRONT-JB/claude-studio/commit/d378548b8dd4968f41de14ca36433b9f164bd7f4))

## [1.1.0](https://github.com/FRONT-JB/claude-studio/compare/claude-studio-v1.0.0...claude-studio-v1.1.0) (2026-03-04)


### Features

* claude studio electron 대시보드 초기 구현 ([a17ac3e](https://github.com/FRONT-JB/claude-studio/commit/a17ac3ee9defcaeb530c1486794066912a957e5a))


### Documentation

* 임시 README 추가 ([29eb974](https://github.com/FRONT-JB/claude-studio/commit/29eb97453691f664197d29da10a38c04ad3cb19a))

## 1.0.0 (2026-03-04)

### Features

* Claud-ometer Electron Desktop App 초기 구현
