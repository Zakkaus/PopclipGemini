# Vertex AI Setup Guide · 設定指南

> English | [繁體中文](#繁體中文)

---

## English

### Step 1: Create a Google Cloud Project

> Skip if you already have a project.

1. Go to [Google Cloud Console](https://console.cloud.google.com/projectcreate)
2. Enter a **project name** and click **Create**

---

### Step 2: Enable Vertex AI API

1. Open the [Vertex AI API page](https://console.cloud.google.com/apis/library/aiplatform.googleapis.com)
2. Make sure your project is selected in the top-left
3. Click **Enable**

---

### Step 3: Create a Service Account

1. Go to [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click **+ Create Service Account**
3. Enter a name (e.g. `vertex-popclip`) and click **Create and Continue**
4. Under "Grant this service account access", select role:

   **Vertex AI → Vertex AI User**

5. Click **Done**

---

### Step 4: Download JSON Key

1. Click your new service account in the list
2. Go to the **Keys** tab
3. Click **Add Key → Create New Key → JSON**, then **Create**
4. The JSON file downloads automatically — **keep it safe, never share it**

---

### Step 5: Configure the Extension

After installing `gemini-ask.popclipext` or `gemini-translate.popclipext`:

1. Open extension settings in PopClip
2. Paste the **entire contents** of your JSON key file into the **Config** field:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "vertex-popclip@your-project.iam.gserviceaccount.com",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

3. Set **Backend** to `vertex-ai`
4. Set **Vertex AI Location** to `global` (required for `gemini-3.1-*` models)

---

### FAQ

**Q: What location should I use?**
- `global` — for `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite-preview`, `gemini-3-pro-preview`
- `us-central1` — for older `gemini-2.0-flash-001` etc.
- `asia-east1` — East Asia region

**Q: Getting 403 / Permission Denied?**
Ensure the service account has the **Vertex AI User** role and the Vertex AI API is enabled.

<br>

---

## 繁體中文 <a name="繁體中文"></a>

> [English](#english) | 繁體中文

### 步驟一：建立 Google Cloud 專案

> 已有專案可跳過此步驟。

1. 前往 [Google Cloud Console](https://console.cloud.google.com/projectcreate)
2. 填寫**專案名稱**，點擊**建立**
3. 等待專案建立完成

---

### 步驟二：啟用 Vertex AI API

1. 前往 [Vertex AI API 頁面](https://console.cloud.google.com/apis/library/aiplatform.googleapis.com)
2. 確認左上角已選取你的專案
3. 點擊**啟用（Enable）**

---

### 步驟三：建立服務帳號

1. 前往 [服務帳號管理頁](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. 點擊 **+ 建立服務帳號**
3. 填寫帳號名稱（如 `vertex-popclip`），點擊**建立並繼續**
4. 在「授予此服務帳號的存取權」，選擇角色：

   **Vertex AI → Vertex AI User**

5. 點擊**完成**

---

### 步驟四：下載 JSON 金鑰

1. 在服務帳號列表中，點擊剛建立的帳號
2. 切換到 **金鑰（Keys）** 分頁
3. 點擊 **新增金鑰 → 建立新金鑰 → JSON**，點擊**建立**
4. JSON 檔案自動下載 — **請妥善保管，勿外洩**

---

### 步驟五：設定擴充套件

安裝 `gemini-ask.popclipext` 或 `gemini-translate.popclipext` 後：

1. 點擊 PopClip 工具列中的 **Gemini Ask / Gemini Translate** 圖示
2. 開啟擴充套件設定
3. 將整個 JSON 金鑰檔案的內容貼入 **Config** 欄位：

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "vertex-popclip@your-project.iam.gserviceaccount.com",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

4. **Backend** 選擇 `vertex-ai`
5. **Vertex AI 位置** 設為 `global`（如需使用 `gemini-3.1-*` 模型）

---

### 常見問題

**Q: Location 要填什麼？**
- `global` — 支援 `gemini-3.1-pro-preview`、`gemini-3.1-flash-lite-preview`、`gemini-3-pro-preview`
- `us-central1` — 適合 `gemini-2.0-flash-001` 等舊版模型
- `asia-east1` — 東亞區域（台灣）

**Q: 報錯 403 / Permission Denied？**
確認服務帳號已被授予 **Vertex AI User** 角色，且 Vertex AI API 已啟用。
