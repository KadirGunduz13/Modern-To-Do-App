const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Kullanıcı bilgilerini güncelleme (PUT metodu)
router.put('/:id', userController.updateProfile);

module.exports = router;