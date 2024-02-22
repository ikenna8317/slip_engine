import { Editor, EditorState } from "../../editor";
import InteractiveEO from "./interactiveeo";
import VectorEO from "./vectoreo";

type Connection = {
    v1: VectorEO,
    v2: VectorEO
};

const isConnectionEqual = (c1: Connection, c2: Connection): boolean => {
    function isVectorEqual(v1: VectorEO, v2: VectorEO): boolean {
        return (v1.x === v2.x) && (v1.y === v2.y);
    }
    return (isVectorEqual(c1.v1, c2.v2) && isVectorEqual(c1.v2, c2.v1)) || (isVectorEqual(c1.v1, c2.v1) && isVectorEqual(c1.v2, c2.v2));
}

export default class GraphicEO extends InteractiveEO {
    vectors: Array<VectorEO>;
    selectedVectors: Array<VectorEO>;
    private extremeX: {min: number, max: number};
    private extremeY: {min: number, max: number};

    constructor(editor: Editor, x: number, y: number) {
        super(editor, x, y);
        this.vectors = [];
        this.vectors.push(new VectorEO(this, x, y));
        this.selectedVectors = [this.vectors[0]];
        this.extremeX = {min: x, max: x};
        this.extremeY = {min: y, max: y};
    }

    draw(): void {
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
        super.draw();
    }

    update(): void {
        super.update();
        if ((this.editor.state === EditorState.VectorEdit || this.editor.state === EditorState.VectorBuild) && this.editor.gobj === this)
            this.vectors.forEach(vector => vector.update());
    }

    updateDimensions(): void {
        const { width, height } = this.calcWidthAndHeight();
        this.x = this.extremeX.min;
        this.y = this.extremeY.min;

        this.width = width;
        this.height = height;
    }

    unselectAll(): void {
        // this.selectedVectors.forEach(vector => vector.highlighted = vector.selected = false);
       this.vectors.forEach(vector => {
        if (vector.highlighted || vector.selected)
            vector.highlighted = vector.selected = false;
       });
        this.selectedVectors.splice(0, this.selectedVectors.length)
    }

    addVector(x: number, y: number): void {
        if (this.selectedVectors.length != 1)
            return;

        const currVector: VectorEO = this.selectedVectors[0];
        const newVector: VectorEO = new VectorEO(this, x, y);

        currVector.selected = false;
        newVector.selected = true;

        this.selectedVectors[0] = newVector;

        currVector.connect(newVector);
        this.vectors.push(newVector);
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