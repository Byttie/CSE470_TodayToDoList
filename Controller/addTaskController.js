const express = require('express');
const router = express.Router();
const tasksModel = require('../Model/Tasks');

router.post('/tasks', (req, res) => {
    const { userId, taskId, task } = req.body;
    if (!userId || !taskId || !task) {
        return res.status(400).json({ error: 'userId, taskId and task are required' });
    }
    tasksModel.addTask(userId, taskId, task)
        .then(() => {
            res.status(201).json({ message: 'Task added successfully' });
        })
        .catch((err) => {
            console.error('Error adding task:', err);
            res.status(500).json({ error: 'Failed to add task: ' + err.message });
        });
});

module.exports = router; 