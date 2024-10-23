import { GameState } from './game/GameState.js';
import { Shield } from './game/Shield.js';
import { ThreatManager } from './game/ThreatManager.js';
import { ParticleSystem } from './background/ParticleSystem.js';

class Game {
    constructor() {
        this.gameState = new GameState();
        this.shield = new Shield();
        this.threatManager = new ThreatManager(this.gameState, this.shield);
        this.particleSystem = new ParticleSystem();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('restart-button').addEventListener('click', () => {
            this.gameState.restart();
            this.threatManager.clear();
        });
    }

    gameLoop() {
        if (this.gameState.gameActive) {
            if (Math.random() < 0.03) this.threatManager.createThreat();
            this.threatManager.update();
        }
        this.particleSystem.animate();
        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        this.gameLoop();
    }
}

// Initialize and start the game
const game = new Game();
game.start();