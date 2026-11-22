import React, { useState, useMemo } from 'react';

const STATUS_CONFIG = {
  matched: {
    label: 'Matched',
    className: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
  },
  weakly_demonstrated: {
    label: 'Weakly Demonstrated',
    className: 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]',
  },
  missing: {
    label: 'Missing',
    className: 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]',
  },
};

export default function SkillMatrix({ skillMatrix }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const counts = useMemo(() => {
    if (!skillMatrix) return { matched: 0, weakly_demonstrated: 0, missing: 0 };
    return skillMatrix.reduce(
      (acc, s) => {
        if (s.status in acc) acc[s.status]++;
        return acc;
      },
      { matched: 0, weakly_demonstrated: 0, missing: 0 }
    );
  }, [skillMatrix]);

  const filteredSkills = useMemo(() => {
    if (!skillMatrix) return [];
    let list = skillMatrix;
    if (filter !== 'all') {
      list = list.filter((s) => s.status === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.skill.toLowerCase().includes(q) ||
          (s.evidence_quote && s.evidence_quote.toLowerCase().includes(q))
      );
    }
    return list;
  }, [skillMatrix, filter, searchQuery]);

  const pills = [
    { id: 'all', label: 'All', count: skillMatrix ? skillMatrix.length : 0 },
    { id: 'matched', label: 'Matched', count: counts.matched },
    { id: 'weakly_demonstrated', label: 'Weakly Demonstrated', count: counts.weakly_demonstrated },
    { id: 'missing', label: 'Missing', count: counts.missing },
  ];

  if (!skillMatrix || skillMatrix.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-[#71717A]">No skill data available.</div>
    );
  }

  return (
    <div>
      {/* Filter Pills Row */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {pills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => setFilter(pill.id)}
            className={`text-xs font-mono px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
              filter === pill.id
                ? 'bg-[#09090B] text-white'
                : 'border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5] bg-white'
            }`}
          >
            {pill.label} ({pill.count})
          </button>
        ))}

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills…"
          className="ml-auto text-xs border border-[#E4E4E7] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#09090B] w-36 transition-colors"
        />
      </div>

      {/* Skill List */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-10 text-sm text-[#71717A]">
          No skills match the current filter.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSkills.map((skill) => (
            <div
              key={skill.skill}
              className="bg-white border border-[#E4E4E7] rounded-lg p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-[#09090B]">{skill.skill}</span>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded flex-shrink-0 ${
                    STATUS_CONFIG[skill.status]?.className || ''
                  }`}
                >
                  {STATUS_CONFIG[skill.status]?.label || skill.status}
                </span>
              </div>

              {skill.evidence_quote && (
                <div className="mt-2 pl-3 border-l-2 border-[#E4E4E7]">
                  <p className="font-mono text-xs text-[#52525B] leading-relaxed">
                    &ldquo;{skill.evidence_quote}&rdquo;
                  </p>
                </div>
              )}

              {skill.gap_explanation && (
                <p className="text-xs text-[#71717A] mt-1.5 italic">{skill.gap_explanation}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
