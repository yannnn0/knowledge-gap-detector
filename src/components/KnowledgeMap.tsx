import { useState } from 'react';
import type { KnowledgeData } from '../types';
import RadarChartPanel from './RadarChartPanel';
import NetworkGraph from './NetworkGraph';
import LearningPath from './LearningPath';
import { RefreshCw } from 'lucide-react';

// Miro design system
const colors = {
  text: '#1c1c1e',
  textSecondary: '#555a6a',
  white: '#ffffff',
  interactive: '#5b76fe',
  border: '#c7cad5',
  success: '#00b473',
  warning: '#ff9500',
  pastelYellow: '#fff8d6',
};

interface KnowledgeMapProps {
  data: KnowledgeData;
  onReset: () => void;
}

export default function KnowledgeMap({ data, onReset }: KnowledgeMapProps) {
  const [showMobilePanel, setShowMobilePanel] = useState<'radar' | 'network' | 'path'>('radar');

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.white }}>
      {/* Miro-style header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo - Miro blue gradient */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.interactive} 0%, #4a65f0 100%)` }}
            >
              <span className="text-white font-semibold text-lg">K</span>
            </div>
            <div>
              <h1 className="font-medium text-lg" style={{ color: colors.text }}>Knowledge Map</h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>{data.nodes.length} knowledge nodes</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ backgroundColor: colors.pastelYellow, color: '#746019' }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Analysis</span>
          </button>
        </div>
      </header>

      {/* Desktop layout */}
      <main className="max-w-7xl mx-auto px-6 py-10 hidden lg:grid lg:grid-cols-12 gap-6">
        {/* Left - Radar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="pl-3 border-l-[3px]" style={{ borderColor: colors.interactive }}>
            <h2 className="text-lg font-medium" style={{ color: colors.text }}>Knowledge Dimensions</h2>
          </div>
          <RadarChartPanel dimensions={data.dimensions} />
        </div>

        {/* Center - Network */}
        <div className="lg:col-span-5 space-y-4">
          <div className="pl-3 border-l-[3px]" style={{ borderColor: colors.interactive }}>
            <h2 className="text-lg font-medium" style={{ color: colors.text }}>Knowledge Network</h2>
          </div>
          <NetworkGraph nodes={data.nodes} links={data.links} />
        </div>

        {/* Right - Learning Path */}
        <div className="lg:col-span-3 space-y-4">
          <div className="pl-3 border-l-[3px]" style={{ borderColor: colors.interactive }}>
            <h2 className="text-lg font-medium" style={{ color: colors.text }}>Learning Path</h2>
          </div>
          <LearningPath dimensions={data.dimensions} />
        </div>
      </main>

      {/* Mobile layout */}
      <main className="lg:hidden px-5 py-8 space-y-8">
        {/* Miro-style segmented control */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: '#f5f5f7' }}>
          {(['radar', 'network', 'path'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setShowMobilePanel(item)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: showMobilePanel === item ? colors.white : 'transparent',
                color: showMobilePanel === item ? colors.interactive : colors.textSecondary,
                boxShadow: showMobilePanel === item ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              {item === 'radar' ? 'Radar' : item === 'network' ? 'Network' : 'Path'}
            </button>
          ))}
        </div>

        {showMobilePanel === 'radar' && <RadarChartPanel dimensions={data.dimensions} />}
        {showMobilePanel === 'network' && <NetworkGraph nodes={data.nodes} links={data.links} />}
        {showMobilePanel === 'path' && <LearningPath dimensions={data.dimensions} />}
      </main>

      {/* Bottom stats bar */}
      <div
        className="fixed bottom-0 left-0 right-0 py-4 px-5"
        style={{ backgroundColor: colors.white, borderTop: `1px solid ${colors.border}` }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-12 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.interactive }}></span>
            <span style={{ color: colors.textSecondary }}>Nodes</span>
            <strong style={{ color: colors.text, fontWeight: 600 }}>{data.nodes.length}</strong>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.success }}></span>
            <span style={{ color: colors.textSecondary }}>Links</span>
            <strong style={{ color: colors.text, fontWeight: 600 }}>{data.links.length}</strong>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.warning }}></span>
            <span style={{ color: colors.textSecondary }}>Gaps</span>
            <strong style={{ color: colors.warning, fontWeight: 600 }}>{data.dimensions.filter(d => d.blankScore > 60).length}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}