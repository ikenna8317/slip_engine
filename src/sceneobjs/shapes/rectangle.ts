import Scene from '../../scene';
import SceneObject from '../sceneobject';

export default class Rectangle extends SceneObject {
    width: number;
    height: number;
    isStroke: boolean;
    
    constructor(scene: Scene, x: number, y: number, width: number, height: number, isStroke: boolean = true) {
        super(scene, x, y);
        this.width = width;
        this.height = height;
        this.isStroke = isStroke;
    }

    draw() {
        this.isStroke ? this.scene.ctx.strokeRect(this.x, this.y, this.width, this.height) : this.scene.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}