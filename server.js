const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const db = require('./src/config/db');

// .env dosyasındaki değişkenleri okumak için
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Güvenlik ve Ayar Katmanları (Middlewares)
// Güvenlik ve Ayar Katmanları
// --- GÜVENLİ HELMET (CSP) AYARLARI ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            // Bootstrap ve Toastify'ın CDN linklerine (cdn.jsdelivr.net) açıkça izin veriyoruz
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            // Resimler ve ikonlar için izinler
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'"]
        }
    }
}));
app.use(cors()); // Farklı kaynaklardan gelen isteklere izin/kısıtlama
app.use(express.json()); // Gelen JSON verilerini okuyabilmek için
app.use(express.urlencoded({ extended: true })); // Form verilerini okumak için

// Frontend dosyalarımızı (HTML, CSS) dışarıya sunmak için 'public' klasörünü statik yapıyoruz
app.use(express.static(path.join(__dirname, 'public')));

// === YENİ EKLENEN KISIM BAŞLANGICI ===
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);
// === YENİ EKLENEN KISIM BİTİŞİ ===

// === YENİ EKLENEN GÖREV ROTALARI ===
const taskRoutes = require('./src/routes/taskRoutes');
app.use('/api/tasks', taskRoutes);
// ===================================

// === YENİ EKLENEN KULLANICI ROTALARI ===
const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);
// =======================================

// Basit bir test rotası
app.get('/api/test', (req, res) => {
    res.json({ mesaj: 'Güvenli Node.js sunucusu başarıyla çalışıyor!' });
});

// Sunucuyu başlatma
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});