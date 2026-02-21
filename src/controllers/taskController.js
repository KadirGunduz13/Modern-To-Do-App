const db = require('../config/db');

// 1. Kullanıcının Tüm Görevlerini Getir (Read)
exports.getTasks = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [tasks] = await db.execute(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at ASC', 
            [userId]
        );
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Görevleri getirme hatası:', error);
        res.status(500).json({ message: 'Görevler getirilirken sunucu hatası oluştu.' });
    }
};

// 2. Yeni Görev Ekle (Create)
exports.createTask = async (req, res) => {
    const { title, task_type, userId, due_date } = req.body;

    if (!title || !task_type || !userId) {
        return res.status(400).json({ message: 'Eksik bilgi gönderildi.' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO tasks (title, task_type, user_id, due_date) VALUES (?, ?, ?, ?)',
            [title, task_type, userId, due_date || null] // due_date opsiyonel, gönderilmezse null olarak kaydedilir
        );
        res.status(201).json({ message: 'Görev başarıyla eklendi!', taskId: result.insertId });
    } catch (error) {
        console.error('Görev ekleme hatası:', error);
        res.status(500).json({ message: 'Görev eklenirken sunucu hatası oluştu.' });
    }
};

// 3. Görev Durumunu Güncelle (Tamamlandı/Tamamlanmadı) (Update)
exports.updateTaskStatus = async (req, res) => {
    const taskId = req.params.id;
    const { is_completed, userId } = req.body;

    try {
        // user_id kontrolü ekliyoruz ki başkası başkasının görevini güncelleyemesin (Güvenlik)
        await db.execute(
            'UPDATE tasks SET is_completed = ? WHERE id = ? AND user_id = ?',
            [is_completed, taskId, userId]
        );
        res.status(200).json({ message: 'Görev durumu güncellendi.' });
    } catch (error) {
        console.error('Görev güncelleme hatası:', error);
        res.status(500).json({ message: 'Görev güncellenirken sunucu hatası oluştu.' });
    }
};

// 4. Görevi Sil (Delete)
exports.deleteTask = async (req, res) => {
    const taskId = req.params.id;
    const { userId } = req.body; // Silme işleminde de güvenliği sağlıyoruz

    try {
        await db.execute(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [taskId, userId]
        );
        res.status(200).json({ message: 'Görev başarıyla silindi.' });
    } catch (error) {
        console.error('Görev silme hatası:', error);
        res.status(500).json({ message: 'Görev silinirken sunucu hatası oluştu.' });
    }
};

// 5. Tüm Günlük Görevleri Sıfırla (Toplu Güncelleme)
exports.resetDailyTasks = async (req, res) => {
    try {
        const userId = req.body.userId; // authMiddleware'den gelen güvenli ID

        // "daily" kelimesini de soru işareti (?) ile güvenli parametre olarak gönderiyoruz
        const [result] = await db.execute(
            'UPDATE tasks SET is_completed = false WHERE user_id = ? AND task_type = ?',
            [userId, 'daily']
        );

        res.status(200).json({ message: 'Günlük görevler başarıyla sıfırlandı.' });
    } catch (err) {
        console.error('Sıfırlama hatası:', err);
        res.status(500).json({ message: 'Sıfırlama sırasında bir hata oluştu.' });
    }
};