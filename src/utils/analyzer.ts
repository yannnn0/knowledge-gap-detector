import type { KnowledgeDimension, KnowledgeNode, KnowledgeLink, KnowledgeData } from '../types';

const dimensionKeywords: Record<string, { keywords: string[]; suggestions: string[]; description: string }> = {
  '职业规划': {
    keywords: ['工作', '求职', '实习', '面试', '职业', '辞职', '离职', '就业', 'offer', '跳槽', '职场', '老板', '同事', '加班', '上班', '下班', '入职', '转正', '试用期', '薪资', '待遇', '福利', '晋升', '裁员', '招聘', '校招', '社招', '全职', '兼职', '自由职业', '创业', '副业'],
    suggestions: ['了解行业趋势', '准备作品集', '练习面试技巧', '建立职业规划', '拓展职业人脉'],
    description: '职业发展方向、求职技能、工作状态'
  },
  '商业/变现': {
    keywords: ['钱', '赚钱', '收入', '变现', '商业模式', '创业', '商业', '营销', '产品', '运营', '品牌', '客户', '用户', '市场', '销售', '利润', '成本', '投资', '估值', '融资', '项目', '接单', '外包', '付费', '价格', '佣金', '分成', '合作', '甲方', '乙方'],
    suggestions: ['学习商业模式画布', '了解产品思维', '掌握基础营销知识', '学习定价策略', '建立个人品牌'],
    description: '如何将技能转化为收入，商业思维'
  },
  '财务管理': {
    keywords: ['理财', '存款', '省钱', '花钱', '预算', '工资', '积蓄', '负债', '投资', '股票', '基金', '保险', '房租', '生活费', '开销', '节流', '开源', '财务', '经济', '贫困', '有钱', '没钱', '信用卡', '贷款', '社保', '公积金'],
    suggestions: ['建立预算习惯', '学习基础理财', '了解税收知识', '规划紧急基金', '学习投资基础'],
    description: '个人理财、资金管理、经济规划'
  },
  '学术研究': {
    keywords: ['论文', '研究', '学术', '博士', '硕士', '导师', '答辩', '毕业', '学业', '课题', '实验', '调研', '文献', '综述', '开题', '中期', '论文选题', '学术写作', '研究方法', '数据分析', '问卷', '访谈', '实验设计', '学术会议', '发表', '期刊', '论文修改'],
    suggestions: ['明确研究方向', '建立文献管理', '提升学术写作', '学习研究方法', '准备博士申请材料'],
    description: '学术论文、研究方法、博士申请'
  },
  '情绪心理': {
    keywords: ['抑郁', '焦虑', '情绪', '心理', 'EMO', 'emo', '难过', '开心', '快乐', '悲伤', '压力', '崩溃', '治愈', '心理咨询', '抗抑郁', '药物', '治疗', '康复', '心情', '心态', '调节', '放松', '冥想', '运动', '睡眠', '休息'],
    suggestions: ['建立情绪记录', '学习情绪调节', '寻求专业帮助', '保持规律作息', '建立支持系统'],
    description: '心理健康、情绪管理、压力应对'
  },
  '人际关系': {
    keywords: ['朋友', '社交', '人际', '关系', '爱情', '恋爱', '男朋友', '女朋友', 'dating', '约会', '暧昧', '表白', '分手', '孤独', '陪伴', '友情', '闺蜜', '兄弟', '家人', '父母', '亲情', '社交技巧', '沟通', '表达', '倾听', '理解', '冲突', '和解'],
    suggestions: ['提升沟通技巧', '建立健康关系', '设置边界', '学习冲突处理', '拓展社交圈'],
    description: '社交技巧、亲密关系、人际交往'
  },
  '创意技能': {
    keywords: ['设计', '艺术', '创意', '绘画', '摄影', '音乐', '说唱', 'rap', 'HipHop', '涂鸦', '排版', '配色', 'UI', 'UX', '交互', '产品设计', '品牌设计', '视频', '剪辑', '特效', '动画', '3D', '建模', '手绘', '插画', '写作', '创作', '作品集', '灵感'],
    suggestions: ['系统学习设计理论', '建立作品集', '尝试新媒介', '参加设计比赛', '关注行业趋势'],
    description: '设计能力、艺术创作、创意表达'
  }
};

