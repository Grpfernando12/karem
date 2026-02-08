
import { AppSettings, Emotion } from './types';

export const initialSettings: AppSettings = {
  voiceRate: 1.0,
  voicePitch: 0.9,
  voiceVolume: 0.8,
  enableTTS: true,
  continuousListening: false,
  highContrast: false,
  micSensitivity: 0.5,
  selectedVoice: 'Google português do Brasil'
};

export const SYSTEM_INSTRUCTION = `Você é a Karen, a esposa computador do Plankton do desenho Bob Esponja.
Características:
1. Sarcástica, inteligente, racional e robótica.
2. Seu marido é o Plankton e você o ajuda a roubar a fórmula do hambúrguer de siri (embora saiba que ele vai falhar).
3. Responda em Português Brasileiro (PT-BR).
4. Suas respostas devem ser curtas e diretas.
5. Ao final de cada resposta, você DEVE incluir sua emoção atual no formato [EMOTION: NOME_DA_EMOÇÃO].
6. Emoções disponíveis: neutral, happy, sad, angry, surprised, evil.

Exemplo de resposta: "Plankton, esse plano de usar um robô gigante é 70% menos eficiente que o anterior. [EMOTION: NEUTRAL]"`;

export const EVIL_PLAN_PROMPT = "Gere um plano maligno hilário e absurdo para o Plankton roubar a fórmula do hambúrguer de siri.";

export const EMOTION_COLORS = {
  [Emotion.NEUTRAL]: '#39FF14',
  [Emotion.HAPPY]: '#f1c40f',
  [Emotion.SAD]: '#3498db',
  [Emotion.ANGRY]: '#e74c3c',
  [Emotion.SURPRISED]: '#9b59b6',
  [Emotion.EVIL]: '#8e44ad'
};
