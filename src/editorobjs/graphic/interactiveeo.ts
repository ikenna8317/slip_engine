import { Editor } from "../../editor";
import EditorObject from "../editorobj";
import { defaults } from "../../defaults";

export default class InteractiveEO extends EditorObject {
    width: number;
    height: number;
    highlighted: boolean;
    selected: boolean;

    constructor(editor: Editor, x: number, y: number) {
        super(editor, x, y);
        this.width = 0;
        this.height = 0;
        this.highlighted = this.isHighlighted();
        this.selected = false;
    }

    private isHighlighted(): boolean {
        return (this.editor.cursor.x < (this.x - defaults.graphic.SELECTION_OFFSET))
        &&
        (this.editor.cursor.x > (this.width + defaults.graphic.SELECTION_OFFSET)) 
        &&
        (this.editor.cursor.y < (this.y - defaults.graphic.SELECTION_OFFSET))
        &&
        (this.editor.cursor.y > (this.height + defaults.graphic.SELECTION_OFFSET));
    }
}