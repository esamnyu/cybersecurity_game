export class DDOSEffect {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 50; // Number of particles in the DDOS attack
        this.activeEffects = [];
    }

    createParticle(startX, startY, targetX, targetY) {
        const particle = document.createElement('div');
        particle.className = 'ddos-particle';
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = 'white';
        particle.style.borderRadius = '50%';
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        return {
            element: particle,
            x: startX,
            y: startY,
            targetX,
            targetY,
            speed: 3 + Math.random() * 2,
            angle: Math.atan2(targetY - startY, targetX - startX)
        };
    }

    spawnDDOSEffect(collisionX, collisionY) {
        const particles = [];
        
        // Create particles in a circle around the collision point
        for (let i = 0; i < this.particleCount; i++) {
            const radius = 100; // Distance from which particles will start
            const angle = (i / this.particleCount) * Math.PI * 2;
            
            // Calculate start positions in a circle
            const startX = collisionX + Math.cos(angle) * radius;
            const startY = collisionY + Math.sin(angle) * radius;

            const particle = this.createParticle(startX, startY, collisionX, collisionY);
            this.container.appendChild(particle.element);
            particles.push(particle);
        }

        this.activeEffects.push({
            particles,
            timeLeft: 60 // Duration in frames
        });
    }

    update() {
        this.activeEffects = this.activeEffects.filter(effect => {
            effect.timeLeft--;
            
            effect.particles.forEach(particle => {
                // Move particle towards target
                const dx = Math.cos(particle.angle) * particle.speed;
                const dy = Math.sin(particle.angle) * particle.speed;
                
                particle.x += dx;
                particle.y += dy;
                
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
            });

            if (effect.timeLeft <= 0) {
                // Clean up particles
                effect.particles.forEach(particle => {
                    particle.element.remove();
                });
                return false;
            }
            return true;
        });
    }
}