import fs from "fs";
import path from "path";

async function textToSpeech(text) {
    const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "playai-tts",
            voice: "Sakura-PlayAI", // Japanese voice
            input: text,
            response_format: "wav",
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Groq TTS failed: ${response.status} ${err}`);
    }

    return Buffer.from(await response.arrayBuffer());
}

async function generateRecordings() {
    // Find today's quiz file
    const date = new Date().toISOString().split("T")[0];
    const quizFile = `./quizzes/daily-${date}.json`;

    if (!fs.existsSync(quizFile)) {
        console.error(`❌ No quiz file found for today: ${quizFile}`);
        process.exit(1);
    }

    const quiz = JSON.parse(fs.readFileSync(quizFile, "utf-8"));

    // Create recordings folder
    const recordingDir = `./recordings/recording-${date}`;
    fs.mkdirSync(recordingDir, { recursive: true });

    console.log(`🎙️ Generating ${quiz.length} recordings into ${recordingDir}...`);

    for (let i = 0; i < quiz.length; i++) {
        const question = quiz[i].question;
        const outputPath = path.join(recordingDir, `question-${i + 1}.wav`);

        console.log(`  [${i + 1}/${quiz.length}] "${question}"`);

        try {
            const audioBuffer = await textToSpeech(question);
            fs.writeFileSync(outputPath, audioBuffer);
            console.log(`  ✅ Saved: ${outputPath}`);
        } catch (err) {
            console.error(`  ❌ Failed for question ${i + 1}:`, err.message);
        }
    }

    console.log("Done!");
}

generateRecordings();