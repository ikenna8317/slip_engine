import { Editor } from "../../editor";
import InteractiveEO from "./interactiveeo";
import VectorEO from "./vectoreo";

export default class GraphicEO extends InteractiveEO {
    rootVector: VectorEO;
    selectedVectors: Array<VectorEO>;
    extremeX: {min: number, max: number};
    extremeY: {min: number, max: number};

    constructor(editor: Editor, x: number, y: number) {
        super(editor, x, y);
        this.rootVector = new VectorEO(this, this.x, this.y);
        this.selectedVectors = [];
        this.extremeX = {min: x, max: x};
        this.extremeY = {min: y, max: y};
    }

    draw(): void {
        super.draw();
        this.rootVector.draw();
    }

    updateDimensions(): void {
        const { width, height } = this.calcWidthAndHeight();
        this.x = this.extremeX.min;
        this.y = this.extremeY.min;

        this.width = width;
        this.height = height;
    }

    private calcWidthAndHeight(): { width: number, height: number} {
        this.rootVector.echoCall(this.findMinAndMax);
        const width = this.extremeX.max - this.extremeX.min;
        const height = this.extremeY.max - this.extremeY.min;

        return { width, height };
    }

    findMinAndMax(vector: VectorEO): void {
        if (vector.x < vector.graphicObject.extremeX.min)
            vector.graphicObject.extremeX.min = vector.x;
        else if (vector.x > vector.graphicObject.extremeX.max)
            vector.graphicObject.extremeX.max = vector.x;

        if (vector.y < vector.graphicObject.extremeY.min)
            vector.graphicObject.extremeY.min = vector.y;
        else if (vector.y > vector.graphicObject.extremeY.max)
            vector.graphicObject.extremeY.max = vector.y;
    }

}