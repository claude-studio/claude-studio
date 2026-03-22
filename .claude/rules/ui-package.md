# @repo/ui 사용 규칙

## Import 방식

```typescript
import { cn, Button, Card, StatCard, CostChart, useStats } from '@repo/ui';
import '@repo/ui/globals.css'; // CSS는 앱 엔트리에서 별도 import
```

## 핵심 원칙

패키지 격리 규칙은 `.claude/reference/coding-rules.md` "패키지 격리" 섹션을 따른다.

## 사용 패턴

```typescript
// cn으로 className 병합 (clsx + tailwind-merge)
<div className={cn('base-class', isActive && 'active-class', className)} />

// StatCard 사용
<StatCard
  title="총 비용"
  value={<CostDisplay cost={stats.totalCost} />}
  trend={{ value: 12.5, label: "전월 대비" }}
  featured // 좌측 primary accent bar 표시
/>

// 차트 사용 (데이터 타입 확인 필요)
<CostChart data={dailyUsage} />         // DailyUsage[]
<ModelBreakdown data={modelBreakdown} /> // ModelUsage[]
```

## 참고

컴포넌트 전체 목록, props, export 패턴은 `.claude/reference/ui-components.md` 참조
