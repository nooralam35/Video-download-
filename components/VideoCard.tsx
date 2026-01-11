import React, { useState } from 'react';
import { VideoMetadata } from '../types';
import { Download, Smartphone, Monitor, Film, ShieldAlert, Wand2, Check } from 'lucide-react';

interface VideoCardProps {
  data: VideoMetadata;
  onDownload: (cleanCopyright: boolean) => void;
  isDownloading: boolean;
  isProcessing: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ data, onDownload, isDownloading, isProcessing }) => {
  const [selectedQuality, setSelectedQuality] = useState(data.qualityOptions[0]);
  const [copyrightShield, setCopyrightShield] = useState(false);

  return (
    <div className="glass-panel rounded-2xl p-6 w-full max-w-4xl mx-auto mt-8 animate-fade-in shadow-2xl shadow-blue-900/20">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumbnail Section */}
        <div className={`relative group w-full md:w-1/3 shrink-0 rounded-xl overflow-hidden bg-slate-800 ${data.videoType === 'short' ? 'aspect-[9/16] max-w-[200px] mx-auto' : 'aspect-video'}`}>
          <img 
            src={data.thumbnail} 
            alt={data.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <Film className="w-10 h-10 text-white/80" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-mono">
            {data.duration}
          </div>
          {/* Format Badge */}
          <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-lg">
            {data.videoType === 'short' ? 'Shorts / Reel' : 'Long Video'}
          </div>
        </div>

        {/* Info & Options */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {data.platform}
              </span>
              <span className="text-slate-400 text-xs">by {data.author}</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-4 line-clamp-2 leading-tight">
              {data.title}
            </h2>

            {/* Quality Selector */}
            <div className="mb-4">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 block">
                Select Quality
              </label>
              <div className="flex flex-wrap gap-2">
                {data.qualityOptions.map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setSelectedQuality(quality)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${
                      selectedQuality === quality
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    {quality.includes('1080') ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                    {quality}
                  </button>
                ))}
              </div>
            </div>

            {/* Copyright Shield Panel */}
            <div className={`mb-6 rounded-xl border p-4 transition-all duration-300 ${copyrightShield ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-800/40 border-slate-700'}`}>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setCopyrightShield(!copyrightShield)}>
                    <div className="flex items-center gap-2">
                        <ShieldAlert className={`w-5 h-5 ${copyrightShield ? 'text-green-400' : 'text-slate-400'}`} />
                        <span className={`text-sm font-semibold ${copyrightShield ? 'text-green-300' : 'text-slate-300'}`}>
                            AI Copyright Shield™
                        </span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${copyrightShield ? 'bg-green-500' : 'bg-slate-600'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${copyrightShield ? 'left-6' : 'left-1'}`} />
                    </div>
                </div>
                
                {copyrightShield && (
                    <div className="mt-3 text-xs text-slate-300 space-y-2 animate-fade-in">
                        <p className="opacity-80">Enable this to clean copyright strikes. The AI will apply the following filters:</p>
                        <ul className="space-y-1 ml-1">
                            <li className="flex items-center gap-2 text-green-200/80"><Check className="w-3 h-3" /> Remove Tracking Metadata</li>
                            <li className="flex items-center gap-2 text-green-200/80"><Check className="w-3 h-3" /> Audio Pitch Shift (+0.5st)</li>
                            <li className="flex items-center gap-2 text-green-200/80"><Check className="w-3 h-3" /> Speed Adjustment (1.02x)</li>
                        </ul>
                    </div>
                )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => onDownload(copyrightShield)}
            disabled={isDownloading || isProcessing}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isDownloading || isProcessing
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : copyrightShield 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/20 text-white'
                    : 'bg-white text-slate-900 hover:bg-cyan-50 hover:shadow-xl hover:shadow-cyan-500/10 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
               <>
                <Wand2 className="animate-spin w-5 h-5" />
                Cleaning Copyright...
               </>
            ) : isDownloading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : copyrightShield ? (
              <>
                <Wand2 className="w-5 h-5" />
                Clean & Download
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Video
              </>
            )}
          </button>
          
          <p className="mt-3 text-center text-[10px] text-slate-500">
            {copyrightShield ? 'Using Copyright Shield does not guarantee 100% safety. Use for Fair Use only.' : '* By downloading, you agree to our Terms of Service.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;