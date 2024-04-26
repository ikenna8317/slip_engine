import { Editor, EditorState } from "../../editor";
import InteractiveEO from "./interactiveeo";
import VectorEO from "./vectoreo";

/* 
TODO: Implement this algorithm

will add webassembly to offload expensive array calculations from the ui thread
------------------------------------------
Show mid vector between 2 vectors algorithm
-------------------------------------------
- For each vector in the graphics object:
    - For each adjacent vector connected:
        - Calculate the slope of the line between the vector and its adjacent
        - Divide the y value of the cursor by its x value
        - Compare the result of the division in the step above to the slope we calculated
            - If the result is exactly equals to or within a margin of error to the slope then the cursor lies within the point of 
              the line between the 2 vectors, in this case, break the loop and exit
            - If not, continue the loop
- If we never found any intersection then the cursor doesn't lie within any lines 
*/

export default class GraphicEO extends InteractiveEO {
    vectors: Array<VectorEO>;
    selectedVectors: Array<VectorEO>;

    /*  */
    private rangeX: {min: number, max: number};
    private rangeY: {min: number, max: number};

    /* The built path2d that the editor canvas context renders */
    path: Path2D;

    constructor(editor: Editor, x: number, y: number) {
        super(editor, x, y);
        this.vectors = [];
        this.vectors.push(new VectorEO(this, x, y));
        this.selectedVectors = [this.vectors[0]];
        this.rangeX = {min: x, max: x};
        this.rangeY = {min: y, max: y};

        this.path = new Path2D();
    }

    draw(): void {
        this.editor.ctx.strokeStyle = '#000';
        this.editor.ctx.stroke(this.path);
        this.vectors.forEach(vector => vector.draw());
        super.draw();
    }

    update(): void {
        super.update();
        if ((this.editor.state === EditorState.VectorEdit || this.editor.state === EditorState.VectorBuild) && this.editor.gobj === this)
            this.vectors.forEach(vector => vector.update());
    }

    updateDimensions(): void {
        const { width, height } = this.calcWidthAndHeight();
        this.x = this.rangeX.min;
        this.y = this.rangeY.min;

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

        //update the path
        this.path.moveTo(currVector.x, currVector.y);
        this.path.lineTo(newVector.x, newVector.y);

        this.vectors.push(newVector);
    }

    private calcWidthAndHeight(): { width: number, height: number} {
        this.vectors.forEach(vector => this.findMinAndMax(vector));
        const width = this.rangeX.max - this.rangeX.min;
        const height = this.rangeY.max - this.rangeY.min;

        return { width, height };
    }

    private findMinAndMax(vector: VectorEO): void {
        if (vector.x < this.rangeX.min)
            this.rangeX.min = vector.x;
        else if (vector.x > this.rangeX.max)
            this.rangeX.max = vector.x;

        if (vector.y < this.rangeY.min)
            this.rangeY.min = vector.y;
        else if (vector.y > this.rangeY.max)
            this.rangeY.max = vector.y;
    }

}