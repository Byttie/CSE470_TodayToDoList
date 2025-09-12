const express = require('express');
const router = express.Router();
const forumsModel = require('../Model/Forums');

// Create a new forum
router.post('/forums', async (req, res) => {
    try {
        const { userId, title, description } = req.body;
        
        if (!userId || !title || !description) {
            return res.status(400).json({ error: 'User ID, title, and description are required' });
        }

        const result = await forumsModel.createForum(userId, title, description);
        res.status(201).json({ 
            message: 'Forum created successfully', 
            forum: result.rows[0] 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create forum' });
    }
});

// Get all forums
router.get('/forums', async (req, res) => {
    try {
        const result = await forumsModel.getAllForums();
        res.status(200).json({ forums: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch forums' });
    }
});

// Get a specific forum by ID
router.get('/forums/:forumId', async (req, res) => {
    try {
        const { forumId } = req.params;
        const result = await forumsModel.getForumById(forumId);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Forum not found' });
        }
        
        res.status(200).json({ forum: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch forum' });
    }
});

// Get forums created by a specific user
router.get('/forums/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await forumsModel.getUserForums(userId);
        res.status(200).json({ forums: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user forums' });
    }
});

// Update a forum
router.put('/forums/:forumId', async (req, res) => {
    try {
        const { forumId } = req.params;
        const { userId, title, description } = req.body;
        
        if (!userId || !title || !description) {
            return res.status(400).json({ error: 'User ID, title, and description are required' });
        }

        const result = await forumsModel.updateForum(forumId, userId, title, description);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Forum not found or you do not have permission to update it' });
        }
        
        res.status(200).json({ 
            message: 'Forum updated successfully', 
            forum: result.rows[0] 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update forum' });
    }
});

// Delete a forum
router.delete('/forums/:forumId', async (req, res) => {
    try {
        const { forumId } = req.params;
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await forumsModel.deleteForum(forumId, userId);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Forum not found or you do not have permission to delete it' });
        }
        
        res.status(200).json({ message: 'Forum deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete forum' });
    }
});

module.exports = router;
