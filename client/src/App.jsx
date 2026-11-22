import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import InputPanel from './components/InputPanel.jsx';
import EmptyRubricState from './components/EmptyRubricState.jsx';
import LoadingTracker from './components/LoadingTracker.jsx';
import ScoreCard from './components/ScoreCard.jsx';
import SkillMatrix from './components/SkillMatrix.jsx';
import BulletRewrites from './components/BulletRewrites.jsx';
import ActionPlan from './components/ActionPlan.jsx';
import RubricModal from './components/RubricModal.jsx';
import { redactPII } from './utils/piiRedactor.js';
import { downloadMarkdownReport } from './utils/markdownExport.js';
import { SAMPLE_CASES, SAMPLE_AUDIT_RESULT } from './utils/sampleData.js';

const TABS = [
  { id: 'score', label: 'Score' },
  { id: 'skills', label: 'Skill Matrix' },
  { id: 'rewrites', label: 'Bullet Rewrites' },
  { id: 'plan', label: 'Action Plan' },
];

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [activeTab, setActiveTab] = useState('score');
  const [showApiKeyPopover, setShowApiKeyPopover] = useState(false);
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [autoRedact, setAutoRedact] = useState(true);
  const [piiCount, setPiiCount] = useState(0);
  const [redactedPreview, setRedactedPreview] = useState('');
  const [showRedactedPreview, setShowRedactedPreview] = useState(false);

  // Sync PII redaction whenever resumeText changes
  useEffect(() => {
    const r = redactPII(resumeText);
    setPiiCount(r.count);
    setRedactedPreview(r.redactedText);
  }, [resumeText]);

  // Ctrl+Enter shortcut
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'Enter' && !isLoading && resumeText.trim() && jdText.trim()) {
        runAudit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isLoading, resumeText, jdText, autoRedact]);

  async function runAudit() {
    const apiKey = sessionStorage.getItem('gemini_api_key')?.trim() || '';

    setIsLoading(true);
    setError(null);
    setAuditResult(null);
    setLoadingStage(0);

    const timers = [
      setTimeout(() => setLoadingStage(1), 350),
      setTimeout(() => setLoadingStage(2), 700),
      setTimeout(() => setLoadingStage(3), 1050),
    ];

    const controller = new AbortController();
    const abortTimeout = setTimeout(() => controller.abort(), 15000);

    try {
      const textToSend = autoRedact ? redactPII(resumeText).redactedText : resumeText;
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey,
        },
        body: JSON.stringify({ resumeText: textToSend, jdText }),
        signal: controller.signal,
      });

      clearTimeout(abortTimeout);

      if (!response.ok) {
        const e = await response.json();
        throw new Error(e.error || 'Audit failed');
      }

      const data = await response.json();
      setAuditResult(data);
      setActiveTab('score');
    } catch (err) {
      clearTimeout(abortTimeout);
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message);
      }
    } finally {
      timers.forEach(clearTimeout);
      setIsLoading(false);
    }
  }

  function loadSampleCase(sampleId) {
    const found = SAMPLE_CASES.find((s) => s.id === sampleId);
    if (found) {
      setResumeText(found.resume || found.resumeText || '');
      setJdText(found.jd || found.jdText || '');
      setAuditResult(null);
      setError(null);
    }
  }

  function loadSampleAudit() {
    setAuditResult(SAMPLE_AUDIT_RESULT);
    setActiveTab('score');
    setError(null);
  }

  function handleExport() {
    if (auditResult) {
      downloadMarkdownReport(auditResult);
    }
  }

  return (
    <div className="h-screen bg-[#FAFAFA] flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <Header
        auditResult={auditResult}
        onExport={handleExport}
        onLoadSample={loadSampleCase}
        onShowRubric={() => setShowRubricModal(true)}
        showApiKeyPopover={showApiKeyPopover}
        setShowApiKeyPopover={setShowApiKeyPopover}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-row overflow-hidden">
        {/* Left Pane */}
        <div className="w-[42%] min-w-[320px] border-r border-[#E4E4E7] overflow-y-auto flex flex-col">
          <InputPanel
            resumeText={resumeText}
            setResumeText={setResumeText}
            jdText={jdText}
            setJdText={setJdText}
            onRunAudit={runAudit}
            isLoading={isLoading}
            piiCount={piiCount}
            redactedPreview={redactedPreview}
            onShowRedactedPreview={() => setShowRedactedPreview(true)}
            autoRedact={autoRedact}
            setAutoRedact={setAutoRedact}
          />
        </div>

        {/* Right Pane */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <LoadingTracker stage={loadingStage} />
          ) : !auditResult ? (
            <EmptyRubricState
              onLoadSample={loadSampleCase}
              onPreviewSampleAudit={loadSampleAudit}
            />
          ) : (
            <div className="flex flex-col h-full">
              {/* Sticky Tab Bar */}
              <div className="bg-white border-b border-[#E4E4E7] px-6 flex gap-0 sticky top-0 z-10">
                {TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`py-3 px-4 text-sm border-b-2 transition-colors ${
                      activeTab === id
                        ? 'border-[#09090B] text-[#09090B] font-medium'
                        : 'border-transparent text-[#71717A] hover:text-[#52525B]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="px-6 py-6 flex-1">
                {activeTab === 'score' && <ScoreCard auditResult={auditResult} />}
                {activeTab === 'skills' && <SkillMatrix skillMatrix={auditResult.skill_matrix} />}
                {activeTab === 'rewrites' && <BulletRewrites bulletRewrites={auditResult.bullet_rewrites} />}
                {activeTab === 'plan' && <ActionPlan actionPlan={auditResult.action_plan} />}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Error Banner */}
      {error && !error.includes('API key') && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-sm text-[#991B1B]">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-[#991B1B] hover:text-[#7F1D1D] font-bold text-lg leading-none"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Redacted Preview Modal */}
      {showRedactedPreview && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setShowRedactedPreview(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-semibold text-[#09090B] mb-3">Redacted Payload Preview</h2>
            <pre className="font-mono text-xs text-[#52525B] bg-[#F4F4F5] p-4 rounded overflow-auto max-h-96 whitespace-pre-wrap">
              {redactedPreview}
            </pre>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowRedactedPreview(false)}
                className="bg-[#18181B] text-white text-xs px-4 py-2 rounded hover:bg-[#27272A]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rubric Modal */}
      <RubricModal isOpen={showRubricModal} onClose={() => setShowRubricModal(false)} />
    </div>
  );
}
