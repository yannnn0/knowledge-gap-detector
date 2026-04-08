import { useState, useRef } from 'react';
import { Upload, Sparkles, ArrowRight } from 'lucide-react';

interface HomeProps {
  onAnalyze: (content: string) => void;
}

// Miro design system
const colors = {
  text: '#1c1c1e',
  textSecondary: '#555a6a',
  white: '#ffffff',
  interactive: '#5b76fe',
  border: '#c7cad5',
  pastelYellow: '#fff8d6',
  pastelTeal: '#c3faf5',
};

export default function Home({ onAnalyze }: HomeProps) {
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'txt' || extension === 'md' || extension === 'json') {
      const content = await file.text();
      setText(content);
    } else {
      alert('Please upload TXT, MD or JSON file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ backgroundColor: colors.white }}>
      {/* Miro-style background with soft accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #fff8d6 0%, transparent 70%)' }} />
        <div className="absolute bottom-40 right-20 w-48 h-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #c3faf5 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-xl w-full">
        {/* Title section */}
        <div className="text-center mb-10">
          {/* Badge - pastel yellow */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: colors.pastelYellow, color: '#746019' }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Knowledge Visualization</span>
          </div>

          {/* Hero title - Roobert style */}
          <h1
            className="text-5xl font-medium text-center mb-4"
            style={{ color: colors.text, lineHeight: 1.15, letterSpacing: '-1.68px' }}
          >
            My Knowledge Map
          </h1>
          <p className="text-xl" style={{ color: colors.textSecondary }}>
            Discover your knowledge structure
          </p>
        </div>

        {/* Input card - ring shadow style */}
        <div
          className="rounded-2xl mb-5"
          style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}`, boxShadow: `rgb(224,226,232) 0px 0px 0px 1px` }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your notes, tweets or any text..."
            className="w-full h-44 resize-none border-0 bg-transparent text-lg leading-normal focus:outline-none p-6"
            style={{ color: colors.text }}
          />
        </div>

        {/* Upload area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed rounded-2xl py-6 px-6 text-center cursor-pointer transition-all duration-200 mb-5"
          style={{
            borderColor: isDragging ? colors.interactive : colors.border,
            backgroundColor: isDragging ? '#f0f1ff' : colors.white
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.json"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
          <div className="flex items-center justify-center gap-3">
            <Upload className="w-5 h-5" style={{ color: colors.textSecondary }} />
            <p className="text-base" style={{ color: colors.text }}>Click or drag to upload</p>
            <span className="text-sm" style={{ color: colors.textSecondary }}>TXT, MD, JSON</span>
          </div>
        </div>

        {/* Primary button - Miro blue */}
        <button
          onClick={() => text.trim() && onAnalyze(text)}
          disabled={!text.trim()}
          className="w-full h-12 text-base font-semibold rounded-xl text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: colors.interactive, letterSpacing: '0.175px' }}
        >
          <span>Start Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Status text */}
        <p className="text-center text-sm mt-4" style={{ color: colors.textSecondary }}>
          {text.trim() ? `${text.length} characters` : 'Enter or upload content'}
        </p>
      </div>
    </div>
  );
}