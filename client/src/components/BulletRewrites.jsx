import React, { useState } from 'react';

function highlightPlaceholders(text) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, i) => {
    if (/^\[.+\]$/.test(part)) {
      return (
        <span
          key={i}
          className="bg-[#FEF9C3] text-[#92400E] rounded px-1 font-mono text-xs"
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function BulletRewrites({ bulletRewrites }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!bulletRewrites || bulletRewrites.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-[#71717A]">
        No bullet rewrites available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bulletRewrites.map((rewrite, i) => (
        <div key={i} className="bg-white border border-[#E4E4E7] rounded-lg p-5">
          {/* Original */}
          <span className="font-mono text-xs text-[#71717A] uppercase tracking-wider">
            Original
          </span>
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-4 py-3 mt-1.5 text-sm text-[#991B1B] leading-relaxed">
            {rewrite.original}
          </div>

          {/* Arrow */}
          <div className="text-center text-[#D4D4D8] my-3 select-none">↓</div>

          {/* Improved */}
          <span className="font-mono text-xs text-[#065F46] uppercase tracking-wider">
            Improved (XYZ Format)
          </span>
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg px-4 py-3 mt-1.5 text-sm text-[#065F46] leading-relaxed">
            {highlightPlaceholders(rewrite.improved)}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-[#F4F4F5] space-y-2">
            <p className="text-xs text-[#52525B]">
              <span className="font-medium text-[#09090B]">Rationale: </span>
              {rewrite.rationale}
            </p>

            {rewrite.keywords_added && rewrite.keywords_added.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-[#71717A]">Keywords: </span>
                {rewrite.keywords_added.map((k) => (
                  <span
                    key={k}
                    className="font-mono text-xs bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7] px-1.5 py-0.5 rounded"
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(rewrite.improved);
                  setCopiedIndex(i);
                  setTimeout(() => setCopiedIndex(null), 2000);
                }}
                className="font-mono text-xs border border-[#E4E4E7] text-[#52525B] px-3 py-1 rounded hover:bg-[#F4F4F5] transition-colors"
              >
                {copiedIndex === i ? '✓ Copied!' : 'Copy Improved'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
