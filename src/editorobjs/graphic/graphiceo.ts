import { Editor } from "../../editor";
import InteractiveEO from "./interactiveeo";
import VectorEO from "./vectoreo";

export default class GraphicEO extends InteractiveEO {
    rootVector: VectorEO;

    constructor(editor: Editor, x: number, y: number, vector?: VectorEO) {
        super(editor, x, y);
        this.rootVector = vector;
    }

    init(): void {
        if (!this.rootVector)
            this.rootVector = new VectorEO(this.editor, this.x, this.y);
    }

    draw(): void {
        if (!this.rootVector)
            return;

        this.rootVector.draw();
    }
    
}