
import React from 'react';
import { GamePlan } from '../types';

interface GamePlanDisplayProps {
  plan: GamePlan;
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
        <div className="p-5">
            <h2 className="flex items-center text-2xl font-bold text-sky-300 mb-4">
                {icon}
                <span className="ml-3">{title}</span>
            </h2>
            <div className="text-gray-300 space-y-3">{children}</div>
        </div>
    </div>
);

const GamePlanDisplay: React.FC<GamePlanDisplayProps> = ({ plan }) => {
  return (
    <div className="animate-fade-in space-y-8 p-4 md:p-0">
      <header className="text-center my-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 mb-2">
          {plan.title}
        </h1>
        <p className="text-xl text-gray-400 italic">"{plan.tagline}"</p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-8">
        <SectionCard title="Core Loop" icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>
        }>
          <ol className="list-decimal list-inside space-y-2">
            {plan.coreLoop.map((step, index) => <li key={index}>{step}</li>)}
          </ol>
        </SectionCard>

        <SectionCard title="Learning Objectives" icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        }>
          <ul className="list-disc list-inside space-y-2">
            {plan.learningObjectives.map((objective, index) => <li key={index}>{objective}</li>)}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Levels" icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      }>
        <div className="space-y-6">
          {plan.levels.map((level, index) => (
            <div key={index} className="p-4 bg-gray-900/60 border border-gray-600 rounded-lg">
              <h3 className="text-lg font-semibold text-sky-400">{index + 1}. {level.title}</h3>
              <p className="mt-1 text-gray-400">{level.description}</p>
              <div className="mt-3 p-3 bg-gray-800 border-l-4 border-sky-500 rounded-r-md">
                <p className="font-mono text-sm text-gray-300"><strong className="text-gray-500">// Example Challenge:</strong> {level.exampleChallenge}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      
       <SectionCard title="Monetization Idea" icon={
           <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
       }>
           <p>{plan.monetizationIdea}</p>
       </SectionCard>
    </div>
  );
};

export default GamePlanDisplay;
   