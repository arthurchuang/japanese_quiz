let quiz = [];
let currentIndex = 0;
let score = 0;
let answered = false;

// Load quiz
window.onload = async function () {
    try {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("dateDisplay").textContent = today;

        const response = await fetch(`./quizzes/daily-${today}.json`);
        if (!response.ok) throw new Error("No quiz found");

        quiz = await response.json();

        displayQuestion();
    } catch (err) {
        alert("Failed to load quiz: " + err.message);
        console.error(err);
    }
};

function displayQuestion() {
    const q = quiz[currentIndex];

    answered = false;

    document.getElementById("progress").textContent =
        `${currentIndex + 1} / ${quiz.length}`;

    document.getElementById("questionWord").textContent = q.question;
    document.getElementById("feedback").textContent = "";
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("nextBtn").style.display = "none";

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    // 🟢 MCQ handling
    if (q.type === "mcq") {
        q.options.forEach(option => {
            const btn = document.createElement("button");
            btn.textContent = option;
            btn.className = "option";

            btn.onclick = () => handleAnswer(option, q);

            optionsDiv.appendChild(btn);
        });
    }

    // 🔵 Fill-in-the-blank handling (tap to reveal)
    else if (q.type === "fill-in-the-blank") {
        const btn = document.createElement("button");
        btn.textContent = "Show Answer";
        btn.className = "option";

        btn.onclick = () => handleAnswer(q.answer, q);

        optionsDiv.appendChild(btn);
    }
}

function handleAnswer(selected, q) {
    if (answered) return;

    answered = true;

    const feedback = document.getElementById("feedback");

    if (q.type === "mcq") {
        const buttons = document.querySelectorAll(".option");

        buttons.forEach(btn => {
            if (btn.textContent === q.answer) {
                btn.style.backgroundColor = "#c8f7c5"; // correct = green
            } else if (btn.textContent === selected) {
                btn.style.backgroundColor = "#f7c5c5"; // wrong = red
            }
            btn.disabled = true;
        });

        if (selected === q.answer) {
            feedback.textContent = "✅ Correct!";
            score++;
        } else {
            feedback.textContent = `❌ Wrong!`;
        }
    }

    // Fill-in-the-blank: always reveal
    else {
        feedback.textContent = `💡 Answer: ${q.answer}`;
        score++; // optional: always reward
    }

    // 📘 Show explanation (VERY IMPORTANT UX)
    const explanation = document.createElement("div");
    explanation.style.marginTop = "10px";
    explanation.style.fontSize = "0.9rem";
    explanation.style.color = "#555";
    explanation.textContent = q.explanation;

    document.getElementById("options").appendChild(explanation);

    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("nextBtn").style.display = "block";
}

document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex++;

    if (currentIndex >= quiz.length) {
        document.getElementById("questionWord").textContent = "🎉 Quiz Complete!";
        document.getElementById("options").innerHTML = "";
        document.getElementById("feedback").textContent = `Final Score: ${score}`;
        document.getElementById("nextBtn").style.display = "none";
        document.getElementById("refreshBtn").style.display = "block";
        return;
    }

    displayQuestion();
});