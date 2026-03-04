import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui';
import { Database, Download, Upload, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/data')({
  component: DataPage,
});

function DataPage() {
  const handleExport = async () => {
    try {
      const data = await window.electronAPI.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `claude-studio-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleClearImport = async () => {
    try {
      await window.electronAPI.clearImport();
    } catch (err) {
      console.error('Clear failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">데이터 관리</h1>
        <p className="text-muted-foreground text-sm mt-1">
          사용량 데이터를 내보내고 관리합니다
        </p>
      </div>

      <div className="grid gap-4">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4" />
              데이터 소스
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              로컬 머신의 ~/.claude/ 디렉토리에서 직접 데이터를 읽어옵니다.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="h-4 w-4" />
              데이터 내보내기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              전체 사용량 데이터를 JSON 파일로 내보냅니다.
            </p>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              JSON 내보내기
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="h-4 w-4" />
              데이터 가져오기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              이전에 내보낸 데이터를 가져옵니다.
            </p>
            <Button variant="outline" size="sm" disabled>
              <Upload className="h-4 w-4 mr-2" />
              JSON 가져오기
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trash2 className="h-4 w-4" />
              가져온 데이터 초기화
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              로컬 데이터 소스로 초기화하고 가져온 데이터를 삭제합니다.
            </p>
            <Button onClick={handleClearImport} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              데이터 초기화
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