export function analyzeContent(text: string): KnowledgeData {
  const dimensions: KnowledgeDimension[] = [];
  const nodeMap = new Map<string, KnowledgeNode>();

  // 计算每个维度的得分
  Object.entries(dimensionKeywords).forEach(([dimName, config]) => {
    let matchCount = 0;
    const matchedKeywords: string[] = [];

    config.keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = text.match(regex);
      if (matches) {
        matchCount += matches.length;
        matchedKeywords.push(keyword);

        // 创建节点
        const nodeId = `keyword-${keyword}`;
        if (!nodeMap.has(nodeId)) {
          nodeMap.set(nodeId, {
            id: nodeId,
            name: keyword,
            category: dimName,
            frequency: matches.length,
            isBlank: false
          });
        }
      }
    });

    // 计算得分（基于匹配数量和文本长度）
    const baseScore = Math.min(100, (matchCount / Math.max(1, text.length / 500)) * 100);

    // 计算空白分数（100 - 得分，超过30%空白率的要提醒）
    const blankScore = Math.max(0, 100 - baseScore);

    dimensions.push({
      id: dimName,
      name: dimName,
      nameEn: getEnglishName(dimName),
      score: Math.round(baseScore),
      keywords: matchedKeywords,
      blankScore: Math.round(blankScore),
      description: config.description,
      suggestions: config.suggestions
    });
  });

  // 识别空白领域（得分低于40%的）
  const blankDimensions = dimensions.filter(d => d.blankScore > 60);

  // 更新空白节点
  blankDimensions.forEach(dim => {
    const nodeId = `blank-${dim.id}`;
    if (!nodeMap.has(nodeId)) {
      nodeMap.set(nodeId, {
        id: nodeId,
        name: `${dim.name} (空白领域)`,
        category: '空白检测',
        frequency: 1,
        isBlank: true
      });
    }
  });

  // 创建节点网络
  let nodes = Array.from(nodeMap.values());

  // 如果没有匹配到任何关键词，添加默认节点
  if (nodes.length === 0) {
    dimensions.forEach(dim => {
      nodes.push({
        id: `dim-${dim.id}`,
        name: dim.name,
        category: dim.id,
        frequency: 0,
        isBlank: dim.blankScore > 60
      });
    });
  }

  // 创建关联（同一维度的关键词相互关联）
  const links: KnowledgeLink[] = [];
  const categoryGroups = new Map<string, string[]>();

  nodes.forEach(node => {
    if (!categoryGroups.has(node.category)) {
      categoryGroups.set(node.category, []);
    }
    categoryGroups.get(node.category)!.push(node.id);
  });

  // @ts-ignore - category is intentionally unused
  categoryGroups.forEach((nodeIds, category) => {
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        links.push({
          source: nodeIds[i],
          target: nodeIds[j],
          strength: 0.5
        });
      }
    }
  });

  // 排序维度按得分
  dimensions.sort((a, b) => b.score - a.score);

  return { dimensions, nodes, links };
}

function getEnglishName(chinese: string): string {
  const map: Record<string, string> = {
    '职业规划': 'Career',
    '商业/变现': 'Business',
    '财务管理': 'Finance',
    '学术研究': 'Academics',
    '情绪心理': 'Psychology',
    '人际关系': 'Relationships',
    '创意技能': 'Creative'
  };
  return map[chinese] || chinese;
}

export function getDefaultData(): KnowledgeData {
  return {
    dimensions: [
      { id: '职业规划', name: '职业规划', nameEn: 'Career', score: 0, keywords: [], blankScore: 100, description: '职业发展方向、求职技能、工作状态', suggestions: [] },
      { id: '商业/变现', name: '商业/变现', nameEn: 'Business', score: 0, keywords: [], blankScore: 100, description: '如何将技能转化为收入，商业思维', suggestions: [] },
      { id: '财务管理', name: '财务管理', nameEn: 'Finance', score: 0, keywords: [], blankScore: 100, description: '个人理财、资金管理、经济规划', suggestions: [] },
      { id: '学术研究', name: '学术研究', nameEn: 'Academics', score: 0, keywords: [], blankScore: 100, description: '学术论文、研究方法、博士申请', suggestions: [] },
      { id: '情绪心理', name: '情绪心理', nameEn: 'Psychology', score: 0, keywords: [], blankScore: 100, description: '心理健康、情绪管理、压力应对', suggestions: [] },
      { id: '人际关系', name: '人际关系', nameEn: 'Relationships', score: 0, keywords: [], blankScore: 100, description: '社交技巧、亲密关系、人际交往', suggestions: [] },
      { id: '创意技能', name: '创意技能', nameEn: 'Creative', score: 0, keywords: [], blankScore: 100, description: '设计能力、艺术创作、创意表达', suggestions: [] },
    ],
    nodes: [],
    links: []
  };
}
