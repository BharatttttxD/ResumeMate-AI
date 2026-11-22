import React from 'react';
import { X } from 'lucide-react';

const PILLARS = [
  {
    num: '01',
    label: 'Core Technical & Hard Skills Alignment',
    points: 40,
    pointsClass: 'text-[#065F46]',
    criteria: [
      'Exact match of required programming languages, frameworks, and tools',
      'Semantic/equivalent matches (e.g. PostgreSQL counted for "SQL databases")',
      'Partial matches — technologies listed but not shown in project context earn reduced points',
      'Required skills completely absent from resume earn zero for that skill',
    ],
  },
  {
    num: '02',
    label: 'Project & Practical Experience Evidence',
    points: 30,
    pointsClass: 'text-[#065F46]',
    criteria: [
      'Deep technical detail: architectural decisions, design patterns, tradeoffs described',
      'Problem-to-solution framing: identifies a specific challenge and resolves it technically',
      'Hands-on implementation proof: specific APIs, libraries, configuration, or integrations cited',
      'Surface-level mentions without technical depth earn partial credit only',
    ],
  },
  {
    num: '03',
    label: 'Impact, Ownership & Action-Verb Quality',
    points: 20,
    pointsClass: 'text-[#92400E]',
    criteria: [
      'Strong engineering verbs: built, architected, optimized, reduced, shipped, led, designed',
      'Quantified outcomes with real numbers: response time %, user count, error rate reduction',
      'Ownership signals: sole engineer, end-to-end responsibility, led team, designed system',
      'Weak verbs (helped, worked on, assisted, was involved in) earn significantly reduced points',
    ],
  },
  {
    num: '04',
    label: 'Role & Domain Contextual Fit',
    points: 10,
    pointsClass: 'text-[#92400E]',
    criteria: [
      'Relevant coursework aligned with the target role domain',
      'Testing exposure: unit tests, integration tests, E2E — where the JD requires it',
      'Deployment / DevOps awareness: CI/CD pipelines, cloud platforms, containers',
      'Industry domain alignment: fintech, ML, enterprise SaaS, etc.',
    ],
  },
];

export default function RubricModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-12 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-[#E4E4E7] sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-[#09090B]">Scoring Rubric v1.0</h2>
            <p className="text-sm text-[#71717A] mt-0.5">
              100-point evidence-grounded alignment rubric
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-[#09090B] p-1 transition-colors"
            aria-label="Close rubric modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.num}
              className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs bg-[#F4F4F5] text-[#52525B] px-2 py-0.5 rounded border border-[#E4E4E7] flex-shrink-0">
                  {pillar.num}
                </span>
                <span className="text-sm font-semibold text-[#09090B] flex-1">{pillar.label}</span>
                <span
                  className={`font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7] flex-shrink-0 ${pillar.pointsClass}`}
                >
                  {pillar.points} pts
                </span>
              </div>
              <ul className="space-y-1.5">
                {pillar.criteria.map((criterion, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-[#52525B] flex items-start gap-2 leading-relaxed"
                  >
                    <span className="text-[#D4D4D8] mt-0.5 flex-shrink-0">·</span>
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E4E4E7] bg-[#FAFAFA]">
          <p className="text-xs text-[#71717A] italic leading-relaxed">
            Anti-hallucination guarantee: every matched or weakly demonstrated skill must include a
            verbatim evidence quote extracted directly from the submitted resume text. No skills are
            inferred or fabricated.
          </p>
        </div>
      </div>
    </div>
  );
}
