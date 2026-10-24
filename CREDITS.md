# 第三方程式、字型、圖資與素材授權

本頁區分程式、資料與媒體的權利範圍。公開 GitHub 倉庫不代表所有內容皆採相同開源授權；本專案不能重新授權他人的照片、音樂、字型、商標或人物肖像。

## 本專案原創程式與文件：MIT

本專案的原創程式碼與原創技術文件採 [MIT License](LICENSE)，著作權聲明為 © 2026 Ju-Chun Ko and contributors。此範圍包含網站、3D 體驗、分享卡服務、影片製作的原創程式及維護工具；使用、修改與散布時須保留著作權聲明與授權全文。

根目錄 `LICENSE` 不適用於下列內容：

- 第三方程式與套件（包括 `vendor/three/` 及 npm 依賴）：保留並遵守各自授權，不能以本專案的 MIT 聲明取代。
- 外部引用文字、照片、圖資、字型、音樂、音效、旁白、影片、渲染圖及其他媒體素材：依本頁、各素材署名檔與來源所列授權或權利人許可使用；未另行標示授權者，不因倉庫公開而取得使用許可。
- 名稱、標誌、商標、人物肖像與聲音：本專案的 MIT 授權不授予這些權利，也不表示相關人物或組織為衍生作品背書。

各 `package.json` 的 `license: "MIT"` 僅描述該套件的原創程式與技術文件，不會變更套件依賴或媒體素材的授權。

## 程式與工具

