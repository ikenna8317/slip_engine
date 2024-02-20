import { EditorState } from "./editor";
type Defaults = {
    cursor: {
        CIRCLE_CURSOR_RADIUS: number,
        MOUSE_OFFSET: number
    },
    graphic: {
        SELECTION_OFFSET: number,
        SELECTION_BOX_BEAD_DIM: number,
        HIGHLIGHT_COLOR: string,
        SELECT_COLOR: string,
        MERGE_COLOR: string
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

/* A map/table of all possible state transitions
and what triggering input event to listen for */
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
    },
    {
        inputType: InputType.MouseClick,
        reqState: EditorState.View,
        nextState: EditorState.View
    },
    {
        inputType: InputType.KeyPress,
        key: 'Enter',
        reqState: EditorState.View,
        nextState: EditorState.VectorEdit
    },
    {
        inputType: InputType.KeyPress,
        key: 'Enter',
        reqState: EditorState.VectorEdit,
        nextState: EditorState.View
    },
    {
        inputType: InputType.MouseClick,
        reqState: EditorState.VectorEdit,
        nextState: EditorState.VectorEdit
    },
    {
        inputType: InputType.KeyPress,
        key: 'e',
        reqState: EditorState.VectorEdit,
        nextState: EditorState.VectorBuild
    },
    {
        inputType: InputType.KeyPress,
        key: 'e',
        reqState: EditorState.VectorBuild,
        nextState: EditorState.VectorEdit
    }
];

/* Constants used throughout the editor */
const defaults: Defaults = {
    cursor: {
        CIRCLE_CURSOR_RADIUS: 4,
        MOUSE_OFFSET: 10
    },
    graphic: {
        SELECTION_OFFSET: 5,
        SELECTION_BOX_BEAD_DIM: 5,
        HIGHLIGHT_COLOR: '#04a8d1',
        SELECT_COLOR: '#33f1ff',
        MERGE_COLOR: '#ff5a08'
    }
}

export {
    stateMap,
    StateTransition,
    InputType,
    defaults
};