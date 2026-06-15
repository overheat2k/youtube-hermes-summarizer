// ============================================================
// Hermes YouTube Summarizer — Popup Script
// Settings: server URL, API base URL, API key, model
// ============================================================

const STORAGE_KEY = 'hermes_youtube_settings';

const serverUrlInput = document.getElementById('serverUrl');
const apiBaseUrlInput = document.getElementById('apiBaseUrl');
const apiKeyInput = document.getElementById('apiKey');
const modelNameInput = document.getElementById('modelName');
const saveBtn = document.getElementById('saveBtn');
const testBtn = document.getElementById('testBtn');
const statusMsg = document.getElementById('statusMsg');

const DEFAULTS = {
  serverUrl: 'http://127.0.0.1:8643',
  apiBaseUrl: 'https://openrouter.ai/api/v1',
  apiKey: '',
  model: 'openai/gpt-4o-mini'
};

// --- Load ---
(async function load() {
  const r = await chrome.storage.local.get(STORAGE_KEY);
  const s = r[STORAGE_KEY] || {};
  serverUrlInput.value = s.serverUrl || DEFAULTS.serverUrl;
  apiBaseUrlInput.value = s.apiBaseUrl || DEFAULTS.apiBaseUrl;
  apiKeyInput.value = s.apiKey || '';
  modelNameInput.value = s.model || DEFAULTS.model;
})();

function getSettings() {
  return {
    serverUrl: serverUrlInput.value.trim() || DEFAULTS.serverUrl,
    apiBaseUrl: apiBaseUrlInput.value.trim() || DEFAULTS.apiBaseUrl,
    apiKey: apiKeyInput.value.trim() || '',
    model: modelNameInput.value.trim() || DEFAULTS.model
  };
}

function setStatus(msg, type) {
  statusMsg.className = `status status-${type}`;
  statusMsg.textContent = msg;
  statusMsg.style.display = 'block';
}

// --- Save ---
saveBtn.addEventListener('click', async () => {
  const s = getSettings();
  if (!s.apiKey) {
    setStatus('请输入 API Key', 'error');
    return;
  }
  await chrome.storage.local.set({ [STORAGE_KEY]: s });
  setStatus('配置已保存 ✅', 'success');
});

// --- Test Connection ---
testBtn.addEventListener('click', async () => {
  const s = getSettings();
  testBtn.disabled = true;
  testBtn.innerHTML = '<span class="spinner"></span> 测试中...';
  setStatus('正在连接总结服务器...', 'info');

  try {
    const resp = await fetch(`${s.serverUrl}/health`, { signal: AbortSignal.timeout(5000) });
    if (resp.ok) {
      const data = await resp.json();
      setStatus(`✅ ${data.version || 'v1'} 服务器运行正常`, 'success');
    } else {
      setStatus(`❌ HTTP ${resp.status}`, 'error');
    }
  } catch (err) {
    setStatus(`❌ 无法连接 ${s.serverUrl}: ${err.message}`, 'error');
  } finally {
    testBtn.disabled = false;
    testBtn.textContent = '测试连接';
  }
});

// --- Auto-save ---
let saveTimer;
function autoSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const s = getSettings();
    if (s.apiKey) await chrome.storage.local.set({ [STORAGE_KEY]: s });
  }, 800);
}

serverUrlInput.addEventListener('input', autoSave);
apiBaseUrlInput.addEventListener('input', autoSave);
apiKeyInput.addEventListener('input', autoSave);
modelNameInput.addEventListener('input', autoSave);
