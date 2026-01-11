import React, { useState } from 'react';
import { generateVideoMetadata } from '../services/geminiService';
import { VideoMetadata, AIGeneratedContent } from '../types';
import { Sparkles, Copy, Hash, AlignLeft, Lightbulb, Download } from 'lucide-react';

interface AIGeneratorProps {
  videoData: VideoMetadata;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({ videoData }) => {
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIGeneratedContent | null>(null);

  const handleGenerate = async () => {
    if (!videoData) return;
    setLoading(true);
    try {
      const data = await generateVideoMetadata(videoData.title, videoData.platform, context);
      setResult(data);
    } catch (e) {
      alert("AI Generation failed. Please ensure API Key is valid.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Ideally show a toast here
  };

  const downloadReport = () => {
    if (!result) return;
    const reportText = `
STREAM SAGE - AI ANALYSIS REPORT
================================
Video Title: ${videoData.title}
Platform: ${videoData.platform}
Generated On: ${new Date().toLocaleString()}

--------------------------------
VIRAL CAPTIONS
--------------------------------
${result.captions.map(c => `• ${c}`).join('\n')}

--------------------------------
TRENDING HASHTAGS
--------------------------------
${result.hashtags.join(' ')}

--------------------------------
VIDEO DESCRIPTION
--------------------------------
${result.description}

--------------------------------
STRATEGY & ANALYSIS
--------------------------------
${result.analysis}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StreamSage_Report_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">AI Content Repurposer</h3>
        </div>

        <p className="text-slate-300 text-sm mb-4">
          Want to repost this? Let Gemini generate viral captions, hashtags, and a strategy for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="E.g., 'Targeting fitness enthusiasts' or 'Make it funny'"
            className="flex-1 bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
          >
            {loading ? 'Thinking...' : 'Generate Magic'}
            {!loading && <Sparkles className="w-4 h-4" />}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
            
            {/* Captions */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-purple-300">
                  <AlignLeft className="w-4 h-4" />
                  <span className="font-semibold text-sm">Viral Captions</span>
                </div>
              </div>
              <div className="space-y-3">
                {result.captions.map((cap, idx) => (
                  <div key={idx} className="group relative bg-slate-800/50 p-3 rounded-lg text-sm text-slate-200 hover:bg-slate-800 transition-colors">
                    "{cap}"
                    <button 
                      onClick={() => copyToClipboard(cap)}
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hashtags */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Hash className="w-4 h-4" />
                  <span className="font-semibold text-sm">Trending Tags</span>
                </div>
                <button 
                  onClick={() => copyToClipboard(result.hashtags.join(' '))}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-slate-800 text-cyan-200/80 px-2 py-1 rounded-md border border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Strategy / Analysis */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900/30 to-slate-900/60 rounded-xl p-4 border border-indigo-500/20">
               <div className="flex items-center gap-2 text-indigo-300 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="font-semibold text-sm">Gemini Strategy Tip</span>
                </div>
                <p className="text-sm text-indigo-100 leading-relaxed italic">
                  {result.analysis}
                </p>
            </div>

            {/* Download Report Button */}
            <div className="col-span-1 md:col-span-2 flex justify-end mt-2">
              <button 
                onClick={downloadReport}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg"
              >
                <Download className="w-4 h-4" />
                Download Report (.txt)
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerator;