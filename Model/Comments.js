const client = require('./database');

function addComment(userId, forumId, comment) {
    const query = 'INSERT INTO comments (id, forumid, comment, commentid, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *';
    const commentId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
    return client.query(query, [userId, forumId, comment, commentId]);
}

function getCommentsByForumId(forumId) {
    const query = `
        SELECT c.comment, c.commentid, c.created_at, u.username, u.img as profile_image_url 
        FROM comments c 
        LEFT JOIN users u ON c.id = u.id 
        WHERE c.forumid = $1 
        ORDER BY c.created_at ASC
    `;
    return client.query(query, [forumId]);
}

function deleteComment(commentId, userId) {
    const query = 'DELETE FROM comments WHERE commentid = $1 AND id = $2 RETURNING *';
    return client.query(query, [commentId, userId]);
}

function getCommentById(commentId) {
    const query = `
        SELECT c.commentid, c.comment, c.id as user_id, u.username 
        FROM comments c 
        LEFT JOIN users u ON c.id = u.id 
        WHERE c.commentid = $1
    `;
    return client.query(query, [commentId]);
}

module.exports = { 
    addComment, 
    getCommentsByForumId, 
    deleteComment, 
    getCommentById 
};
