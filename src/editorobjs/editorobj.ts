import Editor from "../editor";

export default class EditorObject {
    x: number;
    y: number;
    active: boolean;
    editor: Editor;

    constructor(editor: Editor, x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
        this.active = true;
        this.editor = editor;
    }

    draw(): void {

    }

    update(): void {
        
    }
}