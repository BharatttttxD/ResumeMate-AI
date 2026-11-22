import React, { useState } from 'react';

const EFFORT_CONFIG = {
  Low: {
    label: 'Low effort',
    className: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
  },
  Medium: {
    label: 'Medium effort',
    className: 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]',
  },
  High: {
    label: 'High effort',
    className: 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]',
  },
};

export default function ActionPlan({ actionPlan }) {
  const [completedItems, setCompletedItems] = useState(new Set());

  function toggleItem(rank) {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(rank)) {
        next.delete(rank);
      } else {
        next.add(rank);
      }
      return next;
    });
  }

  if (!actionPlan || actionPlan.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-[#71717A]">No action plan available.</div>
    );
  }

  const pct = actionPlan.length
    ? Math.round((completedItems.size / actionPlan.length) * 100)
    : 0;

  return (
    <div className="space-y-3">
      {actionPlan.map((item) => {
        const isCompleted = completedItems.has(item.rank);
        return (
          <div
            key={item.rank}
            className={`bg-white border border-[#E4E4E7] rounded-lg p-4 flex items-start gap-3 transition-opacity ${
              isCompleted ? 'opacity-60' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => toggleItem(item.rank)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#09090B] flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="font-mono text-xs bg-[#F4F4F5] text-[#52525B] px-2 py-0.5 rounded border border-[#E4E4E7]">
                  #{item.rank}
                </span>
                <span className="font-mono text-xs bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2 py-0.5 rounded">
                  +{item.score_lift_pts} pts
                </span>
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded ${
                    EFFORT_CONFIG[item.effort]?.className || ''
                  }`}
                >
                  {item.effort}
                </span>
              </div>
              <p
                className={`text-sm text-[#09090B] leading-relaxed ${
                  isCompleted ? 'line-through text-[#71717A]' : ''
                }`}
              >
                {item.action}
              </p>
            </div>
          </div>
        );
      })}

      {/* Progress Section */}
      <div className="mt-6 pt-4 border-t border-[#E4E4E7]">
        <div className="flex items-center justify-between text-xs text-[#71717A] mb-2">
          <span>
            {completedItems.size} / {actionPlan.length} actions completed
          </span>
          <span className="font-mono">{pct}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#F4F4F5] rounded-full">
          <div
            className="h-1.5 bg-[#09090B] rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
