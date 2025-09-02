const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const client = require('../Model/database');
const userSignup = require('../Model/UserSignup');
const userLogin = require('../Model/UserLogin');
const addTaskController = require('./addTaskController');
const listTasksController = require('./listTasksController');
const deleteTaskController = require('./deleteTaskController');

// Middleware to parse JSON requests
app.use(express.json());

app.use(cors());

app.post('/signup', (req, res) => {
    console.log('Signup request received:', req.body);
    const { username, password } = req.body;
    if (!username || !password) {
        console.log('Missing username or password');
        return res.status(400).json({ error: 'Username and password are required' });
    }
    userSignup.signupUser(username, password)
        .then(result => {
            console.log('User successfully inserted:', result);
            res.status(200).json({ message: 'Data inserted successfully' });
        })
        .catch(err => {
            console.error('Database error during signup:', err);
            res.status(500).json({ error: 'Failed to insert data: ' + err.message });
        });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    userLogin.loginUser(username, password)
        .then(result => {
            if (result.rows.length === 0) {
                res.status(401).json({ error: 'Invalid username or password' });
            } else {
                res.status(200).json({ message: 'Login successful', user: result.rows[0] });
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'Database error' });
        });
});

// Mount task controllers
app.use('/', addTaskController);
app.use('/', listTasksController);
app.use('/', deleteTaskController);

// Serve static files from the Views/dist directory (built React app)
app.use(express.static('../Views/dist'));

// Catch-all route for client-side routing
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '../Views/dist' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});