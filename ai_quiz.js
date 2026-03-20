// Global state
window.currentQuiz = [];
window.currentQuestionIndex = 0;

// DOM elements
const loadingEl = document.getElementById("loading");
const dateDisplayEl = document.getElementById("dateDisplay");
const progressEl = document.getElementById("progress");
const questionWordEl = document.getElementById("questionWord");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const refreshBtn = document.getElementById("refreshBtn");

// 1️⃣ Fetch and display list of available quizzes
async function showQuizList() {
    try {
        loadingEl.textContent = "Loading available quizzes...";
        const response = await fetch(`./quizzes/index.json?t=${Date.now()}`);
        if (!response.ok) throw new Error("Failed to load index.json");

        const quizzes = await response.json();
        loadingEl.textContent = "";
        dateDisplayEl.textContent = "Select a quiz:";

        // Clear previous content
        const quizListEl = document.getElementById("quizList");
        quizListEl.innerHTML = "";

        quizzes.reverse().forEach((quizFile) => {
            const btn = document.createElement("button");
            btn.className = "option";
            btn.textContent = quizFile.replace(".json", "");
            btn.onclick = () => loadQuiz(quizFile);
            quizListEl.appendChild(btn);
        });
    } catch (err) {
        loadingEl.textContent = "Failed to load quizzes.";
        console.error(err);
    }
}

// 2️⃣ Load selected quiz JSON
async function loadQuiz(fileName) {
    document.getElementById("quiz-list-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";

    try {
        loadingEl.textContent = "Loading quiz...";
        const response = await fetch(`./quizzes/${fileName}?t=${Date.now()}`);
        if (!response.ok) throw new Error("Failed to load quiz JSON");

        const quizData = await response.json();
        window.currentQuiz = quizData;
        window.currentQuestionIndex = 0;

        // Update date display
        dateDisplayEl.textContent = fileName.replace(".json", "");

        // Hide loading, show quiz
        loadingEl.style.display = "none";
        nextBtn.disabled = false;
        optionsEl.innerHTML = "";
        feedbackEl.textContent = "";
        scoreEl.textContent = "";

        displayQuestion();
    } catch (err) {
        loadingEl.textContent = "Failed to load quiz.";
        console.error(err);
    }
}

// 3️⃣ Display current question
function displayQuestion() {
    if (!window.currentQuiz.length) return;

    const current = window.currentQuiz[window.currentQuestionIndex];

    // Update progress
    progressEl.textContent = `Question ${window.currentQuestionIndex + 1} / ${window.currentQuiz.length}`;

    // Update question text
    questionWordEl.textContent = current.question;

    // Clear options & feedback
    optionsEl.innerHTML = "";
    feedbackEl.textContent = "";

    // Fill options for MCQ
    if (current.type === "mcq") {
        current.options.forEach((opt) => {
            const btn = document.createElement("button");
            btn.className = "option";
            btn.textContent = opt;
            btn.onclick = () => selectAnswer(opt, current.answer, current.explanation);
            optionsEl.appendChild(btn);
        });
    }

    // Fill for fill-in-the-blank
    else if (current.type === "fill-in-the-blank") {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Type your answer...";
        input.style.width = "100%";
        input.style.padding = "12px";
        input.style.fontSize = "1rem";
        input.onkeydown = (e) => {
            if (e.key === "Enter") selectAnswer(input.value, current.answer, current.explanation);
        };
        optionsEl.appendChild(input);
    }
}

// 4️⃣ Handle answer selection
function selectAnswer(selected, correct, explanation) {
    feedbackEl.textContent = selected === correct ? "✅ Correct!" : `❌ Incorrect! ${explanation}`;

    // Disable all option buttons
    document.querySelectorAll(".option").forEach((btn) => (btn.disabled = true));

    // Show next button if more questions remain
    if (window.currentQuestionIndex < window.currentQuiz.length - 1) {
        nextBtn.style.display = "block";
        nextBtn.disabled = false;
    } else {
        refreshBtn.style.display = "block";
        nextBtn.style.display = "none";
    }
}

// 5️⃣ Next question
function nextQuestion() {
    window.currentQuestionIndex++;
    if (window.currentQuestionIndex < window.currentQuiz.length) {
        displayQuestion();
    }
    nextBtn.style.display = "none";
}

// 6️⃣ Initialize
nextBtn.onclick = nextQuestion;
showQuizList();