import React from 'react';
import { useGuideProgress } from '../hooks/useGuideProgress';

export function ProgressTracker() {
  const { visitedCount, totalCount } = useGuideProgress();
  const isComplete = visitedCount === totalCount && totalCount > 0;

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow-sm rounded-lg border border-gray-200 w-full max-w-md mx-auto">
      <div className="flex justify-between w-full mb-2">
        <span className="text-sm font-semibold text-gray-700">Guide Progress</span>
        <span className="text-sm font-medium text-gray-500">
          {visitedCount} / {totalCount} steps
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${totalCount > 0 ? (visitedCount / totalCount) * 100 : 0}%` }}
        />
      </div>

      {isComplete && (
        <div className="mt-3 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
          🎉 You have reviewed the full election process!
        </div>
      )}
    </div>
  );
}
