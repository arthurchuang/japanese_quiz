// Global state
window.currentQuiz = [];
window.currentQuestionIndex = 0;
window.currentRecordingDir = null; // e.g. "recordings/recording-2026-03-21"

const loadingEl = document.getElementById("loading");
const dateDisplayEl = document.getElementById("dateDisplay");
const progressEl = document.getElementById("progress");
const questionWordEl = document.getElementById("questionWord");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const refreshBtn = document.getElementById("refreshBtn");

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

        // Derive recording folder from quiz filename: daily-2026-03-21.json → recordings/recording-2026-03-21
        const date = fileName.replace("daily-", "").replace(".json", "");
        window.currentRecordingDir = `./recordings/recording-${date}`;

        dateDisplayEl.textContent = fileName.replace(".json", "");
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

// Check if a recording file exists by doing a HEAD request
async function recordingExists(url) {
    try {
        const res = await fetch(url, { method: "HEAD" });
        return res.ok;
    } catch {
        return false;
    }
}

async function displayQuestion() {
    if (!window.currentQuiz.length) return;

    const current = window.currentQuiz[window.currentQuestionIndex];
    const questionNumber = window.currentQuestionIndex + 1;

    progressEl.textContent = `Question ${questionNumber} / ${window.currentQuiz.length}`;

    // Build question line
    questionWordEl.innerHTML = "";

    const questionText = current.question;
    const match = questionText.match(/^(.+?)（(.+?)）/);

    if (match) {
        const mainText = document.createElement("span");
        mainText.textContent = match[1].trim();
        questionWordEl.appendChild(mainText);

        const furigana = document.createElement("div");
        furigana.textContent = match[2].trim();
        furigana.style.cssText = `
            font-size: 0.75rem;
            color: #999;
            margin-top: 4px;
        `;
        questionWordEl.appendChild(furigana);
    } else {
        const mainText = document.createElement("span");
        mainText.textContent = questionText;
        questionWordEl.appendChild(mainText);
    }

    // Check if recording exists for this question, then show speaker button
    const recordingUrl = `${window.currentRecordingDir}/question-${questionNumber}.wav`;
    const hasRecording = await recordingExists(recordingUrl);

    if (hasRecording) {
        const speakerBtn = document.createElement("button");
        speakerBtn.id = "speakerBtn";
        speakerBtn.title = "Listen to question";
        speakerBtn.textContent = "🔊";
        speakerBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            margin-left: 8px;
            vertical-align: middle;
            padding: 2px 6px;
            border-radius: 4px;
            opacity: 0.8;
            transition: opacity 0.2s;
        `;
        speakerBtn.onmouseenter = () => speakerBtn.style.opacity = "1";
        speakerBtn.onmouseleave = () => speakerBtn.style.opacity = "0.8";
        speakerBtn.onclick = () => {
            const audio = new Audio(recordingUrl);
            audio.play();
        };
        questionWordEl.appendChild(speakerBtn);
    }

    // Clear options & feedback
    optionsEl.innerHTML = "";
    feedbackEl.textContent = "";

    if (current.type === "mcq") {
        current.options.forEach((opt) => {
            const btn = document.createElement("button");
            btn.className = "option";
            btn.textContent = opt;
            btn.onclick = () => selectAnswer(opt, current.answer, current.explanation);
            optionsEl.appendChild(btn);
        });
    } else if (current.type === "fill-in-the-blank") {
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

function selectAnswer(selected, correct, explanation) {
    feedbackEl.textContent = selected === correct ? "✅ Correct!" : `❌ Incorrect! ${explanation}`;
    document.querySelectorAll(".option").forEach((btn) => (btn.disabled = true));

    if (window.currentQuestionIndex < window.currentQuiz.length - 1) {
        nextBtn.style.display = "block";
        nextBtn.disabled = false;
    } else {
        refreshBtn.style.display = "block";
        nextBtn.style.display = "none";
    }
}

function nextQuestion() {
    window.currentQuestionIndex++;
    if (window.currentQuestionIndex < window.currentQuiz.length) {
        displayQuestion();
    }
    nextBtn.style.display = "none";
}

nextBtn.onclick = nextQuestion;
showQuizList();