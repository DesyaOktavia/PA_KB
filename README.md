# 🍽️ Food AI Classifier

Aplikasi web klasifikasi makanan berbasis kecerdasan buatan (Deep Learning) menggunakan **PyTorch Custom CNN** yang dideploy via **Google Colab & ngrok**, serta antarmuka web modern responsif dengan gradasi warna biru-ungu-pink.

---

## 📸 Kategori Makanan (8 Kelas)

Model AI dapat mengklasifikasikan 8 jenis makanan berikut:
1. 🥔 **Baked Potato**
2. 🍗 **Crispy Chicken**
3. 🍩 **Donut**
4. 🍟 **Fries**
5. 🍰 **Cheesecake**
6. 🍦 **Ice Cream**
7. 🍳 **Omelette**
8. 🍣 **Sushi**

---

## ✨ Fitur Utama

- 🎨 **Modern Glassmorphism UI**: Desain responsif dengan animasi gradasi latar belakang dinamis (biru - ungu - pink).
- 📁 **Multi-Format Image Upload**: Mendukung upload format gambar `JPG`, `JPEG`, `PNG`, `HEIC`, `HEIF`, `WebP`, dan `BMP`.
- 🖱️ **Drag & Drop**: Mendukung seret-dan-lepas gambar atau klik untuk memilih file.
- 👁️ **Preview Foto**: Pratinjau gambar sebelum dianalisis lengkap dengan nama dan ukuran file.
- ⚡ **Real-time API Integration**: Terhubung langsung ke backend PyTorch di Google Colab melalui tunneling ngrok.
- 📊 **Tingkat Keyakinan (Confidence Score)**: Menampilkan persentase akurasi prediksi model dan breakdown peluang untuk setiap kelas makanan.
- ⚠️ **Smart Error & Status Handling**: Tampilan loading interaktif dan notifikasi status model yang jelas.

---

## 📂 Struktur Proyek

```text
📁 Proyek/
├── 📄 index.html        # Halaman utama (kompatibel GitHub Pages)
├── 📄 klasifikasi.html  # Halaman klasifikasi
├── 📄 style.css         # Styling modern, variabel CSS & animasi
├── 📄 script.js        # Logika aplikasi frontend & fetch API
├── 📄 config.js         # Konfigurasi URL API ngrok
├── 📄 .gitignore        # File ignore untuk git
└── 📄 README.md         # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan Secara Lokal

### 1. Konfigurasi Endpoint API
Buka file `config.js` dan sesuaikan URL ngrok dari Google Colab Anda:
```javascript
const API_URL = "https://your-ngrok-url.ngrok-free.dev";
```

### 2. Jalankan Dev Server Lokal
Gunakan perintah Python di terminal direktori proyek:
```bash
python -m http.server 8080
```
Buka browser dan akses:
```
http://localhost:8080
```
atau:
```
http://localhost:8080/klasifikasi.html
```

---

## 🔗 Spesifikasi Endpoint API (Google Colab)

- **Method**: `POST`
- **Endpoint**: `/prediksi`
- **Header**: `ngrok-skip-browser-warning: true`
- **Body**: `multipart/form-data` dengan field `file`
- **Contoh Respons**:
```json
{
  "success": true,
  "prediction": "Sushi",
  "confidence": "91.50%",
  "class_index": 7
}
```

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla ES6+)
- **Backend Model**: PyTorch, Custom Convolutional Neural Network (CNN)
- **Deployment & Tunnel**: Google Colab, FastAPI / Uvicorn, ngrok
