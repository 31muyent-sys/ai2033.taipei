# 製作紀錄：106 分鐘，從幾句 prompt 到一座可以開車的 3D 臺北

2026 年 10 月 9 日下午 **2:20**，葛如鈞（**dAAAb**）送出需求；下午 **4:06**，網站初版完成。中間隔了 **1 小時 46 分，106 分鐘**。

這是 [ai2033.taipei](https://ai2033.taipei/) 的起點：把一場記者會的內容，做成大字網站、文字整理、簡報，以及一座能開著小黃探索的 3D 臺北。初期開發由 dAAAb 與 **Claude Opus 5.5** 協作；後續的公開發布檢查、資安補強、MIT 授權與本篇紀錄，再由 **Codex** 協作整理。

**106 分鐘指初版完成。** 晚間才提交自訂網域設定，介紹影片、外送賽、公開排行榜與安全補強也都是後續迭代。這份紀錄把這些階段分開，留下能核對的時間、程式與製作過程。

![2026 松山機場與 2033 臺北 AI 園區的 3D 概念對比](screenshots/3d-2026-vs-2033.jpg)

*3D 園區為依公開資料製作的概念示意，非正式設計圖。底圖資料 © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)。*

## 起點：有人想找逐字稿，於是多做了一座城市

最初的需求來自網友：哪裡能看到演講的完整文字？能不能整理成簡報，讓沒時間看完整場影片的人也看得懂？

dAAAb 想起先前看過的「GTA 台北」互動作品，也想到 AI 製作 3D 網頁的能力。既然可以整理文字、畫圖、做簡報，能不能再往前一步，讓人直接走進未來的城市？於是，同一份需求裡加上了 three.js、開車探索，以及松山機場轉變為園區的體驗。

網站裡，玩家從敦化北路開向機場，再按下時光機，讓跑道逐漸退場、園區與公園長出來。面積、路線與距離，開始成為可以親自感受的空間。

這個過程也呼應 dAAAb 的觀察：新科技出現後，人往往需要一段時間，才會想到它還能用在哪裡。連「原來這件事可以交給 AI 做」的念頭，都需要透過使用、感受與發想，慢慢長出來。

[![開車、啟動時光機、探索園區與夜景的示範動圖](demo.gif)](demo.mp4)

*點圖播放[示範影片](demo.mp4)。地圖資料 © OpenStreetMap contributors；影片呈現的是遊戲中的概念場景。*

## 數字

