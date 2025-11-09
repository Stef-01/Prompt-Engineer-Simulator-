import type {
  PromptComponentCategory,
  PromptOptions,
  PromptOrder,
  PromptScoreGrade,
  PromptScoreResult,
  PromptSelection,
} from '../types';

const PROMPT_OPTIONS: PromptOptions = {
  tone: ['witty', 'formal', 'technical', 'venture capitalist'],
  format: ['email', 'spec', 'pitch deck', 'landing page'],
  audience: ['founder', 'CTO', 'investor', 'enterprise client'],
  constraint: ['<200 words', 'legal safe', 'brand voice', 'include KPIs'],
};

export const PROMPT_CATEGORIES = Object.keys(PROMPT_OPTIONS) as PromptComponentCategory[];

export const generateRandomOrder = () => {
  const pick = <T,>(options: readonly T[]): T => options[Math.floor(Math.random() * options.length)];
  return {
    title: `${pick(['Quantum', 'Neon', 'Azure', 'Lattice'])} ${pick(['Prompt', 'Brew', 'Pulse', 'Canvas'])}`,
    tone: pick(PROMPT_OPTIONS.tone),
    format: pick(PROMPT_OPTIONS.format),
    audience: pick(PROMPT_OPTIONS.audience),
    constraint: pick(PROMPT_OPTIONS.constraint),
  };
};

const SCORE_WEIGHTS: Record<PromptComponentCategory, number> = {
  tone: 3,
  format: 3,
  audience: 2,
  constraint: 2,
};

const maxScore = PROMPT_CATEGORIES.reduce((total, category) => total + SCORE_WEIGHTS[category], 0);

const resolveGrade = (score: number): PromptScoreGrade => {
  const accuracy = score / maxScore;
  if (accuracy === 1) return 'perfect';
  if (accuracy >= 0.7) return 'great';
  if (accuracy >= 0.4) return 'ok';
  return 'miss';
};

export const scoreSubmission = (order: PromptOrder, selection: PromptSelection): PromptScoreResult => {
  const breakdown: Record<PromptComponentCategory, boolean> = {
    tone: false,
    format: false,
    audience: false,
    constraint: false,
  };

  const earned = PROMPT_CATEGORIES.reduce((total, category) => {
    const matched = selection[category] === order[category];
    breakdown[category] = matched;
    return matched ? total + SCORE_WEIGHTS[category] : total;
  }, 0);

  return {
    score: earned,
    maxScore,
    breakdown,
    grade: resolveGrade(earned),
  };
};

export { PROMPT_OPTIONS, maxScore as PROMPT_MAX_SCORE };
