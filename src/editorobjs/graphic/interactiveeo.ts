import { Editor, EditorState } from "../../editor";
import EditorObject from "../editorobj";
import { defaults } from "../../defaults";

export default class InteractiveEO extends EditorObject {
    width: number;
    height: number;
    highlighted: boolean;
    selected: boolean;

    constructor(editor: Editor, x: number, y: number, width: number = 0, height: number = 0) {
        super(editor, x, y);
        this.width = width;
        this.height = height;
        this.highlighted = false;
        this.selected = false;
    }

    draw(): void {
        if (this.highlighted)
            this.drawHighlightBox();
    }

    update(): void {
        this.highlighted = this.editor.state === EditorState.View && this.doesCursorOverlap();
        // console.log('Highlighted: ' + this.highlighted);
    }

    private drawHighlightBox(): void {
        // console.log('draw highlight box');
        this.editor.ctx.strokeStyle = '#04a8d1';
        this.editor.ctx.strokeRect(
            this.x - defaults.graphic.SELECTION_OFFSET,
            this.y - defaults.graphic.SELECTION_OFFSET,
            this.width + defaults.graphic.SELECTION_OFFSET * 2,
            this.height + defaults.graphic.SELECTION_OFFSET * 2
        );
    }

    private doesCursorOverlap(): boolean {
        // console.log('cursor overlaps object');
        return (this.editor.cursor.x > (this.x - defaults.graphic.SELECTION_OFFSET))
        &&
        (this.editor.cursor.x < (this.x + this.width + defaults.graphic.SELECTION_OFFSET)) 
        &&
        (this.editor.cursor.y > (this.y - defaults.graphic.SELECTION_OFFSET))
        &&
        (this.editor.cursor.y < (this.y + this.height + defaults.graphic.SELECTION_OFFSET));
        // console.log('Overlaps: ' + overlaps);
    }
}