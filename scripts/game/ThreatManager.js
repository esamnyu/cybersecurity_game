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
        
        // Initialize DDOS effect particles array
        this.ddosParticles = [];
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

        // Add special styling for DDOS threats
        if (threatType === 'DDOS_ATTACK') {
            threat.classList.add('ddos-threat');
        }

        this.container.appendChild(threat);
        this.threats.push({ 
            element: threat, 
            x, 
            y, 
            vx, 
            vy, 
            type: threatType 
        });
    }

    createDDOSParticle(startX, startY, targetX, targetY) {
        const particle = document.createElement('div');
        particle.className = 'ddos-particle';
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        this.container.appendChild(particle);

        const angle = Math.atan2(targetY - startY, targetX - startX);
        const speed = 3 + Math.random() * 2;

        return {
            element: particle,
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 60 // Particle lifetime in frames
        };
    }

    spawnDDOSEffect(x, y) {
        const particleCount = 50;
        const radius = 100;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const startX = x + Math.cos(angle) * radius;
            const startY = y + Math.sin(angle) * radius;

            this.ddosParticles.push(
                this.createDDOSParticle(startX, startY, x, y)
            );
        }
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

    updateDDOSParticles() {
        for (let i = this.ddosParticles.length - 1; i >= 0; i--) {
            const particle = this.ddosParticles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;

            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            particle.element.style.opacity = particle.life / 60;

            if (particle.life <= 0) {
                particle.element.remove();
                this.ddosParticles.splice(i, 1);
            }
        }
    }

    update() {
        this.updateDDOSParticles();
    
        this.threats.forEach((threat, index) => {
            // Update threat position
            threat.x += threat.vx;
            threat.y += threat.vy;
            threat.element.style.left = threat.x + 'px';
            threat.element.style.top = threat.y + 'px';
    
            // Get threat center position for more accurate collision
            const threatRect = threat.element.getBoundingClientRect();
            const threatCenterX = threatRect.left + threatRect.width / 2;
            const threatCenterY = threatRect.top + threatRect.height / 2;
    
            // Check shield collision
            if (this.shield.checkCollision(threatCenterX, threatCenterY)) {
                if (threat.type === 'DDOS_ATTACK') {
                    this.spawnDDOSEffect(threatCenterX, threatCenterY);
                }
                this.destroyThreat(index, true);
                return;
            }
    
            // Check name box collision
            if (this.checkNameCollision(threatRect)) {
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
        
        // Clear DDOS particles
        this.ddosParticles.forEach(particle => particle.element.remove());
        this.ddosParticles = [];
    }
}