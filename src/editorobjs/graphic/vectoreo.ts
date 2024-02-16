import { defaults } from "../../defaults";
import GraphicEO from "./graphiceo";
import InteractiveEO from "./interactiveeo";

export default class VectorEO extends InteractiveEO {
    childVectors: Array<VectorEO>;
    graphicObject: GraphicEO;
   
    constructor(graphicObj: GraphicEO, x: number, y: number) {
        super(graphicObj.editor, x, y);
        this.graphicObject = graphicObj;
        this.width = defaults.cursor.CIRCLE_CURSOR_RADIUS;
        this.childVectors = [];
    }

    draw(): void {
        //draw a white circle representing the current vector itself
        this.drawVector();

        //draw straight lines to each child vectors
        for (const childVector of this.childVectors) {
            this.editor.ctx.beginPath();
            this.editor.ctx.strokeStyle = '#000';
            this.editor.ctx.moveTo(this.x, this.y);
            this.editor.ctx.lineTo(childVector.x, childVector.y);
            this.editor.ctx.stroke();
            childVector.draw();
        }
    }

    //draws a white circle
    private drawVector(): void {
        this.editor.ctx.strokeStyle = '#000';
        this.editor.ctx.fillStyle = '#fff';
        this.editor.ctx.beginPath();
        this.editor.ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2, true);
        this.editor.ctx.stroke();
        this.editor.ctx.fill();
    }

    //adds a vector to the list of child vectors
    addChild(vector: VectorEO): void {
        this.childVectors.push(vector);
    }

    //calls a specific callback function on this vector and recursively on all its children
    echoCall(fn: (vector: VectorEO) => void) {
        console.log('echo called!');
        fn(this);
        this.childVectors.forEach(vector => fn(vector));
    }
}