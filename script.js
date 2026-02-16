// ===== QR MODAL =====
const qrBtn = document.getElementById("qrBtn");
const qrModal = document.getElementById("qrModal");
const closeQRBtn = document.getElementById("closeQR");

qrBtn.addEventListener("click", () => {
    qrModal.style.display = "flex";
});

closeQRBtn.addEventListener("click", () => {
    qrModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === qrModal) {
        qrModal.style.display = "none";
    }
});

// ===== BACKGROUND MUSIC (auto play + loop) =====
const music = document.getElementById("bg-music");

const playlist = [
    "soundtrack.mp3",
];

let currentTrack = 0;

function playNext() {
    music.src = playlist[currentTrack];
    music.play().catch(err => {
        console.log("Autoplay diblokir:", err.message);
    });
}

music.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    playNext();
});

music.volume = 0.25;   // volume lembut

// ===== LOADING SCREEN (pelan + ke atas) =====
window.addEventListener("load", () => {
    const loading = document.getElementById("loading-screen");
    const progressBar = document.getElementById("loading-progress");
    
    let width = 0;
    const interval = setInterval(() => {
        width += 1;                    // sangat pelan
        progressBar.style.width = width + "%";
        
        if (width >= 100) {
            clearInterval(interval);
            
            setTimeout(() => {
                loading.style.opacity = "0";
                
                setTimeout(() => {
                    loading.style.display = "none";
                    playNext();            // mulai music
                }, 500);
            }, 400);
        }
    }, 40);
});