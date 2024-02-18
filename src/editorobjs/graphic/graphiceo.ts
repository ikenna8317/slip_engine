import { Editor, EditorState } from "../../editor";
import InteractiveEO from "./interactiveeo";
import VectorEO from "./vectoreo";

export default class GraphicEO extends InteractiveEO {
    vectors: Array<VectorEO>;
    selectedVectors: Array<VectorEO>;
    extremeX: {min: number, max: number};
    extremeY: {min: number, max: number};

    constructor(editor: Editor, x: number, y: number) {
        super(editor, x, y);
        this.vectors = [];
        this.vectors.push(new VectorEO(this, x, y));
        this.selectedVectors = [];
        this.extremeX = {min: x, max: x};
        this.extremeY = {min: y, max: y};
    }

    draw(): void {
        super.draw();
        this.vectors.forEach(vector => {
            vector.adjVectors.forEach(adjVector => {
                this.editor.ctx.beginPath();
                this.editor.ctx.strokeStyle = '#000';
                this.editor.ctx.moveTo(vector.x, vector.y);
                this.editor.ctx.lineTo(adjVector.x, adjVector.y);
                this.editor.ctx.stroke();
            });
            vector.draw();
        });
    }

    update(): void {
        super.update();
        if (this.editor.state === EditorState.VectorEdit && this.editor.gobj === this)
            this.vectors.forEach(vector => vector.update());
    }

    updateDimensions(): void {
        const { width, height } = this.calcWidthAndHeight();
        this.x = this.extremeX.min;
        this.y = this.extremeY.min;

        this.width = width;
        this.height = height;
    }

    private calcWidthAndHeight(): { width: number, height: number} {
        this.vectors.forEach(vector => this.findMinAndMax(vector));
        const width = this.extremeX.max - this.extremeX.min;
        const height = this.extremeY.max - this.extremeY.min;

        return { width, height };
    }

    private findMinAndMax(vector: VectorEO): void {
        if (vector.x < this.extremeX.min)
            this.extremeX.min = vector.x;
        else if (vector.x > this.extremeX.max)
            this.extremeX.max = vector.x;

        if (vector.y < this.extremeY.min)
            this.extremeY.min = vector.y;
        else if (vector.y > this.extremeY.max)
            this.extremeY.max = vector.y;
    }

}