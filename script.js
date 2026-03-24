const qrBtn = document.getElementById("qrBtn");
const qrModal = document.getElementById("qrModal");
const closeQRBtn = document.getElementById("closeQR");

qrBtn.onclick = () => qrModal.style.display = "flex";
closeQRBtn.onclick = () => qrModal.style.display = "none";

window.onclick = (e) => {
    if (e.target === qrModal) qrModal.style.display = "none";
};

/* QR SLIDER */
const qrImages = [
    "QR-Donasi-Whoisdanz.png",
    "QR-Donasi2-Whoisdanz.png"
];

let currentQR = 0;
const qrImage = document.getElementById("qrImage");

document.getElementById("prevQR").onclick = () => {
    currentQR = (currentQR - 1 + qrImages.length) % qrImages.length;
    qrImage.src = qrImages[currentQR];
};

document.getElementById("nextQR").onclick = () => {
    currentQR = (currentQR + 1) % qrImages.length;
    qrImage.src = qrImages[currentQR];
};

/* DOWNLOAD MENU */
const downloadToggle = document.getElementById("downloadToggle");
const downloadMenu = document.getElementById("downloadMenu");

downloadToggle.onclick = () => {
    downloadMenu.style.display =
        downloadMenu.style.display === "flex" ? "none" : "flex";
};

/* MUSIC */
const music = document.getElementById("bg-music");
music.src = "soundtrack.mp3";
music.volume = 0.25;

document.addEventListener("click", () => {
    music.play().catch(() => {});
}, { once: true });

/* LOADING */
window.onload = () => {
    const loading = document.getElementById("loading-screen");
    const bar = document.getElementById("loading-progress");

    let w = 0;
    const int = setInterval(() => {
        w++;
        bar.style.width = w + "%";
        if (w >= 100) {
            clearInterval(int);
            setTimeout(() => {
                loading.style.display = "none";
            }, 500);
        }
    }, 30);
};