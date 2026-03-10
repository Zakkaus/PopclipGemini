# PopClip · Gemini AI

> 繁體中文 | [English](#english)

---

## 繁體中文

以 Google Gemini 驅動的 macOS PopClip 擴充套件。

### 包含擴充套件

| 套件 | 功能 |
|------|------|
| `gemini-ask.popclipext` | 選取文字 → AI 回答顯示於彈窗，或替換選取文字 |
| `gemini-translate.popclipext` | 選取文字 → 翻譯後直接貼上 |

### 安裝

在 Finder 中**雙擊** `.popclipext` 資料夾即可安裝，無需其他操作。

---

### 設定選項

![Gemini Ask 設定介面（繁體中文）](res/settings-zh.png)

---


### Config 欄位填法

#### Google AI Studio（最簡單）
取得 Key → [Google AI Studio](https://aistudio.google.com/app/apikey)
```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

#### Vertex AI — Service Account JSON
將下載的金鑰 JSON 檔案**整個內容**貼入 Config 欄位：
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-sa@your-project.iam.gserviceaccount.com",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```
擴充套件自動簽署 JWT 並換取 Access Token（快取 1 小時）。
詳細設定流程見 [Vertex AI 設定指南](vertex-ai-setup.md)。

---


### 支援模型

| 模型 | Google AI | Vertex AI |
|------|:---------:|:---------:|
| `gemini-2.5-flash` | ✅ | ✅ |
| `gemini-2.5-flash-lite` | ✅ | ✅ |
| `gemini-2.5-flash-lite-preview-09-2025` | ✅ | ✅ |
| `gemini-2.0-flash` | ✅ | ✅ |
| `gemini-2.0-flash-001` | ✅ | ✅ |
| `gemini-2.0-flash-lite-001` | ✅ | ✅ |
| `gemini-3.1-pro-preview` | ✅ | ✅ (location=global) |
| `gemini-3.1-flash-lite-preview` | ✅ | ✅ (location=global) |
| `gemini-3-pro-preview` | ✅ | ✅ (location=global) |

> 自定義模型欄位可輸入任何有效模型名稱。

---

## English <a name="english"></a>

PopClip extensions for macOS powered by Google Gemini.

### Extensions

| Package | Description |
|---------|-------------|
| `gemini-ask.popclipext` | Selected text → AI answer in popup or replaces selection |
| `gemini-translate.popclipext` | Selected text → translated and pasted |

### Installation

**Double-click** the `.popclipext` folder in Finder. No setup required.

---

### Options

![Gemini Ask Settings (English)](res/settings-en.png)

---


### Config Field

#### Google AI Studio (simplest)
Get key → [Google AI Studio](https://aistudio.google.com/app/apikey)
```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

#### Vertex AI — Service Account JSON
Paste the **entire contents** of your downloaded JSON key file:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-sa@your-project.iam.gserviceaccount.com",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```
The extension auto-signs a JWT and caches the Access Token for 1 hour.
See [Vertex AI Setup Guide](vertex-ai-setup.md) for full instructions.

---


## License

See [LICENSE](LICENSE).
