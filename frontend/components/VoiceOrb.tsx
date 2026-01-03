'use client';

import { useEffect, useRef } from 'react';

interface VoiceOrbProps {
  isActive: boolean;
  isSpeaking?: boolean;
}

export function VoiceOrb({ isActive, isSpeaking = false }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (isActive || isSpeaking) {
        // Animated pulsing orb
        phase += 0.05;
        const pulseRadius = 80 + Math.sin(phase) * 20;
        const outerRadius = pulseRadius + 20;

        // Outer glow
        const gradient1 = ctx.createRadialGradient(centerX, centerY, pulseRadius * 0.5, centerX, centerY, outerRadius);
        gradient1.addColorStop(0, 'rgba(6, 182, 212, 0.8)'); // cyan-500
        gradient1.addColorStop(0.5, 'rgba(6, 182, 212, 0.4)');
        gradient1.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient1;
        ctx.fill();

        // Main orb
        const gradient2 = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
        gradient2.addColorStop(0, 'rgba(20, 184, 166, 1)'); // teal-500
        gradient2.addColorStop(0.7, 'rgba(6, 182, 212, 0.8)'); // cyan-500
        gradient2.addColorStop(1, 'rgba(6, 182, 212, 0.3)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient2;
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(centerX - 20, centerY - 20, 30, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      } else {
        // Static orb when inactive
        const radius = 80;

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(100, 116, 139, 0.8)'); // slate-500
        gradient.addColorStop(1, 'rgba(71, 85, 105, 0.3)'); // slate-600

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isSpeaking]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="rounded-full"
      />
    </div>
  );
}
