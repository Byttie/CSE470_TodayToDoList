const client = require('./database');

function addTask(userId, taskId, taskName, description, priority, time) {
    const query = 'INSERT INTO tasks (id, taskid, task, "desc", priority, time, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())';
    return client.query(query, [userId, taskId, taskName, description, priority, time]);
}

function listTasks(userId) {
    const query = 'SELECT id, taskid, task, "desc" as description, priority, time, created_at FROM tasks WHERE id = $1 ORDER BY taskid DESC';
    return client.query(query, [userId]);
}

function deleteTask(userId, taskId) {
    const query = 'DELETE FROM tasks WHERE id = $1 AND taskid = $2';
    return client.query(query, [userId, taskId]);
}

module.exports = { addTask, listTasks, deleteTask }; 