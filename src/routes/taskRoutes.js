const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken } = require('../middleware/authMiddleware'); // Duvarı çağırdık

// Tüm görev rotalarının önüne 'verifyToken' duvarını ekliyoruz!
router.get('/:userId', verifyToken, taskController.getTasks);
router.post('/', verifyToken, taskController.createTask);
router.put('/reset/daily', verifyToken, taskController.resetDailyTasks);
router.put('/:id/status', verifyToken, taskController.updateTaskStatus);
router.delete('/:id', verifyToken, taskController.deleteTask);

module.exports = router;