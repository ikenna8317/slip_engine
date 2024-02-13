import EditorObject from "./editorobjs/editorobj";
import { EVectorCursor } from "./editorobjs/editor/cursor";

type EditorConfig = {
    width: number;
    height: number;
};

type EditorStates = {
    READY_VERTEX_DRAW: boolean,
    VERTEX_DRAW: boolean
}


export default class Editor {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    objs: Array<EditorObject>;
    mouse: {x: number, y: number};
    states: EditorStates = {
        READY_VERTEX_DRAW: false,
        VERTEX_DRAW: false
    };

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
        this.canvas.style.backgroundColor = '#fff';

        this.ctx = this.canvas.getContext('2d');
        this.mouse = { x: 0, y: 0 };
        this.objs = [];

        this.canvas.addEventListener('mousemove', event => {
            this.mouse.x = Math.floor(event.clientX);
            this.mouse.y = Math.floor(event.clientY);
        });

        //the vector cursor
        this.add(new EVectorCursor(this));

        window.requestAnimationFrame(() => this.update());
    }

    add(obj: EditorObject): void {
        this.objs.push(obj);
    }

    update(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const obj of this.objs) {
            if (obj.active) {
                obj.draw();
                obj.update();
            }
        }
        window.requestAnimationFrame(() => this.update());
    }

    isMouseInBounds(): boolean {
        return (this.mouse.x > 0 && this.mouse.x < this.canvas.width) && (this.mouse.y > 0 && this.mouse.y < this.canvas.height);
    }
}