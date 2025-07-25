document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('api-key');
    const saveBtn = document.getElementById('save-btn');
    const statusEl = document.getElementById('status');

    chrome.storage.sync.get(['geniusApiKey'], (result) => {
        if (result.geniusApiKey) {
            apiKeyInput.value = result.geniusApiKey;
        }
    });

    saveBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            statusEl.textContent = 'enter an api key';
            statusEl.style.color = '#F44336';
            return;
        }

        chrome.storage.sync.set({ geniusApiKey: apiKey }, () => {
            statusEl.textContent = 'key saved';
            statusEl.style.color = '#4CAF50';
            setTimeout(() => statusEl.textContent = '', 2000);
        });
    });
});