import { useState } from 'react';
import Home from './components/Home';
import KnowledgeMap from './components/KnowledgeMap';
import { analyzeContent } from './utils/analyzer';
import type { KnowledgeData } from './types';

function App() {
  const [knowledgeData, setKnowledgeData] = useState<KnowledgeData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (content: string) => {
    setIsAnalyzing(true);

    // 模拟分析过程
    setTimeout(() => {
      const result = analyzeContent(content);
      setKnowledgeData(result);
      setIsAnalyzing(false);
    }, 500);
  };

  const handleReset = () => {
    setKnowledgeData(null);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">正在分析你的知识结构...</p>
        </div>
      </div>
    );
  }

  if (knowledgeData) {
    return <KnowledgeMap data={knowledgeData} onReset={handleReset} />;
  }

  return <Home onAnalyze={handleAnalyze} />;
}

export default App;
