const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/:userId', taskController.getTasks);
router.post('/', taskController.createTask);

// DİKKAT: Bu reset rotası, aşağıdaki :id içeren rotalardan ÖNCE gelmeli!
router.put('/reset/daily', taskController.resetDailyTasks);

router.put('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;