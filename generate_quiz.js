import fs from "fs";

function pickRandom(arr, n) {
    return arr.sort(() => 0.5 - Math.random()).slice(0, n);
}

function isValidQuiz(quiz) {
    return Array.isArray(quiz) &&
        quiz.length === 10 &&
        quiz.every(q =>
            q.question &&
            q.answer &&
            typeof q.question === "string" &&
            typeof q.answer === "string"
        );
}

async function callGroq(prompt) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

async function generateQuiz() {
    const sentences = JSON.parse(
        fs.readFileSync("./data/sentences.json", "utf-8")
    );

    const selected = pickRandom(sentences, 6);

    const prompt = `
You are a professional Japanese teacher.

STRICT RULES:
- Japanese must sound natural to native speakers
- Do NOT create unnatural sentences
- Use only correct grammar (JLPT N4–N3 level)

TASK:
Generate exactly 10 grammar quiz questions.

FORMAT:
- 5 multiple choice (4 options)
- 5 fill-in-the-blank

Return ONLY valid JSON:

[
  {
    "type": "mcq",
    "question": "",
    "options": [],
    "answer": "",
    "explanation": ""
  }
]

If unsure, skip the sentence.

Sentences:
${JSON.stringify(selected)}
`;

    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            const text = await callGroq(prompt);

            let quiz;
            try {
                quiz = JSON.parse(text);
            } catch {
                console.log("JSON parse failed, retrying...");
                continue;
            }

            if (!isValidQuiz(quiz)) {
                console.log("Invalid format, retrying...");
                continue;
            }

            const filename = `./quizzes/daily-${new Date()
                .toISOString()
                .split("T")[0]}.json`;

            fs.writeFileSync(filename, JSON.stringify(quiz, null, 2));

            console.log("✅ Quiz generated:", filename);
            return;

        } catch (err) {
            console.error("Error:", err);
        }
    }

    console.error("❌ Failed after retries");
}

generateQuiz();