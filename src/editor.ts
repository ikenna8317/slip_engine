import EditorObject from "./editorobjs/editorobj";
import { EVectorCursor } from "./editorobjs/editor/cursor";
import GraphicEO from "./editorobjs/graphic/graphiceo";

import { keyMap } from "./defaults";
import VectorEO from "./editorobjs/graphic/vectoreo";

type EditorConfig = {
    width: number;
    height: number;
};

export const enum EditorState {
    View,
    VectorDraw
};


export class Editor {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    objs: Array<EditorObject>;
    cursor: {x: number, y: number};
    onlyUpdateOnInput: boolean;
    state: EditorState;

    constructor(config: EditorConfig) {
        const {
            width,
            height
        } = config;
        this.canvas = document.createElement('canvas');
        document.getElementById('editor-container').appendChild(this.canvas);
        this.canvas.setAttribute('width', width.toString());
        this.canvas.setAttribute('height', height.toString());
        this.canvas.setAttribute('aria-label', 'editor');
        this.canvas.setAttribute('tabindex', '');
        this.canvas.style.backgroundColor = '#fff';

        this.ctx = this.canvas.getContext('2d');
        this.cursor = { x: 0, y: 0 };
        this.objs = [];
        this.onlyUpdateOnInput = true;
        this.state = EditorState.View;

        this.canvas.addEventListener('mousemove', event => {
            this.cursor.x = Math.floor(event.clientX);
            this.cursor.y = Math.floor(event.clientY);

            if (this.onlyUpdateOnInput)
                this.update();
        });
        document.addEventListener('keydown', e => {
            if (e.repeat)
                return;

           keyMap.forEach(value => {
                if (e.key === value.key) {
                    if (value.resetOnToggle && (value.editorState === this.state))
                        this.state = EditorState.View;
                    else
                        this.state = value.editorState;
                    this.update();
                    return;
                }
           })
        })

        //the vector cursor
        this.add(new EVectorCursor(this));

        //TODO: add some basic shapes/objects to use an example to implement the highlight and selection functionality

        const gobj = new GraphicEO(this, 50, 10);
        gobj.init();

        gobj.rootVector.childVectors.push(new VectorEO(this, 40, 20));
        gobj.rootVector.childVectors.push(new VectorEO(this, 60, 20));

        gobj.rootVector.childVectors[0].childVectors.push(new VectorEO(this, 35, 35));

        gobj.rootVector.childVectors[1].childVectors.push(new VectorEO(this, 56, 35));
        gobj.rootVector.childVectors[1].childVectors.push(new VectorEO(this, 64, 35));

        this.add(gobj);

        this.update();
    }

    add(obj: EditorObject): void {
        if (obj.draw && obj.update)
            this.objs.push(obj);
    }

    update(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const obj of this.objs) {
            obj.preUpdate();
            if (obj.active) {
                obj.draw();
                obj.update();
            }
        }

        if (!this.onlyUpdateOnInput)
            window.requestAnimationFrame(() => this.update());
    }

    isCursorInBounds(): boolean {
        return (this.cursor.x > 0 && this.cursor.x < this.canvas.width) && (this.cursor.y > 0 && this.cursor.y < this.canvas.height);
    }
}