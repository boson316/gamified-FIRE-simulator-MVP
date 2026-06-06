"use client";

import { motion } from "framer-motion";
import type { YearlySnapshot } from "@/lib/compound";

type GrowthChartProps = {
  snapshots: YearlySnapshot[];
  maxBalance: number;
};

export function GrowthChart({ snapshots, maxBalance }: GrowthChartProps) {
  const safeMax = maxBalance > 0 ? maxBalance : 1;

  return (
    <div className="flex h-48 gap-1 sm:gap-1.5">
      {snapshots.map((snap) => {
        const heightPct = Math.max((snap.balance / safeMax) * 100, 3);
        const interestShare =
          snap.balance > 0
            ? Math.min((snap.interestEarned / snap.balance) * 100, 100)
            : 0;

        return (
          <div
            key={snap.year}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-1"
          >
            <motion.div
              className="relative w-full overflow-hidden rounded-t-md bg-white/10"
              initial={false}
              animate={{ height: `${heightPct}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              title={`第 ${snap.year} 年：${Math.round(snap.balance).toLocaleString()} 元`}
            >
              <motion.div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-amber-500/80 to-emerald-400/60"
                initial={false}
                animate={{ height: `${interestShare}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
              />
            </motion.div>
            <span className="text-[10px] text-white/40 group-hover:text-white/70">
              {snap.year}y
            </span>
          </div>
        );
      })}
    </div>
  );
}
