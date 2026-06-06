import { describe, expect, it } from "vitest";
import {
  futureValueClosedForm,
  isCompoundInflection,
  simulate,
} from "./compound";

describe("simulate", () => {
  it("matches closed-form FV within 0.01%", () => {
    const params = {
      principal: 100_000,
      monthlyContribution: 10_000,
      annualRate: 0.07,
      years: 20,
    };
    const { finalValue } = simulate(params);
    const closed = futureValueClosedForm(
      params.principal,
      params.monthlyContribution,
      params.annualRate,
      240,
    );
    const relError = Math.abs(finalValue - closed) / closed;
    expect(relError).toBeLessThan(0.0001);
  });

  it("handles zero rate as linear accumulation", () => {
    const result = simulate({
      principal: 50_000,
      monthlyContribution: 5_000,
      annualRate: 0,
      years: 5,
    });
    expect(result.finalValue).toBe(50_000 + 5_000 * 60);
  });

  it("rejects negative principal", () => {
    expect(() =>
      simulate({
        principal: -1,
        monthlyContribution: 0,
        annualRate: 0.05,
        years: 1,
      }),
    ).toThrow(RangeError);
  });
});

describe("isCompoundInflection", () => {
  it("returns false for short series", () => {
    expect(isCompoundInflection([100, 200, 300])).toBe(false);
  });

  it("detects accelerating growth", () => {
    const balances = Array.from({ length: 30 }, (_, i) => i * i * 1_000);
    expect(isCompoundInflection(balances)).toBe(true);
  });
});
