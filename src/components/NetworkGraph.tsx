import { useState, useCallback, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { KnowledgeNode, KnowledgeLink } from '../types';
import { ZoomIn, ZoomOut, Maximize2, Info } from 'lucide-react';

// Miro style colors
const colors = {
  text: '#1c1c1e',
  textSecondary: '#555a6a',
  white: '#ffffff',
  interactive: '#5b76fe',
  border: '#c7cad5',
};

interface NetworkGraphProps {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
}

interface ExtendedNode {
  id: string;
  name?: string;
  category?: string;
  isBlank?: boolean;
  frequency?: number;
}

export default function NetworkGraph({ nodes, links }: NetworkGraphProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<ExtendedNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Miro style colors
  const categoryColors: Record<string, string> = {
    '职业规划': colors.interactive,
    '商业/变现': '#AF52DE',
    '财务管理': '#00b473',
    '学术研究': '#5856d6',
    '情绪心理': '#FF2D55',
    '人际关系': '#FF9500',
    '创意技能': '#00c7be',
    '空白检测': '#ff3b30'
  };

  const handleNodeClick = useCallback((node: unknown) => {
    setSelectedNode(node as ExtendedNode);
  }, []);

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.5, 300);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() / 1.5, 300);
    }
  };

  const handleReset = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  };

  return (
    <div className="bg-white rounded-[22px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.04)] p-6 h-full flex flex-col">
      {/* Apple 风格标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-3 text-[colors.text]">
          <svg className="w-6 h-6 text-[#0071e3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <circle cx="19" cy="5" r="2" />
            <circle cx="5" cy="19" r="2" />
            <circle cx="19" cy="19" r="2" />
            <circle cx="5" cy="5" r="2" />
            <line x1="12" y1="9" x2="12" y2="5" />
            <line x1="9" y1="12" x2="5" y2="12" />
            <line x1="15" y1="12" x2="19" y2="12" />
            <line x1="12" y1="15" x2="12" y2="19" />
          </svg>
          知识网络图
        </h3>
        {/* Apple 风格工具按钮 */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2.5 rounded-[10px] transition-colors bg-[#f5f5f7] text-[colors.textSecondary] hover:bg-[#e5e5e7]"
            title="放大"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 rounded-[10px] transition-colors bg-[#f5f5f7] text-[colors.textSecondary] hover:bg-[#e5e5e7]"
            title="缩小"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-[10px] transition-colors bg-[#f5f5f7] text-[colors.textSecondary] hover:bg-[#e5e5e7]"
            title="适应窗口"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Apple 风格图表区域 */}
      <div
        ref={containerRef}
        className="flex-1 relative rounded-[18px] overflow-hidden min-h-[420px] bg-gradient-to-br from-[#f5f5f7] to-white"
      >
        {nodes.length > 0 ? (
          <ForceGraph2D
            ref={graphRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={{ nodes, links }}
            nodeLabel="name"
            nodeColor={(node: unknown) => {
              const n = node as ExtendedNode;
              if (n.isBlank) return '#ff3b30';
              return categoryColors[n.category || ''] || '#aeaeb2';
            }}
            nodeRelSize={6}
            linkColor={() => '#d1d1d6'}
            linkWidth={1.5}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.005}
            onNodeClick={handleNodeClick}
            backgroundColor="transparent"
            cooldownTicks={100}
            onEngineStop={() => graphRef.current?.zoomToFit(400)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Info className="w-14 h-14 mx-auto mb-4 opacity-40 text-[colors.textSecondary]" />
              <p className="text-base text-[colors.textSecondary]">暂无数据，请先输入内容进行分析</p>
            </div>
          </div>
        )}
      </div>

      {/* Apple 风格节点详情面板 */}
      {selectedNode && (
        <div className="mt-5 p-5 rounded-[14px] bg-[#f5f5f7]">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-[colors.text]">{selectedNode.name}</h4>
              <p className="text-sm text-[colors.textSecondary]">{selectedNode.category}</p>
            </div>
            {selectedNode.isBlank && (
              <span className="px-3 py-1.5 text-xs rounded-full font-medium bg-[rgba(255,59,48,0.1)] text-[#ff3b30]">
                空白领域
              </span>
            )}
          </div>
          {selectedNode.frequency && (
            <p className="text-sm mt-3 text-[colors.textSecondary]">
              出现频次：<span className="text-[colors.text] font-medium">{selectedNode.frequency}</span> 次
            </p>
          )}
        </div>
      )}

      {/* Apple 风格图例 */}
      <div className="mt-5 flex flex-wrap gap-3">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[colors.textSecondary]">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
