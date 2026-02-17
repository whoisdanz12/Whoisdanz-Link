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

// ===== BACKGROUND MUSIC =====
const music = document.getElementById("bg-music");
const soundtrackFile = "soundtrack.mp3";

function startMusic() {
    music.src = soundtrackFile;
    music.play().catch(err => console.log("Play gagal:", err.message));
}

music.volume = 0.25;

// Unmute setelah interaksi pertama
let hasInteracted = false;
document.addEventListener('click', () => {
    if (!hasInteracted) {
        if (music.muted) music.muted = false;
        if (music.paused) startMusic();
        hasInteracted = true;
    }
}, { once: true });

// ===== TYPING ANIMATION DI LOADING SCREEN =====
document.addEventListener("DOMContentLoaded", () => {
    const typedTextElement = document.querySelector(".typed-text");
    const fullText = "Tidak semua harapan harus menjadi kenyataan,\nnamun semua kenyataan berawal dari sebuah harapan.";
    const typingSpeed = 65;

    let charIndex = 0;

    function type() {
        if (charIndex < fullText.length) {
            typedTextElement.textContent += fullText.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            document.querySelector(".cursor").style.display = "none";
        }
    }

    // Mulai typing segera saat halaman dimuat
    document.querySelector(".speech-bubble").classList.add("typing-active");
    type();
});

// ===== LOADING SCREEN + MUSIC =====
window.addEventListener("load", () => {
    const loading = document.getElementById("loading-screen");
    const progressBar = document.getElementById("loading-progress");
    
    let width = 0;
    const interval = setInterval(() => {
        width += 1;
        progressBar.style.width = width + "%";
        
        if (width >= 100) {
            clearInterval(interval);
            
            // Tunggu typing selesai dengan delay ekstra
            setTimeout(() => {
                loading.style.opacity = "0";
                
                setTimeout(() => {
                    loading.style.display = "none";
                    music.muted = true;
                    startMusic();
                    
                    music.addEventListener('playing', () => {
                        if (music.muted) {
                            setTimeout(() => { music.muted = false; }, 400);
                        }
                    }, { once: true });
                }, 700);
            }, 1000); // delay 1 detik setelah progress 100% agar typing terasa selesai
        }
    }, 40);
});