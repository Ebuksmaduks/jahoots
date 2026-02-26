import { useEffect, useState } from "react";
import { QUESTION_TIME } from "@/lib/questions";

interface TimerProps {
  onExpire: () => void;
  running: boolean;
  onTick?: (remaining: number) => void;
}

export default function Timer({ onExpire, running, onTick }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const t = setTimeout(() => {
      const next = timeLeft - 1;
      setTimeLeft(next);
      onTick?.(next);
    }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, running]);

  const progress = (timeLeft / QUESTION_TIME) * circumference;
  const color = timeLeft > 10 ? "#008753" : timeLeft > 5 ? "#FFD700" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="rotate-[-90deg]" width="96" height="96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
        />
      </svg>
      <span
        className="absolute text-3xl font-black"
        style={{ color }}
      >
        {timeLeft}
      </span>
    </div>
  );
}
