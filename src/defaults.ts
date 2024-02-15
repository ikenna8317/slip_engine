import { EditorState } from "./editor";
type Defaults = {
    cursor: {
        CIRCLE_CURSOR_RADIUS: number
    },
    graphic: {
        SELECTION_OFFSET: number
    }
};

type KeyMapping = Array<{
    key: string,
    editorState: EditorState,
    resetOnToggle: boolean
}>;

const keyMap: KeyMapping = [
    {
        key: 'v',
        editorState: EditorState.VectorDraw,
        resetOnToggle: true
    },
    {
        key: 'enter',
        editorState: EditorState.View,
        resetOnToggle: false
    },
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
    keyMap,
    defaults
};