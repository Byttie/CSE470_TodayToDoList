const express = require('express');
const router = express.Router();
const profileModel = require('../Model/Profile');
const { uploadSingle } = require('./uploadService');

// GET /profile/:userId - Get user profile
router.get('/profile/:userId', (req, res) => {
    const userId = Number(req.params.userId);
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    
    profileModel.getUserProfile(userId)
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            const user = result.rows[0];
            res.status(200).json({
                id: user.id,
                username: user.username,
                profileImage: user.img
            });
        })
        .catch(err => {
            console.error('Error getting user profile:', err);
            res.status(500).json({ error: 'Failed to get user profile: ' + err.message });
        });
});

// PUT /profile/:userId/password - Update password
router.put('/profile/:userId/password', (req, res) => {
    const userId = Number(req.params.userId);
    const { newPassword } = req.body;
    
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    profileModel.updatePassword(userId, newPassword)
        .then(() => {
            res.status(200).json({ message: 'Password updated successfully' });
        })
        .catch(err => {
            console.error('Error updating password:', err);
            res.status(500).json({ error: 'Failed to update password: ' + err.message });
        });
});

// PUT /profile/:userId/image - Update profile image
router.put('/profile/:userId/image', uploadSingle('profileImage'), (req, res) => {
    const userId = Number(req.params.userId);
    
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    
    const imagePath = req.file && req.file.path ? req.file.path : null;
    if (!imagePath) {
        return res.status(400).json({ error: 'Profile image is required' });
    }
    
    profileModel.updateProfileImage(userId, imagePath)
        .then(() => {
            res.status(200).json({ 
                message: 'Profile image updated successfully',
                imagePath: imagePath
            });
        })
        .catch(err => {
            console.error('Error updating profile image:', err);
            res.status(500).json({ error: 'Failed to update profile image: ' + err.message });
        });
});

module.exports = router;
