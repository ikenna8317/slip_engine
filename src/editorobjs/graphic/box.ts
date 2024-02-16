import { Editor } from "../../editor";
import InteractiveEO from "./interactiveeo";


export default class Box extends InteractiveEO {
    constructor(editor: Editor, x: number, y: number, width: number = 100, height: number = 100) {
        super(editor, x, y, width, height);
    }

    draw(): void {
        super.draw();

        this.editor.ctx.strokeStyle = '#000';
        this.editor.ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}