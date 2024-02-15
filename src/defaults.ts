import { EditorState } from "./editor";
type Defaults = {
    cursor: {
        CIRCLE_CURSOR_RADIUS: number
    },
    graphic: {
        SELECTION_OFFSET: number
    }
};

/* Possible input types */
const enum InputType {
    KeyPress,
    MouseClick
};

type StateTransition = {
    inputType: InputType,
    key?: string,
    data?: object,
    reqState: EditorState,
    nextState: EditorState
};

/* A map/table of each possible state transition
and what input to listen for */
const stateMap: Array<StateTransition> = [
    {
        inputType: InputType.KeyPress,
        key: 'v',
        reqState: EditorState.View,
        nextState: EditorState.VectorDraw
    },
    {
        inputType: InputType.KeyPress,
        key: 'v',
        reqState: EditorState.VectorDraw,
        nextState: EditorState.View
    },
    {
        inputType: InputType.MouseClick,
        reqState: EditorState.VectorDraw,
        nextState: EditorState.VectorBuild
    },
    {
        inputType: InputType.MouseClick,
        reqState: EditorState.VectorBuild,
        nextState: EditorState.VectorBuild
    },
    {
        inputType: InputType.KeyPress,
        key: 'Enter',
        reqState: EditorState.VectorBuild,
        nextState: EditorState.View
    },
    {
        inputType: InputType.KeyPress,
        key: 'v',
        reqState: EditorState.VectorBuild,
        nextState: EditorState.VectorDraw
    }
];

/* Constants used throughout the editor */
const defaults: Defaults = {
    cursor: {
        CIRCLE_CURSOR_RADIUS: 4
    },
    graphic: {
        SELECTION_OFFSET: 5
    }
}

export {
    stateMap,
    StateTransition,
    InputType,
    defaults
};