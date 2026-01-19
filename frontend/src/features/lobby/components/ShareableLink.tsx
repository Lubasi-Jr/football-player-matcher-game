"use client";

import { useCopyToClipboard } from "@/hooks";
import { LOBBY_CONTENT } from "../constants";

interface ShareableLinkProps {
  gameId: string;
}

export function ShareableLink({ gameId }: ShareableLinkProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const gameUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/game/${gameId}?joining=true`
      : "";

  const handleCopy = () => {
    copyToClipboard(gameUrl);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
        <p className="text-sm text-white/70 font-body mb-2">Game Link:</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={gameUrl}
            readOnly
            className="flex-1 bg-white/5 border border-white/20 rounded px-3 py-2 text-white font-body text-sm truncate"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded font-body font-semibold text-sm transition-all duration-300 ${
              isCopied
                ? "bg-green-500 text-white"
                : "bg-accent-red hover:bg-accent-burgundy text-white"
            }`}
          >
            {isCopied ? LOBBY_CONTENT.copiedButton : LOBBY_CONTENT.copyButton}
          </button>
        </div>
      </div>
    </div>
  );
}
