import React, { useState, useRef, useEffect } from 'react';
import { Key, ChevronDown, ExternalLink, FileDown, BookOpen, Eye, EyeOff, X } from 'lucide-react';

export default function Header({
  auditResult,
  onExport,
  onLoadSample,
  onShowRubric,
  showApiKeyPopover,
  setShowApiKeyPopover,
}) {
  const [apiKey, setApiKey] = useState(
    () => sessionStorage.getItem('gemini_api_key') || ''
  );
  const [keyInput, setKeyInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showKeyValue, setShowKeyValue] = useState(false);

  const popoverRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sync apiKey from sessionStorage on storage events
  useEffect(() => {
    const handler = () => {
      setApiKey(sessionStorage.getItem('gemini_api_key') || '');
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Click outside to close API key popover
  useEffect(() => {
    if (!showApiKeyPopover) return;
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowApiKeyPopover(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showApiKeyPopover, setShowApiKeyPopover]);

  // Click outside to close sample dropdown
  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showDropdown]);

  function saveKey() {
    const k = keyInput.trim();
    sessionStorage.setItem('gemini_api_key', k);
    setApiKey(k);
    setShowApiKeyPopover(false);
    setKeyInput('');
  }

  function clearKey() {
    sessionStorage.removeItem('gemini_api_key');
    setApiKey('');
    setKeyInput('');
  }

  return (
    <header className="h-14 bg-white border-b border-[#E4E4E7] px-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#09090B]">ResumeMate AI</span>
        <span className="font-mono text-xs bg-[#F4F4F5] text-[#52525B] px-2 py-0.5 rounded border border-[#E4E4E7]">
          RUBRIC v1.0
        </span>
        <span className="text-xs text-[#71717A] hidden md:block">
          Stateless · Client PII Redacted
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Load Sample Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="text-xs text-[#52525B] border border-[#E4E4E7] rounded px-3 py-1.5 hover:bg-[#F4F4F5] flex items-center gap-1 bg-white transition-colors"
          >
            Load Sample
            <ChevronDown size={12} />
          </button>

          {showDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-[#E4E4E7] rounded-lg shadow-lg z-50 w-52 py-1">
              <button
                onClick={() => {
                  onLoadSample('fullstack-sde');
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-[#09090B] hover:bg-[#F4F4F5]"
              >
                Full-Stack SDE Intern
              </button>
              <button
                onClick={() => {
                  onLoadSample('aiml-data');
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-[#09090B] hover:bg-[#F4F4F5]"
              >
                AI/ML &amp; Data Intern
              </button>
            </div>
          )}
        </div>

        {/* Rubric Button */}
        <button
          onClick={onShowRubric}
          className="flex items-center gap-1.5 text-xs text-[#52525B] border border-[#E4E4E7] rounded px-3 py-1.5 hover:bg-[#F4F4F5] bg-white transition-colors"
        >
          <BookOpen size={12} />
          Rubric
        </button>

        {/* API Key Section */}
        <div ref={popoverRef} className="relative">
          {/* Pill Button */}
          <button
            onClick={() => setShowApiKeyPopover(!showApiKeyPopover)}
            className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border cursor-pointer transition-colors ${
              apiKey
                ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                : 'bg-[#F4F4F5] text-[#09090B] border-[#E4E4E7] hover:bg-[#E4E4E7]'
            }`}
          >
            {apiKey ? '● Gemini Cloud Key' : '⚡ Audit Engine: Active'}
          </button>

          {/* Popover */}
          {showApiKeyPopover && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-[#E4E4E7] rounded-lg shadow-lg p-4 w-80 z-50">
              <p className="text-sm font-semibold text-[#09090B] mb-1">Audit Engine &amp; API Key</p>
              <p className="text-xs text-[#71717A] mb-3">
                ResumeMate runs out of the box with our built-in evidence-grounded rubric engine. Providing a Gemini API key is completely optional.
              </p>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-3"
              >
                Get your free key at Google AI Studio
                <ExternalLink size={10} />
              </a>

              {/* Input */}
              <div className="relative">
                <input
                  type={showKeyValue ? 'text' : 'password'}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveKey();
                  }}
                  className="w-full text-xs font-mono border border-[#E4E4E7] rounded px-3 py-2 pr-8 focus:outline-none focus:border-[#09090B]"
                  placeholder="AIzaSy..."
                />
                <button
                  type="button"
                  onClick={() => setShowKeyValue((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#71717A] p-0.5 hover:text-[#09090B]"
                  aria-label={showKeyValue ? 'Hide key' : 'Show key'}
                >
                  {showKeyValue ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={saveKey}
                  className="flex-1 bg-[#18181B] text-white text-xs px-4 py-1.5 rounded hover:bg-[#27272A] transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={clearKey}
                  className="border border-[#E4E4E7] text-[#52525B] text-xs px-4 py-1.5 rounded hover:bg-[#F4F4F5] transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          disabled={!auditResult}
          className="flex items-center gap-1.5 text-xs text-[#52525B] border border-[#E4E4E7] rounded px-3 py-1.5 hover:bg-[#F4F4F5] bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FileDown size={12} />
          Export .md
        </button>
      </div>
    </header>
  );
}
