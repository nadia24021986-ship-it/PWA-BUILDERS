const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
    try {
        // Membuat tabel soal otomatis
        await sql`
            CREATE TABLE IF NOT EXISTS questions (
                id SERIAL PRIMARY KEY,
                question_text TEXT NOT NULL,
                type VARCHAR(20) NOT NULL,
                options TEXT,
                correct_answer TEXT NOT NULL
            );
        `;

        // Membuat tabel peserta otomatis
        await sql`
            CREATE TABLE IF NOT EXISTS participants (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                position VARCHAR(100) NOT NULL,
                status VARCHAR(20) DEFAULT 'active',
                score INT DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        return res.status(200).json({ success: true, message: "Semua tabel berhasil dibuat otomatis!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