以下程式與資料統計固定在 **2026/10/24、提交 [`cf13de6`](https://github.com/dAAAb/ai2033.taipei/commit/cf13de697fd35e5623c35e5c527550555518ce66)**，不包含新增本篇文件的提交。起訖時間由 dAAAb 提供；其餘數字取自 Git 歷史、資料檔與驗證紀錄。

| 項目 | 數字與範圍 |
|---|---|
| 從下 prompt 到初版完成 | **106 分鐘**：10/9 14:20 → 16:06，臺灣時間 |
| 第一筆 Git 提交 | 10/9 **14:27:08**，建立資料抓取工作流程 |
| 主站與真實圖資 3D 場景提交 | 10/9 **15:10:37** |
| 16 頁簡報提交 | 10/9 **15:16:40**，含 PPTX、PDF 與講者備註 |
| 自訂網域設定提交 | 10/9 **20:20:12**，與初版完成時間分開計算 |
| Git 提交 | **69 筆**；含自動抓取資料及截圖提交，不等於 69 輪人機對話 |
| 程式與網頁檔 | **59 個檔案、7,826 行**；含測試與產出的 HTML，排除 `vendor/`、資料 JSON、鎖定檔及媒體，算法見文末 |
| 3D 城市中的既有建築資料 | **60,000 筆建築輪廓／高度紀錄**；部分高度以樓層或建築類型估算，非逐棟實測模型 |
| 道路資料 | **13,147 筆道路幾何紀錄**，不是 13,147 條不同路名 |
| 園區示意場景 | **59 筆塔樓、83 筆住宅量體、6,150 筆樹木資料**；屬程式生成的場景物件，不是規劃核定數量 |
| 外送挑戰 | **5 單**：鮮奶、雞腿便當、珍珠奶茶、鳳梨酥、鹹酥雞 |
| 排行榜 | **6 張**：總榜與 5 張任務榜；不用先玩也能看 |
| 介紹影片專案 | **2 種比例**：直式 1080 × 1920、橫式 1920 × 1080 |
| 10/24 安全回歸驗證 | **28 項測試通過**；測試資料庫隔離，不寫入公開排行榜 |

### 花了多少 AI 算力與費用？

目前沒有可供本篇核對的完整模型用量、工具呼叫紀錄與帳單，因此 **token 數、模型呼叫次數、AI 實際執行工時及費用未統計**。106 分鐘是從送出需求到初版完成的經過時間，不能直接換算成模型工時或 API 費用。

Git 提交的共同作者欄可核對初期使用 Claude Opus 5.5；它不包含每次推論的 token 或收費資訊。網站、資料庫、分享卡服務、網域與影音製作也各有自己的服務與成本，應依實際帳單記錄。

## 時間軸（臺灣時間，UTC+8）

除了 14:20／16:06 由 dAAAb 提供，下表時間均依 Git 的作者時間換算。**提交時間表示該版本已寫入歷史，不等同精確部署完成時間，也不能推算期間一直在運算。**

| 時間 | 發生什麼事 | 可核對紀錄 |
|---|---|---|
| 10/9 14:20 | dAAAb 送出需求：文字整理、PPT／PDF、大字互動網站，加上能體驗松機轉型的 3D 臺北 | dAAAb 提供的起始時間；需求保存於下方 |
| 14:27 | 第一筆提交：建立照片、圖資、資料來源與影音處理的工作流程 | [`e94e5b7`](https://github.com/dAAAb/ai2033.taipei/commit/e94e5b7) |
| 14:45–14:56 | 建立 3D 引擎；圖資取得加入 Geofabrik 擷取資料與 osmium 處理流程 | [`7180ddd`](https://github.com/dAAAb/ai2033.taipei/commit/7180ddd)、[`816d832`](https://github.com/dAAAb/ai2033.taipei/commit/816d832) |
| 15:10 | 真實 OSM 街廓的 3D 臺北、主站、文字頁與渲染圖一起提交 | [`0a2a730`](https://github.com/dAAAb/ai2033.taipei/commit/0a2a730) |
| 15:16 | 16 頁 PPTX／PDF 簡報，附渲染圖、圖表與講者備註 | [`f3fdbad`](https://github.com/dAAAb/ai2033.taipei/commit/f3fdbad) |
| 16:05–16:06 | 修正小黃出生位置與小地圖方向；dAAAb 記錄的初版完成時間為 16:06 | [`9c7a574`](https://github.com/dAAAb/ai2033.taipei/commit/9c7a574)（16:05:55）＋ dAAAb 提供時間 |
| 16:38–16:42 | 修正標籤晃動、地面閃爍、車輪顯示與簡報照片變形；瀏覽器測試實際按鍵開車 | [`b794108`](https://github.com/dAAAb/ai2033.taipei/commit/b794108)、[`77d6915`](https://github.com/dAAAb/ai2033.taipei/commit/77d6915) |
| 17:35 | 建立主站、3D 與文字頁的 Claude Artifacts 版本 | [`8ffc00f`](https://github.com/dAAAb/ai2033.taipei/commit/8ffc00f) |
| 19:57 | 修正切到 2033 時畫面出現大片黑方塊的問題；加入簡報檢視版本 | [`a60ad2a`](https://github.com/dAAAb/ai2033.taipei/commit/a60ad2a) |
| 20:20–20:22 | 設定 GitHub Pages 使用 `ai2033.taipei`，README 改以此網址為主 | [`5e94f3a`](https://github.com/dAAAb/ai2033.taipei/commit/5e94f3a)、[`dcb92ef`](https://github.com/dAAAb/ai2033.taipei/commit/dcb92ef) |
| 22:36 | 小黃起點改到離航廈約 500 公尺，縮短進入體驗的等待 | [`a9bad18`](https://github.com/dAAAb/ai2033.taipei/commit/a9bad18) |
| 10/10 13:51–14:36 | 統一網站入口，修正小地圖比例，加入逐格錄影、截圖與 README 示範素材 | [`deb92b7`](https://github.com/dAAAb/ai2033.taipei/commit/deb92b7)、[`237a3d9`](https://github.com/dAAAb/ai2033.taipei/commit/237a3d9) |
| 14:43–20:07 | 建立介紹影片旁白與 Remotion 專案，將字幕對齊語音；擴充直式、橫式輸出與無遊戲字幕的錄影素材 | [`3e47469`](https://github.com/dAAAb/ai2033.taipei/commit/3e47469)、[`4e158d1`](https://github.com/dAAAb/ai2033.taipei/commit/4e158d1)、[`36cab06`](https://github.com/dAAAb/ai2033.taipei/commit/36cab06) |
| 10/11 19:26–23:55 | 加入「2033 外送王」、每單任務榜、Supabase 公榜，以及三段加速與漫畫速度線 | [`dfa7bc8`](https://github.com/dAAAb/ai2033.taipei/commit/dfa7bc8)、[`5e13207`](https://github.com/dAAAb/ai2033.taipei/commit/5e13207)、[`11c4a1c`](https://github.com/dAAAb/ai2033.taipei/commit/11c4a1c) |
| 10/12 11:55–23:02 | 獨立排行榜頁、每筆成績分享卡、行道樹與車速調整；修正分享卡部署缺漏的字型處理檔案，設定 `go.ai2033.taipei` | [`f0d66b5`](https://github.com/dAAAb/ai2033.taipei/commit/f0d66b5)、[`1539b7b`](https://github.com/dAAAb/ai2033.taipei/commit/1539b7b)、[`c9b2b73`](https://github.com/dAAAb/ai2033.taipei/commit/c9b2b73) |
| 10/23 16:32 | 修正手機油門、煞車與加速操作；載入畫面、遊戲工具列及主站都能看榜；處理重複登錄 | [`96237e8`](https://github.com/dAAAb/ai2033.taipei/commit/96237e8) |
| 10/24 19:15 | Codex 協作補強輸入驗證與資料權限、分享卡來源、依賴版本、素材授權、隱私與安全文件 | [`8ecb1fb`](https://github.com/dAAAb/ai2033.taipei/commit/8ecb1fb) |
| 19:54 | dAAAb 確認採 MIT；加入原創程式與技術文件授權，明列第三方與媒體素材的適用範圍 | [`cf13de6`](https://github.com/dAAAb/ai2033.taipei/commit/cf13de6) |

## 最初的需求（專案中保存的版本）

以下取自 [`video/src/content.ts`](../video/src/content.ts) 的 `PROMPT` 常數，保留當時用字與網址。這是先前製作介紹影片時保存的需求版本，並非本篇重新撰寫的提示詞。

```text
可否製作逐字稿
以及 PPT PDF 和 清晰字大的互動式網站
都給我公開連結
感謝：
AI黃金世紀，
從臺北開始！！
大台北
= 亞洲新矽谷
蔣萬安 + 李四川
= 大台北新矽谷
https://youtu.be/ircGbXWHRbQ?si=gRi8lFJCsbfnrr47
可以使用 three js 做台北的 3D 模擬
點進去可以有一個類似 台北 GTA (你上網查）的沈浸式互動頁面 可以體驗 松機變成 台北 AI 園區 和110公頃綠地的感覺
根據這個發表會和網路上的官方訊息
製作超級厲害的網頁介紹
要穿插蔣萬安市長的照片
謝謝
```

原始需求中的「逐字稿」是當時希望完成的內容。目前公開的文字頁以**市府新聞稿與媒體答問重點整理**為主，已正名為「記者會文字整理」；不能把它當成逐字聽打完成的完整演講稿。

## 幾句需求，怎麼變成可操作的網站

### 1. 讓資料長成城市

[`tools/build/build_city.py`](../tools/build/build_city.py) 把 OpenStreetMap 的建築輪廓、道路、河川等資料，轉成瀏覽器可讀取的精簡 [`city.json`](../3d/data/city.json)。建築有高度資料就使用高度，有樓層就換算；缺少兩者時，以建築類型產生估計值。因此，使用者能認出街廓與地標，但不應把每棟樓的高度當成測量結果。

未來園區則依公開文字繪製示意配置，再用程式生成建築、樹木與步道。**3D 場景是用來體會構想的模型**；畫面上的量體、位置與樹木數量，都不代表正式都市計畫。

### 2. 用瀏覽器完成探索與對比

網站主體使用 HTML、CSS 與 JavaScript，3D 場景使用 three.js r160。重複的建築與樹木使用批次繪製，窗光由 shader 產生，並依裝置調整畫質。使用者可以開車、空拍、切換日夜，也能在同一個視角切換 2026 與 2033。

一次整理的內容，也成為不同入口：想快速理解的人看大字網站，想查內容的人搜尋文字，想介紹給別人的人下載簡報，想感受空間的人進入 3D。

| 部分 | 實作與用途 | 專案位置 |
|---|---|---|
| 主站、文字頁、簡報頁 | 靜態網頁，部署於 GitHub Pages | [`index.html`](../index.html)、[`transcript/`](../transcript/)、[`slides/`](../slides/) |
| 3D 臺北 | three.js、OSM 街廓、時光機、開車與任務 | [`3d/`](../3d/) |
| 公開排行榜 | Supabase 儲存成績，限定函式提供讀取與登錄 | [`tools/leaderboard/`](../tools/leaderboard/) |
| 動態分享卡 | Vercel 上的服務，以 satori 排版、resvg 轉圖 | [`og/`](../og/) |
| 介紹影片 | Remotion 組合場景、字幕與影音；旁白設定記錄使用 ElevenLabs v4 | [`video/`](../video/) |
| 截圖、示範與簡報產生 | 瀏覽器自動化、逐格錄影、PPTX／PDF 產製 | [`tools/build/`](../tools/build/) |

### 3. 人看到黑方塊，AI 追到零厚度的屋頂

在切換到未來的動畫裡，部分新建築從高度零開始長出來。屋頂的縮放也一度變成零，使 three.js 的法向量計算產生無效數值；光暈效果再把異常像素擴大成黑色方塊。

這個問題的線索是實際看到的畫面。修正把成長中的物件保留最小厚度，並限制送入光暈處理的數值範圍；[提交內容](https://github.com/dAAAb/ai2033.taipei/commit/a60ad2a) 留下了原因與修改。

```js
// 屋頂成長動畫的高度縮放，避免直接使用 0。
Math.max(0.01, k)
```

![切換未來時曾出現的黑色方塊](../video/public/img/bug-before.png)

*專案保存的錯誤畫面。地圖資料 © OpenStreetMap contributors。*

初版完成後，仍有標籤、觸控、地面閃爍與部署環境等問題需要迭代。人實際操作、指出感受與異常，AI 再讀程式、找原因、修改並驗證，是這個專案持續前進的方式。

### 4. 從自由探索，長出外送賽與分享卡

「2033 外送王」讓探索多了一個明確目標：把五份臺灣日常食物送到園區不同位置。每單都有自己的榜，完整一趟另有總榜；公開排行榜也讓沒有進遊戲的人看得到結果。

分享需求則帶出了另一個技術問題：每筆成績都需要不同的預覽圖。專案因此把動態分享頁與圖片放到獨立服務，從同一份排行榜資料產生名字、時間與名次，再將點開連結的使用者帶回網站。

這些功能出現在 10/11 以後。初版的 106 分鐘，沒有包含後來所有玩法與服務。

## 人和 AI 怎麼分工

| 角色 | 負責的事情 |
|---|---|
| **葛如鈞／dAAAb** | 提出使用情境與點子，把網友的文字需求延伸為 3D 體驗；看成果、實際試用、提供回饋，決定語氣與方向；要求檢查公開內容、資安、繁體中文與授權，並確認原創程式採 MIT。 |
| **Claude Opus 5.5** | 初期網站與後續遊戲迭代：資料處理、程式與 3D 場景、簡報、截圖與錄影工具、介紹影片專案、排行榜與分享卡服務。可從相關提交的共同作者欄核對模型標示。 |
| **Codex** | 10/24 的公開發布檢查與修正：輸入驗證、資料權限、分享卡來源與依賴檢查、素材與授權清單、隱私文件、MIT 授權落實，以及這份依證據整理的製作紀錄。 |

AI 能產出程式與素材處理流程；哪些內容適合公開、授權如何選擇、體驗是否容易理解，仍需要專案擁有者判斷。第三方資料與工具也各有作者與使用條件，完整來源列於 [CREDITS.md](../CREDITS.md) 與 [DEPENDENCIES.md](../DEPENDENCIES.md)。

## 從能跑，到可以公開維護

網站半公開後，工作進入另一個階段：確認資料與素材的來源、把成績登錄的輸入驗證補完整、限制資料庫權限，並讓使用者知道服務如何處理資料。

10/24 的修正加入 28 項安全回歸測試，補上分享卡的 OpenStreetMap 署名與依賴清單；新版移除新聞／維基文章全文、獨立音效原檔等不應直接當作專案原創內容散布的檔案。原創程式碼與原創技術文件採 [MIT](../LICENSE)，第三方程式、圖資、照片、字型、影音與人物相關權利仍各自處理。

**在本篇紀錄截點，這批修正整理於[草稿 PR #10](https://github.com/dAAAb/ai2033.taipei/pull/10)，尚未合併。** 資料庫補強已另行套用；網站與分享服務的程式修改仍須經各自發布流程。最新版本刪除素材，也不會自動清除 Git 舊歷史。

本站仍是非官方的概念體驗。正式內容以市府公告為準；安全測試代表已驗證列出的情境，前端遊戲排行榜也有其防作弊限制。相關說明見 [SECURITY.md](../SECURITY.md) 與[隱私頁](../privacy/index.html)。

## 紀錄來源與統計方法

- **106 分鐘**：dAAAb 在本次專案對話提供「10/9 下午 2:20 下 prompt、下午 4:06 網站就做好了」。[`video/narration.json`](../video/narration.json) 也保存這兩個時間；本篇將其標示為初版完成，不據此斷言自訂網域當時已可連線。
- **原始需求**：[`video/src/content.ts`](../video/src/content.ts) 的 `PROMPT`；完整人機對話未隨本篇公開，因此不宣稱已統計每輪訊息、助手或工具操作。
- **時間軸與模型標示**：Git 提交的作者時間、訊息、差異與共同作者欄。統一換算為 `Asia/Taipei`；時間軸選列里程碑，並非完整操作日誌。
- **場景與任務數字**：[`3d/data/city.json`](../3d/data/city.json)、[`3d/js/content.js`](../3d/js/content.js)、[`tools/leaderboard/README.md`](../tools/leaderboard/README.md)。
- **驗證結果**：10/24 的檢查紀錄及 [PR #10](https://github.com/dAAAb/ai2033.taipei/pull/10)。套件風險會隨時間變化，本篇不把當日檢查當成永久保證。
- **編排參考**：[encore.taipei 的製作紀錄](https://github.com/dAAAb/encore-taipei/blob/main/docs/MAKING-OF.md)。沿用數字、時間軸、原始需求與分工的紀錄方式，內容與統計另依本專案核對。

要重算本篇的提交數、程式行數與場景資料，在具有完整歷史的本機倉庫執行以下指令。程式行數採固定副檔名範圍，包含空行、註解、測試與產出的 HTML；不代表 AI 獨立創作的有效行數，也不拿來推算工時。

```bash
python3 - <<'PY'
import json
import subprocess
from pathlib import PurePosixPath

ref = 'cf13de697fd35e5623c35e5c527550555518ce66'
def git(*args):
    return subprocess.check_output(['git', *args]).decode('utf-8')

extensions = {'.js', '.mjs', '.ts', '.tsx', '.py', '.sh', '.sql', '.html', '.css'}
paths = git('ls-tree', '-r', '--name-only', ref).splitlines()
code = [p for p in paths if PurePosixPath(p).suffix in extensions
        and not p.startswith('vendor/')]
lines = sum(len(git('show', f'{ref}:{p}').splitlines()) for p in code)
city = json.loads(git('show', f'{ref}:3d/data/city.json'))
print('commits:', git('rev-list', '--count', ref).strip())
print('code files:', len(code), 'lines:', lines)
print('buildings:', len(city['buildings']['h']))
print('road records:', len(city['roads']['k']))
print('future objects:', {k: len(city['future'][k])
                          for k in ('towers', 'homes', 'trees')})
PY
```
