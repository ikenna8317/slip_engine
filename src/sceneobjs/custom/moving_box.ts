import Scene from '../../scene';
import Rectangle from '../shapes/rectangle';

export default class MovingBox extends Rectangle {
    speedX: number;
    
    constructor(scene: Scene, x: number, y: number, speedX: number, width: number = 100, height: number = 100) {
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