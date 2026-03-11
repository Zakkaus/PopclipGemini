const axios = require("axios");
const forge = require("./forge.min.js");

// ── Token Cache ────────────────────────────────────────────────
let _cache = { token: null, exp: 0 };

// ── Base64url helper ───────────────────────────────────────────
function b64url(input) {
  const str = typeof input === "string" ? input : JSON.stringify(input);
  return forge.util.encode64(str)
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function b64urlBin(binaryStr) {
  return forge.util.encode64(binaryStr)
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// ── Service Account → Access Token (node-forge RS256 JWT) ─────
async function getServiceAccountToken(sa, location) {
  const now = Math.floor(Date.now() / 1000);
  if (_cache.token && _cache.exp > now + 60) return _cache.token;

  const header  = b64url({ alg: "RS256", typ: "JWT" });
  const payload = b64url({
    iss:   sa.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud:   sa.token_uri || "https://oauth2.googleapis.com/token",
    exp:   now + 3600,
    iat:   now,
  });

  const unsigned = `${header}.${payload}`;

  // Sign with RS256 (PKCS1 v1.5 + SHA-256) using node-forge
  const privateKey = forge.pki.privateKeyFromPem(sa.private_key);
  const md = forge.md.sha256.create();
  md.update(unsigned, "utf8");
  const sig = b64urlBin(privateKey.sign(md));

  const jwt = `${unsigned}.${sig}`;

  const res = await axios.post(
    sa.token_uri || "https://oauth2.googleapis.com/token",
    `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  _cache = { token: res.data.access_token, exp: now + 3600 };
  return _cache.token;
}

// ── Config Parser ──────────────────────────────────────────────
// Accepts:
//   1. Plain string                            → Google AI API key
//   2. { project_id, location, api_key }       → Vertex AI (API key)
//   3. { project_id, location, access_token }  → Vertex AI (Bearer token)
//   4. Full Service Account JSON               → Vertex AI (auto JWT via node-forge)
async function resolveAuth(configStr, locationOverride, backendOverride) {
  const defaultLocation = locationOverride || "global";
  let cfg;
  try {
    cfg = JSON.parse(configStr);
  } catch (_) {
    return { backend: "google-ai", apiKey: configStr.trim() };
  }

  // If user explicitly chose google-ai, treat config as plain API key
  if (backendOverride === "google-ai") {
    // Support both plain string and {api_key:"..."} JSON
    const key = cfg.api_key || configStr.trim();
    return { backend: "google-ai", apiKey: key };
  }

  if (cfg.type === "service_account" && cfg.private_key) {
    const token = await getServiceAccountToken(cfg, defaultLocation);
    return {
      backend: "vertex-ai",
      project: cfg.project_id,
      location: defaultLocation,
      accessToken: token,
    };
  }

  if (cfg.project_id) {
    return {
      backend: "vertex-ai",
      project: cfg.project_id,
      location: cfg.location || defaultLocation,
      apiKey: cfg.api_key || null,
      accessToken: cfg.access_token || null,
    };
  }

  return { backend: "google-ai", apiKey: configStr.trim() };
}

function buildUrl(auth, model) {
  if (auth.backend === "vertex-ai") {
    const host = auth.location === "global"
      ? "aiplatform.googleapis.com"
      : `${auth.location}-aiplatform.googleapis.com`;
    const base = `https://${host}/v1/projects/${auth.project}/locations/${auth.location}/publishers/google/models/${model}:generateContent`;
    return auth.apiKey ? `${base}?key=${auth.apiKey}` : base;
  }
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${auth.apiKey}`;
}

function buildHeaders(auth) {
  const h = { "Content-Type": "application/json" };
  if (auth.backend === "vertex-ai" && auth.accessToken) {
    h["Authorization"] = `Bearer ${auth.accessToken}`;
  }
  return h;
}

// ── Core API Call ──────────────────────────────────────────────
async function callGemini(prompt, configStr, model, locationOverride, backendOverride) {
  const auth = await resolveAuth(configStr, locationOverride, backendOverride);
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
    generationConfig: {
      temperature: 1.0,
      maxOutputTokens: 8192,
      topP: 0.95,
      topK: 64,
    },
  };
  try {
    const res = await axios.post(buildUrl(auth, model), body, {
      headers: buildHeaders(auth),
    });
    return res.data.candidates[0].content.parts.map((p) => p.text).join("\n");
  } catch (e) {
    return "Error: " + (e.response?.data?.error?.message || e.message);
  }
}

module.exports = { callGemini };
