const japDictionary = data.reduce((acc, item) => {
    acc[item.option] = item.question;
    return acc;
}, {});

// Quiz variables.
let unusedQuestions = [];
let current = {};
let score = 0;
let totalQuestions = 25;
let wrongAnswers = [];
let hasAttempted = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

window.speechSynthesis.onvoiceschanged = () => {
    // This "warms up" the voice list so it's ready when the user clicks 'Play'
    window.speechSynthesis.getVoices();
    console.log("Japanese voices loaded and ready!");
};
function speakJapaneseText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    const jpVoice = voices.find(voice =>
        voice.lang === 'ja-JP' && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang === 'ja-JP');

    if (jpVoice) {
        utterance.voice = jpVoice;
    }

    utterance.lang = 'ja-JP';
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
}

function displayJapaneseDate() {
    const today = new Date();

    // 1. Get the base Era/Year/Padded Month/Day/Weekday
    let formatted = today.toLocaleDateString('ja-JP', {
        calendar: 'japanese',
        era: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long'
    });

    // 2. Clean up the Kanji to get your "/" and spacing
    // Transforms "令和8年03月04日水曜日" -> "令和 8 年 03/04 水曜日"
    formatted = formatted
        .replace(/(\D)(\d+)/, '$1 $2')
        .replace('年', ' 年 ')
        .replace('月', '/')
        .replace('日', ' ');

    // 3. Print it to the top of the page
    document.getElementById("dateDisplay").innerText = formatted;
}

function nextQuestion() {
    document.getElementById("nextBtn").style.display = "none";
    const feedback = document.getElementById("feedback");
    feedback.textContent = "";
    hasAttempted = false;

    if (unusedQuestions.length === 0) {
        if (wrongAnswers.length > 0) {
            localStorage.setItem('failedQuestions', JSON.stringify(wrongAnswers));
            localStorage.setItem('finalScore', `${score} / ${totalQuestions}`);
            window.location.replace("vocab_review.html");
            return
        }
        document.getElementById("questionWord").textContent = "すごいですね!";
        document.getElementById("options").innerHTML = "";
        document.getElementById("progress").textContent = "";
        document.getElementById("score").textContent = `Final Score: ${score} / ${totalQuestions}`;
        document.getElementById("nextBtn").style.display = "none";
        document.getElementById("refreshBtn").style.display = "block";
        return;
    }

    const index = Math.floor(Math.random() * unusedQuestions.length);
    current = unusedQuestions.splice(index, 1)[0];

    document.getElementById("questionWord").textContent = current.question;
    document.getElementById("progress").textContent = `Question ${totalQuestions - unusedQuestions.length} / ${totalQuestions}`;
    document.getElementById("score").textContent = `Score: ${score}`;

    let distractors = data.filter(d => d.option !== current.option);
    distractors = shuffle(distractors).slice(0, 3);

    const options = shuffle([current, ...distractors]);
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    options.forEach(opt => {
        const btn = document.createElement("button");

        // Create two lines: option + txt
        btn.innerHTML = `
            <div>${opt.option}</div>
            <div style="font-size: 0.8em; color: gray;">${opt.txt}</div>
        `;

        btn.className = "option";

        btn.onclick = () => {
            const existingSelected = optionsDiv.querySelector('.option.selected');
            if (existingSelected) {
                existingSelected.classList.remove('selected');
            }

            btn.classList.add('selected');

            speakJapaneseText(opt.option);

            if (opt.option === current.option) {
                feedback.textContent = "✅ Correct!";
                feedback.style.color = "#2e7d32";
                if (!hasAttempted) {
                    score++;
                    hasAttempted = true;
                }
            } else {
                if (!hasAttempted) {
                    wrongAnswers.push({
                        question: current.question,
                        correctAnswer: current.option,
                        userChoice: opt.option
                    });
                }
                feedback.innerHTML = `❌ ${japDictionary[opt.option]}<br>The answer is: ${current.option}`;
                feedback.style.color = "#c62828";
                hasAttempted = true;
            }

            document.getElementById("nextBtn").style.display = "block";
            document.getElementById("score").textContent = `Score: ${score}`;
        };

        optionsDiv.appendChild(btn);
    });
}

unusedQuestions = shuffle([...data]).slice(0, totalQuestions);
displayJapaneseDate();
nextQuestion();