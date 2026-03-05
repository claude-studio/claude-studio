# cmux browser 상세 레퍼런스

공식 문서: https://www.cmux.dev/docs/browser-automation

## 기본 구조

```bash
cmux browser [--surface <id|ref|index> | <surface>] <subcommand> [args]
```

surface 지정 방식:
- 위치 인수: `cmux browser surface:2 url`
- 플래그: `cmux browser --surface surface:2 url`

---

## 네비게이션

```bash
cmux browser open <url>                        # 브라우저 split 생성 → surface ID 반환
cmux browser open-split <url>                  # 새 split에 브라우저 열기
cmux browser surface:N navigate <url>          # URL 이동
cmux browser surface:N navigate <url> --snapshot-after
cmux browser surface:N back
cmux browser surface:N forward
cmux browser surface:N reload
cmux browser surface:N reload --snapshot-after
cmux browser surface:N url                     # 현재 URL 확인
cmux browser surface:N focus-webview           # 웹뷰에 포커스
cmux browser surface:N is-webview-focused      # 웹뷰 포커스 상태 확인
cmux browser surface:N identify                # surface 정보 확인
```

---

## 대기 (Wait)

조건을 충족할 때까지 블로킹:

```bash
cmux browser surface:N wait --load-state complete
cmux browser surface:N wait --load-state interactive
cmux browser surface:N wait --selector "#id"
cmux browser surface:N wait --text "텍스트"
cmux browser surface:N wait --url-contains "/path"
cmux browser surface:N wait --function "window.__appReady === true"
cmux browser surface:N wait --timeout-ms 15000
```

---

## 스냅샷 및 내용 읽기

```bash
# 스냅샷
cmux browser surface:N snapshot
cmux browser surface:N snapshot --compact
cmux browser surface:N snapshot --interactive
cmux browser surface:N snapshot --selector "main"
cmux browser surface:N snapshot --max-depth 5

# 스크린샷
cmux browser surface:N screenshot --out /tmp/page.png

# 데이터 추출
cmux browser surface:N get title
cmux browser surface:N get url
cmux browser surface:N get text                   # 전체 텍스트
cmux browser surface:N get text "h1"              # 특정 요소 텍스트
cmux browser surface:N get html "main"
cmux browser surface:N get value "#input"
cmux browser surface:N get attr "a.btn" --attr href
cmux browser surface:N get count ".item"
cmux browser surface:N get box "#element"         # 요소 크기/위치
cmux browser surface:N get styles "#el" --property color
```

---

## DOM 상호작용

모든 변경 작업에 `--snapshot-after` 옵션으로 빠른 검증 가능:

```bash
# 클릭
cmux browser surface:N click "<selector>"
cmux browser surface:N click "<selector>" --snapshot-after
cmux browser surface:N dblclick "<selector>"
cmux browser surface:N hover "<selector>"
cmux browser surface:N focus "<selector>"

# 체크박스
cmux browser surface:N check "<selector>"
cmux browser surface:N uncheck "<selector>"

# 입력
cmux browser surface:N fill "<selector>" "<text>"     # 기존 값 지우고 채우기
cmux browser surface:N fill "<selector>"              # 비우기
cmux browser surface:N type "<selector>" "<text>"     # 현재 값에 추가 입력
cmux browser surface:N press Enter
cmux browser surface:N press "Control+A"
cmux browser surface:N keydown Shift
cmux browser surface:N keyup Shift

# 선택 및 스크롤
cmux browser surface:N select "<selector>" "<value>"
cmux browser surface:N scroll --dy 800
cmux browser surface:N scroll --selector "#el" --dx 0 --dy 400
cmux browser surface:N scroll-into-view "<selector>"
cmux browser surface:N scroll --snapshot-after
```

---

## 요소 검색 (Find)

