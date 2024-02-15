import { Editor, EditorState } from "./editor";
type Defaults = {
    cursor: {
        CIRCLE_CURSOR_RADIUS: number
    },
    graphic: {
        SELECTION_OFFSET: number
    }
};

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