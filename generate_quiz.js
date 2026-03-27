import fs from "fs";

function pickRandom(arr, n) {
    return arr.sort(() => 0.5 - Math.random()).slice(0, n);
}

function isValidQuiz(quiz) {
    return (
        Array.isArray(quiz) &&
        quiz.length > 0 &&
        quiz.every(
            (q) =>
                q.type === "mcq" &&
                q.question &&
                Array.isArray(q.options) &&
                q.options.length === 4 &&
                q.answer &&
                q.explanation
        )
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
            model: "llama-3.3-70b-versatile",
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

    const selected = pickRandom(sentences, 50);

    const prompt = `
You are a native Japanese teacher creating JLPT N5 MCQ quizzes for Chinese speakers.

Pick exactly 10 sentences from the provided pool.
Do not blank out, remove, or change any part of the sentence.

For each sentence:
- Show the full original Japanese sentence as the question
- Provide 4 Chinese translation options: 1 correct translation and 3 incorrect but plausible alternatives
- The correct answer must match one option exactly, character for character
- Add a short explanation in Chinese about why the correct translation is right

Use only one sentence per question.
Return ONLY valid JSON.

OUTPUT SCHEMA:
[
  {
    "type": "mcq",
    "question": "<full original Japanese sentence>",
    "options": ["...", "...", "...", "..."],
    "answer": "<correct Chinese translation>",
    "explanation": "<short Chinese explanation>"
  }
]

If unsure about a sentence, skip it.

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