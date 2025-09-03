const client = require('./database');

// Initialize user points if they don't exist
function initializeUserPoints(userId) {
    return client.query('SELECT id FROM points WHERE id = $1', [userId])
        .then((result) => {
            if (result.rows.length === 0) {
                // User doesn't exist, create them
                const insertQuery = 'INSERT INTO points (id, points, rank) VALUES ($1, 0, $2)';
                return client.query(insertQuery, [userId, 'Bronze']);
            }
            // User already exists, do nothing
            return Promise.resolve();
        });
}

// Get user points and rank
function getUserPoints(userId) {
    const query = 'SELECT points, rank FROM points WHERE id = $1';
    return client.query(query, [userId]);
}

// Update user points and calculate rank
function updateUserPoints(userId, pointsChange) {
    return client.query('BEGIN')
        .then(() => {
            // Get current points
            return client.query('SELECT points FROM points WHERE id = $1', [userId]);
        })
        .then((result) => {
            if (result.rows.length === 0) {
                // Initialize user if they don't exist
                return initializeUserPoints(userId)
                    .then(() => {
                        return client.query('SELECT points FROM points WHERE id = $1', [userId]);
                    });
            }
            return result;
        })
        .then((result) => {
            const currentPoints = result.rows[0].points;
            const newPoints = Math.max(0, currentPoints + pointsChange); // Ensure points don't go below 0
            const newRank = calculateRank(newPoints);
            
            // Update points and rank
            const updateQuery = 'UPDATE points SET points = $1, rank = $2 WHERE id = $3';
            return client.query(updateQuery, [newPoints, newRank, userId]);
        })
        .then(() => {
            return client.query('COMMIT');
        })
        .catch((err) => {
            return client.query('ROLLBACK').then(() => {
                throw err;
            });
        });
}

// Calculate rank based on points
function calculateRank(points) {
    if (points >= 700) return 'Diamond';
    if (points >= 401) return 'Platinum';
    if (points >= 201) return 'Gold';
    if (points >= 101) return 'Silver';
    return 'Bronze';
}

// Award points for successful task completion
function awardPoints(userId, taskTimeInMinutes) {
    const pointsToAward = taskTimeInMinutes; // 1:1 relationship
    return updateUserPoints(userId, pointsToAward);
}

// Penalize points for failed task completion
function penalizePoints(userId, taskTimeInMinutes) {
    const pointsToPenalize = -taskTimeInMinutes; // Negative points
    return updateUserPoints(userId, pointsToPenalize);
}

module.exports = {
    initializeUserPoints,
    getUserPoints,
    updateUserPoints,
    calculateRank,
    awardPoints,
    penalizePoints
};
