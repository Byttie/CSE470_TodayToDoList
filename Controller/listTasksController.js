const express = require('express');
const router = express.Router();
const tasksModel = require('../Model/Tasks');

router.get('/tasks', (req, res) => {
    const userId = Number(req.query.userId);
    if (!userId) {
        return res.status(400).json({ error: 'userId query parameter is required' });
    }
    tasksModel.listTasks(userId)
        .then((result) => {
            res.status(200).json({ tasks: result.rows });
        })
        .catch((err) => {
            console.error('Error listing tasks:', err);
            res.status(500).json({ error: 'Failed to list tasks: ' + err.message });
        });
});

module.exports = router; 