import fs from "fs";
import { n5Questions } from "./grammar_questions.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickRandom(arr, n) {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

function isValidQuiz(quiz) {
    return (
        Array.isArray(quiz) &&
        quiz.length > 0 &&
        quiz.every((q) => q.type === "translation" && q.question && q.answer)
    );
}

// ─── Groq ─────────────────────────────────────────────────────────────────────

async function callGroq(prompt) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function generateQuiz() {
    // Give Groq a random pool of 40 to choose 10 diverse sentences from
    const pool = pickRandom(n5Questions, 40);

    const prompt = `
You are a JLPT N5 Japanese teacher. You will be given a pool of Japanese sentences, each with an index.

Your task: pick exactly 10 sentences that together cover a diverse variety of grammar points
(e.g. don't pick 3 sentences that all use な-adjectives — spread across verbs, particles, adjectives, tenses, etc.).

Return ONLY a JSON array of the indices you selected (0-based), nothing else. No explanation, no markdown.

Example output: [0, 4, 7, 12, 15, 19, 22, 28, 33, 37]

Pool:
${JSON.stringify(pool.map((entry, i) => ({ index: i, q: entry.q })))}
`;

    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            const text = await callGroq(prompt);

            let indices;
            try {
                indices = JSON.parse(text.trim());
            } catch {
                console.log(`  ⚠️  Attempt ${attempt}: JSON parse failed, retrying...`);
                continue;
            }

            if (
                !Array.isArray(indices) ||
                indices.length !== 10 ||
                indices.some((i) => typeof i !== "number" || i < 0 || i >= pool.length)
            ) {
                console.log(`  ⚠️  Attempt ${attempt}: Invalid indices, retrying...`);
                continue;
            }

            const quiz = indices.map((i) => ({
                type: "translation",
                question: pool[i].q,
                answer: pool[i].a,
            }));

            if (!isValidQuiz(quiz)) {
                console.log(`  ⚠️  Attempt ${attempt}: Invalid quiz format, retrying...`);
                continue;
            }

            // Save quiz file
            const date = new Date().toISOString().split("T")[0];
            const filename = `./quizzes/daily-${date}.json`;
            fs.writeFileSync(filename, JSON.stringify(quiz, null, 2));
            console.log("✅ Quiz saved:", filename);

            // Update index.json
            const indexFile = "./quizzes/index.json";
            const index = fs.existsSync(indexFile)
                ? JSON.parse(fs.readFileSync(indexFile, "utf-8"))
                : [];
            const entry = `daily-${date}.json`;
            if (!index.includes(entry)) {
                index.push(entry);
                fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
                console.log("✅ Index updated:", indexFile);
            }

            return;

        } catch (err) {
            console.error(`  ❌ Attempt ${attempt} error:`, err.message);
        }
    }

    console.error("❌ Failed to generate quiz after all attempts");
    process.exit(1);
}

generateQuiz();