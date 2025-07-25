function initLyricsButton() {
    const dislikeBtn = document.querySelector('[data-testid="MusicAudio_Action_ToggleDislike"]');
    if (!dislikeBtn || dislikeBtn.classList.contains('genius-replaced')) return;

    const lyricsBtn = document.createElement('button');
    lyricsBtn.className = 'genius-lyrics-btn';

    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('icons/icon.svg');
    img.width = 20;
    img.height = 20;
    img.alt = 'track lyrics';
    img.style.opacity = '0.9';
    img.style.display = 'block';

    lyricsBtn.appendChild(img);
    lyricsBtn.title = 'fetch lyrics from genius';

    Object.assign(lyricsBtn.style, {
        margin: '0 4px',
        padding: '0',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });

    lyricsBtn.addEventListener('click', async () => {
        const track = getCurrentTrack();
        if (!track?.title) {
            alert('the track is not detected :(\n1. make sure that the music is playing\n2. restart the page');
            return;
        }

        try {
            const response = await chrome.runtime.sendMessage({
                action: 'searchLyrics',
                artist: track.artist,
                title: track.title
            });

            if (response?.url) {
                window.open(response.url, '_blank');
            } else {
                const searchUrl = `https://genius.com/search?q=${encodeURIComponent(track.artist)}+${encodeURIComponent(track.title)}`;
                alert('lyrics were not found on genius :(\n\nworth trying manually:\n' + searchUrl);
            }
        } catch (error) {
            alert('search error :(\ncheck the api key in extention settings');
        }
    });

    dislikeBtn.replaceWith(lyricsBtn);
    lyricsBtn.classList.add('genius-replaced');
}

function getCurrentTrack() {
    if ('mediaSession' in navigator && navigator.mediaSession.metadata) {
        return {
            title: navigator.mediaSession.metadata.title || '',
            artist: navigator.mediaSession.metadata.artist || ''
        };
    }
    return null;
}

function init() {
    initLyricsButton();
    setInterval(initLyricsButton, 1000);
}

if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}