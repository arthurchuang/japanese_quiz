// ─── State ────────────────────────────────────────────────────────────────────

window.currentQuiz = [];
window.currentQuestionIndex = 0;
window.currentRecordingDir = null;

// ─── Elements ─────────────────────────────────────────────────────────────────

const loadingEl     = document.getElementById("loading");
const dateDisplayEl = document.getElementById("dateDisplay");
const progressEl    = document.getElementById("progress");
const questionWordEl = document.getElementById("questionWord");
const optionsEl     = document.getElementById("options");
const feedbackEl    = document.getElementById("feedback");
const scoreEl       = document.getElementById("score");
const nextBtn       = document.getElementById("nextBtn");
const refreshBtn    = document.getElementById("refreshBtn");

// ─── Quiz list ────────────────────────────────────────────────────────────────

async function showQuizList() {
    try {
        loadingEl.textContent = "Loading available quizzes...";

        const response = await fetch(`./quizzes/index.json?t=${Date.now()}`);
        if (!response.ok) throw new Error("Failed to load index.json");

        const quizzes = await response.json();
        loadingEl.textContent = "";
        dateDisplayEl.textContent = "Select a quiz:";

        const quizListEl = document.getElementById("quizList");
        quizListEl.innerHTML = "";

        [...quizzes].reverse().forEach((quizFile) => {
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

// ─── Load quiz ────────────────────────────────────────────────────────────────

async function loadQuiz(fileName) {
    document.getElementById("quiz-list-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";

    try {
        loadingEl.textContent = "Loading quiz...";
        loadingEl.style.display = "block";

        const response = await fetch(`./quizzes/${fileName}?t=${Date.now()}`);
        if (!response.ok) throw new Error("Failed to load quiz JSON");

        const quizData = await response.json();
        window.currentQuiz = quizData;
        window.currentQuestionIndex = 0;

        // Derive recording folder: daily-2026-03-21.json → recordings/recording-2026-03-21
        const date = fileName.replace("daily-", "").replace(".json", "");
        window.currentRecordingDir = `./recordings/recording-${date}`;

        dateDisplayEl.textContent = fileName.replace(".json", "");
        loadingEl.style.display = "none";
        optionsEl.innerHTML = "";
        feedbackEl.textContent = "";
        scoreEl.textContent = "";

        displayQuestion();
    } catch (err) {
        loadingEl.textContent = "Failed to load quiz.";
        console.error(err);
    }
}

// ─── Recording ────────────────────────────────────────────────────────────────

async function recordingExists(url) {
    try {
        const res = await fetch(url, { method: "HEAD" });
        return res.ok;
    } catch {
        return false;
    }
}

// ─── Display question ─────────────────────────────────────────────────────────

async function displayQuestion() {
    if (!window.currentQuiz.length) return;

    const current = window.currentQuiz[window.currentQuestionIndex];
    const questionNumber = window.currentQuestionIndex + 1;

    progressEl.textContent = `Question ${questionNumber} / ${window.currentQuiz.length}`;
    optionsEl.innerHTML = "";
    feedbackEl.textContent = "";
    nextBtn.style.display = "none";
    refreshBtn.style.display = "none";

    // Question text
    questionWordEl.innerHTML = "";
    const questionText = current.question;
    const match = questionText.match(/^(.+?)（(.+?)）/);

    const mainText = document.createElement("span");
    mainText.style.fontSize = "1.5rem";

    if (match) {
        mainText.textContent = match[1].trim();

        const furigana = document.createElement("div");
        furigana.textContent = match[2].trim();
        furigana.style.cssText = `font-size: 0.9rem; color: #999; margin-top: 4px;`;

        questionWordEl.appendChild(mainText);
        questionWordEl.appendChild(furigana);
    } else {
        mainText.textContent = questionText;
        questionWordEl.appendChild(mainText);
    }

    // Speaker button (if recording exists)
    const recordingUrl = `${window.currentRecordingDir}/question-${questionNumber}.wav`;
    const hasRecording = await recordingExists(recordingUrl);

    if (hasRecording) {
        const speakerBtn = document.createElement("button");
        speakerBtn.title = "Listen to question";
        speakerBtn.textContent = "📢";
        speakerBtn.style.cssText = `
            background: none; border: none; cursor: pointer;
            font-size: 1.2rem; margin-left: 8px; vertical-align: middle;
            padding: 2px 6px; border-radius: 4px; opacity: 0.8; transition: opacity 0.2s;
        `;
        speakerBtn.onmouseenter = () => (speakerBtn.style.opacity = "1");
        speakerBtn.onmouseleave = () => (speakerBtn.style.opacity = "0.8");
        speakerBtn.onclick = () => new Audio(recordingUrl).play();
        questionWordEl.appendChild(speakerBtn);
    }

    // Reveal button
    const revealBtn = document.createElement("button");
    revealBtn.className = "option";
    revealBtn.textContent = "Reveal Answer";
    revealBtn.onclick = () => revealAnswer(current.answer);
    optionsEl.appendChild(revealBtn);
}

// ─── Reveal answer ────────────────────────────────────────────────────────────

function revealAnswer(answer) {
    feedbackEl.textContent = `${answer}`;
    optionsEl.innerHTML = "";

    const isLast = window.currentQuestionIndex >= window.currentQuiz.length - 1;
    nextBtn.style.display    = isLast ? "none"  : "block";
    refreshBtn.style.display = isLast ? "block" : "none";
    nextBtn.disabled = false;
}

// ─── Next question ────────────────────────────────────────────────────────────

function nextQuestion() {
    window.currentQuestionIndex++;
    if (window.currentQuestionIndex < window.currentQuiz.length) {
        displayQuestion();
    }
    nextBtn.style.display = "none";
}

nextBtn.onclick = nextQuestion;

// ─── Init ─────────────────────────────────────────────────────────────────────

showQuizList();