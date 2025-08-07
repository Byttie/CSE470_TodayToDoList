const client = require('./database');

/**
 * Authenticates a user in the database.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} Resolves with result or rejects with error
 */
function loginUser(username, password) {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    return client.query(query, [username, password]);
}

module.exports = { loginUser }; 