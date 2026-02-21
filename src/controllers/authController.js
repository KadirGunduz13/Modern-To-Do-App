const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Kayıt Olma İşlemi
exports.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    try {
        // 1. Kullanıcı adının daha önce alınıp alınmadığını kontrol et
        const [existingUsers] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' });
        }

        // 2. Şifreyi Hash'le (Güvenlik katmanı)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Veritabanına kaydet (Parametrik sorgu ile SQLi koruması)
        const [result] = await db.execute(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            [username, hashedPassword]
        );

        res.status(201).json({ message: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.', userId: result.insertId });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// Giriş Yapma İşlemi
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    try {
        // 1. Kullanıcıyı veritabanında bul
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı.' });
        }

        const user = users[0];

        // 2. Şifreyi doğrula
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Geçersiz şifre.' });
        }

        // Şifre doğruysa, kırılamaz bir JWT token (kimlik kartı) oluştur
        const token = jwt.sign(
            { id: user[0].id, username: user[0].username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            message: 'Giriş başarılı!', 
            user: { id: user[0].id, username: user[0].username },
            token: token // Token'ı frontend'e gönderiyoruz
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};