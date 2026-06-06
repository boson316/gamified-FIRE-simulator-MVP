"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

type ConfettiCelebrationProps = {
  trigger: number;
};

export function ConfettiCelebration({ trigger }: ConfettiCelebrationProps) {
  const prev = useRef(0);

  useEffect(() => {
    if (trigger <= prev.current) return;
    prev.current = trigger;

    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ["#34d399", "#fbbf24", "#a78bfa"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ["#34d399", "#fbbf24", "#a78bfa"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [trigger]);

  return null;
}
