# cmux 상세 레퍼런스

공식 문서: https://www.cmux.dev/docs/api

## 기본 구조

```bash
cmux [--socket PATH] [--window ID] [--workspace ID] [--surface ID] [--json] [--id-format refs|uuids|both] <command>
```

**환경변수**

| 변수 | 설명 |
|------|------|
| `CMUX_WORKSPACE_ID` | 현재 워크스페이스 ID (자동 설정) |
| `CMUX_SURFACE_ID` | 현재 surface ID (자동 설정) |
| `CMUX_SOCKET_PATH` | 소켓 경로 오버라이드 (기본: `/tmp/cmux.sock`) |
| `CMUX_SOCKET_ENABLE` | 강제 활성화/비활성화 (1/0, true/false, on/off) |
| `CMUX_SOCKET_MODE` | 접근 모드 (cmuxOnly, allowAll, off) |

**cmux 환경 감지**

```bash
[ -n "${CMUX_WORKSPACE_ID:-}" ] && echo "Inside cmux"
command -v cmux &>/dev/null && echo "cmux available"
[ -S "${CMUX_SOCKET_PATH:-/tmp/cmux.sock}" ] && echo "Socket available"
```

---

## 워크스페이스

```bash
cmux list-workspaces
cmux current-workspace
cmux new-workspace
cmux select-workspace --workspace <id>
cmux rename-workspace --workspace <id> <name>
cmux close-workspace --workspace <id>
```

---

## Surface / Pane

```bash
cmux list-pane-surfaces                            # 현재 워크스페이스 surfaces
cmux list-pane-surfaces --workspace workspace:N    # 특정 워크스페이스
cmux list-panes                                    # pane 목록
cmux new-split right/left/up/down                  # 방향으로 split 생성
cmux new-pane --type terminal/browser              # 새 pane 생성
cmux new-pane --type browser --url <url>
cmux focus-pane --pane <id>
cmux close-surface --surface <id>
cmux identify                                      # 현재 window/workspace/surface 컨텍스트
```

---

## 화면 읽기

```bash
cmux read-screen                              # 현재 surface 화면 읽기
cmux read-screen --surface <id>
cmux read-screen --scrollback                 # 스크롤백 포함
cmux read-screen --lines 50
```

---

## 입력 전송

```bash
# 텍스트 전송 (현재 surface)
cmux send "ls -la\n"                          # \n으로 엔터 포함

# 특정 surface에 전송
cmux send --surface <id> "npm run build\n"

# 키 입력 (enter, tab, escape, backspace, delete, up, down, left, right)
cmux send-key enter
cmux send-key --surface <id> enter

# pane에 전송
cmux send-panel --panel <id> "command\n"
cmux send-key-panel --panel <id> enter
```

---

## 알림

```bash
cmux notify --title "제목" --body "내용"
cmux notify --title "제목" --subtitle "부제목" --body "내용"
cmux list-notifications
cmux clear-notifications
```

---

## 사이드바 메타데이터

```bash
# 상태 표시 (icon: hammer, checkmark, xmark, gear 등)
cmux set-status <key> "<value>" --icon hammer --color "#ff9500"
cmux set-status build "컴파일 중" --icon gear
cmux clear-status <key>
cmux list-status

# 진행률 (0.0 ~ 1.0)
cmux set-progress 0.0 --label "시작..."
cmux set-progress 0.5 --label "진행 중..."
cmux set-progress 1.0 --label "완료"
cmux clear-progress

# 로그 (level: info/progress/success/warning/error)
cmux log "메시지"
cmux log --level success "빌드 성공"
cmux log --level error --source build "컴파일 실패"
cmux log --level warning -- "경고 메시지"   # --로 플래그 충돌 방지
cmux clear-log
cmux list-log
cmux list-log --limit 20

# 전체 사이드바 상태
cmux sidebar-state
cmux sidebar-state --workspace workspace:N
```

---

## 유틸리티

```bash
cmux ping                   # 서버 응답 확인
cmux capabilities           # 사용 가능한 명령어 및 접근 모드
cmux identify               # 현재 컨텍스트 (window/workspace/surface)
```

---

## 소켓 직접 통신

소켓 경로: `/tmp/cmux.sock` (debug: `/tmp/cmux-debug.sock`)

**Shell**
```bash
SOCK="${CMUX_SOCKET_PATH:-/tmp/cmux.sock}"
printf "%s\n" '{"id":"ws","method":"workspace.list","params":{}}' | nc -U "$SOCK"
```

**Python**
```python
import json, os, socket

SOCKET_PATH = os.environ.get("CMUX_SOCKET_PATH", "/tmp/cmux.sock")

def rpc(method, params=None, req_id=1):
    payload = {"id": req_id, "method": method, "params": params or {}}
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as sock:
        sock.connect(SOCKET_PATH)
        sock.sendall(json.dumps(payload).encode() + b"\n")
        return json.loads(sock.recv(65536).decode())

print(rpc("workspace.list", req_id="ws"))
```

---

## 실전 패턴

### 특정 surface에 명령 실행 후 결과 읽기
```bash
cmux send --surface surface:N "npm run build\n"
sleep 3
cmux read-screen --surface surface:N
```

### 빌드 진행률 + 결과 알림
```bash
cmux set-progress 0.0 --label "빌드 시작..."
npm run build
if [ $? -eq 0 ]; then
    cmux set-progress 1.0 --label "완료"
    cmux log --level success "빌드 성공"
    cmux notify --title "✓ 빌드 성공" --body "배포 준비 완료"
else
    cmux clear-progress
    cmux log --level error "빌드 실패"
    cmux notify --title "✗ 빌드 실패" --body "로그를 확인하세요"
fi
cmux clear-progress
```

### 현재 열린 모든 surface 파악
```bash
cmux list-workspaces
cmux list-pane-surfaces --workspace workspace:1
cmux list-pane-surfaces --workspace workspace:2
```

### 특정 워크스페이스 surface에 명령 전송
```bash
# surface ID 확인 후 전송
cmux list-pane-surfaces --workspace workspace:1
cmux send --surface surface:N "git status\n"
cmux read-screen --surface surface:N
```
