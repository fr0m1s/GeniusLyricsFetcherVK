chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'searchLyrics') {
        chrome.storage.sync.get(['geniusApiKey'], async (result) => {
            if (!result.geniusApiKey) {
                sendResponse({ error: 'the api key is not configured' });
                return;
            }

            try {
                const response = await fetch(
                    `https://api.genius.com/search?q=${encodeURIComponent(request.artist)}+${encodeURIComponent(request.title)}`,
                    {
                        headers: { 'Authorization': `Bearer ${result.geniusApiKey}` }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    sendResponse({ error: 'genius api error: ' + (data.error || response.status) });
                    return;
                }

                sendResponse({
                    url: data.response?.hits?.[0]?.result?.url
                });
            } catch (error) {
                sendResponse({ error: 'network error: ' + error.message });
            }
        });
        return true;
    }
});