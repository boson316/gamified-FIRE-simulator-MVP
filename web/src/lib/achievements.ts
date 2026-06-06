import type { SimulateParams, SimulateResult } from "./compound";
import { isCompoundInflection } from "./compound";

export type AchievementId =
  | "zero_to_one"
  | "lollapalooza"
  | "first_million"
  | "consistent_investor"
  | "interest_over_contributions";

export type Achievement = {
  id: AchievementId;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  hidden?: boolean;
};

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  zero_to_one: {
    id: "zero_to_one",
    title: "從零到一",
    titleEn: "Zero to One",
    description: "從小本金出發，資產突破 50 萬——最難的累積期已過。",
    icon: "🌱",
  },
  lollapalooza: {
    id: "lollapalooza",
    title: "魯拉帕路薩效應",
    titleEn: "Lollapalooza Effect",
    description: "複利曲線進入指數爆發：近 12 個月增值超過前 12 個月的 1.5 倍。",
    icon: "🎸",
    hidden: true,
  },
  first_million: {
    id: "first_million",
    title: "百萬俱樂部",
    titleEn: "First Million",
    description: "最終資產達 100 萬元。",
    icon: "💰",
  },
  consistent_investor: {
    id: "consistent_investor",
    title: "紀律投資人",
    titleEn: "Consistent Investor",
    description: "每月定額 ≥ 1 萬且投資年限 ≥ 10 年。",
    icon: "📅",
  },
  interest_over_contributions: {
    id: "interest_over_contributions",
    title: "錢滾錢",
    titleEn: "Money Works Harder",
    description: "利息收益超過本金＋定額投入總和的一半。",
    icon: "⚡",
  },
};

export type UnlockedAchievement = Achievement & { unlockedAt: number };

type EvalContext = {
  params: SimulateParams;
  result: SimulateResult;
};

const RULES: Record<
  AchievementId,
  (ctx: EvalContext) => boolean
> = {
  zero_to_one: ({ params, result }) =>
    params.principal <= 10_000 &&
    params.monthlyContribution > 0 &&
    result.finalValue >= 500_000,

  lollapalooza: ({ params, result }) =>
    params.years >= 10 &&
    isCompoundInflection(result.monthlyBalances),

  first_million: ({ result }) => result.finalValue >= 1_000_000,

  consistent_investor: ({ params }) =>
    params.monthlyContribution >= 10_000 && params.years >= 10,

  interest_over_contributions: ({ result }) =>
    result.interestEarned > result.totalContributed * 0.5,
};

export function evaluateAchievements(
  params: SimulateParams,
  result: SimulateResult,
): AchievementId[] {
  const ctx = { params, result };
  return (Object.keys(RULES) as AchievementId[]).filter((id) => RULES[id](ctx));
}

const STORAGE_KEY = "fire-gamification-achievements";

export function loadUnlocked(): Set<AchievementId> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as AchievementId[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

export function saveUnlocked(ids: Set<AchievementId>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}
