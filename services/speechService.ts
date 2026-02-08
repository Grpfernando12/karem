
import { AppSettings } from '../types';

/**
 * Custom function to play system sounds using Web Audio API
 */
export const playSystemSound = (type: 'beep' | 'confirm' | 'error' | 'boot') => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  switch (type) {
    case 'beep':
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
      break;
    case 'confirm':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(660, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
      break;
    case 'boot':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(110, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 1);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1);
      break;
  }
};

/**
 * Text-to-Speech synthesis with Karen-like qualities
 */
export const speakResponse = (text: string, settings: AppSettings, onEnd?: () => void) => {
  if (!('speechSynthesis' in window)) return;

  // Cancel current speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find a PT-BR voice
  const ptVoice = voices.find(v => v.lang === 'pt-BR') || voices[0];
  
  if (ptVoice) utterance.voice = ptVoice;
  utterance.rate = settings.voiceRate;
  utterance.pitch = settings.voicePitch;
  utterance.volume = settings.voiceVolume;
  utterance.lang = 'pt-BR';

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const synthesizeSpeech = async (text: string) => {
  // This is a placeholder for more advanced synthesis if needed (e.g. Gemini TTS)
  console.log('Synthesizing:', text);
};