| 元件 | 使用位置／用途 | 授權與來源 |
|---|---|---|
| three.js 0.160.0（r160）與 addons | `vendor/three/`，3D 網頁 | MIT；保留 [原始授權全文](vendor/three/LICENSE)；[上游 r160](https://github.com/mrdoob/three.js/tree/r160) |
| satori 0.33.5 | `og/` 分享卡排版 | MPL-2.0；[上游](https://github.com/vercel/satori) |
| @resvg/resvg-js 2.6.2 | `og/` SVG 轉 PNG | MPL-2.0；[上游](https://github.com/yisibl/resvg-js/tree/v2.6.2) |
| React／React DOM | `video/` 影片製作 | MIT；[上游](https://github.com/facebook/react) |
| Remotion 4.0.484 與 @remotion 套件 | `video/` 影片製作，並非網站執行時依賴 | [Remotion License](https://github.com/remotion-dev/remotion/blob/v4.0.484/LICENSE.md)；依使用者／組織資格適用免費或公司授權，不能視為 MIT／無條件開源授權 |
| TypeScript | 影片工具的型別檢查 | Apache-2.0；[上游](https://github.com/microsoft/TypeScript) |
| PGlite | 根目錄 `npm test` 的隔離 Postgres 測試 | Apache-2.0；[上游](https://github.com/electric-sql/pglite)；僅供測試 |

**所有鎖定 npm 套件與間接依賴**見 [DEPENDENCIES.md](DEPENDENCIES.md)，包含 fflate、harfbuzzjs、opentype.js、Yoga、Mediabunny、Fontsource 等。`og/` 及 `video/` 以 `npm ci` 安裝，未將 node_modules 複製到倉庫。MPL 元件若被修改或再散布，須依該版本授權提供對應來源；不能刪除其著作權聲明。

資料與素材建置腳本另外引用下列工具；它們未隨網站散布，也未全部鎖定版本。重新建置時應保留所用版本及授權紀錄：

| 工具 | 用途 | 上游授權 |
|---|---|---|
| [Playwright](https://github.com/microsoft/playwright) | 截圖與錄製 | Apache-2.0 |
| [PptxGenJS](https://github.com/gitbrent/PptxGenJS)、[JSZip](https://github.com/Stuk/jszip) | 產生簡報 | MIT；JSZip 可選 MIT 或 GPL-3.0 |
| [Shapely](https://github.com/shapely/shapely)、[Pillow](https://github.com/python-pillow/Pillow) | 圖資與影像建置 | BSD-3-Clause；HPND（Pillow） |
| [Requests](https://github.com/psf/requests)、[Trafilatura](https://github.com/adbar/trafilatura) | 資料來源擷取 | Apache-2.0 |
| [faster-whisper](https://github.com/SYSTRAN/faster-whisper)、[Whisper](https://github.com/openai/whisper) | 影音轉寫 | MIT；模型及相依元件另依上游條款 |
| [OpenCC](https://github.com/BYVoid/OpenCC)、[opencc-python-reimplemented](https://github.com/yichen0831/opencc-python) | 繁體轉換 | Apache-2.0 |
| [yt-dlp](https://github.com/yt-dlp/yt-dlp) | 維護者取得有權使用的影音 | Unlicense（核心）；下載與使用素材仍須有合法權源 |
| [osmium-tool](https://github.com/osmcode/osmium-tool) | 圖資擷取 | GPL-3.0-or-later（工具本身） |
| [LibreOffice](https://www.libreoffice.org/about-us/licenses/)、[FFmpeg](https://ffmpeg.org/legal.html) | 簡報／影音轉檔 | MPL-2.0 等；FFmpeg 依實際編譯選項為 LGPL／GPL，重新散布執行檔時另行確認 |
| [fontTools](https://github.com/fonttools/fonttools) | 字型子集化 | MIT |

`tools/build/deck.js` 的 `APPLY_THEME` 是原製作環境另外提供的輔助程式，未附在本倉庫；取得其來源與使用權之前，不能宣稱簡報可完全重現建置。

## 字型

- **Noto Sans TC**：SIL Open Font License 1.1。網頁使用 Google Fonts；`og/lib/fonts/` 為以 `og/tools/subset.py` 製作的字型子集，保留 [OFL 全文與修改說明](og/lib/fonts/OFL.txt)。
- **JetBrains Mono**：SIL Open Font License 1.1，透過 `@fontsource/jetbrains-mono` 用於影片。見 [上游授權](https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt)。
- 系統字型（如微軟正黑體、蘋方）只列於字型備援設定，沒有將字型檔打包散布。

## OpenStreetMap 圖資

© OpenStreetMap contributors，採 [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/)；[署名說明](https://www.openstreetmap.org/copyright)。來源為 Geofabrik 臺灣擷取資料。

`3d/data/city.json` 為簡化、縮放後的衍生資料庫，仍以 ODbL 1.0 提供；見 [資料聲明](3d/data/NOTICE.md) 與 [`tools/build/build_city.py`](tools/build/build_city.py)。2033 園區是本專案的概念配置，不是 OSM 已存在建物，也不是官方設計圖。遊戲、網站圖像、分享卡及影片使用地圖衍生成果時應保留 OSM 署名。

## 照片與人物

14 張照片的檔名、作者、來源頁面、授權與裁切資訊見 [`assets/photos/credits.json`](assets/photos/credits.json) 及[網站逐張署名](https://ai2033.taipei/#sources)。

- Solomon203：CC BY-SA 4.0。
- 曾 成訓：CC BY 2.0。
- 毛貓大少爺、ynes95：CC BY-SA 2.0。
- Lord Koxinga：CC BY-SA 3.0。
- 其餘政府來源照片依各 Commons 原始頁的姓名標示條件；不可一律標成 CC 或 MIT。
- `chiang-podium.jpg` 的 Commons 頁未標出作者，來源為立法院；「來源機關」不能當成已查證的攝影者姓名。

縮圖／裁切不移除原有授權義務；CC BY-SA 素材的改作仍須依相容的相同方式分享條款。照片日期、情境以來源頁為準，既有活動照片不應誤稱為 2026/10/08 記者會現場照。授權不代表人物、機關或攝影者為本站背書。

## 文字與影片

- 市府新聞稿依[臺北市政府網站資料開放宣告](https://www.gov.taipei/News_Content.aspx?n=10FDEA7683714512&s=3B6C92FD22C01611&sms=AA987E1C50412097)保留出處；特別限制及第三方內容另論。
- `transcript/` 現有內容是**新聞稿全文及答問摘要**，尚非現場錄音的完整逐字聽打。
- 媒體與維基百科只保留[來源索引](research/pages/index.json)，新版不再隨倉庫提供全文拷貝。引用、改寫與重新散布仍須各自確認權利，署名不等於授權。
- 影片曾使用的 Mixkit 音樂／音效屬特定素材授權，**不是開源或公眾領域**。新版不再附獨立音效原檔；製作者應自行依授權取得。詳見[影音素材說明](video/public/sfx/ATTRIBUTION.md)。
- ElevenLabs 旁白及人物聲音依權利人同意與服務條款使用；原創程式授權不授予複製或合成特定人物聲音的權利。
- `video/` 的鏡頭構想參考 [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)，不因此取得其素材或程式的重新授權權利。

## 程式來源與貢獻規則

本專案由專案擁有者與 AI 工具協作。AI 產生內容仍須檢查來源與授權，不能以 AI 生成作為無侵權保證。2026/10/24 對 `vendor/three/` 的 15 個檔案比對 npm `three@0.160.0`，內容完全一致，原作者與 MIT 聲明保留。

貢獻時請說明外部程式／素材的 URL、版本或日期、授權及修改範圍；不要把未取得授權的程式或素材貼入。臺灣使用者介面採繁體中文與臺灣常用詞，專有名詞、原始引文、作者署名和第三方授權原文不以轉換工具任意改寫。`GTA` 僅是早期構想的玩法參照，本專案未獲 Rockstar Games 授權，也未使用其遊戲素材。
