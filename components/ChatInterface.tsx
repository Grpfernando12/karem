
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';

interface Props {
  messages: Message[];
  transcription: string;
}

const ChatInterface: React.FC<Props> = ({ messages, transcription }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcription]);

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-4 font-mono text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} fade-in`}>
            <div className={`max-w-[85%] px-3 py-2 border rounded-lg ${
              msg.role === 'user' 
              ? 'border-green-500/50 bg-green-500/5 text-green-300' 
              : 'border-green-500 bg-green-500/10 text-green-400'
            }`}>
              <div className="text-[10px] opacity-50 mb-1 uppercase">
                {msg.role === 'user' ? 'Plankton' : 'Karen'} • {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
              <div className="leading-relaxed">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {transcription && (
          <div className="flex flex-col items-end opacity-60 italic">
            <div className="max-w-[85%] px-3 py-1 border border-dashed border-green-500/50 text-xs">
              Ouvindo: "{transcription}"...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
