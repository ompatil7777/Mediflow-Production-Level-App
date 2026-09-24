import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 4,
  className = '',
}) => {
  return (
    <div className={`w-full flex flex-col gap-3.5 p-4 bg-white rounded-[6px] border-[1.5px] border-surface-border ${className}`}>
      <div className="h-6 w-2/3 bg-slate-200 rounded-[4px] animate-pulse" />
      <div className="h-4 w-1/2 bg-slate-200 rounded-[4px] animate-pulse" />
      <div className="my-1 border-t border-slate-100" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div className="h-4 w-full bg-slate-100 rounded-[4px] animate-pulse" />
          <div className="h-3 w-4/5 bg-slate-100 rounded-[4px] animate-pulse" />
        </div>
      ))}
    </div>
  );
};
