
import React from 'react';
import { AppSettings } from '../types';

interface Props {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const VoiceControls: React.FC<Props> = ({ settings, setSettings }) => {
  const handleChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 flex flex-col gap-8">
      <div>
        <h3 className="text-xs font-bold opacity-50 uppercase mb-4 tracking-widest">Configurações de Áudio</h3>
        
        <div className="space-y-6">
          {/* Volume */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase">
              <span>Volume da Síntese</span>
              <span>{Math.round(settings.voiceVolume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.1"
              value={settings.voiceVolume}
              onChange={(e) => handleChange('voiceVolume', parseFloat(e.target.value))}
              className="w-full h-1 bg-green-500/20 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          {/* Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase">
              <span>Velocidade da Fala</span>
              <span>{settings.voiceRate}x</span>
            </div>
            <input 
              type="range" min="0.5" max="2" step="0.1"
              value={settings.voiceRate}
              onChange={(e) => handleChange('voiceRate', parseFloat(e.target.value))}
              className="w-full h-1 bg-green-500/20 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          {/* Pitch */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase">
              <span>Tom (Pitch)</span>
              <span>{settings.voicePitch}</span>
            </div>
            <input 
              type="range" min="0.5" max="2" step="0.1"
              value={settings.voicePitch}
              onChange={(e) => handleChange('voicePitch', parseFloat(e.target.value))}
              className="w-full h-1 bg-green-500/20 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold opacity-50 uppercase mb-4 tracking-widest">Interface do Sistema</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-xs uppercase group-hover:text-green-300 transition-colors">Voz Ativada</span>
            <input 
              type="checkbox" 
              checked={settings.enableTTS}
              onChange={(e) => handleChange('enableTTS', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-green-500/10 border border-green-500/30 rounded-full peer peer-checked:bg-green-500/40 peer-checked:border-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-green-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 relative"></div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-xs uppercase group-hover:text-green-300 transition-colors">Escuta Contínua</span>
            <input 
              type="checkbox" 
              checked={settings.continuousListening}
              onChange={(e) => handleChange('continuousListening', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-green-500/10 border border-green-500/30 rounded-full peer peer-checked:bg-green-500/40 peer-checked:border-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-green-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 relative"></div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-xs uppercase group-hover:text-green-300 transition-colors">Alto Contraste</span>
            <input 
              type="checkbox" 
              checked={settings.highContrast}
              onChange={(e) => handleChange('highContrast', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-green-500/10 border border-green-500/30 rounded-full peer peer-checked:bg-green-500/40 peer-checked:border-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-green-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 relative"></div>
          </label>
        </div>
      </div>

      <div className="mt-auto p-4 border border-green-500/20 bg-green-500/5 rounded">
          <div className="text-[10px] uppercase opacity-40 mb-2">Status do Servidor</div>
          <div className="text-[10px] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            LATÊNCIA: 142ms
          </div>
          <div className="text-[10px] mt-1">CPU_LOAD: 12%</div>
      </div>
    </div>
  );
};

export default VoiceControls;
