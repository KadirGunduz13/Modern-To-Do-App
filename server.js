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
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], // jsdelivr'den gelen scriptlere izin ver
            styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"], // jsdelivr ve satır içi stillere izin ver
            fontSrc: ["'self'", "https://cdn.jsdelivr.net"], // Bootstrap ikonları için fontlara izin ver
            imgSrc: ["'self'", "data:"]
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