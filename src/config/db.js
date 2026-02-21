const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// .env dosyasını okuyoruz
dotenv.config();

// Bağlantı havuzu (Connection Pool) oluşturma
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    // === AKILLI SSL AYARI ===
    // Eğer localhost'taysak SSL'i kapat (false), değilsek Aiven için aktif et
    ssl: process.env.DB_HOST === 'localhost' ? false : { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Bağlantıyı test edelim
pool.getConnection()
    .then(connection => {
        console.log('✅ MySQL Veritabanına başarıyla bağlanıldı!');
        connection.release(); // Bağlantıyı havuza geri bırakıyoruz
    })
    .catch(err => {
        console.error('❌ Veritabanı bağlantı hatası:', err.message);
    });

module.exports = pool;