export function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-96">
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
    </div>
  );
}
