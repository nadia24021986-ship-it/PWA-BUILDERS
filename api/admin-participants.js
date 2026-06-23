const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
    // Memastikan hanya menerima permintaan mengambil data (GET)
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Metode tidak diizinkan' });
    }

    try {
        // Ambil data peserta, urutkan dari yang paling baru memperbarui jawaban
        const { rows } = await sql`
            SELECT id, name, position, status, score 
            FROM participants 
            ORDER BY updated_at DESC;
        `;
        
        // Kirim data ke Dashboard Instruktur
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
