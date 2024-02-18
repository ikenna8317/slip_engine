import { defaults } from "../../defaults";
import { EditorState } from "../../editor";
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
        if (this.selected)
            this.drawSelectionArc();
        else {
            if (this.highlighted)
                this.drawHighlightBox();
            //draw a white circle representing the current vector itself
            this.editor.ctx.strokeStyle = '#000';
            this.editor.ctx.fillStyle = '#fff';
            this.editor.ctx.beginPath();
            this.editor.ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2, true);
            this.editor.ctx.stroke();
            this.editor.ctx.fill();
        }
    }

    update(): void {
        this.highlighted = this.doesCursorOverlap();
        // console.log('Editor state: %d', this.editor.state);
        // console.log('Editor object: %O', this.editor.gobj);
        // console.log('Cursor overlaps: ' + this.doesCursorOverlap());

        // if (this.highlighted)
        //     console.log('vector has been highlighted');
        // if (this.selected)
        //     console.log('vector has been selected');
    }

    private drawSelectionArc(): void {
        this.editor.ctx.strokeStyle = '#000';
        this.editor.ctx.fillStyle = defaults.graphic.SELECT_COLOR;
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