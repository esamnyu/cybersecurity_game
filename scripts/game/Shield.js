export class Shield {
    constructor() {
        this.element = document.getElementById('shield');
        this.x = 0;
        this.y = 0;
        this.radius = 30; // Adjust this to match the visual shield size
        
        // Create debug circle (uncomment during testing)
        this.debugCircle = this.createDebugCircle();
        
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        this.setupEventListeners();
    }

    createDebugCircle() {
        const debug = document.createElement('div');
        debug.style.cssText = `
            position: fixed;
            border: 1px dashed red;
            border-radius: 50%;
            pointer-events: none;
            width: ${this.radius * 2}px;
            height: ${this.radius * 2}px;
            z-index: 1000;
            transform: translate(-50%, -50%);
            display: none; // Change to 'block' to show collision area
        `;
        document.body.appendChild(debug);
        return debug;
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.x = e.clientX;
            this.y = e.clientY;
            this.updatePosition();
        });

        // Toggle debug circle with 'D' key
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'd') {
                this.debugCircle.style.display = 
                    this.debugCircle.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        // Update debug circle position
        this.debugCircle.style.left = this.x + 'px';
        this.debugCircle.style.top = this.y + 'px';
    }

    checkCollision(threatX, threatY) {
        // Get the actual shield position accounting for transforms
        const shieldRect = this.element.getBoundingClientRect();
        const shieldCenterX = shieldRect.left + shieldRect.width / 2;
        const shieldCenterY = shieldRect.top + shieldRect.height / 2;

        // Calculate distance between shield center and threat
        const dx = threatX - shieldCenterX;
        const dy = threatY - shieldCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Optional: log collision data for debugging
        // console.log('Distance:', distance, 'Radius:', this.radius, 'Collision:', distance < this.radius);
        
        return distance < this.radius;
    }
}