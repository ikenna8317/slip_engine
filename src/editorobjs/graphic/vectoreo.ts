import { defaults } from "../../defaults";
import { Editor } from "../../editor";
import GraphicEO from "./graphiceo";
import InteractiveEO from "./interactiveeo";

export default class VectorEO extends InteractiveEO {
    childVectors: Array<VectorEO>;
   
    constructor(graphicObj: GraphicEO, x: number, y: number) {
        super(graphicObj.editor, x, y);
        this.width = defaults.cursor.CIRCLE_CURSOR_RADIUS;
        this.childVectors = [];
    }

    draw(): void {
        this.drawVector();

        for (const childVector of this.childVectors) {
            this.editor.ctx.beginPath();
            this.editor.ctx.moveTo(this.x, this.y);
            this.editor.ctx.lineTo(childVector.x, childVector.y);
            this.editor.ctx.stroke();
            childVector.draw();
        }
    }

    private drawVector(): void {
        this.editor.ctx.strokeStyle = '#000';
        this.editor.ctx.fillStyle = '#fff';
        this.editor.ctx.beginPath();
        this.editor.ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2, true);
        this.editor.ctx.stroke();
        this.editor.ctx.fill();
    }

    addChild(vector: VectorEO): void {
        this.childVectors.push(vector);
    }
}