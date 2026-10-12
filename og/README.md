# 分享卡服務（`og/`）

外送賽的分享連結要在 Facebook、LINE、Threads、X 上顯示**這一趟的成績**（名字、時間、名次），預覽圖就得在被分享時才產生。GitHub Pages 只能放固定檔案，Supabase 的免費方案又不能回傳網頁，所以這個資料夾是一個小小的 Vercel 專案，只做兩件事：

| 路徑 | 內容 |
|---|---|
| `/r/123` | 第 123 筆登錄成績的分享頁：標題、說明、預覽圖都是這筆成績；真人點開會直接被帶進遊戲（總榜成績還會帶上 `vs=` 挑戰時間） |
| `/r?n=ABC&ms=83450&k=0` | 沒登錄上榜的成績（沒有名次）；`k` = 0 是 5 單全送完，1–5 是第幾單 |
| `/b` | 排行榜分享頁，預覽圖是總榜前三名，點開到 `ai2033.taipei/rank/` |
| `/card?…` | 上面各頁的 1200×630 預覽圖（PNG） |

成績從同一個 Supabase 專案的公開函式 `race_entry()`、`race_boards()` 讀（`tools/leaderboard/supabase.sql`）。預覽圖用 satori 排版、resvg 轉成 PNG，字型是只留卡片用得到的字的 Noto Sans TC（`lib/fonts/`，改了卡片文字要跑 `tools/subset.py`）。

## 部署

目前已部署：Vercel 專案 `ai2033-share`，網址 `https://go.ai2033.taipei`（Gandi DNS 的 `CNAME go → cname.vercel-dns.com.`；`https://ai2033-share.vercel.app` 也一樣能用）。遊戲用的是 `3d/js/board.js` 的 `SHARE`。推到這個分支，Vercel 就會自動重新部署；`.github/workflows/leaderboard-check.yml` 會從外面檢查分享頁和卡片。

要從頭再架一份（約 3 分鐘）：

1. 到 <https://vercel.com> 用 GitHub 登入 → **Add New… → Project** → Import `dAAAb/ai2033.taipei`。
2. **Root Directory** 按 Edit 選 `og`；Framework Preset 選 **Other**；其他保持預設 → **Deploy**。
3. 部署好會拿到網址（例如 `https://ai2033-taipei.vercel.app`）。打開 `網址/r?n=ABC&ms=83450&k=0` 應該會跳進遊戲；把網址填進 `3d/js/board.js` 的 `SHARE`（或交給 Claude），遊戲的分享按鈕就會改用這些分享頁。
4. （選用）自己的網址：Vercel 專案 → Settings → Domains 加上網址（例如 `go.ai2033.taipei`），在 DNS 加一筆指向 `cname.vercel-dns.com.` 的 CNAME，再把 `SHARE` 改成這個網址。

用 [Facebook 分享偵錯工具](https://developers.facebook.com/tools/debug/) 貼上分享連結，可以看到預覽圖，也能強制 Facebook 重新抓取。

## 本機測試

```bash
cd og && npm install
node tools/static-card.mjs run /tmp/card.png   # 單張卡片（kind: run / board / rank / site）
```
