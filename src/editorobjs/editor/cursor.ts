import Editor from '../../editor';
import EditorObject from '../editorobj';
import defaults from '../../defaults';

export class EVectorCursor extends EditorObject {
    constructor(editor: Editor) {
        super(editor, editor.mouse.x, editor.mouse.y);
    }
    draw(): void {
        if (!this.editor.isMouseInBounds())
            return;
            
        this.editor.ctx.strokeStyle = '#000';
        this.editor.ctx.beginPath();
        this.editor.ctx.arc(this.x, this.y, defaults.cursor.CIRCLE_CURSOR_RADIUS, 0, Math.PI * 2, true);
        this.editor.ctx.stroke();
    }
    update(): void {
        this.x = this.editor.mouse.x;
        this.y = this.editor.mouse.y;
    }
}