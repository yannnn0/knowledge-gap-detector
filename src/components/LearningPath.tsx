import type { KnowledgeDimension } from '../types';
import { BookOpen, Target, ArrowRight, Zap, Sparkles } from 'lucide-react';

interface LearningPathProps {
  dimensions: KnowledgeDimension[];
}

export default function LearningPath({ dimensions }: LearningPathProps) {
  // 按空白分数排序，找出最需要补充的领域
  const sortedByBlank = [...dimensions].sort((a, b) => b.blankScore - a.blankScore);
  const topBlanks = sortedByBlank.filter(d => d.blankScore > 40).slice(0, 3);

  // 按得分排序，找出优势领域
  const sortedByScore = [...dimensions].sort((a, b) => b.score - a.score);
  const topStrengths = sortedByScore.filter(d => d.score > 40).slice(0, 3);

  const getPriorityIcon = (index: number) => {
    if (index === 0) return <Zap className="w-4 h-4 text-[#ff9500]" />;
    if (index === 1) return <Sparkles className="w-4 h-4 text-[#aeaeb2]" />;
    return <div className="w-5 h-5 rounded-full bg-[#f5f5f7] text-xs flex items-center justify-center text-[#86868b] font-medium">{index + 1}</div>;
  };

  return (
    <div className="bg-white rounded-[22px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.04)] p-6">
      <h3 className="text-lg font-semibold mb-8 flex items-center gap-3 text-[#1d1d1f]">
        <Target className="w-6 h-6 text-[#0071e3]" />
        学习路径推荐
      </h3>

      {/* Apple 风格优先补充领域 */}
      {topBlanks.length > 0 ? (
        <div className="mb-10">
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-5 text-[#86868b]">
            建议优先补充
          </h4>
          <div className="space-y-4">
            {topBlanks.map((dim, index) => (
              <div
                key={dim.id}
                className={`rounded-[16px] p-5 transition-all hover:shadow-md ${
                  index === 0
                    ? 'bg-gradient-to-br from-[rgba(255,149,0,0.08)] to-[rgba(255,159,10,0.04)] border border-[rgba(255,149,0,0.2)]'
                    : 'bg-[#f5f5f7] border border-transparent'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">{getPriorityIcon(index)}</div>
                  <div className="flex-1">
                    <h5 className="font-semibold mb-2 text-[#1d1d1f]">{dim.name}</h5>
                    <p className="text-sm mb-4 text-[#86868b]">{dim.description}</p>
                    <div className="space-y-2">
                      {dim.suggestions.map((suggestion, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#1d1d1f]">
                          <ArrowRight className="w-3 h-3 flex-shrink-0 text-[#ff9500]" />
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#ff9500]">{dim.blankScore}%</div>
                    <div className="text-xs text-[#aeaeb2]">空白率</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-10 p-5 rounded-[14px] text-center bg-[rgba(52,199,89,0.1)] border border-[rgba(52,199,89,0.2)]">
          <p className="font-medium text-[#34c759]">你的知识结构很均衡！各领域都有不错的积累</p>
        </div>
      )}

      {/* Apple 风格优势领域 */}
      {topStrengths.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-5 text-[#86868b]">
            你的优势领域
          </h4>
          <div className="grid gap-4">
            {topStrengths.map((dim, index) => (
              <div
                key={dim.id}
                className="rounded-[14px] p-5 bg-gradient-to-br from-[rgba(52,199,89,0.08)] to-[rgba(52,199,89,0.04)] border border-[rgba(52,199,89,0.15)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-[rgba(52,199,89,0.15)] text-[#34c759]">
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-semibold text-[#1d1d1f]">{dim.name}</h5>
                      <p className="text-sm text-[#86868b]">
                        关键词：{dim.keywords.slice(0, 3).join('、') || '暂无'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#34c759]">{dim.score}</div>
                    <div className="text-xs text-[#aeaeb2]">得分</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apple 风格总结建议 */}
      <div className="mt-8 p-5 rounded-[14px] bg-[#f5f5f7]">
        <div className="flex items-start gap-4">
          <BookOpen className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#86868b]" />
          <div>
            <h5 className="font-semibold mb-1 text-[#1d1d1f]">综合建议</h5>
            <p className="text-sm leading-relaxed text-[#86868b]">
              {topBlanks.length > 0 ? (
                <>
                  你在 <strong className="text-[#34c759]">{topStrengths.map(d => d.name).slice(0, 2).join('、')}</strong> 方面有不错的积累，
                  但在 <strong className="text-[#ff9500]">{topBlanks[0].name}</strong> 领域存在较大空白。
                  建议优先补充这些领域，它们对您目前 gap 期的发展和经济独立都很重要。
                </>
              ) : (
                '你的知识结构非常均衡，继续保持好奇心，广泛学习！'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
