// main.js

document.addEventListener('DOMContentLoaded', () => {
    const redPill = document.getElementById('red-pill');
    const bluePill = document.getElementById('blue-pill');

    redPill.addEventListener('click', () => {
        const confirmation = confirm("Are you sure you want to take the red pill?");
        if (confirmation) {
            startGame();
        }
    });

    bluePill.addEventListener('click', () => {
        displayMotivationalMessages();
    });
});

function startGame() {
    // Logic to start the Dino-like game
    window.location.href = 'game.html'; // Redirect to the game page
}

function displayMotivationalMessages() {
    const messages = [
        "Wake up! Your dreams are waiting.",
        "Success is not for the lazy.",
        "Every day is a new opportunity.",
        "Believe in yourself and all that you are.",
        "The future belongs to those who believe in the beauty of their dreams."
    ];

    const messageContainer = document.createElement('div');
    messageContainer.className = 'motivational-messages';
    messages.forEach(message => {
        const messageElement = document.createElement('p');
        messageElement.className = 'hex-text';
        messageElement.textContent = message;
        messageContainer.appendChild(messageElement);
    });

    document.body.appendChild(messageContainer);
}