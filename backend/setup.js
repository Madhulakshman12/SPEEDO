const mysql = require('mysql2/promise');

async function setup() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'mysql@M1'
        });

        console.log('Connected to MySQL server.');

        // Create Database
        await connection.query('CREATE DATABASE IF NOT EXISTS car_rental');
        console.log('Database car_rental created or already exists.');

        // Switch to database
        await connection.query('USE car_rental');

        // Create Tables
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('client', 'admin') DEFAULT 'client',
        loyaltyTier VARCHAR(100),
        discountRate DECIMAL(3,2) DEFAULT 0.00
      )
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        dailyRate DECIMAL(10,2),
        horsepower VARCHAR(50),
        zeroToSixty VARCHAR(50),
        topSpeed VARCHAR(50),
        transmission VARCHAR(100),
        location VARCHAR(255),
        image TEXT,
        available BOOLEAN DEFAULT TRUE,
        maintenanceStatus VARCHAR(100)
      )
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(100) PRIMARY KEY,
        carId VARCHAR(100),
        userId INT,
        carName VARCHAR(255),
        startDate DATE,
        endDate DATE,
        days INT,
        totalPaid DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'Confirmed',
        location VARCHAR(255),
        FOREIGN KEY (carId) REFERENCES vehicles(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

        console.log('Tables created successfully.');

        console.log('Setup finished.');
        process.exit(0);
    } catch (err) {
        console.error('Setup failed:', err);
        process.exit(1);
    }
}

setup();
