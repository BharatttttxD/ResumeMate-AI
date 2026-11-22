import React, { useState, useRef } from 'react';
import { extractTextFromPDF } from '../utils/pdfExtractor.js';
import { Upload, FileText, Eye, X } from 'lucide-react';

export default function InputPanel({
  resumeText,
  setResumeText,
  jdText,
  setJdText,
  onRunAudit,
  isLoading,
  piiCount,
  redactedPreview,
  onShowRedactedPreview,
  autoRedact,
  setAutoRedact,
}) {
  const [inputMode, setInputMode] = useState('paste');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const fileInputRef = useRef(null);

  async function handleFiles(files) {
    const fileArr = Array.from(files);
    const pdfFile = fileArr.find((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (!pdfFile) {
      setPdfError('Please select a valid PDF file.');
      return;
    }
    setPdfLoading(true);
    setPdfError(null);
    try {
      const text = await extractTextFromPDF(pdfFile);
      setResumeText(text);
      setUploadedFileName(pdfFile.name);
    } catch (err) {
      setPdfError(err.message || 'Failed to extract text from PDF.');
    } finally {
      setPdfLoading(false);
    }
  }

  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }

  function onDragLeave() {
    setIsDragOver(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function onFileInputChange(e) {
    handleFiles(e.target.files);
    e.target.value = '';
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable top section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* CARD 1 — Candidate Resume */}
        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4">
          {/* Card header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#09090B]">Candidate Resume</span>
            <div className="flex gap-1">
              <button
                onClick={() => setInputMode('paste')}
                className={`text-xs font-mono px-2.5 py-1 rounded transition-colors ${
                  inputMode === 'paste'
                    ? 'bg-[#09090B] text-white'
                    : 'bg-[#F4F4F5] text-[#52525B] hover:bg-[#E4E4E7]'
                }`}
              >
                Paste Text
              </button>
              <button
                onClick={() => setInputMode('upload')}
                className={`text-xs font-mono px-2.5 py-1 rounded transition-colors ${
                  inputMode === 'upload'
                    ? 'bg-[#09090B] text-white'
                    : 'bg-[#F4F4F5] text-[#52525B] hover:bg-[#E4E4E7]'
                }`}
              >
                Upload PDF
              </button>
            </div>
          </div>

          {/* Paste mode */}
          {inputMode === 'paste' && (
            <>
              <textarea
                className="w-full min-h-[200px] resize-y text-sm text-[#09090B] placeholder-[#A1A1AA] border border-[#E4E4E7] rounded-lg p-3 font-sans leading-relaxed focus:outline-none focus:border-[#09090B] transition-colors"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                maxLength={15000}
                placeholder={"Paste your resume text here…\nInclude all sections: Education, Projects, Experience, Skills"}
              />

              <div className="flex items-center justify-between mt-2">
                {/* Left: Toggle + PII info */}
                <div className="flex items-center gap-2">
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => setAutoRedact(!autoRedact)}
                    className="relative w-8 h-4 flex-shrink-0"
                    aria-label="Toggle auto-redact PII"
                  >
                    <div
                      className={`w-8 h-4 rounded-full transition-colors ${
                        autoRedact ? 'bg-[#09090B]' : 'bg-[#D4D4D8]'
                      }`}
                    />
                    <div
                      className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${
                        autoRedact ? 'translate-x-4 left-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                  <span className="text-xs text-[#52525B]">Auto-Redact PII</span>

                  {autoRedact && piiCount > 0 && (
                    <span className="font-mono text-xs bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-1.5 py-0.5 rounded">
                      {piiCount} masked
                    </span>
                  )}

                  {autoRedact && resumeText && (
                    <button
                      onClick={onShowRedactedPreview}
                      className="text-xs text-[#71717A] hover:text-[#09090B] flex items-center gap-0.5 ml-1 transition-colors"
                    >
                      <Eye size={10} />
                      Preview
                    </button>
                  )}
                </div>

                {/* Right: char count */}
                <span className="font-mono text-xs text-[#71717A]">
                  {resumeText.length.toLocaleString()} / 15,000
                </span>
              </div>
            </>
          )}

          {/* Upload mode */}
          {inputMode === 'upload' && (
            <>
              <div
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                  isDragOver
                    ? 'border-[#09090B] bg-[#F4F4F5]'
                    : 'border-[#E4E4E7] hover:border-[#A1A1AA]'
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-2">
                  <Upload size={24} className="mx-auto text-[#71717A]" />
                  <p className="text-sm text-[#52525B] font-medium">
                    Drop PDF here or click to browse
                  </p>
                  <p className="text-xs text-[#71717A]">
                    .pdf only · Parsed entirely in browser · Never uploaded
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={onFileInputChange}
                className="hidden"
              />

              {pdfLoading && (
                <p className="text-xs text-[#52525B] mt-3 text-center animate-pulse">
                  Extracting text from PDF…
                </p>
              )}

              {pdfError && (
                <p className="text-xs text-[#991B1B] mt-2">{pdfError}</p>
              )}

              {uploadedFileName && resumeText && (
                <div className="mt-3 flex items-center gap-2 text-xs text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] rounded px-3 py-2">
                  <FileText size={12} />
                  <span>Extracted: {uploadedFileName}</span>
                  <button
                    onClick={() => {
                      setResumeText('');
                      setUploadedFileName(null);
                      setPdfError(null);
                    }}
                    className="ml-auto text-[#71717A] hover:text-[#991B1B] transition-colors"
                    aria-label="Remove uploaded file"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* CARD 2 — Target Job Description */}
        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#09090B]">Target Job Description</span>
            <button
              onClick={() => setJdText('')}
              disabled={!jdText}
              className="text-xs text-[#71717A] hover:text-[#09090B] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Clear
            </button>
          </div>

          <textarea
            className="w-full min-h-[150px] resize-y text-sm text-[#09090B] placeholder-[#A1A1AA] border border-[#E4E4E7] rounded-lg p-3 font-sans leading-relaxed focus:outline-none focus:border-[#09090B] transition-colors"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            maxLength={10000}
            placeholder={"Paste the job description here…\nInclude requirements, responsibilities, and nice-to-haves"}
          />

          <div className="flex justify-end mt-2">
            <span className="font-mono text-xs text-[#71717A]">
              {jdText.length.toLocaleString()} / 10,000
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="border-t border-[#E4E4E7] bg-[#FAFAFA] p-4">
        <button
          onClick={onRunAudit}
          disabled={isLoading || !resumeText.trim() || !jdText.trim()}
          className="w-full bg-[#18181B] text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-[#27272A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                viewBox="0 0 24 24"
                fill="none"
              />
              Analyzing…
            </>
          ) : (
            'Run Alignment Audit'
          )}
        </button>
        <p className="text-center text-xs text-[#71717A] mt-2">Press Ctrl + Enter to run</p>
      </div>
    </div>
  );
}
