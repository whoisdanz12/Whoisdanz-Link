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

/* QR SLIDER */
const qrImages = [
    "QR-Donasi-Whoisdanz.png",
    "QR-Donasi2-Whoisdanz.png"
];

let currentQR = 0;

const qrImage = document.getElementById("qrImage");
const prevQR = document.getElementById("prevQR");
const nextQR = document.getElementById("nextQR");

function updateQR() {
    qrImage.src = qrImages[currentQR];
}

prevQR.addEventListener("click", () => {
    currentQR = (currentQR - 1 + qrImages.length) % qrImages.length;
    updateQR();
});

nextQR.addEventListener("click", () => {
    currentQR = (currentQR + 1) % qrImages.length;
    updateQR();
});

/* MUSIC */
const music = document.getElementById("bg-music");
const soundtrackFile = "soundtrack.mp3";

function startMusic() {
    music.src = soundtrackFile;
    music.play().catch(() => {});
}

music.volume = 0.25;

let hasInteracted = false;
document.addEventListener("click", () => {
    if (!hasInteracted) {
        if (music.muted) {
            music.muted = false;
            if (music.paused) startMusic();
        }
        hasInteracted = true;
    }
}, { once: true });

/* LOADING */
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

                    music.addEventListener("playing", () => {
                        setTimeout(() => {
                            music.muted = false;
                        }, 300);
                    }, { once: true });

                }, 600);
            }, 400);
        }
    }, 40);
});