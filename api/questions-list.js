const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
    // Memastikan hanya menerima permintaan mengambil data (GET)
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Metode tidak diizinkan' });
    }

    try {
        // Ambil soal, tapi JANGAN ambil kolom 'correct_answer' demi keamanan
        const { rows } = await sql`
            SELECT id, question_text, type, options 
            FROM questions;
        `;
        
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

