
import React, { useState, useCallback } from 'react';
import { GamePlan } from './types';
import { generateGamePlan } from './services/geminiService';
import GamePlanDisplay from './components/GamePlanDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [gameIdea, setGameIdea] = useState<string>('');
  const [gamePlan, setGamePlan] = useState<GamePlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameIdea.trim()) {
      setError("Please enter a game concept.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGamePlan(null);

    try {
      const plan = await generateGamePlan(gameIdea);
      setGamePlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [gameIdea]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>

      <main className="w-full max-w-4xl mx-auto">
        <header className="text-center my-8 md:my-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
            Prompt Engineering Game Planner
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Turn your spark of an idea into a playable concept. Describe your game, and let AI build the foundation.
          </p>
        </header>

        <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm animate-fade-in" style={{animationDelay: '0.2s'}}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="gameIdea" className="block text-lg font-medium text-sky-300 mb-2">
              Enter Your Game Concept
            </label>
            <textarea
              id="gameIdea"
              rows={4}
              value={gameIdea}
              onChange={(e) => setGameIdea(e.target.value)}
              className="w-full p-3 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-300 placeholder-gray-500"
              placeholder="e.g., A detective game where players craft prompts to interrogate AI witnesses..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? 'Generating...' : 'Create Game Plan'}
            </button>
          </form>
        </div>
        
        <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {gamePlan && <GamePlanDisplay plan={gamePlan} />}
        </div>
      </main>
      
      <footer className="w-full max-w-4xl mx-auto text-center py-6 text-gray-500 text-sm mt-8">
          <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
   