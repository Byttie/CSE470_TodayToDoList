const express = require('express');
const router = express.Router();
const tasksModel = require('../Model/Tasks');

router.post('/tasks', (req, res) => {
    const { userId, taskId, name, description, priority, time } = req.body;
    if (!userId || !taskId || !name) {
        return res.status(400).json({ error: 'userId, taskId and name are required' });
    }
    
    // Set defaults for optional fields
    const taskDescription = description || '';
    const taskPriority = priority || 'medium';
    const taskTime = time || 1;
    
    tasksModel.addTask(userId, taskId, name, taskDescription, taskPriority, taskTime)
        .then(() => {
            res.status(201).json({ message: 'Task added successfully' });
        })
        .catch((err) => {
            console.error('Error adding task:', err);
            res.status(500).json({ error: 'Failed to add task: ' + err.message });
        });
});

module.exports = router; 