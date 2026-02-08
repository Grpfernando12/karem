
export enum Emotion {
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  SAD = 'sad',
  ANGRY = 'angry',
  SURPRISED = 'surprised',
  EVIL = 'evil'
}

export enum VoiceState {
  INACTIVE = 'inactive',
  LISTENING = 'listening',
  PROCESSING = 'processing'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  emotion?: Emotion;
}

export interface AppSettings {
  voiceRate: number;
  voicePitch: number;
  voiceVolume: number;
  enableTTS: boolean;
  continuousListening: boolean;
  highContrast: boolean;
  micSensitivity: number;
  selectedVoice: string;
}
