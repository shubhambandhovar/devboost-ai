import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function ExportButtons({ content, filename = 'generated-result' }) {
  const exportToMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToText = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-3">
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
