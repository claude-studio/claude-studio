export function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  );
}
