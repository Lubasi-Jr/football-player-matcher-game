"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GamerTagProvider } from "./GamerTagContext";
import { GameProvider } from "./GameContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GamerTagProvider>
        <GameProvider>{children}</GameProvider>
      </GamerTagProvider>
    </QueryClientProvider>
  );
}

export { useGamerTag } from "./GamerTagContext";
export { useGame } from "./GameContext";
