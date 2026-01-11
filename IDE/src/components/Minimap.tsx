import { useEffect, useRef, useState } from 'react';

interface MinimapProps {
    content: string;
    visibleRange: { start: number; end: number };
    onClick: (line: number) => void;
}

export default function Minimap({ content, visibleRange, onClick }: MinimapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lines = content.split('\n');
    const lineHeight = 2;
    const width = 80;
    const height = Math.min(lines.length * lineHeight, 800);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#252526';
        ctx.fillRect(0, 0, width, height);

        // Draw lines
        lines.forEach((line, i) => {
            const y = i * lineHeight;
            const chars = line.trim().length;
            const lineWidth = Math.min(chars * 0.8, width - 10);

            if (lineWidth > 0) {
                ctx.fillStyle = '#4a4a4a';
                ctx.fillRect(4, y, lineWidth, 1.5);
            }
        });

        // Draw visible range
        const rangeY = visibleRange.start * lineHeight;
        const rangeHeight = (visibleRange.end - visibleRange.start) * lineHeight;
        ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
        ctx.fillRect(0, rangeY, width, rangeHeight);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.strokeRect(0, rangeY, width, rangeHeight);
    }, [content, visibleRange, lines.length]);

    const handleClick = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const y = e.clientY - rect.top;
        const line = Math.floor(y / lineHeight);
        onClick(line);
    };

    return (
        <div className="w-20 bg-[#252526] border-l border-[#3c3c3c] flex-shrink-0 overflow-hidden">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onClick={handleClick}
                className="cursor-pointer"
            />
        </div>
    );
}
