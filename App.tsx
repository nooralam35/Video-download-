import React, { useState } from 'react';
import Navbar from './components/Navbar';
import VideoCard from './components/VideoCard';
import AIGenerator from './components/AIGenerator';
import { VideoMetadata, AppState } from './types';
import { Link, Search, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setAppState(AppState.ANALYZING_URL);
    
    // Simulate API Fetching logic
    setTimeout(() => {
      let platform: VideoMetadata['platform'] = 'generic';
      let videoType: VideoMetadata['videoType'] = 'long';
      let detectedTitle = "Downloaded Video";

      // Detect Platform and Type
      if (url.includes('youtube') || url.includes('youtu.be')) {
        platform = 'youtube';
        detectedTitle = "YouTube Video Content";
        if (url.includes('/shorts/')) {
          videoType = 'short';
          detectedTitle = "YouTube Short - Viral Clip";
        }
      }
      else if (url.includes('instagram')) {
        platform = 'instagram';
        detectedTitle = "Instagram Reel";
        if (url.includes('/reel/')) videoType = 'short';
      }
      else if (url.includes('tiktok')) {
        platform = 'tiktok';
        detectedTitle = "TikTok Trending Video";
        videoType = 'short';
      }
      else if (url.includes('twitter') || url.includes('x.com')) {
        platform = 'twitter';
        detectedTitle = "X (Twitter) Video";
      }
      else if (url.match(/\.(mp4|webm|mov)$/i)) {
        // Direct file link detection
        platform = 'generic';
        // Extract filename from URL
        const filenameFromUrl = url.split('/').pop();
        if (filenameFromUrl) {
            // Remove extension for title display, we'll add it back on download
            detectedTitle = filenameFromUrl.replace(/\.(mp4|webm|mov)$/i, '');
        } else {
            detectedTitle = "Direct Video File";
        }
      }

      const mockData: VideoMetadata = {
        id: Math.random().toString(36).substr(2, 9),
        url: url,
        platform: platform,
        videoType: videoType,
        title: detectedTitle === "Downloaded Video" ? "Amazing Travel Vlog - Hidden Gems of Japan | 4K Cinematic" : detectedTitle,
        thumbnail: `https://picsum.photos/800/450?random=${Math.floor(Math.random() * 100)}`,
        duration: videoType === 'short' ? "0:59" : "12:45",
        author: "@TravelWithGemini",
        qualityOptions: ["1080p (MP4)", "720p (MP4)", "Audio Only (MP3)"]
      };

      setVideoData(mockData);
      setAppState(AppState.RESULT_READY);
    }, 1500);
  };

  const handleDownload = async (cleanCopyright: boolean = false) => {
    if (cleanCopyright) {
      setAppState(AppState.PROCESSING_COPYRIGHT);
      // Simulate heavy processing (Re-encoding, Pitch shifting, Metadata stripping)
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    setAppState(AppState.DOWNLOADING);
    
    // Simulate network handshake
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      let downloadSource = videoData?.url || "";
      
      const isDirectFile = downloadSource.match(/\.(mp4|webm|mp3|ogg)$/i);

      if (!isDirectFile) {
         console.warn("Target is a social media page, not a direct file. Using sample video for demonstration.");
         downloadSource = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
      }

      const response = await fetch(downloadSource);
      if (!response.ok) throw new Error("Network error during download");
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      
      // FILENAME LOGIC: Use the exact title, sanitized for filesystem safety
      // We allow spaces, dashes, and alphanumerics.
      let finalFileName = videoData?.title || "video";
      
      // Basic sanitization to prevent illegal chars (OS dependent, but good practice)
      finalFileName = finalFileName.replace(/[^a-z0-9 \-\.\(\)]/gi, '');
      
      // Ensure it has .mp4 extension
      if (!finalFileName.toLowerCase().endsWith('.mp4')) {
        finalFileName += '.mp4';
      }

      a.download = finalFileName;
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error("Download failed:", error);
      alert("Unable to download this specific video stream directly from the browser (CORS Protected). Try a direct MP4 link.");
    } finally {
      setAppState(AppState.RESULT_READY);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <main className="flex-1 flex flex-col items-center pt-32 px-4 pb-20 relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in-down">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="block text-white">Download Any Video.</span>
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Shorts. Reels. Vlogs.
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Universal downloader for Long videos & Shorts. 
            Includes <span className="text-white font-semibold">Copyright Shield™</span> to clean strikes and Gemini AI for viral reposting.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-3xl relative group z-20">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-500 blur-sm"></div>
          <form onSubmit={handleSearch} className="relative flex items-center bg-slate-900 rounded-xl p-2 shadow-2xl">
            <div className="pl-4 pr-3 text-slate-400">
              <Link className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Paste URL (YouTube Shorts, Instagram Reels, TikTok...)"
              className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:outline-none focus:ring-0 text-base py-3"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={appState === AppState.ANALYZING_URL}
              className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {appState === AppState.ANALYZING_URL ? (
                'Analyzing...'
              ) : (
                <>
                  Start <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Feature Highlights (Only show when idle) */}
        {appState === AppState.IDLE && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Shorts & Long Form"
              description="Automatically detects and optimizes downloads for YouTube Shorts, Reels, TikToks, and long videos."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-green-400" />}
              title="Copyright Shield"
              description="Clean copyright strikes automatically. Our AI adjusts metadata and audio pitch for safer reposting."
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-blue-400" />}
              title="Universal Support"
              description="Works with YouTube, Instagram, Twitter, TikTok, and 20+ other sites."
            />
          </div>
        )}

        {/* Results Area */}
        {appState !== AppState.IDLE && appState !== AppState.ANALYZING_URL && videoData && (
          <>
            <VideoCard 
              data={videoData} 
              onDownload={handleDownload}
              isDownloading={appState === AppState.DOWNLOADING}
              isProcessing={appState === AppState.PROCESSING_COPYRIGHT}
            />
            <AIGenerator videoData={videoData} />
          </>
        )}

      </main>

      <footer className="w-full border-t border-slate-900 py-8 text-center text-slate-500 text-sm relative z-10 bg-slate-950">
        <p>© 2024 StreamSage. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

export default App;