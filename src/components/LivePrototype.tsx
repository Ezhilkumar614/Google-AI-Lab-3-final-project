import React, { useState } from 'react';
import { Play, Copy, Check, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

interface LivePrototypeProps {
  toolName: string;
  role: string;
  sampleInput: string;
  prototypeTitle: string;
  prototypeDescription: string;
}

export const LivePrototype: React.FC<LivePrototypeProps> = ({
  toolName,
  role,
  sampleInput,
  prototypeTitle,
  prototypeDescription,
}) => {
  const [inputText, setInputText] = useState(sampleInput);
  const [audience, setAudience] = useState('Executive Leadership (C-Suite)');
  const [formatStyle, setFormatStyle] = useState('Structured Executive Briefing');
  const [outputResult, setOutputResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [modelUsed, setModelUsed] = useState('');

  const handleSimulate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/simulate-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName,
          role,
          taskContext: 'Synthesizing fragmented updates into clear, high-signal briefings',
          inputContent: inputText,
          targetAudience: audience,
          formatStyle,
        }),
      });

      const data = await res.json();
      setOutputResult(data.output || 'No output generated.');
      setModelUsed(data.modelUsed || 'gemini-3.8-flash');
    } catch (err) {
      console.error('Simulation error:', err);
      setOutputResult('Error connecting to backend simulation service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputResult) return;
    const blob = new Blob([outputResult], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-briefing.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSample = () => {
    setInputText(sampleInput);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <span>LIVE INTERACTIVE PROTOTYPE</span>
          <span aria-hidden="true">·</span>
          <span>POWERED BY GEMINI 3.8 FLASH</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {prototypeTitle}
            </h2>
            <p className="text-xs lg:text-sm text-slate-600 mt-1 max-w-2xl">
              {prototypeDescription} Experience how an AI-powered tool compresses 45 minutes of manual synthesis into an immediate 30-second review.
            </p>
          </div>
          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload Sample Input
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Input on Left, Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Input Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-900">
                1. RAW UNSTRUCTURED WORK INPUT
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {inputText.length} characters
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste raw notes, Slack threads, status updates, or customer transcripts here..."
              rows={14}
              className="w-full text-xs font-mono bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none leading-relaxed"
            />

            {/* Audience & Tone Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  TARGET AUDIENCE
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
                >
                  <option value="Executive Leadership (C-Suite)">Executive Leadership (C-Suite)</option>
                  <option value="Cross-Functional Stakeholders">Cross-Functional Stakeholders</option>
                  <option value="Internal Engineering Team">Internal Engineering Team</option>
                  <option value="Customer / Client Facing">Customer / Client Facing</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  DELIVERABLE FORMAT
                </label>
                <select
                  value={formatStyle}
                  onChange={(e) => setFormatStyle(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
                >
                  <option value="Structured Executive Briefing">Structured Executive Briefing</option>
                  <option value="Concise Slack Digest">Concise Slack / Email Digest</option>
                  <option value="Risk & Blocker Radar Only">Risk & Blocker Radar Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Single-click AI transformation
            </span>
            <button
              onClick={handleSimulate}
              disabled={isLoading || !inputText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Synthesizing Brief...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Executive Deliverable
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-900">
                2. AI SYNTHESIZED DELIVERABLE
              </label>
              {modelUsed && (
                <span className="text-[11px] text-slate-500 font-mono">
                  Engine: {modelUsed}
                </span>
              )}
            </div>

            {outputResult ? (
              <div className="relative">
                <textarea
                  value={outputResult}
                  onChange={(e) => setOutputResult(e.target.value)}
                  rows={14}
                  className="w-full text-xs bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed font-sans resize-none"
                />
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Editable: make quick human adjustments before exporting</span>
                  <span>Markdown formatted</span>
                </div>
              </div>
            ) : (
              <div className="h-[340px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50">
                <Sparkles className="w-8 h-8 text-slate-300 mb-3" />
                <h4 className="text-sm font-semibold text-slate-700 mb-1">
                  Ready to Synthesize
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mb-4">
                  Click "Generate Executive Deliverable" to execute the AI workflow using the Gemini 3.8 Flash model.
                </p>
                <button
                  onClick={handleSimulate}
                  disabled={isLoading}
                  className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Run Simulation Now
                </button>
              </div>
            )}
          </div>

          {outputResult && (
            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Text
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .md
                </button>
              </div>

              <div className="text-[11px] text-emerald-700 font-medium">
                Human Review Time: ~30 seconds
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
