import { useGuideProgress } from '../hooks/useGuideProgress';

export function ProgressTracker() {
  const { visitedCount, totalCount } = useGuideProgress();
  const isComplete = visitedCount === totalCount && totalCount > 0;
  const percentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col p-4 bg-white shadow-xs rounded-xl border border-gray-200/80 w-full max-w-lg mx-auto">
      <div className="flex justify-between items-center w-full mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-800">Guide Progress</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60">
            {percentage}%
          </span>
        </div>
        <span className="text-xs font-semibold text-gray-500">
          {visitedCount} of {totalCount} steps viewed
        </span>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isComplete && (
        <div className="mt-3 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 animate-fade-in">
          <span>🎉</span>
          <span>You have reviewed all steps in this election process!</span>
        </div>
      )}
    </div>
  );
}
