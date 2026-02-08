
import React from 'react';
import { Message, Emotion } from '../types';

interface Props {
  messages: Message[];
}

const MetricDashboard: React.FC<Props> = ({ messages }) => {
  const emotionStats = messages.reduce((acc, msg) => {
    if (msg.role === 'assistant' && msg.emotion) {
      acc[msg.emotion] = (acc[msg.emotion] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalWords = messages.reduce((sum, m) => sum + m.content.split(' ').length, 0);

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-sm font-bold border-b border-green-500/30 pb-2 uppercase tracking-widest">Painel de Métricas</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 border border-green-500/20 bg-green-500/5 rounded text-center">
            <div className="text-[10px] opacity-50 uppercase">Mensagens</div>
            <div className="text-xl font-bold">{messages.length}</div>
        </div>
        <div className="p-3 border border-green-500/20 bg-green-500/5 rounded text-center">
            <div className="text-[10px] opacity-50 uppercase">Palavras</div>
            <div className="text-xl font-bold">{totalWords}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] uppercase opacity-50">Análise de Emoções</h4>
        {Object.entries(Emotion).map(([key, val]) => {
          const count = emotionStats[val] || 0;
          const percentage = messages.length > 0 ? (count / messages.filter(m => m.role === 'assistant').length) * 100 : 0;
          
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase">
                <span>{val}</span>
                <span>{count}</span>
              </div>
              <div className="w-full h-1 bg-green-500/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-4">
        <h4 className="text-[10px] uppercase opacity-50">Logs de Atividade</h4>
        <div className="text-[9px] font-mono space-y-2 opacity-60">
           {messages.slice(-5).map((m, i) => (
             <div key={i} className="truncate">
               [{new Date(m.timestamp).toLocaleTimeString()}] {m.role.toUpperCase()}: {m.content}
             </div>
           ))}
        </div>
      </div>

      <button 
        onClick={() => {
            const data = JSON.stringify(messages, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `karen-logs-${Date.now()}.json`;
            a.click();
        }}
        className="w-full py-2 border border-green-500/50 hover:bg-green-500/10 transition-all text-xs uppercase mt-4"
      >
        Exportar Logs
      </button>
    </div>
  );
};

export default MetricDashboard;
