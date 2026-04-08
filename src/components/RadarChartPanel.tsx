import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { KnowledgeDimension } from '../types';
import { AlertTriangle, CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';

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

interface RadarChartPanelProps {
  dimensions: KnowledgeDimension[];
}

export default function RadarChartPanel({ dimensions }: RadarChartPanelProps) {
  const [selectedDim, setSelectedDim] = useState<KnowledgeDimension | null>(null);

  const chartData = dimensions.map(dim => ({
    subject: dim.nameEn,
    fullMark: 100,
    value: dim.score,
    blank: dim.blankScore
  }));

  const blankAreas = dimensions.filter(d => d.blankScore > 60);
  const strongAreas = dimensions.filter(d => d.score > 50);

  return (
    <div className="rounded-2xl p-6 h-full" style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
      {/* Title */}
      <h3 className="text-lg font-medium mb-6 flex items-center gap-3" style={{ color: colors.text }}>
        <TrendingUp className="w-6 h-6" style={{ color: colors.interactive }} />
        Knowledge Radar
      </h3>

      {/* Radar chart */}
      <div className="h-72 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="#e5e5e7" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: colors.textSecondary, fontSize: 12, fontWeight: '500' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#aeaeb2', fontSize: 10 }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke={colors.interactive}
              fill={colors.interactive}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip
              content={({ payload }) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: colors.text, color: colors.white }}>
                      <p className="font-medium text-sm">{data.subject}</p>
                      <p className="text-sm opacity-80">Score: {data.value}</p>
                      <p className="text-sm opacity-80">Gap: {data.blank}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Dimensions list */}
      <div className="space-y-2 mb-6">
        {dimensions.map(dim => (
          <button
            key={dim.id}
            onClick={() => setSelectedDim(dim)}
            className="w-full text-left px-5 py-4 rounded-xl transition-all duration-200 flex items-center justify-between"
            style={{
              backgroundColor: selectedDim?.id === dim.id ? `${colors.interactive}15` : '#f5f5f7',
              border: selectedDim?.id === dim.id ? `1px solid ${colors.interactive}50` : '1px solid transparent'
            }}
          >
            <span className="font-medium" style={{ color: colors.text }}>{dim.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: dim.score > 50 ? colors.success : colors.warning }}>
                {dim.score}
              </span>
              {dim.blankScore > 60 && (
                <AlertTriangle className="w-4 h-4" style={{ color: colors.warning }} />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Warning card */}
      {blankAreas.length > 0 && (
        <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: '#fff8d6', border: '1px solid #efe3b8' }}>
          <div className="flex items-center gap-2 mb-2" style={{ color: '#746019' }}>
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Knowledge Gaps Found</span>
          </div>
          <p className="text-sm" style={{ color: '#746019' }}>
            Areas to improve: {blankAreas.map(d => d.name).join(', ')}
          </p>
        </div>
      )}

      {/* Strengths card */}
      {strongAreas.length > 0 && (
        <div className="rounded-xl p-5" style={{ backgroundColor: '#d4f7e6', border: '1px solid #b8e0cc' }}>
          <div className="flex items-center gap-2 mb-2" style={{ color: colors.success }}>
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Your Strengths</span>
          </div>
          <p className="text-sm" style={{ color: colors.success }}>
            Strong areas: {strongAreas.map(d => d.name).join(', ')}
          </p>
        </div>
      )}

      {/* Selected detail */}
      {selectedDim && (
        <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${colors.border}` }}>
          <h4 className="font-medium mb-3" style={{ color: colors.text }}>{selectedDim.name}</h4>
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{selectedDim.description}</p>

          {selectedDim.keywords.length > 0 && (
            <div className="mb-4">
              <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>Your keywords:</p>
              <div className="flex flex-wrap gap-2">
                {selectedDim.keywords.slice(0, 10).map(kw => (
                  <span key={kw} className="px-3 py-1.5 text-xs rounded-full" style={{ backgroundColor: '#f5f5f7', color: colors.text }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedDim.blankScore > 40 && (
            <div className="rounded-xl p-4" style={{ backgroundColor: `${colors.interactive}15` }}>
              <div className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: colors.interactive }}>
                <Lightbulb className="w-4 h-4" />
                <span>Suggestions</span>
              </div>
              <ul className="text-sm space-y-1" style={{ color: colors.interactive }}>
                {selectedDim.suggestions.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}