let currentIdx = 0;
let score = 0;
let canClick = true;
let userResults = [];
let quizQuestions = []; // Use a separate array for the active 20 questions

function init() {
    // 1. Shuffle and pick only the first 20 questions
    score = 0;
    quizQuestions = [...n5Questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);

    displayQuestion();
}

function displayQuestion() {
    canClick = true;
    const data = quizQuestions[currentIdx];

    // Progress UI (Now out of quizQuestions.length, which is max 20)
    document.getElementById('progress-bar-fill').style.width = (currentIdx / quizQuestions.length * 100) + "%";
    document.getElementById('current-count').innerText = currentIdx + 1;

    // Display Question
    document.getElementById('display-question').innerText = data.q;

    // --- NEW: Display Mandarin Translation ---
    // If you have a specific element for it, use that. Otherwise, you can append it or use a sub-header.
    const translationEl = document.getElementById('display-translation');
    if (translationEl) {
        translationEl.innerText = data.t;
    }

    // Options
    const list = document.getElementById('options-list');
    list.innerHTML = '';
    data.a.forEach((text, i) => {
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
    const correct = data.correct;
    const isCorrect = (idx === correct);

    userResults.push({
        q: data.q,
        ans: data.a[correct],
        meaning: data.t, // Save the translation for the review page
        isCorrect: isCorrect
    });

    if (isCorrect) {
        score++;
        document.getElementById('live-score').innerText = score;
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
        const options = document.querySelectorAll('.option-btn');
        if (options[correct]) options[correct].classList.add('correct');
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
    list.innerHTML = ''; // Clear previous review items

    userResults.forEach(res => {
        const item = document.createElement('div');
        item.className = `review-item ${res.isCorrect ? 'was-correct' : ''}`;

        // --- NEW: Added Mandarin Meaning to the review list ---
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

let tokenizer = null;

kuromoji.builder({ dicPath: "node_modules/kuromoji/dict" }).build((err, built) => {
  tokenizer = built;
});

function toPhonetic(text) {
  if (!tokenizer) return text; // fallback if tokenizer not ready

  const tokens = tokenizer.tokenize(text);
  
  return tokens.map(token => {
    const surface = token.surface_form;
    const pos = token.part_of_speech; // 品詞

    // は: replace only when it's a particle (助詞)
    if (surface === 'は' && pos.includes('助詞')) return 'わ';
    
    // へ: replace only when it's a particle (助詞)
    if (surface === 'へ' && pos.includes('助詞')) return 'え';

    // を: always a particle, but use same pattern for consistency
    if (surface === 'を' && pos.includes('助詞')) return 'お';

    // for everything else, use the reading if available, else surface
    return token.reading ? token.reading : surface;
  }).join('');
}

function playQuestionAudio() {
    const msg = new SpeechSynthesisUtterance(toPhonetic(quizQuestions[currentIdx].tts));
    msg.lang = 'ja-JP';
    msg.rate = 0.6;
    window.speechSynthesis.speak(msg);
}

init();