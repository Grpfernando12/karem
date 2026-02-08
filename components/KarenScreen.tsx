
import React, { useRef, useEffect } from 'react';
import { Emotion } from '../types';
import { EMOTION_COLORS } from '../constants';

interface Props {
  emotion: Emotion;
  isSpeaking: boolean;
  isListening: boolean;
}

const KarenScreen: React.FC<Props> = ({ emotion, isSpeaking, isListening }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;
      
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = EMOTION_COLORS[emotion] || '#39FF14';
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.strokeStyle;

      // Draw the wave
      for (let x = 0; x < width; x++) {
        let amplitude = 2;
        let frequency = 0.05;

        if (isSpeaking) {
          amplitude = 30 + Math.sin(offset * 0.2) * 20;
          frequency = 0.1;
        } else if (isListening) {
          amplitude = 10 + Math.random() * 5;
          frequency = 0.2;
        }

        // Adjust wave based on emotion
        if (emotion === Emotion.ANGRY) frequency *= 2;
        if (emotion === Emotion.SAD) amplitude *= 0.5;
        if (emotion === Emotion.EVIL) {
           amplitude *= 1.5;
           frequency *= 0.5;
        }

        const y = midY + Math.sin(x * frequency + offset) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      // Add "eye" glitches if surprised or angry
      if (emotion === Emotion.SURPRISED) {
          ctx.beginPath();
          ctx.arc(width/2, midY, 40 + Math.sin(offset) * 10, 0, Math.PI * 2);
          ctx.stroke();
      }

      offset += 0.15;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [emotion, isSpeaking, isListening]);

  return (
    <div className="w-full h-full relative flex items-center justify-center p-4">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#39FF14 1px, transparent 1px), linear-gradient(90deg, #39FF14 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="w-full max-w-2xl h-auto"
      />
      
      <div className="absolute bottom-4 right-4 text-[10px] opacity-40 uppercase">
        Signal: {emotion} | Mode: {isSpeaking ? 'TRANSMITTING' : isListening ? 'RECEIVING' : 'IDLE'}
      </div>
    </div>
  );
};

export default KarenScreen;
