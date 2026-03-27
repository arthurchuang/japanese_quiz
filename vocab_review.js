document.addEventListener("DOMContentLoaded", () => {
    const data = localStorage.getItem('failedQuestions');
    const finalScore = localStorage.getItem('finalScore') || "0 / 0";

    const mistakes = JSON.parse(data) || [];
    const tableBody = document.getElementById("tableBody");

    document.getElementById('finalScore').textContent = `最終スコア: ${finalScore}`;
    mistakes.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="jp-cell">${item.question}</td>
            <td class="wrong-cell">${item.userChoice}</td>
            <td class="correct-cell">${item.correctAnswer}</td>
        `;

        tableBody.appendChild(row);
    });

});