# cmux browser 상세 레퍼런스

공식 문서: https://www.cmux.dev/docs/browser-automation

## 기본 구조

```bash
cmux browser [--surface <id|ref|index> | <surface>] <subcommand> [args]
```

surface는 위치 인수 또는 `--surface` 플래그로 지정 가능:
- `cmux browser surface:2 url`
- `cmux browser --surface surface:2 url`

## 네비게이션

```bash
cmux browser open <url>               # 브라우저 split 생성 (surface ID 반환)
cmux browser open-split <url>         # 새 split에 브라우저 열기
cmux browser surface:N navigate <url> # URL 이동
cmux browser surface:N back
cmux browser surface:N forward
cmux browser surface:N reload
cmux browser surface:N url            # 현재 URL 확인
```

## 대기 (Wait)

```bash
cmux browser surface:N wait --load-state complete
cmux browser surface:N wait --load-state interactive
cmux browser surface:N wait --selector "#id"
cmux browser surface:N wait --text "텍스트"
cmux browser surface:N wait --url-contains "/path"
cmux browser surface:N wait --function "window.__ready === true"
cmux browser surface:N wait --timeout-ms 15000
```

## 스냅샷 및 내용 읽기

```bash
cmux browser surface:N snapshot                       # DOM 스냅샷
cmux browser surface:N snapshot --compact             # 간략한 스냅샷
cmux browser surface:N snapshot --interactive         # 인터랙티브 모드
cmux browser surface:N snapshot --selector "main"     # 특정 영역만
cmux browser surface:N snapshot --max-depth 5

cmux browser surface:N get title
cmux browser surface:N get url
cmux browser surface:N get text                       # 전체 텍스트
cmux browser surface:N get text "h1"                  # 특정 요소 텍스트
cmux browser surface:N get html "main"
cmux browser surface:N get value "#input"
cmux browser surface:N get attr "a.btn" --attr href
cmux browser surface:N get count ".item"
```

## DOM 상호작용

```bash
cmux browser surface:N click "<selector>"
cmux browser surface:N click "<selector>" --snapshot-after
cmux browser surface:N dblclick "<selector>"
cmux browser surface:N hover "<selector>"
cmux browser surface:N fill "<selector>" "<text>"     # 입력 채우기
cmux browser surface:N fill "<selector>"              # 입력 비우기
cmux browser surface:N type "<selector>" "<text>"     # 타이핑
cmux browser surface:N press Enter
cmux browser surface:N select "<selector>" "<value>"  # select 옵션
cmux browser surface:N scroll --dy 800
cmux browser surface:N check "<selector>"
cmux browser surface:N uncheck "<selector>"
```

## 요소 검색 (Find)

```bash
cmux browser surface:N find role button --name "확인"
cmux browser surface:N find text "텍스트"
cmux browser surface:N find label "이메일"
cmux browser surface:N find placeholder "검색"
cmux browser surface:N find testid "submit-btn"
cmux browser surface:N find first ".item"
cmux browser surface:N find last ".item"
cmux browser surface:N find nth 2 ".item"
```

## JavaScript 실행

```bash
cmux browser surface:N eval "document.title"
cmux browser surface:N eval "document.body.innerText"
cmux browser surface:N eval "window.location.href"
cmux browser surface:N addstyle "#banner { display: none }"
```

## 상태 확인

```bash
cmux browser surface:N is visible "#element"
cmux browser surface:N is enabled "button"
cmux browser surface:N is checked "#checkbox"
cmux browser surface:N console list           # 콘솔 로그
cmux browser surface:N errors list            # JS 에러
```

## 탭 관리

```bash
cmux browser surface:N tab list
cmux browser surface:N tab new <url>
cmux browser surface:N tab switch 1
cmux browser surface:N tab close
```

## 다이얼로그

```bash
cmux browser surface:N dialog accept
cmux browser surface:N dialog dismiss
```

## Surface 관리

```bash
cmux list-pane-surfaces                           # 현재 워크스페이스 surfaces
cmux list-pane-surfaces --workspace workspace:N   # 특정 워크스페이스
cmux list-workspaces                              # 전체 워크스페이스
cmux browser surface:N identify                   # surface 정보
```

## 실전 패턴

### 페이지 열고 내용 읽기
```bash
cmux browser open https://example.com
# → surface=surface:N 확인
cmux browser surface:N wait --load-state complete
cmux browser surface:N get text
```

### 특정 텍스트 추출 (grep 활용)
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
