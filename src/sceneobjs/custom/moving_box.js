import Rectangle from '../shapes/rectangle';

export default class MovingBox extends Rectangle {
    constructor(scene, x, y, speedX, width=100, height=100) {
        super(scene, x, y, width, height);
        this.speedX = speedX;
    }

    update() {
        if ((this.x + this.width) >= this.scene.canvas.width) {
            this.x = this.scene.canvas.width - this.width;
            return;
        }
        
        this.x += this.speedX;
    }
}