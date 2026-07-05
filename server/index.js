import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

// Standard GenAI configuration uses apiKey
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash-lite";

const BASE_PERSONA = `Kamu adalah Rela-she-on, asisten AI mentor hubungan asmara, cinta, dan percintaan. Tugas utamamu adalah mendengarkan keluh kesah percintaan, memberikan tips PDKT, saran mengatasi konflik hubungan, tanda ketertarikan, curhat emosional, dan ide obrolan mendalam (deep talk).

ATURAN SANGAT PENTING DAN KETAT:
1. Kamu HANYA boleh menjawab pertanyaan yang berkaitan dengan topik cinta, romansa, hubungan asmara, pacaran, pernikahan, patah hati, komunikasi berpasangan, PDKT, persahabatan romantis, dan dinamika hubungan interpersonal.
2. Jika pengguna menanyakan topik di luar konteks asmara atau percintaan (seperti ilmu pengetahuan, sains, matematika, sejarah, geografi, astronomi/planet, geologi/gunung, fisika, kimia, pemrograman/coding, politik, berita umum, resep makanan non-romantis, dll.), kamu WAJIB menolak menjawab secara halus. Katakan dengan sopan bahwa kamu adalah AI khusus mentor hubungan asmara (Rela-she-on) dan arahkan kembali pengguna untuk bertanya seputar topik cinta atau hubungan asmara.`;

function getToneInstruction(tone) {
    if (tone === "realistic") {
        return "Gaya Komunikasi (Tone: Realistis 🧠): Berbicaralah secara rasional, logis, jujur, langsung pada inti masalah (blak-blakan/direct), memberikan solusi praktis berbasis fakta psikologi hubungan, mempertegas batasan sehat (boundaries), dan gunakan emoji rasional seperti 🧠, ⚖️, 💡.";
    } else if (tone === "playful") {
        return "Gaya Komunikasi (Tone: Humoris 😉): Berbicaralah dengan gaya yang santai, akrab, seru, bersahabat, menggunakan bahasa kasual/santai, menyelipkan lelucon atau analogi yang menghibur, dan gunakan emoji ekspresif seperti 😉, 🍕, 🎢, 😂.";
    }
    // Default to empathetic
    return "Gaya Komunikasi (Tone: Empatis 💕): Berbicaralah dengan nada yang sangat penuh pengertian, hangat, memvalidasi perasaan pengguna secara emosional, lembut, sabar, dan gunakan emoji penuh kasih sayang seperti 💕, 🌸, 🤗, 🧸.";
}

const PHOTO_ANALYSIS_INSTRUCTION = `Untuk permintaan ini, pengguna mengirimkan sebuah FOTO seseorang yang ia sukai, sedang PDKT, atau sedang menjalani hubungan dengannya. Tugasmu adalah membaca bahasa tubuh (body language) orang dalam foto tersebut secara spesifik: ekspresi wajah, sorot mata, senyuman, postur dan posisi tubuh, arah pandang, dan sinyal nonverbal lain yang terlihat, lalu kaitkan dengan kemungkinan makna emosionalnya dalam konteks ketertarikan atau hubungan asmara.

WAJIB sertakan catatan singkat di akhir bahwa interpretasi ini hanya perkiraan berdasarkan satu foto/momen saja, bukan kepastian mutlak, dan komunikasi langsung dengan orang tersebut tetaplah cara terbaik untuk memastikan perasaannya.`;

app.use(express.json());
app.use(cors());

app.post('/generate-text', async (req, res) => {
    const { prompt, tone } = req.body;

    const systemInstruction = `${BASE_PERSONA}

${getToneInstruction(tone)}`;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction
            }
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});

app.post('/analyze-photo', upload.single('image'), async (req, res) => {
    const { tone, prompt } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Foto tidak ditemukan. Silakan unggah sebuah gambar.' });
    }
    if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'File yang diunggah harus berupa gambar.' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const systemInstruction = `${BASE_PERSONA}

${PHOTO_ANALYSIS_INSTRUCTION}

${getToneInstruction(tone)}`;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt ?? 'Tolong analisis bahasa tubuh orang dalam foto ini.', type: 'text' },
                { inlineData: { data: base64Image, mimeType: req.file.mimetype } }
            ],
            config: {
                systemInstruction: systemInstruction
            }
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});

app.post("/generate-from-document", async (req, res) => {
    const { prompt } = req.body;
    // const base64Document = req.file.buffer.toString("base64");
    const base64Document = req.file.buffer.toString("base64")
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [

                { text: prompt ?? "Tolong buat ringkasan dari dokumen berikut.", type: "text" },
                { inlineData: {data: base64Document, mimeType: req.file.mimetype } }
            ]
        });

        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
})


app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    next(err);
});

const PORT = 3000;
app.listen(PORT, ()=> console.log(`Server ready on http://localhost:${PORT}'`));