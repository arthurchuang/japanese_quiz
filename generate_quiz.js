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

    const selected = pickRandom(sentences, 50);

    const prompt = `
You are a Japanese teacher creating JLPT N5 grammar quizzes.

Use only natural Japanese.
Use only grammar found in the provided sentences.
Do not use any new grammar points.
Skip anything uncertain or unnatural.

Generate exactly 10 questions.

For each question:
- "type" must be "mcq"
- Use one Japanese sentence with one blank: _____
- The blank must test a grammar point from the provided sentences
- Do not show the answer anywhere else in the sentence
- None of the options may appear in the question sentence
- Give exactly 4 options
- Include 1 correct answer and 3 clearly wrong distractors
- Add a short English explanation
- Do not ask meta questions
- Do not create questions where the blank overlaps with text already appearing before or after the blank.
   - Bad example:
     question: "______のホテルのプールは良くありません。"
     answer: "このホテルのプールは"
     This creates duplication and is invalid.

Japanese text rules:
- In "question", "options", and "answer", use hiragana/katakana only
- If a word normally uses kanji, add the kanji in parentheses after the reading
- Apply this to all Japanese text
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