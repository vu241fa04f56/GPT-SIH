import React, { useState } from 'react';
import { CityModelOutput } from '../types.ts';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Loader2,
  ShieldAlert,
  CloudSun,
  Sprout,
  HelpCircle,
} from 'lucide-react';

interface AIAnalystModalProps {
  onClose: () => void;
  initialCity: CityModelOutput | null;
  allCities: CityModelOutput[];
}

export const AIAnalystModal: React.FC<AIAnalystModalProps> = ({
  onClose,
  initialCity,
  allCities,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<number>(initialCity?.city.id || 10); // Default Delhi #10
  const [promptInput, setPromptInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisReport, setAnalysisReport] = useState<string | null>(null);

  const presets = [
    'Assess cyclone vulnerability along the Odisha and Andhra coast',
    'Generate Rabi wheat sowing & soil moisture advisory for Punjab & Haryana',
    'Analyze air quality & smog risk across Delhi-NCR districts in the next 3h',
    'Compare flood risk between Assam Brahmaputra valley and Western Ghats',
  ];

  const handleRunAnalysis = async (customPrompt?: string) => {
    const queryToUse = customPrompt || promptInput;
    setIsLoading(true);
    setAnalysisReport(null);

    try {
      const res = await fetch('/api/ai/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: selectedCityId,
          customPrompt: queryToUse,
          focusArea: 'Senior Meteorological & Agro Briefing',
        }),
      });

      const data = await res.json();
      setAnalysisReport(data.report || 'Analysis complete.');
    } catch (err: any) {
      setAnalysisReport('Service unavailable or network timeout. Please verify backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs text-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>WeatherGPT AI Intelligence Analyst</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Synthesis engine analyzing all 3 AI/ML models across 130 hubs
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Target Station Selector */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold whitespace-nowrap">
              Primary Focus Station:
            </span>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(parseInt(e.target.value, 10))}
              className="bg-slate-950 text-cyan-300 border border-slate-800 rounded-lg px-2 py-1 text-xs outline-none w-full cursor-pointer"
            >
              {allCities.map((c) => (
                <option key={c.city.id} value={c.city.id}>
                  #{c.city.id} {c.city.name} ({c.city.state} - {c.city.zone})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1.5">
              Strategic AI Briefing Queries:
            </span>
            <div className="space-y-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(p);
                    handleRunAnalysis(p);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-cyan-800/60 text-slate-300 hover:text-cyan-300 text-[11px] font-sans transition-colors flex items-center justify-between"
                >
                  <span>{p}</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input Box */}
          <div className="space-y-2 pt-2">
            <label className="text-[10px] text-slate-400 uppercase font-semibold block">
              Custom Meteorological or Agro Inquiry:
            </label>
            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleRunAnalysis();
                  }
                }}
                placeholder="Ask about flood thresholds, pest risks, or 1h radar trends..."
                className="bg-transparent px-2 py-1 text-xs text-white placeholder-slate-500 outline-none w-full"
              />
              <button
                onClick={() => handleRunAnalysis()}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Analyze</span>
              </button>
            </div>
          </div>

          {/* Analysis Report Output */}
          {analysisReport && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-700/60 mt-4 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-cyan-300 font-bold text-xs pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Synthesized Operational Intelligence</span>
                </span>
                <span className="text-[10px] text-slate-400">Station #{selectedCityId}</span>
              </div>
              <div className="text-slate-200 text-xs font-sans whitespace-pre-wrap leading-relaxed">
                {analysisReport}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
