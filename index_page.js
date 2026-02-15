/**
 * Home Page Logic - 5 Master Videos & Fast Direct Downloads
 */

const VIDEOS = [
    { id: '_V33HCZWLDQ', title: '1. Course Overview & Setup', thumb: 'https://i.ytimg.com/vi/_V33HCZWLDQ/mqdefault.jpg' },
    { id: 'N-O4w6PynGY', title: '2. Ultra Responsive Portfolio', thumb: 'https://i.ytimg.com/vi/N-O4w6PynGY/mqdefault.jpg' },
    { id: 'd3jXofmQm44', title: '3. Backend Logic Mastery', thumb: 'https://i.ytimg.com/vi/d3jXofmQm44/mqdefault.jpg' },
    { id: 'CyGodpqcid4', title: '4. Database Integration Core', thumb: 'https://i.ytimg.com/vi/CyGodpqcid4/mqdefault.jpg' },
    { id: '4WjtQjPQGIs', title: '5. Final Project Deployment', thumb: 'https://i.ytimg.com/vi/4WjtQjPQGIs/mqdefault.jpg' }
];

let player;

document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('course-gallery');
    const toggle = document.getElementById('course-toggle');
    if (!gallery || !toggle) return;

    // Load Videos
    VIDEOS.forEach(vid => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <img src="${vid.thumb}" style="width:100%; height:160px; object-fit:cover;">
            <div style="padding:1.2rem;">
                <h4 style="font-size:0.95rem; margin-bottom:1.2rem; height:45px; overflow:hidden; font-weight:700;">${vid.title}</h4>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem;">
                    <button class="btn-play" data-id="${vid.id}" style="background:var(--primary-gradient); color:white; border:none; padding:0.75rem; border-radius:12px; cursor:pointer; font-weight:700; font-size:0.85rem; transition: var(--transition-fast);">Play Hub</button>
                    <button class="btn-download" data-id="${vid.id}" style="background:var(--success); color:white; border:none; padding:0.75rem; border-radius:12px; cursor:pointer; font-weight:700; font-size:0.85rem; transition: var(--transition-fast);">Fast Download</button>
                    <button class="btn-yt" data-id="${vid.id}" style="grid-column: span 2; background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.8); border:0.5px solid var(--glass-border); padding:0.75rem; border-radius:12px; cursor:pointer; font-weight:600; font-size:0.8rem; margin-top:0.2rem;">YouTube App Version ↗</button>
                </div>
            </div>
        `;
        gallery.appendChild(card);
    });

    toggle.onclick = () => {
        gallery.classList.toggle('active');
        const isActive = gallery.classList.contains('active');
        toggle.querySelector('span').innerHTML = isActive ? '🔼' : '🎞️';
    };

    gallery.onclick = (e) => {
        const id = e.target.getAttribute('data-id');
        const modal = document.getElementById('player-modal');
        if (!id || !modal) return;

        if (e.target.classList.contains('btn-play')) {
            modal.classList.add('active');
            if (player) {
                player.loadVideoById(id);
            } else {
                player = new YT.Player('yt-player-placeholder', {
                    videoId: id,
                    playerVars: { 'autoplay': 1, 'controls': 1, 'modestbranding': 1, 'rel': 0, 'hd': 1 },
                    events: { 'onReady': (ev) => ev.target.playVideo() }
                });
            }
        } else if (e.target.classList.contains('btn-download')) {
            // High-speed Direct Download Support (Optimized redirect)
            // Using y2mate backend as it is generally faster and high quality
            window.open(`https://y2mate.is/watch?v=${id}`, '_blank');
        } else if (e.target.classList.contains('btn-yt')) {
            // Support for deep linking to YouTube app or site
            window.open(`https://youtube.com/watch?v=${id}`, '_blank');
        }
    };

    const closeModal = document.getElementById('close-player');
    if (closeModal) {
        closeModal.onclick = () => {
            document.getElementById('player-modal').classList.remove('active');
            if (player) player.stopVideo();
        };
    }

    // Video Speed & 10s Skips
    document.getElementById('skip-back').onclick = () => player?.seekTo(player.getCurrentTime() - 10);
    document.getElementById('skip-forward').onclick = () => player?.seekTo(player.getCurrentTime() + 10);
    document.getElementById('playback-speed').onchange = (e) => player?.setPlaybackRate(parseFloat(e.target.value));
});
