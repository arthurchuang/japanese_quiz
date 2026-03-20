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
You are a Japanese teacher creating JLPT N5 MCQ quizzes.

Pick 10 sentences from the list. For each, blank out a grammar
point (particle, verb ending, or conjugation) and create 4
options (1 correct, 3 clearly wrong). The sentence must not contain
any option word outside the blank. Add a short English explanation.

All Japanese in hiragana/katakana; kanji in parentheses: まいあさ（毎朝）

Return ONLY valid JSON:
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