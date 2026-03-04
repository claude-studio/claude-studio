import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Database, Download, Upload } from 'lucide-react';

export const Route = createFileRoute('/data')({
  component: DataPage,
});

function DataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">데이터</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Claude 사용 데이터 관리
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4" />
            데이터 소스
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            읽기 경로:{' '}
            <code className="text-foreground bg-muted px-1 rounded text-xs">
              ~/.claude/projects/
            </code>
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Download className="h-4 w-4" />
              데이터 내보내기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              백업 또는 분석을 위해 세션 데이터를 JSON으로 내보냅니다.
            </p>
            <button
              onClick={() => window.open('/api/export', '_blank')}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              JSON 내보내기
            </button>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" />
              데이터 가져오기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              가져오기 기능은 Electron 앱에서 사용 가능합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
