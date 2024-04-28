import EditorObject from "./editorobjs/editorobj";
import { EVectorCursor } from "./editorobjs/editor/cursor";
import GraphicEO from "./editorobjs/graphic/graphiceo";

import { defaults, InputType, stateMap, StateTransition } from "./defaults";
import InteractiveEO from "./editorobjs/graphic/interactiveeo";

import stateReducer from "./reducer";

//basic configuration object for setting up the editor canvas
type EditorConfig = {
    width: number;
    height: number;
};

//possible states the editor can be in
export const enum EditorState {
    View,           //0
    VectorDraw,     //1
    VectorBuild,    //2
    VectorEdit      //3
};

//main editor class
export class Editor {
    /* the main canvas interface in which objects are drawn */
    canvas: HTMLCanvasElement;      

    /* the 2D context used for drawing operations on the canvas */
    ctx: CanvasRenderingContext2D;     //

    /* An array of objects that gets drawn on the canvas */
    objs: Array<EditorObject>;      

    onStateChangeEvent: Event;

    /* the rounded down x and y position of the mouse */
    cursor: {x: number, y: number};     
    
    /* 
    the canvas will only refresh on user input (i.e. moving mouse, pressing a key) if true.
    Otherwise, the canvas will refresh automatically every frame i.e. 60FPS if false
    */
    onlyUpdateOnInput: boolean;  
    
    /* the current state of the editor i.e. (View, VectorDraw, ...) */
    state: EditorState;

    /* The previous state of the editor */
    prevState: EditorState;

    /* The buffer that stores the graphic object that is being currently drawn by the user */
    gobj: GraphicEO;

    selections: Array<InteractiveEO>;

    // currVector: VectorEO;

    constructor(config: EditorConfig) {
        const {
            width,
            height
        } = config;

        /* Initialize the canvas and set the attributes */
        this.canvas = document.createElement('canvas');
        document.getElementById('editor-container').appendChild(this.canvas);
        this.canvas.setAttribute('width', width.toString());
        this.canvas.setAttribute('height', height.toString());
        this.canvas.setAttribute('aria-label', 'editor');
        this.canvas.style.backgroundColor = '#dbdbdb';

        /* Initialize the editor specific variables */
        this.ctx = this.canvas.getContext('2d');
        this.cursor = { x: 0, y: 0 };
        this.objs = [];
        this.onlyUpdateOnInput = true;
        this.state = this.prevState = EditorState.View;
        this.gobj = null;
        this.selections = [];
        // this.currVector = null;

        /* this event is dispatched/emitted whenever the state of the editor changes */
        this.onStateChangeEvent = new Event('onstatechange');

        /* Whenever the user moves the mouse... */
        this.canvas.addEventListener('mousemove', event => {
            /* Update the cursor position with the rounded down value of the users mouse position */
            this.cursor.x = Math.floor(event.clientX) - defaults.cursor.MOUSE_OFFSET;
            this.cursor.y = Math.floor(event.clientY) - defaults.cursor.MOUSE_OFFSET;

            /* Update/refresh the canvas */
            if (this.onlyUpdateOnInput)
                this.update();
        });

        /* Whenever the user presses a key */
        document.addEventListener('keydown', e => {
            /* ignore all repeated keydown events to only listen for single presses,
             also ignore key events when the cursor is not within the canvas */
            if (e.repeat || !this.isCursorInBounds())
                return;

            this.processNextState(InputType.KeyPress, e.key);
        });

        
        document.addEventListener('click', () => {
            //if the cursor is out of the bounds of the canvas then ignore and exit
            if (!this.isCursorInBounds())
                return;

            this.processNextState(InputType.MouseClick);
        });

        /* Whenever the state of the editor changes this listener is meant to perform special editor-wide actions that are not tied to any specific object */
        this.canvas.addEventListener('onstatechange', () => {
            // console.log('state has changed from ' + this.prevState + ' to ' + this.state);
            stateReducer(this);
            this.update();
        });

        //add the vector cursor object to the editor display list
        this.add(new EVectorCursor(this));

        //TODO: add some basic shapes/objects to use an example to show the highlight and selection functionality
        // this.add(new Box(this, 150, 150));

        //update the frame
        this.update();
    }

    //Self-explanatory: adds an object to the editor display list
    add(obj: EditorObject): void {
        if (obj.draw && obj.update)
            this.objs.push(obj);
    }

    //updates the frame
    private update(): void {
        //clear the entire canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //for each object in the display list
        for (const obj of this.objs) {
            obj.preUpdate();
            /* draw and update the object only if it is currently active */
            if (obj.active) {
                obj.draw();
                obj.update();
            }
        }

        /* if 'onlyUpdateOnInput' is false then automatically run the update function again */
        if (!this.onlyUpdateOnInput)
            window.requestAnimationFrame(() => this.update());
    }

    //returns true if the cursor is within the canvas (drawing screen), false otherwise
    isCursorInBounds(): boolean {
        return (this.cursor.x > 0 && this.cursor.x < this.canvas.width) && (this.cursor.y > 0 && this.cursor.y < this.canvas.height);
    }

    /* adds a vector to the global graphic object if it exists, otherwise create a new graphic object */
    buildGraphicObject(x: number, y: number): void {
        /* if more than one vector is selected then exit */
        if (this.gobj && (this.gobj.selectedVectors.length != 1))
            return;

        /* if the global graphic object is null (does not exists yet) */
        if (!this.gobj && this.state === EditorState.VectorBuild) {
            //create a new graphic object, put it into the buffer, select its root vector and add it to the display list
            this.gobj = new GraphicEO(this, x, y);
            this.add(this.gobj);
            return;
        }
    
        this.gobj.addVector(x, y);
    }

    processNextState(inputType: InputType, key?: string): StateTransition {
        /* find the next state to switch to depending on the current state and key pressed */
        const transition: StateTransition | undefined = stateMap.find(statePair => 
            statePair.inputType === inputType
            &&
            statePair.reqState === this.state
            &&
            (!key || (statePair.key === key))
        );

        //if no next state was found then exit 
        if (!transition) {
            // console.error('Unable to transition to proper state on mouse click from ' + this.state);
            return;
        }

        /* Update the previous and current state and let the page know we have changed the state of the editor */
        this.transitionState(transition.nextState);

        return transition;
    }

    transitionState(editorState: EditorState, dispatchChange: boolean = true): void {
        this.prevState = this.state;
        this.state = editorState;
        if (dispatchChange)
            this.canvas.dispatchEvent(this.onStateChangeEvent);
    }

    /* Debugging purposes only: list out the graph representation of the graphical object */
    private logVectors(gobj: GraphicEO) {
        console.log('children: %s', gobj.vectors.toString());
        let i = 1;
        gobj.vectors.forEach(vector => { 
            console.log('%d\'s connected vectors: %s', i, vector.adjVectors.toString());
            i++;
        });
        console.log('finished');
    }

    /* nullify the global graphics object to make space for the creation of new graphic objects */
    resetGOBuffer(): void {
        if (this.gobj) {
            this.gobj.unselectAll();
            this.gobj = null;
        }
    }
}