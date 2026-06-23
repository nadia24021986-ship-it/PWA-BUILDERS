const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
    // Memastikan hanya menerima kiriman data (POST)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metode tidak diizinkan' });
    }

    try {
        const { text, type, options, correct } = req.body;
        
        // Simpan soal ke tabel 'questions' di Vercel Postgres
        await sql`
            INSERT INTO questions (question_text, type, options, correct_answer)
            VALUES (${text}, ${type}, ${JSON.stringify(options)}, ${correct});
        `;
        
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

