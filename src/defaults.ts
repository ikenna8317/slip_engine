import { EditorState } from "./editor";
type Defaults = {
    cursor: {
        CIRCLE_CURSOR_RADIUS: number
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
    }
];

const defaults: Defaults = {
    cursor: {
        CIRCLE_CURSOR_RADIUS: 10
    }
}

export {
    keyMap,
    defaults
};