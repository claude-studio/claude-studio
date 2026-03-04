import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Claude Studio</h1>
        <p className="text-muted-foreground mt-4">랜딩 페이지</p>
      </div>
    </div>
  );
}
