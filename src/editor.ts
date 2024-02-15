import EditorObject from "./editorobjs/editorobj";
import { EVectorCursor } from "./editorobjs/editor/cursor";
import GraphicEO from "./editorobjs/graphic/graphiceo";

import { InputType, stateMap, StateTransition } from "./defaults";
import VectorEO from "./editorobjs/graphic/vectoreo";

type EditorConfig = {
    width: number;
    height: number;
};

export const enum EditorState {
    View,
    VectorDraw,
    VectorBuild
};


export class Editor {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    objs: Array<EditorObject>;
    cursor: {x: number, y: number};
    onlyUpdateOnInput: boolean;
    state: EditorState;
    prevState: EditorState;
    gobj: GraphicEO | null;

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
        this.prevState = EditorState.View;
        this.gobj = null;
        const onStateChangeEvent = new CustomEvent('onstatechange', { detail: EditorState.View });

        this.canvas.addEventListener('mousemove', event => {
            this.cursor.x = Math.floor(event.clientX);
            this.cursor.y = Math.floor(event.clientY);

            if (this.onlyUpdateOnInput)
                this.update();
        });
        document.addEventListener('keydown', e => {
            if (e.repeat)
                return;

            const validState: StateTransition | undefined = stateMap.find(statePair => { 
                return statePair.inputType === InputType.KeyPress 
                &&
                statePair.key === e.key
                &&
                statePair.reqState === this.state;
            });

            if (!validState) {
                console.error('Unable to transition to proper state on key press: ' + e.key + ' from ' + this.state);
                return;
            }

            this.prevState = this.state;
            this.state = validState.nextState;
            document.dispatchEvent(onStateChangeEvent);
        });

        document.addEventListener('click', () => {
            if (!this.isCursorInBounds())
                return;

            const validState: StateTransition | undefined = stateMap.find(statePair => { 
                return statePair.inputType === InputType.MouseClick 
                &&
                statePair.reqState === this.state;
            });

            if (!validState) {
                console.error('Unable to transition to proper state on mouse click from ' + this.state);
                return;
            }

            this.prevState = this.state;
            this.state = validState.nextState;
            document.dispatchEvent(onStateChangeEvent);
        });

        //TODO: after testing the vector draw functionality, test passing previous state
        // into the custom state change event
        document.addEventListener('onstatechange', () => {
            console.log('state has changed from ' + this.prevState + ' to ' + this.state);
            switch (this.state) {
                case EditorState.View:
                    if (this.prevState === EditorState.VectorBuild)
                        this.resetGOBuffer();
                break;
                case EditorState.VectorBuild:
                    this.addVector(this.cursor.x, this.cursor.y);
                break;
            }
        });

        //the vector cursor
        this.add(new EVectorCursor(this));

        //TODO: add some basic shapes/objects to use an example to implement the highlight and selection functionality

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

    addVector(x: number, y: number): void {
        if (this.gobj && this.gobj.selectedVectors.length > 1)
            return;

        if (!this.gobj) {
            this.gobj = new GraphicEO(this, x, y);
            this.gobj.selectedVectors[0] = this.gobj.rootVector;
            this.add(this.gobj);
            return;
        }
        
        const vector: VectorEO = new VectorEO(this.gobj, x, y);
        this.gobj.selectedVectors[0].addChild(vector);
        const numOfChildren: number = this.gobj.selectedVectors[0].childVectors.length;
        this.gobj.selectedVectors[0] = this.gobj.selectedVectors[0].childVectors[numOfChildren-1];
    }

    resetGOBuffer(): void {
        this.gobj = null;
    }
}