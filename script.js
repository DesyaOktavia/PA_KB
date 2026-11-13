// ==========================================
// FOOD AI CLASSIFIER - CLIENT SCRIPT
// ==========================================

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const btnRemove = document.getElementById('btnRemove');
const fileNameEl = document.getElementById('fileName');
const btnClassify = document.getElementById('btnClassify');
const loadingContainer = document.getElementById('loadingContainer');
const warningBanner = document.getElementById('warningBanner');
const resultBox = document.getElementById('resultBox');
const resultEmoji = document.getElementById('resultEmoji');
const resultLabel = document.getElementById('resultLabel');
const resultValue = document.getElementById('resultValue');
const confidenceSection = document.getElementById('confidenceSection');
const confidenceBar = document.getElementById('confidenceBar');
const confidencePercent = document.getElementById('confidencePercent');
const allPredictions = document.getElementById('allPredictions');
const predList = document.getElementById('predList');
const btnRetry = document.getElementById('btnRetry');

let selectedFile = null;

// Food Emoji Mapping
const foodEmoji = {
    'baked potato': '🥔',
    'crispy chicken': '🍗',
    'donut': '🍩',
    'fries': '🍟',
    'cheesecake': '🍰',
    'ice cream': '🍦',
    'omelette': '🍳',
    'sushi': '🍣'
};

function getEmoji(label) {
    if (!label) return '🍽️';
    const key = label.toLowerCase().trim();
    for (const [food, emoji] of Object.entries(foodEmoji)) {
        if (key.includes(food)) return emoji;
    }
    return '🍽️';
}

// Drag & Drop & Upload Events
uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
    }
});

// File Handler & Validation
function handleFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const allowedExt = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'bmp'];

    if (!allowedExt.includes(ext)) {
        showError('Format file tidak didukung!\nGunakan salah satu: JPG, JPEG, PNG, HEIC, HEIF, WebP, atau BMP.');
        return;
    }

    selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewContainer.classList.add('show');
        uploadZone.style.display = 'none';
        btnClassify.classList.add('show');
        fileNameEl.textContent = `${file.name} (${formatSize(file.size)})`;
        hideResult();
    };
    reader.readAsDataURL(file);
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

// Reset Upload State
btnRemove.addEventListener('click', resetUpload);
btnRetry.addEventListener('click', resetUpload);

function resetUpload() {
    selectedFile = null;
    fileInput.value = '';
    previewContainer.classList.remove('show');
    uploadZone.style.display = '';
    btnClassify.classList.remove('show');
    hideResult();
    loadingContainer.classList.remove('show');
    warningBanner.classList.remove('show');
}

// API Prediction Request
btnClassify.addEventListener('click', classify);

async function classify() {
    if (!selectedFile) return;

    btnClassify.disabled = true;
    btnClassify.textContent = '⏳ Memproses...';
    loadingContainer.classList.add('show');
    hideResult();
    warningBanner.classList.remove('show');

    try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const targetUrl = (typeof API_URL !== 'undefined' ? API_URL : '') + '/prediksi';

        const res = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            body: formData
        });

        if (!res.ok) {
            const errText = await res.text().catch(() => '');
            throw new Error(`Server merespon status ${res.status}: ${errText}`);
        }

        const data = await res.json();

        // Warning jika model belum dilatih
        if (data.model_sudah_dilatih === false) {
            warningBanner.classList.add('show');
        }

        // Baca label dari berbagai format respons API
        const label = data.prediksi || data.prediction || 'Tidak diketahui';

        // Parsing nilai confidence / keyakinan
        let confidence = 0;
        if (data.keyakinan !== undefined) {
            confidence = data.keyakinan;
        } else if (data.confidence !== undefined) {
            if (typeof data.confidence === 'string') {
                confidence = parseFloat(data.confidence) / 100;
            } else {
                confidence = data.confidence;
            }
        }

        const allPreds = data.semua || [];

        showSuccess(label, confidence, allPreds);

    } catch (e) {
        showError(e.message);
    } finally {
        btnClassify.disabled = false;
        btnClassify.textContent = '🔍 Klasifikasi Makanan';
        loadingContainer.classList.remove('show');
    }
}

// Display Result Functions
function showSuccess(label, confidence, allPreds) {
    resultEmoji.textContent = getEmoji(label);
    resultLabel.textContent = 'Terdeteksi sebagai';
    resultValue.textContent = label;

    // Confidence Bar
    const pct = (confidence * 100).toFixed(1);
    confidenceBar.style.width = pct + '%';
    confidencePercent.textContent = pct + '%';
    confidenceSection.style.display = '';

    // List Prediksi Semua Kelas
    if (allPreds.length > 0) {
        predList.innerHTML = '';
        const sorted = [...allPreds].sort((a, b) => (b.peluang || 0) - (a.peluang || 0));
        sorted.forEach(item => {
            const p = ((item.peluang || 0) * 100).toFixed(1);
            const isTop = item.kelas === label;
            const row = document.createElement('div');
            row.className = 'pred-row';
            row.innerHTML = `
                <span class="pred-emoji">${getEmoji(item.kelas)}</span>
                <span class="pred-name">${item.kelas || '?'}</span>
                <div class="pred-bar-bg">
                    <div class="pred-bar-fill ${isTop ? '' : 'low'}" style="width: ${p}%"></div>
                </div>
                <span class="pred-percent">${p}%</span>
            `;
            predList.appendChild(row);
        });
        allPredictions.style.display = '';
    } else {
        allPredictions.style.display = 'none';
    }

    resultBox.className = 'result-box show success';
}

function showError(msg) {
    resultEmoji.textContent = '⚠️';
    resultLabel.textContent = 'Error';
    resultValue.textContent = msg + '\n\nPastikan Google Colab & ngrok aktif, dan URL di config.js sudah sesuai.';
    confidenceSection.style.display = 'none';
    allPredictions.style.display = 'none';
    resultBox.className = 'result-box show error';
}

function hideResult() {
    resultBox.className = 'result-box';
}
