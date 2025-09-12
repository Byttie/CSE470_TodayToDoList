const client = require('./database');

function signupUser(username, password, profileImageUrl) {
    const hasImage = Boolean(profileImageUrl);
    const insertQuery = hasImage
        ? 'INSERT INTO users (username, password, img) VALUES ($1, $2, $3)'
        : 'INSERT INTO users (username, password) VALUES ($1, $2)';
    const insertParams = hasImage ? [username, password, profileImageUrl] : [username, password];

    // First, check if the username already exists
    return client.query('SELECT 1 FROM users WHERE username = $1 LIMIT 1', [username])
        .then(check => {
            if (check.rows && check.rows.length > 0) {
                const err = new Error('USER_EXISTS');
                err.code = 'USER_EXISTS';
                throw err;
            }
            return client.query(insertQuery, insertParams);
        });
}

module.exports = { signupUser }; 