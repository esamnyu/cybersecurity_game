export class ThreatManager {
    constructor(gameState, shield) {
        this.gameState = gameState;
        this.shield = shield;
        this.threats = [];
        this.threatTypes = [
            'DDOS_ATTACK',
            'MALWARE',
            'RANSOMWARE',
            'SQL_INJECTION',
            'XSS_ATTACK',
            'PHISHING',
            'ZERO_DAY'
        ];
        this.container = document.getElementById('game-container');
        this.nameBox = document.querySelector('.game-name').getBoundingClientRect();
    }

    createThreat() {
        if (!this.gameState.gameActive) return;

        const threat = document.createElement('div');
        threat.className = 'threat';
        
        const [x, y, vx, vy] = this.calculateSpawnPosition();
        const threatType = this.threatTypes[Math.floor(Math.random() * this.threatTypes.length)];
        
        threat.textContent = threatType;
        threat.style.left = x + 'px';
        threat.style.top = y + 'px';

        this.container.appendChild(threat);
        
        this.threats.push({ element: threat, x, y, vx, vy });
    }

    calculateSpawnPosition() {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(side) {
            case 0: x = Math.random() * window.innerWidth; y = -20; break;
            case 1: x = window.innerWidth + 20; y = Math.random() * window.innerHeight; break;
            case 2: x = Math.random() * window.innerWidth; y = window.innerHeight + 20; break;
            case 3: x = -20; y = Math.random() * window.innerHeight; break;
        }

        const targetX = window.innerWidth / 2;
        const targetY = window.innerHeight / 2;
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 2;
        
        return [x, y, (dx / distance) * speed, (dy / distance) * speed];
    }

    update() {
        this.threats.forEach((threat, index) => {
            threat.x += threat.vx;
            threat.y += threat.vy;
            threat.element.style.left = threat.x + 'px';
            threat.element.style.top = threat.y + 'px';

            if (this.shield.checkCollision(threat.x, threat.y)) {
                this.destroyThreat(index, true);
                return;
            }

            const threatBox = threat.element.getBoundingClientRect();
            if (this.checkNameCollision(threatBox)) {
                this.destroyThreat(index, false);
                this.gameState.updateHP(10);
            }
        });
    }

    checkNameCollision(threatBox) {
        return threatBox.left < this.nameBox.right &&
               threatBox.right > this.nameBox.left &&
               threatBox.top < this.nameBox.bottom &&
               threatBox.bottom > this.nameBox.top;
    }

    destroyThreat(index, wasDeflected) {
        if (wasDeflected) this.gameState.updateScore(10);
        this.threats[index].element.remove();
        this.threats.splice(index, 1);
    }

    clear() {
        this.threats.forEach(threat => threat.element.remove());
        this.threats = [];
    }
}