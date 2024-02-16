import { defaults } from "../../defaults";
import GraphicEO from "./graphiceo";
import InteractiveEO from "./interactiveeo";

export default class VectorEO extends InteractiveEO {
    adjVectors: Array<VectorEO>;
    graphicObject: GraphicEO;
   
    constructor(graphicObj: GraphicEO, x: number, y: number) {
        super(graphicObj.editor, x, y, defaults.cursor.CIRCLE_CURSOR_RADIUS, defaults.cursor.CIRCLE_CURSOR_RADIUS);
        this.graphicObject = graphicObj;
        this.adjVectors = [];
    }

    draw(): void {
        //draw a white circle representing the current vector itself
        this.editor.ctx.strokeStyle = '#000';
        this.editor.ctx.fillStyle = '#fff';
        this.editor.ctx.beginPath();
        this.editor.ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2, true);
        this.editor.ctx.stroke();
        this.editor.ctx.fill();
    }

    //adds a vector to the list of adjacent vectors
    connect(vector: VectorEO): void {
        this.adjVectors.push(vector);
    }

}