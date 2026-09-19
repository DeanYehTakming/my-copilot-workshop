---
agent: 'agent'
description: '依專案標準審查目前的 Pull Request,優先找出會造成錯誤或回歸的問題'
argument-hint: 'prNumber=7'
---

# 任務:審查 Pull Request

請審查本 repo 的 Pull Request **#${input:prNumber:要審查的 PR 編號}**。

## 審查順序

1. 使用 GitHub 工具讀取 PR 描述、變更檔案與相關 issue。
2. 閱讀變更涉及的程式碼與鄰近呼叫流程，確認行為是否符合需求。
3. 執行可用的最小驗證；純前端功能至少檢查 HTML、CSS、JavaScript 錯誤與 `git diff --check`。
4. 依嚴重程度列出問題：先列會造成錯誤、資料遺失或回歸的問題，再列測試缺口與可改善項目。

## 專案標準

- 維持純 HTML、CSS、原生 JavaScript，不引入框架、套件或 `package.json`。
- 不使用外部 CDN，功能必須能離線運作。
- JavaScript 使用 `const` / `let`，變數與函式名稱使用英文 camelCase。
- 註解使用繁體中文。
- CSS 顏色集中在 `:root` 的 CSS 變數，不在元件規則中寫死色碼。
- 產生 DOM 內容優先使用 `textContent` 或 `createElement`，避免用 `innerHTML` 組字串。
- 檢查深色模式、篩選、`localStorage`、鍵盤操作與 ARIA 狀態是否仍然正確。

## 回覆格式

- 先列出 findings，依嚴重程度排序。
- 每個 finding 說明檔案、行號、問題、影響與建議修正方向。
- 若沒有發現問題，明確寫出「未發現需要修正的問題」，並列出仍缺少的驗證或測試。
- 最後補充簡短的審查摘要與驗證結果。