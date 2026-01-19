import type { Metadata } from "next";
import { EB_Garamond, Montserrat } from "next/font/google";
import { Providers } from "@/context";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "2 Clubs 1 Player - Football Trivia Game",
  description:
    "Test your football knowledge in this exciting head-to-head trivia game. Name a player who has played for both clubs!",
  keywords: ["football", "trivia", "game", "soccer", "quiz", "multiplayer"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${montserrat.variable}`}>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
