let currentMode = 'login'; // 'login' or 'register'
let jwtToken = localStorage.getItem('jwt_token') || null;
let savedApiKey = localStorage.getItem('api_key') || null;

const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const authBtn = document.getElementById('authBtn');
const loginStatus = document.getElementById('loginStatus');
const authMessage = document.getElementById('authMessage');
const apiKeyInput = document.getElementById('apiKeyInput');
const apiResponse = document.getElementById('apiResponse');

// Check Initial State
if (jwtToken) {
    showDashboard();
}

function switchTab(mode) {
    currentMode = mode;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (mode === 'login') {
        authBtn.textContent = 'Masuk Sekarang';
    } else {
        authBtn.textContent = 'Daftar Akun';
    }
    authMessage.textContent = '';
}

async function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    authBtn.textContent = 'Memproses...';
    authBtn.disabled = true;

    try {
        const endpoint = currentMode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            if (currentMode === 'login') {
                jwtToken = data.token;
                localStorage.setItem('jwt_token', jwtToken);
                loginStatus.textContent = email;
                showDashboard();
            } else {
                showMessage('Registrasi berhasil! Silakan login.', 'success');
                switchTab('login');
                document.querySelector('.tab-btn').classList.add('active');
                document.querySelectorAll('.tab-btn')[1].classList.remove('active');
            }
        } else {
            showMessage(data.error || 'Terjadi kesalahan', 'error');
        }
    } catch (err) {
        showMessage('Gagal terhubung ke server', 'error');
    } finally {
        authBtn.textContent = currentMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun';
        authBtn.disabled = false;
    }
}

function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    loginStatus.textContent = 'Active Session';
    
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
}

function logout() {
    jwtToken = null;
    savedApiKey = null;
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('api_key');
    
    dashboardSection.classList.add('hidden');
    authSection.classList.remove('hidden');
    loginStatus.textContent = 'Not Logged In';
    apiKeyInput.value = '';
    apiResponse.textContent = '// Hasil JSON akan muncul di sini...';
}

async function generateKey() {
    try {
        const res = await fetch('/api/auth/generate-key', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${jwtToken}` 
            }
        });
        const data = await res.json();
        
        if (res.ok) {
            savedApiKey = data.data.api_key;
            localStorage.setItem('api_key', savedApiKey);
            apiKeyInput.value = savedApiKey;
            
            // Highlight animation
            apiKeyInput.style.borderColor = 'var(--secondary)';
            setTimeout(() => {
                apiKeyInput.style.borderColor = 'var(--panel-border)';
            }, 1000);
        } else {
            if(res.status === 401) {
                alert('Sesi kedaluwarsa, silakan login kembali.');
                logout();
            } else {
                alert(data.error);
            }
        }
    } catch (err) {
        alert('Gagal meng-generate API Key');
    }
}

async function testApi() {
    if (!savedApiKey) {
        apiResponse.textContent = '// ERROR: Anda belum memiliki API Key.\n// Silakan klik "Generate Baru" terlebih dahulu.';
        apiResponse.style.color = 'var(--accent)';
        return;
    }

    apiResponse.style.color = '#a5d6ff';
    apiResponse.textContent = 'Fetching data...';

    try {
        const res = await fetch('/api/flights?limit=5', {
            headers: {
                'x-api-key': savedApiKey
            }
        });
        const data = await res.json();
        
        if (res.ok) {
            apiResponse.textContent = JSON.stringify(data, null, 2);
        } else {
            apiResponse.textContent = JSON.stringify(data, null, 2);
            apiResponse.style.color = 'var(--accent)';
        }
    } catch (err) {
        apiResponse.textContent = '// ERROR: Gagal terhubung ke API';
        apiResponse.style.color = 'var(--accent)';
    }
}

function showMessage(msg, type) {
    authMessage.textContent = msg;
    authMessage.className = `message ${type}`;
}
