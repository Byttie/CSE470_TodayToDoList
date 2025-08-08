const client = require('./database');

function signupUser(username, password) {
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    return client.query(query, [username, password]);
}

module.exports = { signupUser }; 