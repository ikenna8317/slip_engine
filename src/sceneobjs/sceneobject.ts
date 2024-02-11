import Scene from '../scene';

export default class SceneObject {
    scene: Scene;
    x: number;
    y: number;
    
    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
    }
    update() {
        
    }
    draw() {
        
    }
}