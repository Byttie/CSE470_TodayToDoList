const client = require('./database');

function updatePassword(userId, newPassword) {
    const query = 'UPDATE users SET password = $1 WHERE id = $2';
    return client.query(query, [newPassword, userId]);
}

function updateProfileImage(userId, imagePath) {
    const query = 'UPDATE users SET img = $1 WHERE id = $2';
    return client.query(query, [imagePath, userId]);
}

function getUserProfile(userId) {
    const query = 'SELECT id, username, img FROM users WHERE id = $1';
    return client.query(query, [userId]);
}

module.exports = { updatePassword, updateProfileImage, getUserProfile };
