# GitHub 이슈 라벨 가이드

## 공통 라벨 11개

### 타입 라벨 (8개)

| 라벨명         | 색상      | 설명                |
| -------------- | --------- | ------------------- |
| `✨ 새 기능`   | `#0075ca` | 새로운 기능 추가    |
| `🐛 버그`      | `#d73a4a` | 버그 수정           |
| `🔧 설정·빌드` | `#e4e669` | 빌드, 설정, 인프라  |
| `♻️ 리팩토링`  | `#cfd3d7` | 코드 개선, 리팩토링 |
| `📝 문서`      | `#0075ca` | 문서 작성 및 수정   |
| `🎨 디자인·UI` | `#e99695` | UI/UX 디자인 작업   |
| `🧪 테스트`    | `#d4c5f9` | 테스트 추가 및 수정 |
| `⚡ 성능`      | `#f9d0c4` | 성능 개선           |

### 우선순위 라벨 (3개)

| 라벨명              | 색상      | 설명           |
| ------------------- | --------- | -------------- |
| `🔴 우선순위: 높음` | `#b60205` | 즉시 처리 필요 |
| `🟡 우선순위: 중간` | `#fbca04` | 일반 우선순위  |
| `🟢 우선순위: 낮음` | `#0e8a16` | 여유있게 처리  |

## gh label create 명령어

아래 명령어를 실행하면 공통 라벨 11개가 생성된다. 이미 존재하는 라벨은 `--force` 없이 실행 시 에러를 내므로 `2>/dev/null || true`로 스킵 처리한다.

```bash
# 타입 라벨
gh label create "✨ 새 기능" --color "0075ca" --description "새로운 기능 추가" 2>/dev/null || echo "스킵: ✨ 새 기능"
gh label create "🐛 버그" --color "d73a4a" --description "버그 수정" 2>/dev/null || echo "스킵: 🐛 버그"
gh label create "🔧 설정·빌드" --color "e4e669" --description "빌드, 설정, 인프라" 2>/dev/null || echo "스킵: 🔧 설정·빌드"
gh label create "♻️ 리팩토링" --color "cfd3d7" --description "코드 개선, 리팩토링" 2>/dev/null || echo "스킵: ♻️ 리팩토링"
gh label create "📝 문서" --color "0075ca" --description "문서 작성 및 수정" 2>/dev/null || echo "스킵: 📝 문서"
gh label create "🎨 디자인·UI" --color "e99695" --description "UI/UX 디자인 작업" 2>/dev/null || echo "스킵: 🎨 디자인·UI"
gh label create "🧪 테스트" --color "d4c5f9" --description "테스트 추가 및 수정" 2>/dev/null || echo "스킵: 🧪 테스트"
gh label create "⚡ 성능" --color "f9d0c4" --description "성능 개선" 2>/dev/null || echo "스킵: ⚡ 성능"

# 우선순위 라벨
gh label create "🔴 우선순위: 높음" --color "b60205" --description "즉시 처리 필요" 2>/dev/null || echo "스킵: 🔴 우선순위: 높음"
gh label create "🟡 우선순위: 중간" --color "fbca04" --description "일반 우선순위" 2>/dev/null || echo "스킵: 🟡 우선순위: 중간"
gh label create "🟢 우선순위: 낮음" --color "0e8a16" --description "여유있게 처리" 2>/dev/null || echo "스킵: 🟢 우선순위: 낮음"
```

## 프로젝트 전용 라벨 예시

Phase 기반 프로젝트의 경우:

```bash
gh label create "🖼️ Phase 1: UI MVP" --color "bfd4f2" --description "Phase 1 작업" 2>/dev/null || true
gh label create "🔌 Phase 2: 백엔드 연동" --color "d4c5f9" --description "Phase 2 작업" 2>/dev/null || true
gh label create "🚀 Phase 3: 배포·최적화" --color "c2e0c6" --description "Phase 3 작업" 2>/dev/null || true
```

도메인 기반 라벨 예시:

```bash
gh label create "🔐 인증·보안" --color "e4e669" --description "인증, 권한, 보안" 2>/dev/null || true
gh label create "📊 데이터·분석" --color "0075ca" --description "데이터 처리 및 분석" 2>/dev/null || true
```

## 라벨 조합 예시

이슈 생성 시 아래처럼 조합하여 사용:

```bash
# 새 기능, 높은 우선순위
gh issue create --label "✨ 새 기능,🔴 우선순위: 높음" --title "..." --body "..."

# 버그, 중간 우선순위, Phase 1
gh issue create --label "🐛 버그,🟡 우선순위: 중간,🖼️ Phase 1: UI MVP" --title "..." --body "..."
```
