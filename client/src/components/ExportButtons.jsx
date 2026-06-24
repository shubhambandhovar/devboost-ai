import React, { useState } from 'react';
import { Download, FileText, Copy, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ExportButtons({ content, filename = 'generated-result' }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      showToast('Successfully copied code to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy code to clipboard.', 'error');
    }
  };

  const exportToMarkdown = () => {
    try {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Markdown file downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to export markdown file.', 'error');
    }
  };

  const exportToText = () => {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Text file downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to export text file.', 'error');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 bg-dark-lighter/40 hover:bg-dark-lighter/60 rounded-lg transition-all duration-300 border border-white/5"
        title="Copy to Clipboard"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <button 
        onClick={exportToMarkdown}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/20"
        title="Download Markdown"
      >
        <Download className="w-4 h-4" />
        .MD
      </button>
      <button 
        onClick={exportToText}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-400 bg-purple-400/10 hover:bg-purple-400/20 rounded-lg transition-colors border border-purple-400/20"
        title="Download Text"
      >
        <FileText className="w-4 h-4" />
        .TXT
      </button>
    </div>
  );
}

