import { Link } from '@tanstack/react-router';

interface ProjectDetailPageProps {
  id: string;
}

export function ProjectDetailPage({ id: _id }: ProjectDetailPageProps) {
  return (
    <div className="space-y-4">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        &larr; 프로젝트 목록
      </Link>
      <p className="text-muted-foreground text-sm text-center py-8">
        세션 상세 보기는 현재 제공되지 않습니다.
      </p>
    </div>
  );
}
