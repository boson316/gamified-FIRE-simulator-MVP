"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { simulate, formatCurrency } from "@/lib/compound";
import {
  evaluateAchievements,
  loadUnlocked,
  saveUnlocked,
  type AchievementId,
} from "@/lib/achievements";
import { ParameterSlider } from "./ParameterSlider";
import { AnimatedNumber } from "./AnimatedNumber";
import { GrowthChart } from "./GrowthChart";
import { AchievementPanel } from "./AchievementPanel";
import { ConfettiCelebration } from "./ConfettiCelebration";

const DEFAULT = {
  principal: 50_000,
  monthlyContribution: 15_000,
  annualRate: 0.07,
  years: 20,
};

export function Simulator() {
  const [principal, setPrincipal] = useState(DEFAULT.principal);
  const [monthlyContribution, setMonthlyContribution] = useState(
    DEFAULT.monthlyContribution,
  );
  const [annualRate, setAnnualRate] = useState(DEFAULT.annualRate);
  const [years, setYears] = useState(DEFAULT.years);

  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(new Set());
  const [newlyUnlocked, setNewlyUnlocked] = useState<AchievementId[]>([]);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  useEffect(() => {
    setUnlocked(loadUnlocked());
  }, []);

  const params = useMemo(
    () => ({ principal, monthlyContribution, annualRate, years }),
    [principal, monthlyContribution, annualRate, years],
  );

  const result = useMemo(() => simulate(params), [params]);

  const checkAchievements = useCallback(() => {
    const current = evaluateAchievements(params, result);
    const prev = loadUnlocked();
    const fresh = current.filter((id) => !prev.has(id));

    if (fresh.length > 0) {
      const merged = new Set([...prev, ...fresh]);
      saveUnlocked(merged);
      setUnlocked(merged);
      setNewlyUnlocked(fresh);

      if (fresh.includes("lollapalooza")) {
        setConfettiTrigger((n) => n + 1);
      }
    } else {
      setNewlyUnlocked([]);
    }
  }, [params, result]);

  useEffect(() => {
    const timer = setTimeout(checkAchievements, 400);
    return () => clearTimeout(timer);
  }, [checkAchievements]);

  const maxBalance = result.yearlySnapshots.at(-1)?.balance ?? result.finalValue;

  return (
    <div className="mx-auto grid min-h-screen max-w-7xl gap-6 p-4 lg:grid-cols-2 lg:p-8">
      <ConfettiCelebration trigger={confettiTrigger} />

      <motion.section
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
      >
        <header>
          <p className="text-xs uppercase tracking-widest text-emerald-400/80">
            參數調整
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            財務自由模擬器
          </h1>
          <p className="mt-2 text-sm text-white/50">
            拖曳滑桿，感受複利與時間的魔力。
          </p>
        </header>

        <div className="space-y-6">
          <ParameterSlider
            label="初始資金"
            value={principal}
            min={0}
            max={500_000}
            step={5_000}
            format={(v) => formatCurrency(v)}
            onChange={setPrincipal}
          />
          <ParameterSlider
            label="每月定期定額"
            value={monthlyContribution}
            min={0}
            max={100_000}
            step={1_000}
            format={(v) => formatCurrency(v)}
            onChange={setMonthlyContribution}
          />
          <ParameterSlider
            label="預期年化報酬率"
            value={annualRate}
            min={0}
            max={0.15}
            step={0.005}
            format={(v) => `${(v * 100).toFixed(1)}%`}
            onChange={setAnnualRate}
          />
          <ParameterSlider
            label="預計投資年限"
            value={years}
            min={1}
            max={40}
            step={1}
            format={(v) => `${v} 年`}
            onChange={setYears}
          />
        </div>

        <AchievementPanel unlocked={unlocked} newlyUnlocked={newlyUnlocked} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-950/80 to-emerald-900/40 p-6 backdrop-blur-sm"
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-400/80">
            最終總資產
          </p>
          <AnimatedNumber
            value={result.finalValue}
            className="mt-2 block text-4xl font-bold tabular-nums text-amber-300 sm:text-5xl lg:text-6xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/5 px-4 py-3">
            <p className="text-white/50">累計投入</p>
            <p className="font-mono font-semibold text-white">
              {formatCurrency(result.totalContributed)}
            </p>
          </div>
          <div className="rounded-xl bg-white/5 px-4 py-3">
            <p className="text-white/50">利息收益</p>
            <p className="font-mono font-semibold text-emerald-300">
              {formatCurrency(result.interestEarned)}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-white/40">
            資產成長曲線
          </p>
          <GrowthChart snapshots={result.yearlySnapshots} maxBalance={maxBalance} />
        </div>
      </motion.section>
    </div>
  );
}
