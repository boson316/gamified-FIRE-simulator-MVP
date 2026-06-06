# 遊戲化_財務自由_模擬器與人生成就記分板 — 專案總結

**Languages:** [English](SUMMARY.en.md) · [中文](SUMMARY.md)

> **路徑：** `cursor/遊戲化_財務自由_模擬器與人生成就記分板` · **更新：** 2026-06-06

---

## 一句話

拖曳滑桿感受複利成長，解鎖「從零到一」「魯拉帕路薩效應」等投資哲學成就。

---

## 雙指標

| 指標 | 進度 | 含義 |
|------|------|------|
| **code_complete** | ~55% | MVP 前端 + 複利測試 + README |
| **go_to_market** | ~10% | 待 Vercel 部署 + demo GIF |

```
code_complete    [███████████░░░░░░░░░]  55%
go_to_market     [██░░░░░░░░░░░░░░░░░░]  10%
```

---

## 目錄結構

```
web/                    # Next.js 前端（MVP 主體）
├── src/lib/compound.ts
├── src/lib/achievements.ts
└── src/components/
src/app.py              # bootstrap health stub
tests/                  # pytest + vitest 橋接
```

---

## 驗證

```powershell
cd web && npm run test && npm run build
cd .. && python -m pytest -q
```

---

## 已知技術債

見 [TECH_DEBT.md](TECH_DEBT.md)。

---

## 仍需本人

- [ ] 公開 demo URL（Vercel）
- [ ] 30 秒 demo GIF
- [ ] Lighthouse 性能量測

---

## 文件索引

[PRD.md](PRD.md) · [README.md](README.md) · [README.zh-TW.md](README.zh-TW.md)
