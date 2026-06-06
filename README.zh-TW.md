# 遊戲化財務自由模擬器

**Languages:** [English](README.md) · [中文](README.zh-TW.md)

複利模擬 + 滑桿互動 + 數字滾動動畫 + 成就徽章（含隱藏成就與 confetti）。

## 技術棧

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS 4 · Framer Motion · canvas-confetti
- LocalStorage 持久化成就（零後端）

## 快速開始

```powershell
cd web
npm install
npm run dev
```

瀏覽 [http://localhost:3000](http://localhost:3000)。

## 驗收

```powershell
# 單元測試（複利計算，與 Excel FV 誤差 < 0.01%）
cd web
npm run test

# 正式建置
npm run build

# 專案根目錄 smoke
cd ..
python -m pytest -q
```

## MVP 功能

| 項目 | 狀態 |
|------|------|
| 複利計算（本金、每月定額、年化報酬、年限） | 完成 |
| 滑桿輸入 + 最終資產數字平滑滾動 | 完成 |
| 年度資產成長柱狀圖（Framer Motion） | 完成 |
| 5 個成就（從零到一、魯拉帕路薩隱藏成就 + confetti 等） | 完成 |
| LocalStorage 存檔 | 完成 |
| 通膨 / 資產配置 / 多幣別 | 不在 scope |

## 成就一覽

| 徽章 | 觸發條件 |
|------|----------|
| 從零到一 | 初始 ≤ 1 萬、有定額、最終資產 ≥ 50 萬 |
| 魯拉帕路薩效應（隱藏） | 投資 ≥ 10 年且近 12 月增值 ≥ 前 12 月的 1.5 倍 |
| 百萬俱樂部 | 最終資產 ≥ 100 萬 |
| 紀律投資人 | 每月定額 ≥ 1 萬且年限 ≥ 10 年 |
| 錢滾錢 | 利息收益 > 累計投入的一半 |

## 目錄

```
web/
├── src/lib/compound.ts       # 核心複利邏輯
├── src/lib/achievements.ts   # 成就規則引擎
└── src/components/           # 互動 UI
```

## 部署

`web/` 可直接部署至 Vercel（純前端）。

## 相關

- 作品集衝刺規劃：`作品集_五專案衝刺規劃.md` §7
- 複利參考實作：`cursor/3_Web與API/fin-tools-tw/dca/js/calc.js`
