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

const music = document.getElementById("bg-music");
const soundtrackFile = "soundtrack.mp3";

function startMusic() {
    music.src = soundtrackFile;
    music.play()
        .then(() => console.log("Musik dimulai:", soundtrackFile))
        .catch(err => console.log("Play gagal:", err.message));
}

music.volume = 0.25;

let hasInteracted = false;
document.addEventListener('click', () => {
    if (!hasInteracted) {
        if (music.muted) {
            music.muted = false;
            if (music.paused) {
                startMusic();
            }
        }
        hasInteracted = true;
    }
}, { once: true });

window.addEventListener("load", () => {
    const loading = document.getElementById("loading-screen");
    const progressBar = document.getElementById("loading-progress");
    
    let width = 0;
    const interval = setInterval(() => {
        width += 1;
        progressBar.style.width = width + "%";
        
        if (width >= 100) {
            clearInterval(interval);
            
            setTimeout(() => {
                loading.style.opacity = "0";
                
                setTimeout(() => {
                    loading.style.display = "none";
                    
                    music.muted = true;
                    startMusic();
                    
                    music.addEventListener('playing', () => {
                        if (music.muted) {
                            setTimeout(() => { music.muted = false; }, 300);
                        }
                    }, { once: true });
                }, 600);
            }, 400);
        }
    }, 40);
});