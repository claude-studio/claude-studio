import { Link } from '@tanstack/react-router';

interface ProjectDetailPageProps {
  id: string;
}

export function ProjectDetailPage({ id: _id }: ProjectDetailPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; 프로젝트 목록
        </Link>
        <h1 className="text-2xl font-semibold mt-2">프로젝트</h1>
      </div>
      <p className="text-muted-foreground text-sm text-center py-8">
        세션 상세 보기는 현재 제공되지 않습니다.
      </p>
    </div>
  );
}