```bash
cmux browser surface:N find role button --name "확인"
cmux browser surface:N find text "텍스트"
cmux browser surface:N find label "이메일"
cmux browser surface:N find placeholder "검색"
cmux browser surface:N find alt "이미지 설명"
cmux browser surface:N find title "설정 열기"
cmux browser surface:N find testid "submit-btn"
cmux browser surface:N find first ".item"
cmux browser surface:N find last ".item"
cmux browser surface:N find nth 2 ".item"

# 강조 표시
cmux browser surface:N highlight "<selector>"
```

---

## 상태 확인

```bash
cmux browser surface:N is visible "#element"
cmux browser surface:N is enabled "button"
cmux browser surface:N is checked "#checkbox"
```

---

## JavaScript 실행 및 주입

```bash
cmux browser surface:N eval "document.title"
cmux browser surface:N eval "document.body.innerText"
cmux browser surface:N eval --script "window.location.href"
cmux browser surface:N addinitscript "window.__ready = true;"   # 페이지 로드 전 실행
cmux browser surface:N addscript "document.querySelector('#name')?.focus()"
cmux browser surface:N addstyle "#banner { display: none !important; }"
```

---

## 쿠키 및 스토리지

```bash
# 쿠키
cmux browser surface:N cookies get
cmux browser surface:N cookies get --name session_id
cmux browser surface:N cookies set session_id abc123 --domain example.com --path /
cmux browser surface:N cookies clear --name session_id
cmux browser surface:N cookies clear --all

# 로컬/세션 스토리지
cmux browser surface:N storage local set theme dark
cmux browser surface:N storage local get theme
cmux browser surface:N storage local clear
cmux browser surface:N storage session set flow onboarding
cmux browser surface:N storage session get flow

# 브라우저 상태 저장/복원
cmux browser surface:N state save /tmp/cmux-state.json
cmux browser surface:N state load /tmp/cmux-state.json
```

---

## 탭 관리

```bash
cmux browser surface:N tab list
cmux browser surface:N tab new <url>
cmux browser surface:N tab switch 1
cmux browser surface:N tab switch surface:7
cmux browser surface:N tab close
cmux browser surface:N tab close surface:7
```

---

## 콘솔 및 에러

```bash
cmux browser surface:N console list
cmux browser surface:N console clear
cmux browser surface:N errors list
cmux browser surface:N errors clear
```

---

## 다이얼로그

```bash
cmux browser surface:N dialog accept
cmux browser surface:N dialog accept "확인 메시지"
cmux browser surface:N dialog dismiss
```

---

## iframe 프레임

```bash
cmux browser surface:N frame "iframe[name='checkout']"   # iframe 진입
cmux browser surface:N click "#pay-now"                  # iframe 내부 조작
cmux browser surface:N frame main                        # 최상위 문서로 복귀
```

---

## 다운로드

```bash
cmux browser surface:N click "a#download-report"
cmux browser surface:N download --path /tmp/report.csv --timeout-ms 30000
```

---

## Surface 목록 확인

```bash
cmux list-pane-surfaces                           # 현재 워크스페이스
cmux list-pane-surfaces --workspace workspace:N   # 특정 워크스페이스
cmux list-workspaces                              # 전체 워크스페이스
```

---

## 실전 패턴

### 페이지 열고 내용 읽기
```bash
cmux browser open https://example.com
# → OK surface=surface:N 에서 N 확인
cmux browser surface:N wait --load-state complete
cmux browser surface:N get text
```

### 특정 텍스트 grep으로 추출
```bash
cmux browser surface:N eval "document.body.innerText" | grep -i "keyword"
```

### 폼 작성 및 제출
```bash
cmux browser surface:N fill "#email" "user@example.com"
cmux browser surface:N fill "#password" "secret"
cmux browser surface:N click "button[type='submit']" --snapshot-after
cmux browser surface:N wait --url-contains "/dashboard"
```

### 에러 디버깅
```bash
cmux browser surface:N console list
cmux browser surface:N errors list
cmux browser surface:N screenshot --out /tmp/failure.png
```

### 로그인 상태 유지 (쿠키 재사용)
```bash
# 저장
cmux browser surface:N state save /tmp/auth-state.json
# 다음 세션에서 복원
cmux browser surface:N state load /tmp/auth-state.json
```
