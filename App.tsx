
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import KarenScreen from './components/KarenScreen';
import ChatInterface from './components/ChatInterface';
import VoiceControls from './components/VoiceControls';
import MetricDashboard from './components/MetricDashboard';
import { Message, AppSettings, Emotion, VoiceState } from './types';
import { initialSettings, SYSTEM_INSTRUCTION, EVIL_PLAN_PROMPT } from './constants';
import { synthesizeSpeech, speakResponse } from './services/speechService';

const App: React.FC = () => {
  // State
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Iniciando sistema... Olá, Plankton. O que vamos conquistar hoje?', timestamp: Date.now(), emotion: Emotion.NEUTRAL }
  ]);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.INACTIVE);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(Emotion.NEUTRAL);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  // Refs for Audio
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<any>(null);
  const aiRef = useRef<any>(null);

  // Initialize AI
  useEffect(() => {
    aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';

      recognition.onstart = () => setVoiceState(VoiceState.LISTENING);
      recognition.onend = () => {
        if (settings.continuousListening) {
          recognition.start();
        } else {
          setVoiceState(VoiceState.INACTIVE);
        }
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setTranscription(interimTranscript || finalTranscript);

        if (finalTranscript) {
          handleUserCommand(finalTranscript);
          setTranscription('');
        }
      };

      recognitionRef.current = recognition;
    }
  }, [settings.continuousListening]);

  const handleUserCommand = async (text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    // Command filtering
    if (lowerText.includes('karen, pare') || lowerText.includes('karen, silêncio')) {
      window.speechSynthesis.cancel();
      return;
    }

    if (lowerText.includes('karen, limpe a tela')) {
      setMessages([]);
      return;
    }

    if (lowerText.includes('karen, modo escuro')) {
      setSettings(prev => ({ ...prev, highContrast: false }));
      return;
    }

    // Process General AI Request
    setVoiceState(VoiceState.PROCESSING);
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: Date.now() }]);

    try {
      const ai = aiRef.current;
      const isEvilPlan = lowerText.includes('plano maligno');
      const prompt = isEvilPlan ? EVIL_PLAN_PROMPT : text;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: isEvilPlan ? 1.2 : 0.7,
        }
      });

      const aiText = response.text || "Erro no processador central.";
      const emotionMatch = aiText.match(/\[EMOTION: (\w+)\]/);
      const emotion = (emotionMatch ? emotionMatch[1].toLowerCase() : 'neutral') as Emotion;
      const cleanText = aiText.replace(/\[EMOTION: \w+\]/g, '').trim();

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: cleanText, 
        timestamp: Date.now(), 
        emotion 
      }]);
      
      setCurrentEmotion(emotion);
      setVoiceState(VoiceState.INACTIVE);

      // Speak result
      if (settings.enableTTS) {
        speakResponse(cleanText, settings, () => {
           // On end logic if needed
        });
      }

    } catch (error) {
      console.error(error);
      setVoiceState(VoiceState.INACTIVE);
      setMessages(prev => [...prev, { role: 'assistant', content: "Maldito Siri Cascudo! Tive um erro de conexão.", timestamp: Date.now(), emotion: Emotion.SAD }]);
    }
  };

  const toggleMic = () => {
    if (voiceState === VoiceState.INACTIVE) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
      setVoiceState(VoiceState.INACTIVE);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${settings.highContrast ? 'grayscale contrast-125' : ''}`}>
      {/* Header */}
      <header className="h-16 border-b border-green-500/50 bg-black/80 flex items-center justify-between px-6 z-20 sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center animate-pulse">
            <span className="text-xs font-bold">K</span>
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-shadow-green uppercase">KAREN OS v2.4.0</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className={`text-xs px-2 py-1 border border-green-500 rounded ${voiceState === VoiceState.LISTENING ? 'bg-green-500/20' : ''}`}>
              {voiceState === VoiceState.LISTENING ? 'ESCUTANDO...' : voiceState === VoiceState.PROCESSING ? 'PROCESSANDO...' : 'SISTEMA OK'}
            </span>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 border border-green-500/50 hover:bg-green-500/20 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left: Settings (Desktop) */}
        <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-black border-r border-green-500/30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-30 overflow-y-auto`}>
           <VoiceControls settings={settings} setSettings={setSettings} />
        </aside>

        {/* Center: Karen Screen + Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-2/5 md:h-1/2 border-b border-green-500/20 relative bg-black/50">
            <KarenScreen emotion={currentEmotion} isSpeaking={window.speechSynthesis.speaking} isListening={voiceState === VoiceState.LISTENING} />
          </div>
          <div className="flex-1 flex flex-col bg-black/20 p-4">
            <ChatInterface messages={messages} transcription={transcription} />
          </div>
        </div>

        {/* Right: Metrics (Desktop) */}
        <aside className="hidden xl:block w-80 border-l border-green-500/30 bg-black overflow-y-auto p-4">
           <MetricDashboard messages={messages} />
        </aside>
      </main>

      {/* Bottom Control Bar */}
      <footer className="h-20 border-t border-green-500/30 bg-black/90 p-4 flex items-center justify-between gap-4 z-20">
        <div className="hidden sm:flex flex-col text-[10px] text-green-500/60 font-mono">
            <div>MEM_USE: 42.8MB / 128MB</div>
            <div>PLANKTON_LOC: BALDE_DE_LIXO</div>
        </div>
        
        <div className="flex-1 flex justify-center">
           <button 
              onClick={toggleMic}
              className={`group flex items-center justify-center gap-3 px-8 py-3 rounded-full border-2 transition-all duration-300 ${
                voiceState === VoiceState.LISTENING 
                ? 'bg-red-500/20 border-red-500 animate-pulse' 
                : 'bg-green-500/10 border-green-500 hover:bg-green-500/30'
              }`}
           >
              <div className={`w-3 h-3 rounded-full ${voiceState === VoiceState.LISTENING ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className="font-bold uppercase text-sm">{voiceState === VoiceState.LISTENING ? 'Parar' : 'Falar com Karen'}</span>
           </button>
        </div>

        <div className="hidden sm:flex items-center gap-4">
           <button 
            onClick={() => window.speechSynthesis.cancel()}
            className="p-2 border border-green-500/30 hover:bg-green-500/20 transition-all rounded"
            title="Mudar Voz"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
           </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
