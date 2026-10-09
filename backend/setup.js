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

        // Seed dummy users
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', ['julian.sterling@apex.corp']);
        if (users.length === 0) {
            await connection.query(
                "INSERT INTO users (name, email, password, role, loyaltyTier, discountRate) VALUES (?, ?, ?, ?, ?, ?)",
                ['Julian Sterling', 'julian.sterling@apex.corp', 'password123', 'client', 'Apex Black Member', 0.15]
            );
            console.log('Dummy user inserted.');
        }

        const [adminUser] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@speedo.com']);
        if (adminUser.length === 0) {
            await connection.query(
                "INSERT INTO users (name, email, password, role, loyaltyTier, discountRate) VALUES (?, ?, ?, ?, ?, ?)",
                ['Speedo Administrator', 'admin@speedo.com', 'admin123', 'admin', 'Executive Fleet Manager', 0.25]
            );
            console.log('Admin user inserted.');
        }

        // Seed dummy vehicles
        const [vehicles] = await connection.query('SELECT * FROM vehicles');
        if (vehicles.length === 0) {
            const initialVehicles = [
                ['car-1', 'Porsche 911 GT3 RS', 'Supercars & Track', 65000, '518 HP', '3.0s', '296 km/h', '7-Speed PDK Dual-Clutch', 'Banjara Hills, Hyderabad, India', 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80', true, 'Optimal'],
                ['car-2', 'Mercedes-AMG G 63 4x4²', 'Luxury SUV', 58000, '577 HP', '4.5s', '220 km/h', '9G-TRONIC Automatic', 'Jubilee Hills, Hyderabad, India', 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80', true, 'Service Due in 2 Days'],
                ['car-3', 'Audi RS e-tron GT', 'Electric Performance', 42000, '637 HP', '3.1s', '250 km/h', '2-Speed Automatic Electric', 'Whitefield, Bangalore, India', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80', true, 'Optimal'],
                ['car-4', 'Lamborghini Urus Performante', 'Luxury SUV', 72000, '666 HP', '3.3s', '306 km/h', '8-Speed Automatic', 'Banjara Hills, Hyderabad, India', 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80', true, 'Optimal'],
                ['car-5', 'Ferrari 296 GTB Hybrid', 'Supercars & Track', 85000, '819 HP', '2.9s', '330 km/h', '8-Speed F1 Dual-Clutch', 'Jubilee Hills, Hyderabad, India', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80', true, 'Optimal'],
                ['car-6', 'Rolls-Royce Ghost Black Badge', 'Executive Luxury', 95000, '592 HP', '4.6s', '250 km/h', '8-Speed Satellite-Aided Auto', 'Whitefield, Bangalore, India', 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=800&q=80', true, 'Optimal']
            ];
            for (const v of initialVehicles) {
                await connection.query(
                    "INSERT INTO vehicles (id, name, category, dailyRate, horsepower, zeroToSixty, topSpeed, transmission, location, image, available, maintenanceStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    v
                );
            }
            console.log('Dummy vehicles inserted.');
        }

        // Seed dummy booking
        const [bookings] = await connection.query('SELECT * FROM bookings');
        if (bookings.length === 0) {
            await connection.query(
                "INSERT INTO bookings (id, carId, userId, carName, startDate, endDate, days, totalPaid, status, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ['bk-991', 'car-1', 1, 'Porsche 911 GT3 RS', '2026-10-12', '2026-10-15', 3, 165750.00, 'Confirmed', 'Banjara Hills, Hyderabad, India']
            );
            console.log('Dummy booking inserted.');
        }

        console.log('Setup finished.');
        process.exit(0);
    } catch (err) {
        console.error('Setup failed:', err);
        process.exit(1);
    }
}

setup();
