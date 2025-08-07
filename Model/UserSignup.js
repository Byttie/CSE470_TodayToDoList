const client = require('./database');

/**
 * Registers a new user in the database.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} Resolves with result or rejects with error
 */
function signupUser(username, password) {
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    return client.query(query, [username, password]);
}

module.exports = { signupUser }; 