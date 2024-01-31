import SceneObject from '../sceneobject';

export default class Rectangle extends SceneObject {
    constructor(scene, x, y, width, height, isStroke=true) {
        super(scene, x, y);
        this.width = width;
        this.height = height;
        this.isStroke = isStroke;
    }

    draw() {
        this.isStroke ? this.scene.ctx.strokeRect(this.x, this.y, this.width, this.height) : this.scene.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}