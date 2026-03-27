import { TypecastClient, TypecastAPIError } from "@neosapience/typecast-js";
import fs from "fs";
import path from "path";

const client = new TypecastClient({
    apiKey: process.env.TYPECAST_API_KEY,
});

async function textToSpeech(text) {
    const audio = await client.textToSpeech({
        text,
        model: "ssfm-v30",
        voice_id: "tc_68f9c6a72f0f04a417bb136f",
        language: "jpn",
        output: {
            audio_format: "wav",
        },
    });

    return Buffer.from(audio.audioData);
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
        const question = quiz[i].question.replace(/（.+?）/, "").trim();
        const outputPath = path.join(recordingDir, `question-${i + 1}.wav`);

        console.log(`  [${i + 1}/${quiz.length}] "${question}"`);

        try {
            const audioBuffer = await textToSpeech(question);
            fs.writeFileSync(outputPath, audioBuffer);
            console.log(`  ✅ Saved: ${outputPath}`);
        } catch (err) {
            if (err instanceof TypecastAPIError) {
                console.error(`  ❌ Typecast API error (${err.statusCode}):`, err.message);
            } else {
                console.error(`  ❌ Failed for question ${i + 1}:`, err.message);
            }
        }
    }

    console.log("Done!");
}

generateRecordings();