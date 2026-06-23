const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
    // Memastikan hanya menerima kiriman data (POST)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metode tidak diizinkan' });
    }

    try {
        const { name, position } = req.body;
        
        // Simpan data peserta dengan status awal 'active' (aktif)
        const { rows } = await sql`
            INSERT INTO participants (name, position, status)
            VALUES (${name}, ${position}, 'active')
            RETURNING id;
        `;
        
        // Kembalikan ID peserta yang baru dibuat ke HP peserta
        return res.status(200).json({ id: rows[0].id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

