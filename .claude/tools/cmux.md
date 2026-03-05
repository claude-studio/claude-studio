# cmux 상세 레퍼런스

공식 문서: https://www.cmux.dev/docs/api

## 기본 구조

```bash
cmux [--socket PATH] [--window ID] [--workspace ID] [--surface ID] [--json] <command>
```

**환경변수 (cmux 터미널 내 자동 설정)**
- `CMUX_WORKSPACE_ID` - 현재 워크스페이스 ID
- `CMUX_SURFACE_ID` - 현재 surface ID
- `CMUX_SOCKET_PATH` - 소켓 경로 오버라이드 (기본: `/tmp/cmux.sock`)

## 워크스페이스

```bash
cmux list-workspaces                          # 전체 워크스페이스 목록
cmux current-workspace                        # 현재 워크스페이스
cmux new-workspace                            # 새 워크스페이스 생성
cmux select-workspace --workspace <id>        # 워크스페이스 전환
cmux rename-workspace --workspace <id> <name>
cmux close-workspace --workspace <id>
```

## Surface / Pane

```bash
cmux list-pane-surfaces                            # 현재 워크스페이스 surfaces
cmux list-pane-surfaces --workspace workspace:N    # 특정 워크스페이스
cmux new-split right/left/up/down                  # 분할 생성
cmux new-pane --type terminal/browser              # 새 pane 생성
cmux focus-pane --pane <id>
cmux identify                                      # 현재 컨텍스트 확인
```

## 입력 전송

```bash
cmux send "text"                              # 현재 터미널에 텍스트 전송
cmux send --surface <id> "command"            # 특정 surface에 전송
cmux send-key enter/tab/escape/backspace      # 키 입력 전송
cmux send-key --surface <id> enter
```

## 화면 읽기

```bash
cmux read-screen                              # 현재 화면 내용 읽기
cmux read-screen --surface <id>
cmux read-screen --scrollback                 # 스크롤백 포함
cmux read-screen --lines 50
```

## 알림

```bash
cmux notify --title "제목" --body "내용"
cmux list-notifications
cmux clear-notifications
```

## 사이드바 메타데이터

```bash
# 상태 표시
cmux set-status key "value" --icon hammer --color "#ff9500"
cmux clear-status key
cmux list-status

# 진행률
cmux set-progress 0.5 --label "Building..."
cmux clear-progress

# 로그 (level: info/progress/success/warning/error)
cmux log --level success "빌드 완료"
cmux log --level error "실패"
cmux clear-log
cmux list-log --limit 20

# 사이드바 전체 상태
cmux sidebar-state
```

## 유틸리티

```bash
cmux ping                  # 서버 응답 확인
cmux capabilities          # 사용 가능한 명령어 및 접근 모드 확인
cmux identify              # 현재 window/workspace/surface 컨텍스트
```

## 실전 패턴

### 특정 surface에 명령어 실행하고 결과 읽기
```bash
cmux send --surface surface:N "npm run build\n"
sleep 2
cmux read-screen --surface surface:N
```

### 빌드 진행률 표시
```bash
cmux set-progress 0.0 --label "시작..."
# ... 작업 ...
cmux set-progress 0.5 --label "절반 완료"
# ... 작업 ...
cmux set-progress 1.0 --label "완료"
cmux clear-progress
cmux log --level success "빌드 완료"
```

### 현재 열린 모든 surface 파악
```bash
cmux list-workspaces
cmux list-pane-surfaces --workspace workspace:1
cmux list-pane-surfaces --workspace workspace:2
```
