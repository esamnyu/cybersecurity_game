export class GameState {
    constructor() {
        this.score = 0;
        this.hp = 100;
        this.gameActive = true;
        this.elements = {
            score: document.getElementById('score'),
            hp: document.getElementById('hp'),
            gameOver: document.querySelector('.game-over'),
            finalScore: document.getElementById('final-score')
        };
    }

    updateScore(points) {
        this.score += points;
        this.elements.score.textContent = this.score;
    }

    updateHP(damage) {
        this.hp -= damage;
        this.elements.hp.textContent = this.hp;
        if (this.hp <= 0) this.endGame();
    }

    endGame() {
        this.gameActive = false;
        this.elements.gameOver.style.display = 'block';
        this.elements.finalScore.textContent = this.score;
    }

    restart() {
        this.score = 0;
        this.hp = 100;
        this.gameActive = true;
        this.elements.score.textContent = this.score;
        this.elements.hp.textContent = this.hp;
        this.elements.gameOver.style.display = 'none';
    }
}
