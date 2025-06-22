import { quiz } from './quiz_text.js';

//問題文・選択肢を生成するためのランダム番号を取得
const used = JSON.parse(sessionStorage.getItem("usedQuestions") || "[]");
let randomNumber; 
do {
  randomNumber = Math.floor(Math.random() * quiz.length);
} while (used.includes(String(randomNumber)))
used.push(String(randomNumber));
sessionStorage.setItem("usedQuestions", JSON.stringify(used));

// 問題文・選択肢の生成
const question = document.getElementById("question");
const btn_option1 = document.getElementById("option1");
const btn_option2 = document.getElementById("option2");
const btn_option3 = document.getElementById("option3");
question.textContent = quiz[randomNumber].question;
btn_option1.textContent = quiz[randomNumber].option1;
btn_option2.textContent = quiz[randomNumber].option2;
btn_option3.textContent = quiz[randomNumber].option3;

//URLより全出題数・１問の制限時間、今、何問目で何問正解しているかを取得
const params = new URLSearchParams(window.location.search);
//全出題数
let total_questions = params.get("total_questions") || "5";
document.getElementById("quiz_title").textContent = "クイズ（3択問題・全" + total_questions + "問）";
//１問の制限時間
let question_time = params.get("question_time") || "0";
//今、何問目
let questionNumber = params.get("questionnumber") || "1";
document.getElementById("questionNumber").textContent = "問" + questionNumber;
//何問正解しているか
let correctCount = params.get("correctcount") || "0";

const judge_text = document.getElementById("judgement");
const mylink = document.getElementById("myLink");
const result = document.getElementById("result");
const countDown = document.getElementById('countdown'); 
let countDownStop = false;

//選択肢１のボタンを押下したとき
btn_option1.addEventListener('click', () => {
    const option1 = btn_option1.textContent;
    judge(option1,randomNumber);
});

//選択肢２のボタンを押下したとき
btn_option2.addEventListener('click', () => {
    const option2 = btn_option2.textContent;
    judge(option2,randomNumber);
});

//選択肢３のボタンを押下したとき
btn_option3.addEventListener('click', () => {
    const option3 = btn_option3.textContent;
    judge(option3,randomNumber);
});

//正誤判定
function judge(option,number) {
    let judgeText = "";
    const answer = quiz[number].answer;
    countDownStop = true;
    if (option === answer) {
        judgeText = "正解です！";
        judge_text.classList.add("correct");
        correctCount++;
    }
    else {
        judgeText = "残念、不正解です。";
        judge_text.classList.add("incorrect");
    }
    judge_text.textContent = judgeText;
    [btn_option1, btn_option2, btn_option3].forEach(btn => btn.disabled = true);
    questionNumber++;
    if (total_questions < questionNumber) 
      result.classList.remove('hidden');
    else  
      mylink.classList.remove('hidden');
    countDown.style.display = 'none';
};

function timeover() {
  let judgeText = "残念、タイムオーバーです。";
  judge_text.classList.add("incorrect");
  judge_text.textContent = judgeText;
  [btn_option1, btn_option2, btn_option3].forEach(btn => btn.disabled = true);
  questionNumber++;
  if (total_questions < questionNumber) 
    result.classList.remove('hidden');
  else  
    mylink.classList.remove('hidden');
  countDown.style.display = 'none';
}

//「次の問題へ」を押下したとき
document.getElementById("myLink").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = window.location.pathname + "?total_questions=" + total_questions + "&question_time=" + question_time + "&questionnumber=" + questionNumber + "&correctcount=" + correctCount;
});
//「結果発表へ」を押下したとき
document.getElementById("result").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "./result.html?total_questions=" + total_questions + "&correctcount=" + correctCount;
});

if (performance.getEntriesByType("navigation")[0].type === "reload") {
  sessionStorage.clear();
  window.location.href = "menu.html";
}

window.onload = function() {
    if(question_time === "0")
      return;
    const targetTime = new Date().getTime() + 10000; 
    const interval = setInterval(updateCountDown, 1000);
    updateCountDown();
    function updateCountDown(){
        const now = new Date().getTime();
        const distance = targetTime - now;
        if(countDownStop)
            clearInterval(interval);
        if(distance <= 0){
            clearInterval(interval);
            countDown.textContent = "残り0秒";
            timeover();
            return;
        }
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countDown.textContent = "残り" + seconds + "秒";
    }
};