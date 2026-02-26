import { useEffect, useRef } from "react";

const COLORS = ["#008753", "#FFD700", "#FFFFFF", "#00B36B", "#FFC107", "#4CAF50"];

export default function Confetti() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pieces: HTMLDivElement[] = [];

    for (let i = 0; i < 80; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = `-20px`;
      piece.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      piece.style.width = `${6 + Math.random() * 8}px`;
      piece.style.height = `${6 + Math.random() * 8}px`;
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      piece.style.animationDuration = `${2 + Math.random() * 3}s`;
      piece.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(piece);
      pieces.push(piece);
    }

    return () => {
      pieces.forEach((p) => p.remove());
    };
  }, []);

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-50 overflow-hidden" />;
}
