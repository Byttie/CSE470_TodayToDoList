const client = require('./database');

function loginUser(username, password) {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    return client.query(query, [username, password]);
}

module.exports = { loginUser }; 