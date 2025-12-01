const questions = [
    "How are you feeling today? (good/okay/bad)",
    "How often do you feel overwhelmed? (never/sometimes/often)",
    "How well are you sleeping? (good/average/poor)",
    "Do you feel stressed at work or studies? (yes/no)",
    "Do you get time to relax? (yes/no)"
];

let currentQuestion = 0;
let score = 0;

function sendBotMessage(msg) {
    let box = document.getElementById("chat-box");
    box.innerHTML += `<div class="message bot">${msg}</div>`;
    box.scrollTop = box.scrollHeight;
}

function sendUserMessage(msg) {
    let box = document.getElementById("chat-box");
    box.innerHTML += `<div class="message user">${msg}</div>`;
    box.scrollTop = box.scrollHeight;
}

function processAnswer(answer) {
    answer = answer.toLowerCase();

    if (answer.includes("bad") || answer.includes("often") || answer.includes("poor") || answer === "yes") {
        score += 2;
    } else if (answer.includes("okay") || answer.includes("average") || answer === "sometimes") {
        score += 1;
    }
}

function showResult() {
    let level = "";

    if (score <= 3) level = "Low Stress 😊";
    else if (score <= 6) level = "Moderate Stress 😐";
    else level = "High Stress 😟";

    sendBotMessage(`Your Stress Level: <b>${level}</b>`);

    // send to backend
    fetch("http://localhost:8080/api/assessment/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            score: score,
            level: level,
            date: new Date()
        })
    });
}

document.getElementById("send-btn").addEventListener("click", () => {
    let input = document.getElementById("user-input");
    let text = input.value.trim();

    if (text === "") return;

    sendUserMessage(text);
    processAnswer(text);

    input.value = "";

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        setTimeout(() => sendBotMessage(questions[currentQuestion]), 800);
    } else {
        setTimeout(showResult, 800);
    }
});

// Start chatbot
window.onload = () => {
    sendBotMessage("Hi! I will help you check your stress level 😊");
    setTimeout(() => sendBotMessage(questions[currentQuestion]), 1000);
};
