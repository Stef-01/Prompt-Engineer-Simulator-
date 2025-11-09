import { useEffect, useMemo } from 'react';
import { PROMPT_CATEGORIES } from '../game/systems/OrderSystem';
import { useGameStore } from '../game/state/useGameStore';
import type { PromptComponentCategory } from '../game/types';

const Hud = () => {
  const {
    score,
    servings,
    currentOrder,
    playerHasPrompt,
    activePromptComponents,
    promptOptions,
    selectedPrompt,
    statusMessage,
    setPromptSelection,
    resetPromptSelections,
  } = useGameStore(
    (state) => ({
      score: state.score,
      servings: state.servings,
      currentOrder: state.currentOrder,
      playerHasPrompt: state.playerHasPrompt,
      activePromptComponents: state.activePromptComponents,
      promptOptions: state.promptOptions,
      selectedPrompt: state.selectedPrompt,
      statusMessage: state.statusMessage,
      setPromptSelection: state.setPromptSelection,
      resetPromptSelections: state.resetPromptSelections,
    })
  );

  useEffect(() => {
    document.title = `Prompt Cafe — Score ${score}`;
  }, [score]);

  const currentSelectionSummary = useMemo(() => {
    return PROMPT_CATEGORIES
      .map((category) => selectedPrompt[category])
      .filter(Boolean)
      .join(', ');
  }, [selectedPrompt]);

  const formatCategoryLabel = (category: PromptComponentCategory) =>
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="hud-grid">
      <section className="hud-card">
        <h1 className="hud-title">Prompt Cafe</h1>
        <p className="hud-label">Futuristic Barista Ops</p>
      </section>

      <section className="hud-card">
        <div className="hud-grid">
          <div>
            <div className="hud-label">Score</div>
            <div className="hud-value">{score}</div>
          </div>
          <div>
            <div className="hud-label">Servings</div>
            <div className="hud-value">{servings}</div>
          </div>
        </div>
      </section>

      <section className="hud-card hud-order-section">
        <div className="hud-label">Current Order</div>
        <div className="hud-value">{currentOrder.title}</div>
        <div className="hud-grid">
          <span className="hud-label">Tone</span>
          <span>{currentOrder.tone}</span>
          <span className="hud-label">Format</span>
          <span>{currentOrder.format}</span>
          <span className="hud-label">Audience</span>
          <span>{currentOrder.audience}</span>
          <span className="hud-label">Constraint</span>
          <span>{currentOrder.constraint}</span>
        </div>
        <div className="hud-prompt-indicator">
          <span className="hud-label">Prompt Ready</span>
          <span>{playerHasPrompt ? 'Yes' : 'No'}</span>
        </div>
        {playerHasPrompt && (
          <div className="hud-label">Loaded Prompt: {activePromptComponents.join(', ')}</div>
        )}
      </section>

      <section className="hud-card hud-builder">
        <div className="hud-label">Assemble Prompt Components</div>
        <div className="hud-builder-grid">
          {PROMPT_CATEGORIES.map((category) => (
            <div key={category} className="hud-builder-category">
              <div className="hud-label">{formatCategoryLabel(category)}</div>
              <div className="hud-builder-options">
                {promptOptions[category].map((option) => {
                  const isActive = selectedPrompt[category] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`hud-option${isActive ? ' is-active' : ''}`}
                      onClick={() => setPromptSelection(category, option)}
                      disabled={playerHasPrompt}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="hud-builder-footer">
          <button
            type="button"
            className="hud-option hud-option--ghost"
            onClick={resetPromptSelections}
            disabled={playerHasPrompt}
          >
            Clear Selection
          </button>
          <div className="hud-status">{statusMessage}</div>
        </div>
        {currentSelectionSummary && !playerHasPrompt && (
          <div className="hud-label">Current Selection: {currentSelectionSummary}</div>
        )}
      </section>
    </div>
  );
};

export default Hud;
