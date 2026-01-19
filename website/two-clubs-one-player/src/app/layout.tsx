import { Metadata } from "next";
import { EB_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="en">
      <body className={`${montserrat.variable} ${garamond.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
