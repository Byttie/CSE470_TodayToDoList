const express = require('express');
const router = express.Router();
const tasksModel = require('../Model/Tasks');

router.delete('/tasks/:taskId', (req, res) => {
    const userId = Number(req.query.userId);
    const taskId = Number(req.params.taskId);
    if (!userId || !taskId) {
        return res.status(400).json({ error: 'userId query and taskId param are required' });
    }
    tasksModel.deleteTask(userId, taskId)
        .then(() => {
            res.status(200).json({ message: 'Task deleted successfully' });
        })
        .catch((err) => {
            console.error('Error deleting task:', err);
            res.status(500).json({ error: 'Failed to delete task: ' + err.message });
        });
});

module.exports = router; 