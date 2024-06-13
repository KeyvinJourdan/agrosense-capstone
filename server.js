const express = require('express');
const mysql = require('mysql2/promise');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.json());

// Konfigurasi database
const dbConfig = {
    host: '34.128.83.18',
    user: 'root',
    password: 'clarity0010',
    database: 'agrosense'
};

async function initializeDatabase() {
    try {
        const connection = mysql.createPool(dbConfig);
        app.set('dbConnection', connection);

        // Cek koneksi database
        await connection.query('SELECT 1');
        console.log('Koneksi ke database berhasil');

        // Secret JWT
        const JWT_SECRET = 'your_jwt_secret'; // Ganti dengan kunci rahasia Anda
        app.set('jwtSecret', JWT_SECRET);

        // Routes
        app.use('/api', userRoutes);

        // Default route
        app.get('/', (req, res) => {
            res.send('API berjalan dengan baik');
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server berjalan pada port ${PORT}`);
        });
    } catch (error) {
        console.error('Koneksi ke database gagal:', error.message);
        process.exit(1); // Keluar dari aplikasi jika koneksi database gagal
    }
}

initializeDatabase();
