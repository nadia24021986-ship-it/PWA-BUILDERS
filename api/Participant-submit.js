const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
    // Memastikan hanya menerima kiriman data (POST)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metode tidak diizinkan' });
    }

    try {
        const { participantId, answers } = req.body; // answers berupa objek { soalId: "jawaban" }

        // 1. Ambil semua kunci jawaban asli dari database
        const { rows: questions } = await sql`SELECT id, correct_answer FROM questions`;
        
        let totalSoal = questions.length;
        let benar = 0;

        // 2. Hitung jawaban yang benar (tidak sensitif huruf besar/kecil dan spasi)
        questions.forEach(q => {
            const userAnswer = answers[q.id]?.toString().trim().toLowerCase();
            const correctAnswer = q.correct_answer.toString().trim().toLowerCase();
            if (userAnswer === correctAnswer) {
                benar++;
            }
        });

        // 3. Hitung rumus nilai akhir (skala 0 - 100)
        const score = totalSoal > 0 ? Math.round((benar / totalSoal) * 100) : 0;

        // 4. Update data peserta di database: ganti status dan simpan nilai
        await sql`
            UPDATE participants 
            SET status = 'completed', score = ${score}, updated_at = NOW()
            WHERE id = ${participantId};
        `;

        // Kirim balik nilai akhir ke HP peserta untuk ditampilkan
        return res.status(200).json({ success: true, score });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

