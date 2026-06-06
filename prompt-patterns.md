# Prompt Patterns

## spec-to-tests

把 `PRD.md` 轉成可執行測試，輸出：

1. `tests/` 新增檔案列表
2. 每個測試對應的 FR 與驗收條件
3. 不要先改 production code

## tests-to-impl

基於現有 failing tests 實作最小可行修正，限制：

1. 只改必要檔案
2. 回傳實際修改檔案清單
3. 跑最小測試集並回報結果

## gate-fail-triage

分析 `artifacts/gate_result.json` 失敗原因，輸出：

1. root cause（最多 3 個）
2. 最小修復步驟
3. 修復後重跑指令

## artifact-review

審查 `baseline_metrics.json`、`optimized_metrics.json`、`benchmark_compare.json`、`gate_result.json`：

1. 指標是否一致
2. 是否有可疑數值
3. 下一輪調參建議（含預期影響）

## plan-before-ship（Senior — 動手前）

```text
Read PLANNING.md + PRD.md + TECH_DEBT.md + SUMMARY.md 雙指標。

任務：〈本 session 唯一 deliverable〉
範圍：只改 〈檔案清單〉

請 Plan Mode 輸出：
1) code_complete / go_to_market 現況與本任務影響
2) In Scope / 明確 Out of Scope
3) 驗收命令（pytest + 煙測 + 手動）
4) 會新增或關閉的 TECH_DEBT 項
5) ≤5 步驟 checklist

若 go_to_market <40% 且 code_complete ≥70%：說明為何仍要加功能，或改建議 GTM。
我確認後再實作。
```

## scope-gate（加功能前）

```text
Read PRD.md In/Out of Scope + TECH_DEBT.md + ROADMAP.md。

提案：〈新功能〉

輸出：
1) 是否 Out of Scope / 加購項
2) 若要做：decision artifact 草稿（context / decision / tradeoff）
3) 對雙指標影響
4) 建議：做 / 不做 / 等有客戶付費再做

不要寫碼，除非我明確 override。
```

## dual-metrics-review（每 sprint 末）

```text
Read SUMMARY.md、ROADMAP.md、TASKS.md、TECH_DEBT.md、weekly_review.md。

輸出：
1) code_complete / go_to_market 更新值與理由
2) P0 技術債清單
3) 下週 5h 配比（build vs GTM）
4) next_actions.md 草稿（3 條以內）
5) 是否觸發 docs/go-to-market-checklist.md
```

## gtm-week1（上線週）

```text
Read docs/go-to-market-checklist.md + TECH_DEBT.md P0。

執行或產出：
1) 部署步驟與公開 URL 占位
2) 真實煙測命令與預期結果
3) outreach 模板需替換的 URL 清單
4) 不新增 FR（除非 P0 修復必要）
```

## tech-debt-triage

```text
Read TECH_DEBT.md + 最近 diff。

輸出：
1) 每項 P0/P1/P2 與關閉條件
2) 最小關閉順序（通常：公開 URL → 真實煙測）
3) 不應標記為 Done 的 SUMMARY/TASKS 勾選項
```
