"use client";

interface GameButtonsProps {
  onCreateGame: () => void;
  onRandomGame: () => void;
  isLoading: boolean;
  isRandomDisabled?: boolean;
}

export function GameButtons({
  onCreateGame,
  onRandomGame,
  isLoading,
  isRandomDisabled = true,
}: GameButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <button
        onClick={onCreateGame}
        disabled={isLoading}
        className="btn-primary flex-1 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            Creating...
          </>
        ) : (
          "Create Game"
        )}
      </button>

      <button
        onClick={onRandomGame}
        disabled={isRandomDisabled || isLoading}
        className="btn-secondary flex-1 opacity-50 cursor-not-allowed"
        title="Coming soon!"
      >
        Play Random
      </button>
    </div>
  );
}
