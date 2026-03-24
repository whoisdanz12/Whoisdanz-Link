// MODAL
const qrBtn = document.getElementById("qrBtn");
const qrModal = document.getElementById("qrModal");
const closeQRBtn = document.getElementById("closeQR");

qrBtn.onclick = () => qrModal.style.display = "flex";
closeQRBtn.onclick = () => qrModal.style.display = "none";

qrModal.onclick = (e) => {
    if (e.target === qrModal) qrModal.style.display = "none";
};

// QR SWITCH
const qrOptions = document.querySelectorAll(".qr-option");
const qrImages = document.querySelectorAll(".qr-preview");
const downloadBtn = document.getElementById("downloadQR");

qrOptions.forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.qr;

        qrOptions.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        qrImages.forEach(img => {
            img.classList.remove("active");
            if (img.dataset.qr === id) {
                img.classList.add("active");
                downloadBtn.href = img.src;
                downloadBtn.setAttribute("download", img.src);
            }
        });
    });
});

// MUSIC (clean version)
const music = document.getElementById("bg-music");
music.volume = 0.25;

document.addEventListener("click", () => {
    if (!music.src) {
        music.src = "soundtrack.mp3";
        music.play().catch(()=>{});
    }
}, { once: true });

// LOADING (simple)
window.addEventListener("load", () => {
    const loading = document.getElementById("loading-screen");
    setTimeout(() => {
        loading.style.display = "none";
    }, 600);
});