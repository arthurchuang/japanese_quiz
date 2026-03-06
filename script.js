// Hardcoded vocabulary list
const data = [
    { question: "昂貴的/高的", option: "たかい" },
    { question: "新的", option: "あたらしい" },
    { question: "強的/強壯的", option: "つよい" },
    { question: "快的", option: "はやい" },
    { question: "寬敞的", option: "ひろい" },
    { question: "溫暖的", option: "あたたかい" },
    { question: "輕的", option: "かるい" },
    { question: "黑暗的", option: "くらい" },
    { question: "沮喪的", option: "くらい" },
    { question: "鄰近的", option: "ちかい" },
    { question: "長的", option: "ながい" },
    { question: "有趣的", option: "おもしろい" },
    { question: "粗的", option: "ふとい" },
    { question: "深的", option: "ふかい" },
    { question: "忙碌的", option: "いそがしい" },
    { question: "正確的", option: "ただしい" },
    { question: "快樂的", option: "たのしい" },
    { question: "親密的", option: "したしい" },
    { question: "舊的", option: "ふるい" },
    { question: "壞的", option: "わるい" },
    { question: "便宜的", option: "やすい" },
    { question: "矮的", option: "ひくい" },
    { question: "難吃的", option: "まずい" },
    { question: "冰的 / 冷的", option: "つめたい" },
    { question: "薄的", option: "うすい" },
    { question: "效力弱的", option: "よわい" },
    { question: "慢的", option: "おそい" },
    { question: "狹小的", option: "せまい" },
    { question: "涼爽的", option: "すずしい" },
    { question: "沉重的", option: "おもい" },
    { question: "明亮的", option: "あかるい" },
    { question: "遙遠的", option: "とおい" },
    { question: "短的", option: "みじかい" },
    { question: "無聊的", option: "つまらない" },
    { question: "細的", option: "ほそい" },
    { question: "淺的", option: "あさい" },
    { question: "多的", option: "おおい" },
    { question: "少的", option: "すくない" },
    { question: "很難的", option: "むずかしい" },
    { question: "甜的", option: "あまい" },
    { question: "親切的", option: "やさしい" },
    { question: "辣的", option: "からい" },
    { question: "圓的", option: "まるい" },
    { question: "危險的", option: "あぶない" },
    { question: "髒的／不乾淨的", option: "きたない" },
    { question: "年輕的", option: "わかい" },
    { question: "想要的", option: "ほしい" },
    { question: "藍色的", option: "あおい" },
    { question: "紅色的", option: "あかい" },
    { question: "黃色的", option: "きいろい" },
    { question: "黑色的", option: "くろい" },
    { question: "漂亮的／乾淨的", option: "きれいな" },
    { question: "喜歡的", option: "すきな" },
    { question: "方便的", option: "べんりな" },
    { question: "擅長的", option: "じょうずな" },
    { question: "拿手的", option: "とくいな" },
    { question: "安靜的", option: "しずかな" },
    { question: "簡單的", option: "かんたんな" },
    { question: "辛苦的／糟糕的", option: "たいへんな" },
    { question: "有精神的／健康的", option: "げんきな" },
    { question: "強壯的／堅固的", option: "じょうぶな" },
    { question: "熱鬧的", option: "にぎやかな" },
    { question: "有空的", option: "ひまな" },
    { question: "有名的", option: "ゆうめいな" },
    { question: "各種各樣的", option: "いろいろな" },
    { question: "重要的", option: "たいせつな" },
    { question: "沒問題的", option: "だいじょうぶな" },
    { question: "筆直的", option: "まっすぐな" },
    { question: "醜的 (俚語/粗俗)", option: "ぶすな" },
    { question: "討厭的", option: "きらいな" },
    { question: "不方便的", option: "ふべんな" },
    { question: "不擅長的", option: "へたな" },
    { question: "不擅長／討厭的", option: "にがてな" },
    { question: "輕鬆的", option: "らくな" }
];

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

    // Look for a specific high-quality voice
    // "Google 日本語" is usually very good on Chrome
    const jpVoice = voices.find(voice =>
        voice.lang === 'ja-JP' && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang === 'ja-JP');

    if (jpVoice) {
        utterance.voice = jpVoice;
    }

    utterance.lang = 'ja-JP';
    utterance.rate = 0.9; // Slightly slower is often better for learners
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
            window.location.href = "review.html";
            return
        }
        document.getElementById("questionWord").textContent = "🎉 Quiz Complete!";
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
    distractors = shuffle(distractors).slice(0, 3).map(d => d.option);

    const options = shuffle([current.option, ...distractors]);
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.className = "option";
        btn.onclick = () => {
            // 1. Remove .selected from any other option button
            const existingSelected = optionsDiv.querySelector('.option.selected');
            if (existingSelected) {
                existingSelected.classList.remove('selected');
            }

            // 2. Add .selected to the button that was just clicked
            btn.classList.add('selected');

            speakJapaneseText(opt);

            // 3. Quiz logic (checking the answer)
            if (opt === current.option) {
                feedback.textContent = "✅ Correct!";
                feedback.style.color = "#2e7d32";
                if (!hasAttempted) {
                    score++;
                    hasAttempted = true;
                }
            } else {
                if (!hasAttempted) {
                    // Save the question AND what the user actually clicked
                    wrongAnswers.push({
                        question: current.question, // The Kanji/Word
                        correctAnswer: current.option, // The right meaning
                        userChoice: opt // The wrong meaning the user picked
                    });
                }
                feedback.innerHTML = `❌ ${japDictionary[opt]}<br>The answer is: ${current.option}`;
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