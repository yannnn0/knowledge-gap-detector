export interface KnowledgeDimension {
  id: string;
  name: string;
  nameEn: string;
  score: number;
  keywords: string[];
  blankScore: number;
  description: string;
  suggestions: string[];
}

export interface KnowledgeNode {
  id: string;
  name: string;
  category: string;
  frequency: number;
  isBlank: boolean;
}

export interface KnowledgeLink {
  source: string;
  target: string;
  strength: number;
}

export interface KnowledgeData {
  dimensions: KnowledgeDimension[];
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
}

export interface UserProfile {
  name: string;
  status: string;
  concerns: string[];
}
