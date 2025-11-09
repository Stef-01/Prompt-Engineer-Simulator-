
export interface GamePlan {
  title: string;
  tagline: string;
  coreLoop: string[];
  learningObjectives: string[];
  levels: {
    title: string;
    description: string;
    exampleChallenge: string;
  }[];
  monetizationIdea: string;
}
   