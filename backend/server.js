const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Register
app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email in use' });

        const userRole = role === 'admin' ? 'admin' : 'client';
        const tier = userRole === 'admin' ? 'Executive Fleet Manager' : 'Speedo Silver Member';
        const discount = userRole === 'admin' ? 0.20 : 0.05;

        await pool.query(
            'INSERT INTO users (name, email, password, role, loyaltyTier, discountRate) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, password, userRole, tier, discount]
        );
        const [users] = await pool.query('SELECT id, name, email, role, loyaltyTier, discountRate FROM users WHERE email = ?', [email]);
        res.json({ success: true, user: users[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

// Login / Auth
app.post('/api/login', async (req, res) => {
    const { email, password, requiredRole } = req.body;
    try {
        const [users] = await pool.query('SELECT id, name, email, role, loyaltyTier, discountRate FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length > 0) {
            const user = users[0];
            if (requiredRole && requiredRole === 'admin' && user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Access denied: Admin credentials required' });
            }
            res.json({ success: true, user });
        } else {
            // Also accept default admin credentials if not yet in database
            if (email === 'admin@speedo.com' && password === 'admin123') {
                const adminUser = {
                    id: 999,
                    name: 'Speedo Fleet Admin',
                    email: 'admin@speedo.com',
                    role: 'admin',
                    loyaltyTier: 'Executive Administrator',
                    discountRate: 0.25
                };
                return res.json({ success: true, user: adminUser });
            }
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        // Fallback for default admin
        if (email === 'admin@speedo.com' && password === 'admin123') {
            return res.json({
                success: true,
                user: {
                    id: 999,
                    name: 'Speedo Fleet Admin',
                    email: 'admin@speedo.com',
                    role: 'admin',
                    loyaltyTier: 'Executive Administrator',
                    discountRate: 0.25
                }
            });
        }
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

// For prototyping, we often just want a GET /api/user mapping to a specific user (our dummy user)
app.get('/api/user', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, loyaltyTier, discountRate FROM users LIMIT 1');
        if (users.length > 0) {
            res.json(users[0]);
        } else {
            res.status(404).json({ message: 'No users found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Vehicles
app.get('/api/vehicles', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM vehicles');
        // Map database properties (MySQL booleans are tinyint 1/0)
        const formattedRows = rows.map(r => ({
            ...r,
            available: !!r.available,
            maintenance: { status: r.maintenanceStatus }
        }));
        res.json(formattedRows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/vehicles', async (req, res) => {
    const v = req.body;
    try {
        const id = `car-${Date.now()}`;
        await pool.query(
            `INSERT INTO vehicles 
       (id, name, category, dailyRate, horsepower, zeroToSixty, topSpeed, transmission, location, image, available, maintenanceStatus) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, v.name, v.category || 'Luxury SUV', Number(v.dailyRate) || 45000,
                v.horsepower || '450 HP', v.zeroToSixty || '3.8s', v.topSpeed || '260 km/h',
                v.transmission || 'Automatic', v.location || 'Banjara Hills, Hyderabad, India',
                v.image || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
                true, 'Optimal'
            ]
        );
        const [newVehicle] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
        const r = newVehicle[0];
        res.json({
            ...r,
            available: !!r.available,
            maintenance: { status: r.maintenanceStatus }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/vehicles/:id', async (req, res) => {
    const { id } = req.params;
    const v = req.body;
    try {
        const maintenanceStatus = v.maintenanceStatus || (v.maintenance && v.maintenance.status) || 'Optimal';
        await pool.query(
            `UPDATE vehicles 
             SET name = ?, category = ?, dailyRate = ?, horsepower = ?, zeroToSixty = ?, topSpeed = ?, transmission = ?, location = ?, image = ?, available = ?, maintenanceStatus = ? 
             WHERE id = ?`,
            [
                v.name, v.category, Number(v.dailyRate),
                v.horsepower, v.zeroToSixty, v.topSpeed || '280 km/h',
                v.transmission || 'Automatic', v.location,
                v.image, v.available ? 1 : 0, maintenanceStatus,
                id
            ]
        );
        const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Vehicle not found' });
        const r = rows[0];
        res.json({
            ...r,
            available: !!r.available,
            maintenance: { status: r.maintenanceStatus }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/vehicles/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM bookings WHERE carId = ?', [id]);
        const [result] = await pool.query('DELETE FROM vehicles WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Vehicle not found' });
        res.json({ success: true, message: 'Vehicle deleted successfully', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM bookings ORDER BY startDate DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    const b = req.body;
    try {
        const id = `bk-${Date.now()}`;
        await pool.query(
            `INSERT INTO bookings 
       (id, carId, userId, carName, startDate, endDate, days, totalPaid, status, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, b.carId, b.userId || 1, b.carName, b.startDate, b.endDate,
                b.days, b.totalPaid, 'Confirmed', b.location
            ]
        );
        const [newBooking] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
        res.json(newBooking[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Auto-migrate / seed database with Indian locations & INR rates
async function ensureDatabaseSeeded() {
    try {
        // Ensure admin user
        const [admins] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@speedo.com']);
        if (admins.length === 0) {
            await pool.query(
                'INSERT INTO users (name, email, password, role, loyaltyTier, discountRate) VALUES (?, ?, ?, ?, ?, ?)',
                ['Speedo Fleet Admin', 'admin@speedo.com', 'admin123', 'admin', 'Executive Administrator', 0.25]
            );
            console.log('Seeded admin user: admin@speedo.com / admin123');
        }

        // Migrate vehicle locations and rates
        await pool.query(`
            UPDATE vehicles 
            SET location = 'Banjara Hills, Hyderabad, India' 
            WHERE location LIKE '%Los Angeles%' OR location LIKE '%LAX%' OR location IS NULL OR location = ''
        `);
        await pool.query(`
            UPDATE vehicles 
            SET location = 'Jubilee Hills, Hyderabad, India' 
            WHERE location LIKE '%Miami%'
        `);
        await pool.query(`
            UPDATE vehicles 
            SET location = 'Whitefield, Bangalore, India' 
            WHERE location LIKE '%San Francisco%'
        `);

        // Convert any low USD rates to realistic INR rates (e.g. < 5000 -> in thousands)
        await pool.query(`
            UPDATE vehicles 
            SET dailyRate = dailyRate * 85 
            WHERE dailyRate < 5000
        `);

        // Update bookings locations & rates
        await pool.query(`
            UPDATE bookings 
            SET location = 'Banjara Hills, Hyderabad, India' 
            WHERE location LIKE '%Los Angeles%' OR location LIKE '%LAX%'
        `);
        await pool.query(`
            UPDATE bookings 
            SET location = 'Jubilee Hills, Hyderabad, India' 
            WHERE location LIKE '%Miami%'
        `);
        await pool.query(`
            UPDATE bookings 
            SET location = 'Whitefield, Bangalore, India' 
            WHERE location LIKE '%San Francisco%'
        `);
        await pool.query(`
            UPDATE bookings 
            SET totalPaid = totalPaid * 85 
            WHERE totalPaid < 10000
        `);

        console.log('Database synced with 3 Indian locations and INR currency.');
    } catch (err) {
        console.warn('Auto-seed warning:', err.message);
    }
}

const PORT = 5000;
app.listen(PORT, async () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    await ensureDatabaseSeeded();
});
