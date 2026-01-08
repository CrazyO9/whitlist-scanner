# Whitelist Scanner

一個以 **實務工作流為核心** 設計的本地桌面掃描工具，目標是：

> **快速判斷商品是否在白名單中，並留下可追蹤、可匯出的掃描紀錄。**

本專案使用 **React + Tauri (Rust)** 打造，強調：

* 清楚的責任分工
* 可維護的狀態管理
* 不為了方便而犧牲結構

---

## 🎯 設計目標（Why）

在實際工作場景中，掃描類工具常遇到以下問題：

1. UI 與系統能力混雜，導致維護困難
2. 設定狀態分散，重開即失效
3. 匯出、路徑、平台差異處理不一致
4. 功能完成了，但「為什麼這樣設計」說不清楚

**Whitelist Scanner 的目標不是只把功能做出來，而是讓設計決策本身是可說明的。**

---

## 🧱 整體架構概覽

```
UI (React)
 ├─ components      → 純顯示 / 使用者互動
 ├─ hooks           → 行為與狀態邏輯
 ├─ context         → 全域設定（Preferences）
 └─ styles          → 主題與視覺規則

System (Rust / Tauri)
 ├─ import / export → 檔案處理
 ├─ open_path       → 作業系統行為
 └─ commands        → 被 UI 呼叫的系統能力
```

### 核心原則

> **UI 發出「意圖」，Rust 負責「系統行為」**

React 不處理平台差異；
Rust 不介入 UI 狀態。

---

## 🧠 關鍵設計決策說明

### 1️⃣ 為什麼使用 Tauri 而不是純 Web？

* 需要直接操作本地檔案（CSV / XLSX）
* 需要開啟系統資料夾（Explorer / Finder）
* 希望效能與發佈體積可控

👉 Tauri 提供 **最小 Rust 系統層 + Web UI 的彈性**。

---

### 2️⃣ 為什麼路徑由前端取得？（Tauri v2）

在 Tauri v2 中：

* 路徑 API 偏向前端（`@tauri-apps/api/path`）
* Rust 不再直接提供 `document_dir()` 等 API

因此本專案採用：

> **前端取得路徑 → Rust 接收並執行 reveal 行為**

這樣的好處是：

* 路徑來源單一
* Rust command 可重用
* 不綁死資料夾結構

---

### 3️⃣ 為什麼設定（Preferences）用 Context？

設定項目包含：

* 音效開關（通過 / 不通過）
* 主題模式（白天 / 黑夜）
* 行為型設定（開啟匯出資料夾）

這些設定：

* 與 Scan / Whitelist 無直接資料關係
* 需要跨多個元件共用

👉 使用 **PreferencesContext + Provider**：

* 避免 prop drilling
* 所有設定集中管理
* 可自然擴充新設定

---

### 4️⃣ 為什麼音效不寫在 useScanner？

掃描流程中會產生「結果」，但：

* 是否播放音效是「偏好」
* 播放什麼音效是「呈現層」

因此：

* `useScanner`：只產生 `lastScanResult`
* `useScanSound`：根據結果 + 偏好決定是否播放

👉 **避免業務邏輯與呈現副作用耦合。**

---

### 5️⃣ 為什麼 Modal 要提升到 App 層？

Settings Panel 涉及：

* 全域設定
* 全畫面遮罩
* ESC / 點擊背景關閉

若綁在 ScanPanel：

* z-index 複雜
* 主題切換範圍受限

👉 **Modal 提升至 App 層，確保：**

* 覆蓋整個應用
* 不干擾既有版型
* 行為一致

---

## 🎨 主題系統（Theme）

* 使用 CSS Variables 定義語意色彩（`--bg-main`, `--text-main`）
* 以 `.theme-light / .theme-dark` 切換整體風格
* 不在 component 內寫死顏色

👉 主題是「系統層能力」，不是單一元件特效。

---

## 📦 匯出與資料夾開啟策略

* Rust 提供 `reveal_in_folder`：單一、可重用
* 匯出資料夾若不存在，由 Rust 自動建立
* UI 不假設檔案結構存在

👉 **避免第一次使用就噴錯。**

---

## 📌 結語

Whitelist Scanner 並不是一個追求炫技的專案，
而是一個刻意練習以下能力的成果：

* 清楚說明「為什麼這樣設計」
* 把功能收在正確的層級
* 為未來維護留下空間

如果你正在閱讀這份 README，
代表這個專案的目標已經達成一半。

另一半，來自實際使用與持續修正。
