// Hardcoded vocabulary list
const data = [
    { question: "昂貴的/高的", option: "たかい" },
    { question: "新的", option: "あたらしい" },
    { question: "強的/強壯的", option: "つよい" },
    { question: "快的/早的", option: "はやい" },
    { question: "寬敞的", option: "ひろい" },
    { question: "溫暖的", option: "あたたかい" },
    { question: "輕的", option: "かるい" },
    { question: "黑暗的/沮喪的", option: "くらい" },
    { question: "鄰近的", option: "ちかい" },
    { question: "長的", option: "ながい" },
    { question: "有趣的/好笑的", option: "おもしろい" },
    { question: "粗的", option: "ふとい" },
    { question: "深的", option: "ふかい" },
    { question: "忙碌的", option: "いそがしい" },
    { question: "正確的", option: "ただしい" },
    { question: "快樂的", option: "たのしい" },
    { question: "親密的", option: "したしい" },
    { question: "舊的", option: "ふるい" },
    { question: "壞的", option: "わるい" },
    { question: "便宜的", option: "やすい" },
    { question: "矮的/低的", option: "ひくい" },
    { question: "難吃的", option: "まずい" },
    { question: "冰的/冷的", option: "つめたい" },
    { question: "薄的/淡的", option: "うすい" },
    { question: "效力弱的/弱的", option: "よわい" },
    { question: "慢的/晚的", option: "おそい" },
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
    { question: "親切的/容易的", option: "やさしい" },
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
    { question: "各式各樣的", option: "いろいろな" },
    { question: "重要的", option: "たいせつな" },
    { question: "沒問題的", option: "だいじょうぶな" },
    { question: "筆直的", option: "まっすぐな" },
    { question: "醜的 (俚語/粗俗)", option: "ぶすな" },
    { question: "討厭的", option: "きらいな" },
    { question: "不方便的", option: "ふべんな" },
    { question: "不擅長的", option: "へたな" },
    { question: "不擅長／討厭的", option: "にがてな" },
    { question: "輕鬆的", option: "らくな" },
    { question: "見面", option: "あいます" },
    { question: "上去 / 上來", option: "あがります" },
    { question: "給 / 舉起", option: "あげます / あげる" },
    { question: "打開", option: "あける" },
    { question: "早上", option: "あさ" },
    { question: "早飯", option: "あさごはん" },
    { question: "後天", option: "あさって" },
    { question: "腳", option: "あし" },
    { question: "明天", option: "あした" },
    { question: "那裡", option: "あそこ" },
    { question: "玩", option: "あそぶ" },
    { question: "頭", option: "あたま" },
    { question: "那個 / 那裡 / 那位", option: "あちら" },
    { question: "熱的 / 厚的", option: "あつい" },
    { question: "～之後 / 後來", option: "あと" },
    { question: "你 / 您", option: "あなた" },
    { question: "你們", option: "あなたたち" },
    { question: "哥哥 [謙稱]", option: "あに" },
    { question: "姊姊 [謙稱]", option: "あね" },
    { question: "那個 + 名詞", option: "あの" },
    { question: "公寓", option: "アパート" },
    { question: "淋", option: "あびます / あびる" },
    { question: "（不）那麼～ / ～否定 / (不) 怎麼～", option: "あまり" },
    { question: "編織", option: "あむ" },
    { question: "糖果 / 雨", option: "あめ" },
    { question: "美國", option: "アメリカ" },
    { question: "洗", option: "あらいます / あらう" },
    { question: "有 / 在", option: "あります / ある" },
    { question: "有 / 在 (否定)", option: "ありません" },
    { question: "打工", option: "アルバイト" },
    { question: "那個", option: "あれ" },
    { question: "胃", option: "い" },
    { question: "好的", option: "いい" },
    { question: "不是", option: "いいえ" },
    { question: "說", option: "いう" },
    { question: "家 / 房子", option: "いえ / うち" },
    { question: "去", option: "いきます / いく" },
    { question: "幾個 / 幾歲", option: "いくつ" },
    { question: "多少錢", option: "いくら" },
    { question: "池塘", option: "いけ" },
    { question: "不行的", option: "いけません" },
    { question: "醫生", option: "いしゃ" },
    { question: "椅子", option: "いす" },
    { question: "之前 / 以前", option: "いぜん" },
    { question: "痛的", option: "いたい" },
    { question: "1點", option: "いちじ" },
    { question: "1小時後", option: "いちじかんご" },
    { question: "1小時前", option: "いちじかんまえ" },
    { question: "最～", option: "いちばん" },
    { question: "1號教室", option: "いちばんきょうしつ" },
    { question: "1張", option: "いちまい" },
    { question: "1個星期", option: "いっしゅうかん" },
    { question: "1個星期後", option: "いっしゅうかんご" },
    { question: "拚命地", option: "いっしょうけんめい" },
    { question: "一起", option: "いっしょに" },
    { question: "1隻", option: "いっとう" },
    { question: "很多地/滿滿地", option: "いっぱい" },
    { question: "總是 / 每次", option: "いつも" },
    { question: "狗", option: "いぬ" },
    { question: "現在", option: "いま" },
    { question: "有 / 在 (人或動物)", option: "います / いる" },
    { question: "意思", option: "いみ" },
    { question: "妹妹 [謙稱]", option: "いもうと" },
    { question: "入口", option: "いりぐち" },
    { question: "放入/沖泡/倒入", option: "いれます / いれる" },
    { question: "顏色", option: "いろ" },
    { question: "小提琴", option: "ヴァイオリン" },
    { question: "維多利亞", option: "ヴィクトリア" },
    { question: "上面", option: "うえ" },
    { question: "主唱", option: "ヴォーカル" },
    { question: "櫃檯", option: "うけつけ" },
    { question: "動", option: "うごく" },
    { question: "後面", option: "うしろ" },
    { question: "歌", option: "うた" },
    { question: "唱（歌）", option: "うたいます / うたう" },
    { question: "美味的/擅長的", option: "うまい" },
    { question: "海 / 海洋", option: "うみ" },
    { question: "賣", option: "うります / うる" },
    { question: "吵鬧的 / 煩的", option: "うるさい" },
    { question: "外套", option: "うわぎ" },
    { question: "駕駛", option: "うんてんする" },
    { question: "運動", option: "うんどう" },
    { question: "運動會", option: "うんどうかい" },
    { question: "電影", option: "えいが" },
    { question: "電影院", option: "えいがかん" },
    { question: "英文", option: "えいご" },
    { question: "車站", option: "えき" },
    { question: "車站前", option: "えきまえ" },
    { question: "M (尺寸)", option: "エム" },
    { question: "選擇", option: "えらびます / えらぶ" },
    { question: "L (尺寸)", option: "エル" },
    { question: "電梯", option: "エレベーター" },
    { question: "日幣", option: "えん" },
    { question: "演奏", option: "えんそうします" },
    { question: "鉛筆", option: "えんぴつ" },
    { question: "貴庚", option: "おいくつ" },
    { question: "美味的", option: "おいしい" },
    { question: "大的", option: "おおきい" },
    { question: "大阪 [地名]", option: "おおさか" },
    { question: "大掃除", option: "おおそうじ" },
    { question: "母親 [尊稱]", option: "おかあさん" },
    { question: "點心 / 零食", option: "おかし" },
    { question: "錢", option: "おかね" },
    { question: "起床 / 起來", option: "おきます / おきる" },
    { question: "放置", option: "おきます / おく" },
    { question: "客人 [尊稱]", option: "おきゃくさん" },
    { question: "太太 [尊稱]", option: "おくさん" },
    { question: "酒", option: "おさけ" },
    { question: "盤子", option: "おさら" },
    { question: "祖父 [尊稱]", option: "おじいさん" },
    { question: "叔父 / 伯父 [尊稱]", option: "おじさん" },
    { question: "教 / 告訴", option: "おしえます / おしえる" },
    { question: "聊天", option: "おしゃべり" },
    { question: "按 / 壓 / 推", option: "おす" },
    { question: "壽司", option: "おすし" },
    { question: "茶", option: "おちゃ" },
    { question: "飯碗 / 茶碗", option: "おちゃわん" },
    { question: "洗手間 / 廁所", option: "おてあらい" },
    { question: "寺院", option: "おてら" },
    { question: "父親 [尊稱]", option: "おとうさん" },
    { question: "弟弟 [謙稱]", option: "おとうと" },
    { question: "男 / 男人", option: "おとこ / おとこのひと" },
    { question: "男孩子", option: "おとこのこ" },
    { question: "前天", option: "おととい" },
    { question: "前年", option: "おととし" },
    { question: "大人", option: "おとな" },
    { question: "肚子", option: "おなか" },
    { question: "哥哥 [尊稱]", option: "おにいさん" },
    { question: "父母的姊妹 [謙稱]", option: "おば" },
    { question: "祖母 / 年長的女生 [尊稱]", option: "おばあさん" },
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

const ELEVENLABS_API_KEY = "sk_3c0a6925d213838085a85dece73a773831d1e1aaa54ea84e";
const VOICE_ID = "AZnzlk1XvdvUeBnXmlld";
const MODEL_ID = "eleven_multilingual_v2";

// Cache to avoid re-calling the API for the same word
const audioCache = {};

async function speakJapaneseText(text) {
  // Return cached audio if available
  if (audioCache[text]) {
    new Audio(audioCache[text]).play();
    return;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
            speed: 0.75,
          },
        }),
      }
    );

    if (!response.ok) throw new Error("TTS request failed");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    audioCache[text] = url; // cache it
    new Audio(url).play();

  } catch (err) {
    console.error("ElevenLabs TTS error:", err);
    // Fallback to Web Speech API
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    window.speechSynthesis.speak(utterance);
  }
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