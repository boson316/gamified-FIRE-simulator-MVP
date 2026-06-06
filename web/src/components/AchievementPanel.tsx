"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ACHIEVEMENTS,
  type AchievementId,
} from "@/lib/achievements";

type AchievementPanelProps = {
  unlocked: Set<AchievementId>;
  newlyUnlocked: AchievementId[];
};

export function AchievementPanel({
  unlocked,
  newlyUnlocked,
}: AchievementPanelProps) {
  const ids = Object.keys(ACHIEVEMENTS) as AchievementId[];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
        人生成就
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ids.map((id) => {
          const ach = ACHIEVEMENTS[id];
          const isUnlocked = unlocked.has(id);
          const isNew = newlyUnlocked.includes(id);
          const isHidden = ach.hidden && !isUnlocked;

          if (isHidden) {
            return (
              <div
                key={id}
                className="flex items-center gap-2 rounded-xl border border-dashed border-white/10 px-3 py-2 opacity-40"
              >
                <span className="text-lg">❓</span>
                <span className="text-xs text-white/40">隱藏成就</span>
              </div>
            );
          }

          return (
            <motion.div
              key={id}
              layout
              initial={isNew ? { scale: 0.8, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              className={`relative flex flex-col gap-0.5 rounded-xl border px-3 py-2 ${
                isUnlocked
                  ? "border-amber-400/40 bg-amber-400/10"
                  : "border-white/10 bg-white/5 opacity-50 grayscale"
              }`}
            >
              {isNew && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-emerald-950"
                >
                  NEW
                </motion.span>
              )}
              <span className="text-xl">{ach.icon}</span>
              <span className="text-xs font-semibold text-white">{ach.title}</span>
              <span className="text-[10px] text-white/50">{ach.titleEn}</span>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {newlyUnlocked.map((id) => (
          <motion.div
            key={`toast-${id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100"
          >
            <strong>{ACHIEVEMENTS[id].icon} 解鎖：{ACHIEVEMENTS[id].title}</strong>
            <p className="mt-1 text-xs text-white/60">{ACHIEVEMENTS[id].description}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
