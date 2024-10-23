export class Shield {
    constructor() {
        this.element = document.getElementById('shield');
        this.x = 0;
        this.y = 0;
        this.radius = 40;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.x = e.clientX;
            this.y = e.clientY;
            this.updatePosition();
        });
    }

    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    checkCollision(threatX, threatY) {
        const dx = threatX - this.x;
        const dy = threatY - this.y;
        return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }
}