//include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};
//initialize Express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start server
app.listen(port, () => {
    console.log('Server running on port', port);
});

//Example Route: Get all cars
app.get('/allcars', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.cars');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allcars' });
    }
});

//Add car
app.post('/addcar', async (req, res) => {
    const { car_name, car_pic } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO cars (car_name, car_pic) VALUES (?, ?)',
            [car_name, car_pic]
        );
        await connection.end();
        res.json({ message: 'Car added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding car' });
    }
});

//Update
app.put('/updatecar/:id', async (req, res) => {
    const { id } = req.params;
    const { car_name, car_pic } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE cars SET car_name = ?, car_pic = ? WHERE id = ?',
            [car_name, car_pic, id]
        );
        await connection.end();
        res.json({ message: 'Car updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating car' });
    }
});

//Delete cars
app.delete('/deletecar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM cars WHERE id = ?',
            [id]
        );
        await connection.end();
        res.json({ message: 'Car deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting car' });
    }
});


