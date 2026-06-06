export type SimulateParams = {
  principal: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
};

export type YearlySnapshot = {
  year: number;
  balance: number;
  contributed: number;
  interestEarned: number;
};

export type SimulateResult = {
  monthlyBalances: number[];
  yearlySnapshots: YearlySnapshot[];
  finalValue: number;
  totalContributed: number;
  interestEarned: number;
};

function assertNonNegativeFinite(value: number, name: string): void {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative finite number`);
  }
}

function assertFinite(value: number, name: string): void {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number`);
  }
}

/**
 * Monthly compounding with end-of-month contributions (Excel FV type=0).
 * Supports initial principal + recurring monthly deposits.
 */
export function simulate({
  principal,
  monthlyContribution,
  annualRate,
  years,
}: SimulateParams): SimulateResult {
  assertNonNegativeFinite(principal, "principal");
  assertNonNegativeFinite(monthlyContribution, "monthlyContribution");
  assertFinite(annualRate, "annualRate");
  assertNonNegativeFinite(years, "years");

  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = annualRate / 12;
  const monthlyBalances: number[] = [];

  let balance = principal;
  let totalContributed = principal;

  for (let month = 1; month <= months; month += 1) {
    if (Math.abs(monthlyRate) < 1e-15) {
      balance += monthlyContribution;
    } else {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    totalContributed += monthlyContribution;
    monthlyBalances.push(balance);
  }

  const yearlySnapshots: YearlySnapshot[] = [];
  for (let year = 1; year <= Math.ceil(years); year += 1) {
    const monthIndex = Math.min(year * 12, months) - 1;
    if (monthIndex < 0) break;

    const balanceAtYear = monthlyBalances[monthIndex] ?? principal;
    const contributedAtYear =
      principal + monthlyContribution * Math.min(year * 12, months);
    yearlySnapshots.push({
      year,
      balance: balanceAtYear,
      contributed: contributedAtYear,
      interestEarned: balanceAtYear - contributedAtYear,
    });
  }

  const finalValue = balance;
  const interestEarned = finalValue - totalContributed;

  return {
    monthlyBalances,
    yearlySnapshots,
    finalValue,
    totalContributed,
    interestEarned,
  };
}

/**
 * Closed-form FV with principal + end-of-period payments.
 * Excel: =FV(rate, nper, -pmt, -pv, 0)
 */
export function futureValueClosedForm(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  months: number,
): number {
  if (months <= 0) return principal;
  const r = annualRate / 12;
  if (Math.abs(r) < 1e-15) {
    return principal + monthlyContribution * months;
  }
  const factor = Math.pow(1 + r, months);
  return principal * factor + (monthlyContribution * (factor - 1)) / r;
}

/** Detect hockey-stick phase: latest 12m gain exceeds prior 12m gain by 1.5× */
export function isCompoundInflection(monthlyBalances: number[]): boolean {
  const n = monthlyBalances.length;
  if (n < 24) return false;

  const gainLast = monthlyBalances[n - 1] - monthlyBalances[n - 13];
  const gainPrior = monthlyBalances[n - 13] - monthlyBalances[n - 25];
  if (gainPrior <= 0) return gainLast > 0;
  return gainLast >= gainPrior * 1.5;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(value);
}
