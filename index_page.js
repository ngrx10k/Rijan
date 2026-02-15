/**
 * Home Page Logic - Full 17 Master Videos & Fast Direct Downloads
 * WITH AUTH GUARD & LOADING
 */

const firebaseConfig = {
    apiKey: "AIzaSyDcosGTi0MeCOkXFq4DURJeLs9lbLa-cq0",
    authDomain: "com3-564ad.firebaseapp.com",
    databaseURL: "https://com3-564ad-default-rtdb.firebaseio.com",
    projectId: "com3-564ad",
    storageBucket: "com3-564ad.firebasestorage.app",
    messagingSenderId: "788919726183",
    appId: "1:788919726183:web:3bccd28a1ed0fe484a24c2"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

const VIDEOS = [
    { id: 'HcOc7P5BMi4', title: '1. Web Dev Full Course Intro', thumb: 'https://i.ytimg.com/vi/HcOc7P5BMi4/mqdefault.jpg' },
    { id: 'ESnrn1kAD4E', title: '2. HTML Complete Roadmap', thumb: 'https://i.ytimg.com/vi/ESnrn1kAD4E/mqdefault.jpg' },
    { id: 'nGhKIC_7Mkk', title: '3. CSS Mastery Core', thumb: 'https://i.ytimg.com/vi/nGhKIC_7Mkk/mqdefault.jpg' },
    { id: 'Ez8F0nW6S-w', title: '4. JavaScript Essentials', thumb: 'https://i.ytimg.com/vi/Ez8F0nW6S-w/mqdefault.jpg' },
    { id: 'ajdRvxDWH4w', title: '5. Responsive Web Design', thumb: 'https://i.ytimg.com/vi/ajdRvxDWH4w/mqdefault.jpg' },
    { id: 'Zg4-uSjxosE', title: '6. Master Flexbox Layouts', thumb: 'https://i.ytimg.com/vi/Zg4-uSjxosE/mqdefault.jpg' },
    { id: 'UmRtFFSDSFo', title: '7. Advanced CSS Grid', thumb: 'https://i.ytimg.com/vi/UmRtFFSDSFo/mqdefault.jpg' },
    { id: 'gFWhbjzowrM', title: '8. DOM Manipulation Pro', thumb: 'https://i.ytimg.com/vi/gFWhbjzowrM/mqdefault.jpg' },
    { id: 'P0XMXqDGttU', title: '9. Asynchronous JavaScript', thumb: 'https://i.ytimg.com/vi/P0XMXqDGttU/mqdefault.jpg' },
    { id: '7zcXPCt8Ck0', title: '10. API & Data Fetching', thumb: 'https://i.ytimg.com/vi/7zcXPCt8Ck0/mqdefault.jpg' },
    { id: 'fXAGTOZ25H8', title: '11. Portfolio Project Guide', thumb: 'https://i.ytimg.com/vi/fXAGTOZ25H8/mqdefault.jpg' },
    { id: 'SqrppLEljkY', title: '12. E-Commerce Clone Logic', thumb: 'https://i.ytimg.com/vi/SqrppLEljkY/mqdefault.jpg' },
    { id: '_V33HCZWLDQ', title: '13. Full Stack Deployment', thumb: 'https://i.ytimg.com/vi/_V33HCZWLDQ/mqdefault.jpg' },
    { id: 'N-O4w6PynGY', title: '14. Ultra Modern Sidebar UI', thumb: 'https://i.ytimg.com/vi/N-O4w6PynGY/mqdefault.jpg' },
    { id: 'd3jXofmQm44', title: '15. React Fundamentals', thumb: 'https://i.ytimg.com/vi/d3jXofmQm44/mqdefault.jpg' },
    { id: 'CyGodpqcid4', title: '16. Backend Node Core', thumb: 'https://i.ytimg.com/vi/CyGodpqcid4/mqdefault.jpg' },
    { id: '4WjtQjPQGIs', title: '17. Database Mastery (SQL)', thumb: 'https://i.ytimg.com/vi/4WjtQjPQGIs/mqdefault.jpg' }
];

let player;

// AUTH GUARD & LOADING LOGIC
auth.onAuthStateChanged(user => {
    const loader = document.getElementById('loading-overlay');

    if (user) {
        // User logged in - Show Page
        if (loader) loader.style.display = 'none';
        initializePageFeatures();
    } else {
        // Not logged in - Redirect
        window.location.href = 'login.html';
    }
});

function initializePageFeatures() {
    const gallery = document.getElementById('course-gallery');
    const toggle = document.getElementById('course-toggle');
    if (!gallery || !toggle) return;

    // Load Videos
    if (gallery.children.length === 0) {
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
                    </div>
                </div>
            `;
            gallery.appendChild(card);
        });
    }

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
            window.open(`https://y2mate.is/watch?v=${id}`, '_blank');
        }
    };

    const closeFunctions = () => {
        document.getElementById('player-modal').classList.remove('active');
        if (player) player.stopVideo();
    };

    document.getElementById('close-player').onclick = closeFunctions;
    document.getElementById('close-player-mobile').onclick = closeFunctions;

    // Fullscreen Logic
    document.getElementById('btn-fullscreen').onclick = () => {
        const iframe = document.getElementById('yt-player-placeholder');
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) { /* Safari */
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { /* IE11 */
            iframe.msRequestFullscreen();
        }
    };

    // Video Speed & 10s Skips
    document.getElementById('skip-back').onclick = () => player?.seekTo(player.getCurrentTime() - 10);
    document.getElementById('skip-forward').onclick = () => player?.seekTo(player.getCurrentTime() + 10);
    document.getElementById('playback-speed').onchange = (e) => player?.setPlaybackRate(parseFloat(e.target.value));
}

// YT API Loader
if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
