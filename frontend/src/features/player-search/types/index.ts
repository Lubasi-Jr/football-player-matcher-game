import { Footballer } from "@/types";

export interface PlayerSearchProps {
  onSelectPlayer: (footballer: Footballer) => void;
}

export interface PlayerItemProps {
  footballer: Footballer;
  searchQuery: string;
  onSelect: (footballer: Footballer) => void;
}
