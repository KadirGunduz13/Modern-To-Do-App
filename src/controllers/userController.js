const bcrypt = require('bcrypt');
const db = require('../config/db');


exports.updateProfile = async (req, res) => {
    const userId = req.params.id;
    const { newUsername, newPassword } = req.body;

    // Hiçbir bilgi gönderilmediyse işlemi durdur
    if (!newUsername && !newPassword) {
        return res.status(400).json({ message: 'Güncellenecek bir bilgi girmediniz.' });
    }

    try {
        // 1. Kullanıcı adı değişiyorsa, bu ismin başkası tarafından alınıp alınmadığını kontrol et
        if (newUsername) {
            const [existingUser] = await db.execute(
                'SELECT id FROM users WHERE username = ? AND id != ?', 
                [newUsername, userId]
            );
            if (existingUser.length > 0) {
                return res.status(409).json({ message: 'Bu kullanıcı adı zaten kullanımda. Lütfen başka bir tane seçin.' });
            }
        }

        // 2. Dinamik SQL Sorgusu Oluşturma (Sadece gelen verileri güncelleriz)
        let updateQuery = 'UPDATE users SET ';
        const queryValues = [];

        if (newUsername) {
            updateQuery += 'username = ?';
            queryValues.push(newUsername);
        }

        if (newPassword) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            
            // Eğer kullanıcı adı da güncelleniyorsa araya virgül koymalıyız
            if (newUsername) updateQuery += ', '; 
            updateQuery += 'password_hash = ?';
            queryValues.push(hashedPassword);
        }

        // Sorguyu bitir ve ID'yi ekle
        updateQuery += ' WHERE id = ?';
        queryValues.push(userId);

        // 3. Veritabanını Güncelle
        await db.execute(updateQuery, queryValues);

        res.status(200).json({ 
            message: 'Hesap bilgileriniz başarıyla güncellendi.',
            updatedUsername: newUsername 
        });

    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};