const { Client } = require("pg");

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root1234",
    database: "postgres",
});

client.connect().then(() => {
    console.log("Connected to the database");
}).catch((err) => {
    console.error("Error connecting to the database", err);
});

module.exports = client;