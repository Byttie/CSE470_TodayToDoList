const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the Views/dist directory (built React app)
app.use(express.static('../Views/dist'));

// API route example
app.get('/api/hello', (req, res) => {
    res.send("Hello World");
});

// Catch-all route for client-side routing
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '../Views/dist' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});