export type PromptOrder = {
  id: string;
  title: string;
  tone: string;
  format: string;
  audience: string;
  constraint: string;
};

export type PromptComponentCategory = 'tone' | 'format' | 'audience' | 'constraint';

export type PromptSelection = Partial<Record<PromptComponentCategory, string>>;

export type PromptOptions = Record<PromptComponentCategory, readonly string[]>;

export type PromptScoreGrade = 'perfect' | 'great' | 'ok' | 'miss';

export type PromptScoreResult = {
  score: number;
  maxScore: number;
  breakdown: Record<PromptComponentCategory, boolean>;
  grade: PromptScoreGrade;
};
