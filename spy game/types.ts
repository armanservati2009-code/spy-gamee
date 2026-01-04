
export enum GameState {
  SETUP = 'SETUP',
  ROLE_DISTRIBUTION = 'ROLE_DISTRIBUTION',
  PLAYING = 'PLAYING',
  REVEAL = 'REVEAL'
}

export type Language = 'fa' | 'en';

export interface Player {
  id: string;
  name: string;
  isSpy: boolean;
  seen: boolean;
}

export interface GameSettings {
  spyCount: number;
  category: string;
  timerSeconds: number | null;
  language: Language;
  isOffline: boolean;
}
