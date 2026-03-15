let currentIdx = 0;
let score = 0;
let canClick = true;
let userResults = [];
let quizQuestions = [];

function init() {
    score = 0;
    currentIdx = 0;
    userResults = [];
    quizQuestions = [...n5Questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 50);

    displayQuestion();
}

function buildOptions(currentQuestion) {
    const correctAnswer = currentQuestion.a;

    const wrongAnswers = n5Questions
        .filter(q => q.a !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(q => q.a);

    return [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);
}

function displayQuestion() {
    canClick = true;
    const data = quizQuestions[currentIdx];

    document.getElementById('progress-bar-fill').style.width = (currentIdx / quizQuestions.length * 100) + "%";
    document.getElementById('current-count').innerText = currentIdx + 1;

    document.getElementById('display-question').innerText = data.q;

    const translationEl = document.getElementById('display-translation');
    if (translationEl) translationEl.innerText = data.t;

    data._options = buildOptions(data);

    const list = document.getElementById('options-list');
    list.innerHTML = '';
    data._options.forEach((text, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = text;
        btn.onclick = (e) => handleAnswer(i, e.target);
        list.appendChild(btn);
    });
}

function handleAnswer(idx, btn) {
    if (!canClick) return;
    canClick = false;

    const data = quizQuestions[currentIdx];
    const correctAnswer = data.a;
    const correctIdx = data._options.indexOf(correctAnswer);
    const isCorrect = (idx === correctIdx);

    userResults.push({
        q: data.q,
        ans: correctAnswer,
        meaning: data.t,
        isCorrect: isCorrect
    });

    if (isCorrect) {
        score++;
        document.getElementById('live-score').innerText = score;
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
        const options = document.querySelectorAll('.option-btn');
        if (options[correctIdx]) options[correctIdx].classList.add('correct');
    }

    setTimeout(() => {
        if (currentIdx < quizQuestions.length - 1) {
            currentIdx++;
            displayQuestion();
        } else {
            showReview();
        }
    }, 1200);
}

function showReview() {
    document.getElementById('quiz-page').style.display = 'none';
    document.getElementById('review-page').style.display = 'block';
    document.getElementById('final-score').innerText = score;

    const list = document.getElementById('review-list');
    list.innerHTML = '';

    userResults.forEach(res => {
        const item = document.createElement('div');
        item.className = `review-item ${res.isCorrect ? 'was-correct' : ''}`;
        item.innerHTML = `
            <div class="review-row">
                <span class="review-q">${res.q}</span>
                <span class="review-meaning">${res.meaning}</span>
            </div>
            <span class="review-a">正解: ${res.ans}</span>
        `;
        list.appendChild(item);
    });
}

init();