const express = require('express');
const app = express();
const port = 3000;
const client = require('../Model/database');

// Middleware to parse JSON requests
app.use(express.json());

// CORS middleware to allow frontend to communicate with backend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.post('/signup', (req, res) => {
    console.log('Signup request received:', req.body);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
        console.log('Missing username or password');
        return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    console.log('Executing query:', query, 'with values:', [username, password]);

    client.query(query, [username, password], (err, result) => {
        if (err) {
            console.error('Database error during signup:', err);
            res.status(500).json({ error: 'Failed to insert data: ' + err.message });
        } else {
            console.log('User successfully inserted:', result);
            res.status(200).json({ message: 'Data inserted successfully' });
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    
    client.query(query, [username, password], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid username or password' });
        } else {
            res.status(200).json({ message: 'Login successful', user: result.rows[0] });
        }
    });
});

// Serve static files from the Views/dist directory (built React app)
app.use(express.static('../Views/dist'));

// Catch-all route for client-side routing
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '../Views/dist' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});