export default function Loading() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
        <p className="mt-3 text-sm text-gray-500">Loading admin data...</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-24 bg-base-200 rounded-md animate-pulse"></div>
          <div className="h-24 bg-base-200 rounded-md animate-pulse"></div>
          <div className="h-24 bg-base-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
