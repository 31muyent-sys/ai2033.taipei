# 2033 外送王：全台排行榜（Supabase）

不設定也能玩：成績會存在玩家自己的瀏覽器裡（「排行榜（這台裝置）」）。要讓所有人比同一張榜，接一個免費的 Supabase 專案：

1. 到 <https://supabase.com> 用 GitHub 登入，**New project**（Region 選 Tokyo 或 Singapore；資料庫密碼自己保管）。
2. 左側 **SQL Editor** → New query → 貼上 [`supabase.sql`](supabase.sql) 全部內容 → **Run**。
3. **Project Settings → API**，複製 **Project URL** 和 **anon public** key，填進 [`3d/js/board.js`](../../3d/js/board.js)：
   ```js
   export const BOARD = {
     url: 'https://xxxxxxxx.supabase.co',
     key: 'eyJhbGciOi…',
   };
   ```
4. commit、push，GitHub Pages 更新後，結算畫面的標題會從「排行榜（這台裝置）」變成「全台排行榜」。

## 安全與防作弊

- anon key 是公開金鑰，本來就會出現在網頁裡；資料表開了 RLS 而且沒有任何 policy，瀏覽器**不能直接讀寫**，只能呼叫兩個函式：
  - `race_top(course, limit)`：前 N 名（只回傳名字、時間、日期）
  - `submit_score(...)`：登錄一筆成績
- `submit_score` 會重播這一趟每 0.5 秒的位置：起點要對、時間只能往前、任兩點之間不能比小黃極速（52 m/s）還快、5 個外送點要依序在各自的分段時間送達；不通過就回 `implausible`。
- 同一個連線 15 秒內只能登錄一次（`rate_limited`）；名字只收 A–Z 三個字母，並擋掉一小份不雅字詞（`blocked_initials`，清單在 SQL 與 `board.js` 裡各一份）。
- 前端遊戲終究在玩家手上，會寫程式的人仍有辦法偽造一條「看起來合理」的路線。看到可疑的紀錄，在 SQL Editor 刪掉即可：
  ```sql
  select id, initials, ms, created_at from public.race_scores where course = 'c1' order by ms limit 20;
  delete from public.race_scores where id = 123;
  ```

## 改路線

路線定義在 `3d/js/content.js` 的 `RACE`，伺服器端在 `supabase.sql` 的 `race_course()`；兩邊要一致。改了外送點就把 `id` 換成新的（例如 `c2`），舊榜單會保留在原本的 course 底下。
