import Scene from '../../scene';
import Rectangle from '../shapes/rectangle';

export default class BounceBox extends Rectangle {
    speedX: number;
    ignoreBounce: boolean;
    
    constructor(scene: Scene, x: number, y: number, speedX: number, width: number = 100, height: number = 100) {
        super(scene, x, y, width, height);
        this.speedX = speedX;
        this.ignoreBounce = false;
    }

    update() {
        if (!this.ignoreBounce && (((this.x + this.width) > this.scene.canvas.width) || (this.x < 0))) {
            this.speedX *= -1;
            this.ignoreBounce = true;
            setTimeout(() => this.ignoreBounce = false, 50);
            return;
        }
        
        this.x += this.speedX;
    }
}