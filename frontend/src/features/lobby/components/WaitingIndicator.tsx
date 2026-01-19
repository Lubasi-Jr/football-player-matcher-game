"use client";

import { LOBBY_CONTENT } from "../constants";

interface WaitingIndicatorProps {
  message?: string;
}

export function WaitingIndicator({
  message = LOBBY_CONTENT.waitingMessage,
}: WaitingIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-4 h-4 bg-accent-red rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-white/80 font-body text-lg">{message}</p>
    </div>
  );
}
