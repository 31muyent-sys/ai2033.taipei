# 安全說明

## 回報

請透過 GitHub 的 [Report a vulnerability](https://github.com/dAAAb/ai2033.taipei/security/advisories/new) 私下回報。若此功能尚未開啟，請先聯絡專案維護者；公開 issue 只留不含攻擊細節的聯絡請求，勿張貼憑證、個資、可重播的惡意路線或未修補漏洞。

## 權限與範圍

- `sb_publishable_…` 是公開瀏覽器金鑰；`service_role`、`sb_secret_…`、帳號 cookies 與私鑰不可進入 Git、HTML、分享卡或 Actions 日誌。
- 排行榜資料表保持 RLS、無公開 policy，並撤銷匿名／一般登入角色的直接資料表及 sequence 權限。公開介面僅輸出必要成績欄位，不輸出連線來源標記或分段陣列。
- 三個 SECURITY DEFINER RPC 是刻意公開的有限介面；使用空 `search_path`，不可任意加入動態 SQL 或擴大可讀欄位。
- 防作弊屬合理性驗證。用戶端路線仍可能被程式偽造，來源標頭節流也不是身分驗證或完整阻斷服務攻擊防護。
- 網頁、資料庫與分享服務是不同部署。修改 Git 不會自動套用 Supabase SQL。
- `.github/workflows/fetch-*` 改由維護者手動執行，避免提交一般修改時自動下載外部內容並回寫。不要在持有倉庫寫入權杖的工作中執行不明第三方腳本。

## 驗證

`npm test` 以本機隔離 Postgres 驗證正常路線、錯誤型別、時間與權限，也檢查分享連結輸入與來源網址。對公榜只能做有界限的讀取及確定會拒絕的請求；勿用真實資料庫做壓力、破壞或有效成績寫入測試。

`npm audit --prefix og` 檢查分享服務；`npm audit --prefix video --package-lock-only` 檢查離線影片工具。修正 `fflate`、`zod`、`fast-uri` 的鎖定版本後仍需驗證輸出，不能直接執行 `npm audit fix --force`。

檢查不等於零風險保證：原始碼掃描無法證明所有歷史提交、部署環境、服務設定及第三方素材皆無問題。若憑證曾外洩，必須撤銷／輪替；從最新版本刪檔不會消除 Git 歷史。
