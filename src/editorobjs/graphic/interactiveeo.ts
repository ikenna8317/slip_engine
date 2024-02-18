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
        if (this.selected)
            this.drawSelectionBox();
        else if (this.highlighted)
            this.drawHighlightBox();
    }

    update(): void {
        this.highlighted = this.editor.state === EditorState.View && this.doesCursorOverlap();
    }

    protected drawHighlightBox(): void {
        this.editor.ctx.strokeStyle = defaults.graphic.HIGHLIGHT_COLOR;
        this.editor.ctx.strokeRect(
            this.x - defaults.graphic.SELECTION_OFFSET,
            this.y - defaults.graphic.SELECTION_OFFSET,
            this.width + defaults.graphic.SELECTION_OFFSET * 2,
            this.height + defaults.graphic.SELECTION_OFFSET * 2
        );
    }

    private drawSelectionBox(): void {
        this.drawHighlightBox();

        const _miniw: number = defaults.graphic.SELECTION_BOX_BEAD_DIM;

        this.editor.ctx.fillStyle = '#fff';
        this.editor.ctx.strokeStyle = '#000';

        for (let i: number = this.x - defaults.graphic.SELECTION_OFFSET - (_miniw/2);
         i < this.x + this.width + defaults.graphic.SELECTION_OFFSET*2;
         i+=(this.width + defaults.graphic.SELECTION_OFFSET*2)/2
        ) 
            this.editor.ctx.strokeRect(i, this.y - defaults.graphic.SELECTION_OFFSET - _miniw/2, _miniw, _miniw);

        this.editor.ctx.strokeRect(this.x - defaults.graphic.SELECTION_OFFSET - (_miniw/2), this.y + this.height/2, _miniw, _miniw);
        this.editor.ctx.strokeRect((this.x + this.width) + defaults.graphic.SELECTION_OFFSET - (_miniw/2), this.y + this.height/2, _miniw, _miniw);

        for (let i: number = this.x - defaults.graphic.SELECTION_OFFSET - (_miniw/2);
         i < this.x + this.width + defaults.graphic.SELECTION_OFFSET*2;
         i+=(this.width + defaults.graphic.SELECTION_OFFSET*2)/2
        ) 
            this.editor.ctx.strokeRect(i, this.y + this.height + defaults.graphic.SELECTION_OFFSET - _miniw/2, _miniw, _miniw);
    }

    protected doesCursorOverlap(): boolean {
        return (this.editor.cursor.x > (this.x - defaults.graphic.SELECTION_OFFSET))
        &&
        (this.editor.cursor.x < (this.x + this.width + defaults.graphic.SELECTION_OFFSET)) 
        &&
        (this.editor.cursor.y > (this.y - defaults.graphic.SELECTION_OFFSET))
        &&
        (this.editor.cursor.y < (this.y + this.height + defaults.graphic.SELECTION_OFFSET));
    }
}