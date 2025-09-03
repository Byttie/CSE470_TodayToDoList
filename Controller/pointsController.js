const express = require('express');
const router = express.Router();
const pointsModel = require('../Model/Points');

// Get user points and rank
router.get('/points/:userId', (req, res) => {
    const userId = Number(req.params.userId);
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    
    pointsModel.getUserPoints(userId)
        .then((result) => {
            if (result.rows.length === 0) {
                // Initialize user points if they don't exist
                return pointsModel.initializeUserPoints(userId)
                    .then(() => {
                        return pointsModel.getUserPoints(userId);
                    });
            }
            return result;
        })
        .then((result) => {
            const userPoints = result.rows[0];
            res.status(200).json({
                points: userPoints.points,
                rank: userPoints.rank
            });
        })
        .catch((err) => {
            console.error('Error getting user points:', err);
            res.status(500).json({ error: 'Failed to get user points: ' + err.message });
        });
});

// Award points for successful task completion
router.post('/points/award', (req, res) => {
    const { userId, taskTimeInMinutes } = req.body;
    if (!userId || !taskTimeInMinutes) {
        return res.status(400).json({ error: 'userId and taskTimeInMinutes are required' });
    }
    
    pointsModel.awardPoints(Number(userId), Number(taskTimeInMinutes))
        .then(() => {
            return pointsModel.getUserPoints(Number(userId));
        })
        .then((result) => {
            const userPoints = result.rows[0];
            res.status(200).json({
                message: 'Points awarded successfully',
                points: userPoints.points,
                rank: userPoints.rank,
                pointsAwarded: Number(taskTimeInMinutes)
            });
        })
        .catch((err) => {
            console.error('Error awarding points:', err);
            res.status(500).json({ error: 'Failed to award points: ' + err.message });
        });
});

// Penalize points for failed task completion
router.post('/points/penalize', (req, res) => {
    const { userId, taskTimeInMinutes } = req.body;
    if (!userId || !taskTimeInMinutes) {
        return res.status(400).json({ error: 'userId and taskTimeInMinutes are required' });
    }
    
    pointsModel.penalizePoints(Number(userId), Number(taskTimeInMinutes))
        .then(() => {
            return pointsModel.getUserPoints(Number(userId));
        })
        .then((result) => {
            const userPoints = result.rows[0];
            res.status(200).json({
                message: 'Points penalized successfully',
                points: userPoints.points,
                rank: userPoints.rank,
                pointsPenalized: Number(taskTimeInMinutes)
            });
        })
        .catch((err) => {
            console.error('Error penalizing points:', err);
            res.status(500).json({ error: 'Failed to penalize points: ' + err.message });
        });
});

// Complete task successfully (award points and delete task)
router.post('/tasks/complete', (req, res) => {
    const { userId, taskId, taskTimeInMinutes } = req.body;
    if (!userId || !taskId || !taskTimeInMinutes) {
        return res.status(400).json({ error: 'userId, taskId, and taskTimeInMinutes are required' });
    }
    
    const tasksModel = require('../Model/Tasks');
    
    // Award points first
    pointsModel.awardPoints(Number(userId), Number(taskTimeInMinutes))
        .then(() => {
            // Then delete the task
            return tasksModel.deleteTask(Number(userId), Number(taskId));
        })
        .then(() => {
            return pointsModel.getUserPoints(Number(userId));
        })
        .then((result) => {
            const userPoints = result.rows[0];
            res.status(200).json({
                message: 'Task completed successfully! Points awarded.',
                points: userPoints.points,
                rank: userPoints.rank,
                pointsAwarded: Number(taskTimeInMinutes)
            });
        })
        .catch((err) => {
            console.error('Error completing task:', err);
            res.status(500).json({ error: 'Failed to complete task: ' + err.message });
        });
});

// Handle task timeout (penalize points and delete task)
router.post('/tasks/timeout', (req, res) => {
    const { userId, taskId, taskTimeInMinutes } = req.body;
    if (!userId || !taskId || !taskTimeInMinutes) {
        return res.status(400).json({ error: 'userId, taskId, and taskTimeInMinutes are required' });
    }
    
    const tasksModel = require('../Model/Tasks');
    
    // Penalize points first
    pointsModel.penalizePoints(Number(userId), Number(taskTimeInMinutes))
        .then(() => {
            // Then delete the task
            return tasksModel.deleteTask(Number(userId), Number(taskId));
        })
        .then(() => {
            return pointsModel.getUserPoints(Number(userId));
        })
        .then((result) => {
            const userPoints = result.rows[0];
            res.status(200).json({
                message: 'Task timed out! Points penalized.',
                points: userPoints.points,
                rank: userPoints.rank,
                pointsPenalized: Number(taskTimeInMinutes)
            });
        })
        .catch((err) => {
            console.error('Error handling task timeout:', err);
            res.status(500).json({ error: 'Failed to handle task timeout: ' + err.message });
        });
});

module.exports = router;
