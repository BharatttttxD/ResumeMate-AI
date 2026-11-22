import React from 'react';

export default function EmptyRubricState({
  onLoadSample,
  onPreviewSampleAudit,
}) {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">

      {/* Section 1 — How It Works */}
      <section>
        <h2 className="text-sm font-semibold text-[#09090B] mb-3">How ResumeMate AI Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step 1 */}
          <div className="bg-white border border-[#E4E4E7] rounded-lg p-4">
            <span className="font-mono text-xs text-[#71717A] mb-2 block">01</span>
            <p className="text-sm font-semibold text-[#09090B] mb-1">Submit Resume + JD</p>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Paste resume text or upload a PDF (extracted in-browser). Add the target job
              description.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#E4E4E7] rounded-lg p-4">
            <span className="font-mono text-xs text-[#71717A] mb-2 block">02</span>
            <p className="text-sm font-semibold text-[#09090B] mb-1">Evidence Verification</p>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Every claimed skill is cross-referenced against project and experience bullets. PII is
              redacted before the request is sent.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#E4E4E7] rounded-lg p-4">
            <span className="font-mono text-xs text-[#71717A] mb-2 block">03</span>
            <p className="text-sm font-semibold text-[#09090B] mb-1">Transparent Scoring</p>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Receive a 100-point rubric breakdown across 4 pillars with verbatim evidence quotes,
              XYZ bullet rewrites, and a ranked action plan.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 — Rubric Table */}
      <section>
        <h2 className="text-sm font-semibold text-[#09090B] mb-3">Scoring Rubric Overview</h2>
        <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-[#F4F4F5]">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold text-[#52525B]">Pillar</th>
                <th className="text-right px-4 py-2.5 font-semibold text-[#52525B] font-mono">
                  Points
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#52525B] hidden md:table-cell">
                  What We Evaluate
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#E4E4E7]">
                <td className="px-4 py-3 text-[#09090B] font-medium">
                  Core Technical &amp; Hard Skills Alignment
                </td>
                <td className="px-4 py-3 text-[#52525B] font-mono text-right">40 pts</td>
                <td className="px-4 py-3 text-[#71717A] hidden md:table-cell">
                  Exact &amp; semantic match of languages, frameworks, databases, tools
                </td>
              </tr>
              <tr className="border-t border-[#E4E4E7]">
                <td className="px-4 py-3 text-[#09090B] font-medium">
                  Project &amp; Practical Experience Evidence
                </td>
                <td className="px-4 py-3 text-[#52525B] font-mono text-right">30 pts</td>
                <td className="px-4 py-3 text-[#71717A] hidden md:table-cell">
                  Architectural depth, hands-on implementation proof, problem-solving
                </td>
              </tr>
              <tr className="border-t border-[#E4E4E7]">
                <td className="px-4 py-3 text-[#09090B] font-medium">
                  Impact, Ownership &amp; Action-Verb Quality
                </td>
                <td className="px-4 py-3 text-[#52525B] font-mono text-right">20 pts</td>
                <td className="px-4 py-3 text-[#71717A] hidden md:table-cell">
                  Strong verbs, quantified outcomes, ownership signals
                </td>
              </tr>
              <tr className="border-t border-[#E4E4E7]">
                <td className="px-4 py-3 text-[#09090B] font-medium">
                  Role &amp; Domain Contextual Fit
                </td>
                <td className="px-4 py-3 text-[#52525B] font-mono text-right">10 pts</td>
                <td className="px-4 py-3 text-[#71717A] hidden md:table-cell">
                  Coursework, testing/deployment exposure, domain alignment
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3 — Quick Start */}
      <section>
        <h2 className="text-sm font-semibold text-[#09090B] mb-3">Try a Sample Case or Instant Preview</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => onLoadSample('fullstack-sde')}
            className="border border-[#E4E4E7] bg-white rounded-lg px-4 py-3 text-left hover:bg-[#F4F4F5] transition-colors"
          >
            <p className="text-sm font-medium text-[#09090B]">Full-Stack SDE Intern</p>
            <p className="text-xs text-[#71717A] font-mono mt-0.5">
              React · Node.js · PostgreSQL · JWT
            </p>
          </button>

          <button
            onClick={() => onLoadSample('aiml-data')}
            className="border border-[#E4E4E7] bg-white rounded-lg px-4 py-3 text-left hover:bg-[#F4F4F5] transition-colors"
          >
            <p className="text-sm font-medium text-[#09090B]">AI/ML &amp; Data Intern</p>
            <p className="text-xs text-[#71717A] font-mono mt-0.5">
              PyTorch · BERT · Apache Spark · MLflow
            </p>
          </button>

          <button
            onClick={onPreviewSampleAudit}
            className="border border-dashed border-[#A1A1AA] bg-white rounded-lg px-4 py-3 text-left hover:bg-[#F4F4F5] transition-colors"
          >
            <p className="text-sm font-medium text-[#09090B]">Preview With Pre-Computed Sample Audit →</p>
            <p className="text-xs text-[#71717A] font-mono mt-0.5">
              Inspect Full Diagnostic UI · Zero Setup
            </p>
          </button>
        </div>
      </section>
    </div>
  );
}
