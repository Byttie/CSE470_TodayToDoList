const client = require('./database');

function createForum(userId, title, description) {
    const query = 'INSERT INTO forums (id, forumid, title, "desc") VALUES ($1, $2, $3, $4) RETURNING *';
    const forumId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
    return client.query(query, [userId, forumId, title, description]);
}

function getAllForums() {
    const query = `
        SELECT f.forumid, f.title, f."desc" as description, f.created_at, u.username, u.img as profile_image_url 
        FROM forums f 
        LEFT JOIN users u ON f.id = u.id 
        ORDER BY f.created_at DESC
    `;
    return client.query(query);
}

function getForumById(forumId) {
    const query = `
        SELECT f.forumid, f.title, f."desc" as description, f.created_at, u.username, u.img as profile_image_url 
        FROM forums f 
        LEFT JOIN users u ON f.id = u.id 
        WHERE f.forumid = $1
    `;
    return client.query(query, [forumId]);
}

function getUserForums(userId) {
    const query = `
        SELECT f.forumid, f.title, f."desc" as description, f.created_at 
        FROM forums f 
        WHERE f.id = $1 
        ORDER BY f.created_at DESC
    `;
    return client.query(query, [userId]);
}

function updateForum(forumId, userId, title, description) {
    const query = 'UPDATE forums SET title = $1, "desc" = $2 WHERE forumid = $3 AND id = $4 RETURNING *';
    return client.query(query, [title, description, forumId, userId]);
}

function deleteForum(forumId, userId) {
    const query = 'DELETE FROM forums WHERE forumid = $1 AND id = $2 RETURNING *';
    return client.query(query, [forumId, userId]);
}

module.exports = { 
    createForum, 
    getAllForums, 
    getForumById, 
    getUserForums, 
    updateForum, 
    deleteForum 
};
