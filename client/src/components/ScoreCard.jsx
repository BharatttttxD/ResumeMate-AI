import React from 'react';

const GRADE_STYLES = {
  'A+': 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
  'A':  'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
  'A-': 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
  'B+': 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
  'B':  'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
  'B-': 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
  'C+': 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
  'C':  'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
  'D':  'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
  'F':  'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
};

export default function ScoreCard({ auditResult }) {
  const { overall_score, grade, executive_summary, pillars } = auditResult;
  const gradeStyle =
    GRADE_STYLES[grade] || 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]';

  return (
    <div className="space-y-6">
      {/* Score Hero */}
      <div className="bg-white border border-[#E4E4E7] rounded-lg p-6">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-mono text-6xl font-bold text-[#09090B] tabular-nums">
            {overall_score}
          </span>
          <span className="font-mono text-2xl text-[#71717A]">/ 100</span>
          <span
            className={`font-mono text-sm font-semibold px-2.5 py-1 rounded border ml-2 ${gradeStyle}`}
          >
            {grade}
          </span>
        </div>
        <p className="text-sm text-[#52525B] leading-relaxed">{executive_summary}</p>
      </div>

      {/* Rubric Breakdown */}
      <div className="bg-white border border-[#E4E4E7] rounded-lg p-6">
        <h3 className="text-sm font-semibold text-[#09090B] mb-5">Rubric Breakdown</h3>
        <div className="space-y-6">
          {pillars &&
            pillars.map((pillar) => {
              const pct =
                pillar.max_points > 0
                  ? ((pillar.earned_points / pillar.max_points) * 100).toFixed(1)
                  : '0.0';
              return (
                <div key={pillar.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[#09090B]">{pillar.label}</span>
                    <span className="font-mono text-sm text-[#52525B]">
                      {pillar.earned_points} / {pillar.max_points}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F4F4F5] rounded-full mb-2">
                    <div
                      className="h-1.5 bg-[#09090B] rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#52525B] leading-relaxed">{pillar.justification}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
