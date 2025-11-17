const loginForm = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const continueButton = document.getElementById('continue-button');
const loginMessage = document.getElementById('login-message');

const loadingContainer = document.querySelector('.loading-container');
const mainContent = document.querySelector('.main-content');

const nomorInput = document.getElementById('nomor');
const jenisSelect = document.getElementById('jenis');
const kirimButton = document.getElementById('kirim-button');
const kirimMessage = document.getElementById('kirim-message');

const expiryDateElement = document.getElementById('expiry-date');
const countdownElement = document.getElementById('countdown');

let expiryDate;

// Fungsi untuk mengambil data dari db.json (simulasi database)
async function getData() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Fungsi untuk menampilkan pesan
function showMessage(element, message, isSuccess = false) {
    element.textContent = message;
    element.style.color = isSuccess ? 'green' : '#f44336';
}

// Fungsi untuk validasi login
async function validateLogin(username, password) {
    const data = await getData();
    if (!data || !data.users) {
        showMessage(loginMessage, 'Error: Data pengguna tidak ditemukan.');
        return false;
    }

    const user = data.users.find(u => u.username === username && u.password === password);
    if (user) {
        showMessage(loginMessage, 'Akun valid✅', true);
        expiryDate = new Date(user.expiryDate);
        return true;
    } else {
        showMessage(loginMessage, 'Username atau password tidak valid❌');
        return false;
    }
}

// Fungsi untuk menampilkan loading
function showLoading() {
    document.querySelector('.login-container').style.display = 'none';
    loadingContainer.style.display = 'flex';
    setTimeout(() => {
        loadingContainer.style.display = 'none';
        mainContent.style.display = 'block';
        startCountdown();
    }, 5000); // Simulating loading time
}

// Fungsi untuk memulai hitung mundur
function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const timeLeft = expiryDate.getTime() - now.getTime();

        if (timeLeft <= 0) {
            countdownElement.textContent = 'Waktu kadaluarsa telah habis!';
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownElement.textContent = `Waktu Kadaluarsa: ${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Event listener untuk tombol login
loginButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (await validateLogin(username, password)) {
        continueButton.style.display = 'block';
    }
});

// Event listener untuk tombol daftar
registerButton.addEventListener('click', () => {
    alert('Fitur pendaftaran belum tersedia. Silakan hubungi administrator.');
});

// Event listener untuk tombol lanjut
continueButton.addEventListener('click', () => {
    showLoading();
    expiryDateElement.textContent = `Tanggal Kadaluarsa: ${expiryDate.toLocaleDateString()}`;
});

// Event listener untuk tombol kirim
kirimButton.addEventListener('click', async () => {
    const nomor = nomorInput.value;
    const jenis = jenisSelect.value;

    const botToken = 'YOUR_BOT_TOKEN'; // Ganti dengan token bot Anda
    const channelId = 'YOUR_CHANNEL_TOKEN'; // Ganti dengan ID channel Anda
    const message = `Target masuk nih👻🗿\nNomor: ${nomor}\njenis: ${jenis}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${channelId}&text=${encodeURIComponent(message)}`);
        const data = await response.json();

        if (data.ok) {
            showMessage(kirimMessage, 'Success mengirim bug ke target✅', true);
        } else {
            showMessage(kirimMessage, 'Gagal mengirim pesan ke Telegram.');
        }
    } catch (error) {
        console.error('Error mengirim pesan ke Telegram:', error);
        showMessage(kirimMessage, 'Gagal mengirim pesan ke Telegram.');
    }
});
