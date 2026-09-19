# 待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App，透過逐步實作，建立一個支援主題切換、待辦管理與篩選功能的前端應用程式。

## 線上展示

[GitHub Pages](https://<你的帳號>.github.io/<你的repo名稱>/)

> 請將網址中的 `<你的帳號>` 與 `<你的repo名稱>` 替換成實際的 GitHub 帳號與 repository 名稱。

## 功能

- 新增待辦事項。
- 勾選待辦事項為完成或未完成。
- 刪除單筆待辦事項。
- 顯示所有待辦中的未完成項目數量。
- 使用 `localStorage` 保存待辦資料，重新整理後仍可保留。
- 在淺色模式與深色模式之間切換。
- 使用 `localStorage` 記住使用者的主題偏好。
- 使用者未手動設定主題時，跟隨作業系統的深淺色設定。
- 依「全部」、「未完成」與「已完成」篩選待辦事項。
- 篩選結果為空時，顯示對應的提示文字。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript。
- 不使用任何前端框架或第三方套件。
- 不依賴外部 CDN，可離線運作。
- 使用 CSS 變數集中管理介面色彩與主題配色。
- 使用瀏覽器的 `localStorage` 保存待辦資料與主題偏好。

## 開發方式

- 使用 GitHub Copilot Agent Mode，依照需求逐步建立與修改待辦清單 App。
- 透過 MCP 整合 Microsoft Learn 文件與 GitHub repository 資訊，協助查詢官方建議與 issue。
- 使用 `.github/prompts` 中的 agentic workflow，依照固定流程讀取 issue、提出修改計畫、建立分支、修正問題、驗證並建立 Pull Request。
- 透過 Git 與 GitHub 管理版本、分支與變更紀錄。

## 我學到什麼

- 如何使用 GitHub Copilot Agent Mode 將需求轉換成可執行的前端修改。
- 如何使用 MCP 查詢 Microsoft Learn 官方文件與 GitHub issue。
- 如何透過 CSS 變數與 `prefers-color-scheme` 實作深色模式。
- 如何使用 `localStorage` 保存瀏覽器端的應用程式狀態。
- 如何設計可重複使用的 agentic workflow，並透過 Pull Request 管理修正流程。
