# Cloudflare Workers 部署與預覽

本專案使用 Next.js 靜態輸出。執行 `npm run build` 後，網站檔案會放在 `out` 資料夾，再由 Cloudflare Workers Static Assets 發布。

## Cloudflare 建置設定

| 欄位 | 設定值 |
| --- | --- |
| 專案名稱 | `system-design-learning-game` |
| 組建命令 | `npm run build` |
| 部署命令 | `npx wrangler deploy` |
| 非生產分支的組建 | 開啟 |

專案根目錄的 `wrangler.jsonc` 是部署設定的主要來源。Cloudflare 專案名稱必須與其中的 `name` 相同。

## 分支設定

目前進行畫面驗收時，正式分支暫時設為 `codex/foundation-spike`。這個分支有完整的遊戲功能與 Cloudflare 設定，可以直接產生 `workers.dev` 網址。

Draft PR 合併後，請到 Cloudflare 的 `Settings → Build → Branch control`，把正式分支改回 `main`。

## 畫面驗收交接

建置成功後，從 Cloudflare 的部署紀錄複製公開的 `workers.dev` 網址。驗收至少包含：

- 四個學習關卡能否正確切換；
- 解答、官方文件與電子書頁碼是否完整顯示；
- 架構圖、拖曳、連線與模擬操作；
- 桌面、平板及手機版面；
- 重新整理後的本機狀態；
- 瀏覽器主控台是否出現錯誤。

預覽網站不應放入帳號密碼、API 金鑰或真實使用者資料。
