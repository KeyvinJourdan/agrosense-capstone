const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send('Selamat Datang di AgroSense API')
});

// Registrasi
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const connection = req.app.get('dbConnection');
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await connection.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const connection = req.app.get('dbConnection');
    const jwtSecret = req.app.get('jwtSecret');
    
    try {
        const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];
        
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    // Untuk logout, kita bisa menghapus token dari client-side.
    // Di server-side, kita bisa mengimplementasikan mekanisme token blacklisting jika diperlukan.
    res.json({ message: 'User logged out successfully' });
});

module.exports = router;
