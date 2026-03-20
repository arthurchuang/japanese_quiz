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
You are a professional Japanese teacher.

STRICT RULES:
- Japanese must sound natural to native speakers
- Do NOT create unnatural sentences
- Use only correct grammar (JLPT N5 level) from the provided sentences
- Do NOT use any grammar points that are not in the provided sentences

TASK:
Generate exactly 10 grammar quiz questions.

FORMAT:
- All 10 questions must be type "mcq"
- Each question must be a Japanese sentence with one word or particle replaced by a blank (_____)
- The blank must test a grammar point from the provided sentences
- The question sentence must NOT contain the answer word anywhere outside the blank
- The options must NOT appear anywhere in the question sentence
- Each question must have exactly 4 options to fill in the blank
- Each question must have EXACTLY 1 correct answer and 3 incorrect distractors
- The 3 distractors must be clearly wrong in the context of the sentence
- Provide a brief explanation in English for why the correct answer is right
- Do NOT ask meta questions like "which particle is used here" — just show the sentence with a blank

JAPANESE WRITING RULES:
- All Japanese text in "question", "options", and "answer" must be written in hiragana/katakana only
- If the original word contains kanji, add it in parentheses after the reading: e.g. "まいあさ（毎朝）"
- Apply this rule to ALL Japanese text including options and answers
EXAMPLE FORMAT:
{
  "type": "mcq",
  "question": "このたてもの(建物)は_____です。",
  "options": ["ふる(古)くない", "ふる(古)くて", "ふる(古)い", "ふる(古)く"],
  "answer": "ふる(古)くない",
  "explanation": "ふる(古)くない is the negative form of the i-adjective ふる(古)い. To negate an i-adjective, drop the い and add くない."
}

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