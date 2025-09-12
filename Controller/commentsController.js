const express = require('express');
const router = express.Router();
const commentsModel = require('../Model/Comments');

// Add a comment to a forum
router.post('/comments', async (req, res) => {
    try {
        const { userId, forumId, comment } = req.body;
        
        if (!userId || !forumId || !comment) {
            return res.status(400).json({ error: 'User ID, Forum ID, and comment are required' });
        }

        const result = await commentsModel.addComment(userId, forumId, comment);
        res.status(201).json({ 
            message: 'Comment added successfully', 
            comment: result.rows[0] 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Get all comments for a specific forum
router.get('/comments/forum/:forumId', async (req, res) => {
    try {
        const { forumId } = req.params;
        const result = await commentsModel.getCommentsByForumId(forumId);
        res.status(200).json({ comments: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Delete a comment
router.delete('/comments/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await commentsModel.deleteComment(commentId, userId);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found or you do not have permission to delete it' });
        }
        
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

// Get a specific comment by ID
router.get('/comments/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;
        const result = await commentsModel.getCommentById(commentId);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        res.status(200).json({ comment: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comment' });
    }
});

// Like a comment
router.post('/comments/:commentId/like', async (req, res) => {
    try {
        const { commentId } = req.params;
        const result = await commentsModel.likeComment(commentId);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        res.status(200).json({ 
            message: 'Comment liked successfully', 
            likes: result.rows[0].likes 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to like comment' });
    }
});

// Unlike a comment
router.post('/comments/:commentId/unlike', async (req, res) => {
    try {
        const { commentId } = req.params;
        const result = await commentsModel.unlikeComment(commentId);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        res.status(200).json({ 
            message: 'Comment unliked successfully', 
            likes: result.rows[0].likes 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unlike comment' });
    }
});

module.exports = router;
