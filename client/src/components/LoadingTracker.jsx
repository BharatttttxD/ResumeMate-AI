import React from 'react';

const STAGES = [
  { id: '01', label: 'Parsing JD requirements' },
  { id: '02', label: 'Verifying resume evidence quotes' },
  { id: '03', label: 'Computing 4-pillar rubric weights' },
  { id: '04', label: 'Drafting XYZ bullet rewrites' },
];

const Spinner = () => (
  <svg className="animate-spin w-4 h-4 text-[#09090B]" fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export default function LoadingTracker({ stage }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <p className="text-sm text-[#52525B] mb-8 animate-pulse font-mono">
        Analyzing with Gemini 2.0 Flash…
      </p>

      <div className="w-full max-w-sm space-y-2">
        {STAGES.map((s, i) => (
          <div
            key={s.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              i === stage ? 'bg-[#F4F4F5]' : ''
            }`}
          >
            <span className="font-mono text-xs text-[#71717A] w-6 flex-shrink-0">{s.id}</span>
            <span
              className={`text-sm flex-1 ${
                i < stage
                  ? 'text-[#71717A]'
                  : i === stage
                  ? 'text-[#09090B] font-medium'
                  : 'text-[#A1A1AA]'
              }`}
            >
              {s.label}
            </span>
            <div className="ml-auto flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {i < stage ? (
                <span className="text-[#065F46] text-sm font-bold">✓</span>
              ) : i === stage ? (
                <Spinner />
              ) : (
                <div className="w-4 h-4 rounded-full border border-[#D4D4D8]" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
