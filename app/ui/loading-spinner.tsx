// app/ui/loading-spinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      <div className="h-20 w-20 animate-spin rounded-full border-8 border-blue-500 border-t-transparent"></div>
    </div>
  );
}
