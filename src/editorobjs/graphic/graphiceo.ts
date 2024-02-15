import { Editor } from "../../editor";
import InteractiveEO from "./interactiveeo";
import VectorEO from "./vectoreo";

export default class GraphicEO extends InteractiveEO {
    rootVector: VectorEO;
    selectedVectors: Array<VectorEO>

    constructor(editor: Editor, x: number, y: number) {
        super(editor, x, y);
        this.rootVector = new VectorEO(this, this.x, this.y);
        this.selectedVectors = [];
    }

    draw(): void {
        if (!this.rootVector)
            return;

        this.rootVector.draw();
    }
    
}