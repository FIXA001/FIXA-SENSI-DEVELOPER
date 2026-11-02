import React, { useState } from 'react';
import { FixaLogo } from './FixaLogo';
import {
  Download,
  X,
  Copy,
  Check,
  ExternalLink,
  FileCode,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Layers,
} from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Direct production URL from cloud environment
  const directDownloadUrl = `${window.location.origin}/api/download-zip`;

  const handleBlobDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const response = await fetch('/api/download-zip');
      if (!response.ok) throw new Error('Download failed from server');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'fixa-gaming-complete-website.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      console.error(err);
      setDownloadError(
        'Browser iframe blocked the direct download. Please click "Copy Direct Link" below and open it in a new browser tab.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directDownloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#181824] via-[#101017] to-[#0a0a0f] border-2 border-red-600/80 rounded-2xl shadow-[0_0_60px_rgba(220,38,38,0.4)] overflow-hidden">
        {/* Top Header Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-red-600 p-2 rounded-lg transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <FixaLogo size="md" glow={true} />
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <FileCode className="w-4 h-4" />
              <span>Full Website Source Code (.ZIP)</span>
            </div>
            <h2 className="mt-2 text-2xl font-black font-heading tracking-wide text-white">
              DOWNLOAD CODE PACKAGE
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm">
              Download the complete FIXA GAMING project package including frontend, server, database, and assets.
            </p>
          </div>

          {/* Iframe Notice */}
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-xs space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>AI Studio iFrame Download Guidance:</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Because the AI Studio preview runs inside an isolated iframe, direct browser downloads may occasionally be restricted. Use either method below:
            </p>
          </div>

          {downloadError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-600 text-xs text-red-200">
              {downloadError}
            </div>
          )}

          {/* Download Method 1: Client-Side Blob Download Button */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase font-heading flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Method 1: Direct File Download</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">fixa-gaming.zip (~84 KB)</span>
            </div>

            <button
              onClick={handleBlobDownload}
              disabled={isDownloading}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Downloading ZIP...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Code (.ZIP) Now</span>
                </>
              )}
            </button>
          </div>

          {/* Download Method 2: Copy Direct Link to Open in New Tab */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <span className="text-xs font-bold text-white uppercase font-heading flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px]">2</span>
              <span>Method 2: Copy Direct Link & Paste into Browser Tab</span>
            </span>

            <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <input
                type="text"
                readOnly
                value={directDownloadUrl}
                className="w-full bg-transparent text-[11px] text-zinc-300 font-mono outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer border border-zinc-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-zinc-400">
              * Open this link in any Chrome, Edge, or Safari tab to immediately download the complete source code ZIP.
            </p>
          </div>

          {/* Included Files info */}
          <div className="pt-2 text-[11px] text-zinc-500 border-t border-zinc-800/80 flex items-center justify-between">
            <span>React 19, TypeScript, Express Server, JSON Database, SVG Logo</span>
            <span className="text-emerald-400 font-mono">Full Source Code</span>
          </div>
        </div>
      </div>
    </div>
  );
};
