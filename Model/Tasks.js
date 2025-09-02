const client = require('./database');

function addTask(userId, taskId, taskName) {
    const query = 'INSERT INTO tasks (id, taskid, task) VALUES ($1, $2, $3)';
    return client.query(query, [userId, taskId, taskName]);
}

function listTasks(userId) {
    const query = 'SELECT id, taskid, task FROM tasks WHERE id = $1 ORDER BY taskid DESC';
    return client.query(query, [userId]);
}

function deleteTask(userId, taskId) {
    const query = 'DELETE FROM tasks WHERE id = $1 AND taskid = $2';
    return client.query(query, [userId, taskId]);
}

module.exports = { addTask, listTasks, deleteTask }; 