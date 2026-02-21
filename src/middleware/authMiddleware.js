const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // Frontend'den gelen yetki (Authorization) başlığını alıyoruz
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'Erişim reddedildi. Token bulunamadı.' });

    // "Bearer <token>" formatından sadece token'ı ayırıyoruz
    const token = authHeader.split(' ')[1];

    try {
        // Token'ın sahte olup olmadığını gizli anahtarımızla kontrol ediyoruz
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // IDOR ZAFİYETİ ÇÖZÜMÜ: Frontend'den gelen sahte ID'leri ezip geçiyoruz!
        // Sadece kendi çözdüğümüz %100 güvenilir ID'yi sisteme zorunlu kılıyoruz.
        if (req.body) req.body.userId = decoded.id;
        if (req.params) req.params.userId = decoded.id;
        
        next(); // Güvenlik duvarını geçmesine izin ver
    } catch (err) {
        res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    }
};