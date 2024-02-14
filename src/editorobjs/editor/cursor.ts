import {Editor, EditorState} from '../../editor';
import EditorObject from '../editorobj';
import {defaults} from '../../defaults';

export class EVectorCursor extends EditorObject {
    constructor(editor: Editor) {
        super(editor, editor.cursor.x, editor.cursor.y);
        this.active = false;
    }
    preUpdate(): void {
        this.active = (this.editor.state === EditorState.VectorDraw) && this.editor.isCursorInBounds();
    }
    draw(): void {
        this.editor.ctx.strokeStyle = '#000';
        this.editor.ctx.beginPath();
        this.editor.ctx.arc(this.x, this.y, defaults.cursor.CIRCLE_CURSOR_RADIUS, 0, Math.PI * 2, true);
        this.editor.ctx.stroke();
    }
    update(): void {
        this.x = this.editor.cursor.x;
        this.y = this.editor.cursor.y;
    }
}