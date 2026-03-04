import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/data')({
  component: DataPage,
});

function DataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">데이터 관리</h1>
        <p className="text-muted-foreground text-sm mt-1">
          로컬 머신의 ~/.claude/ 디렉토리에서 직접 데이터를 읽어옵니다.
        </p>
      </div>
    </div>
  );
}
