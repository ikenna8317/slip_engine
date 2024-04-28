import { Editor, EditorState } from "./editor";
import EditorObject from "./editorobjs/editorobj";
import InteractiveEO from "./editorobjs/graphic/interactiveeo";
import VectorEO from "./editorobjs/graphic/vectoreo";
import GraphicEO from "./editorobjs/graphic/graphiceo";

export default function stateReducer(editor: Editor) {
    const state: EditorState = editor.state;
    const prevState: EditorState = editor.prevState;

    switch (state) {
        //if the new state is 'View'
        case EditorState.View:
            /* if the previous state was 'VectorBuild' that means we just finished creating a graphic object,
             in that case empty the buffer holding the currently drawn graphics object */ 
             //OR
            /* if the previous state was 'VectorDraw' and the global graphic object is not null,
            then that means the user is done creating the graphics object, empty the buffer */
            if ((prevState === EditorState.VectorBuild)
                || 
                (prevState === EditorState.VectorDraw && editor.gobj)
                ||
                (prevState === EditorState.VectorEdit)) {
                editor.gobj.updateDimensions();
                editor.resetGOBuffer();
            } else if (prevState === EditorState.View) {
                //unselect all previously selected objects and empty the selections array
                editor.selections.forEach(obj => obj.selected = false);
                editor.selections.splice(0, editor.selections.length);

                //find the first highlighted object and mark it as selected
                const selectedObj: EditorObject = editor.objs.find(obj => obj instanceof InteractiveEO && obj.highlighted);

                if (selectedObj && selectedObj instanceof InteractiveEO) {
                    selectedObj.selected = true;
                    editor.selections.push(selectedObj);
                }
            }
        break;
        //...else if the new state is 'VectorBuild'
        case EditorState.VectorBuild:
            if (prevState === EditorState.VectorEdit)
                break;

            if (editor.gobj && editor.gobj.selectedVectors.length > 0) {
                const overlappedVector = editor.gobj.vectors.find(obj => obj.doesCursorOverlap());
                // console.log(overlappedVector);

                if (overlappedVector) {
                    const currVector: VectorEO = editor.gobj.selectedVectors[0];
                    editor.gobj.path.moveTo(currVector.x, currVector.y);
                    editor.gobj.path.lineTo(overlappedVector.x, overlappedVector.y);
                    currVector.connect(overlappedVector);
                    editor.gobj.updateDimensions();
                    editor.resetGOBuffer();
                    editor.transitionState(EditorState.View, false);
                    break;
                }
            }
            //add a vector object to the position of the cursor
            editor.buildGraphicObject(editor.cursor.x, editor.cursor.y);
        break;
        case EditorState.VectorEdit:
            if (prevState === EditorState.View) {
                const selectedObj: InteractiveEO = editor.selections.find(obj => obj instanceof GraphicEO)

                if (selectedObj && selectedObj instanceof GraphicEO) {
                    editor.gobj = selectedObj;
                }
            } else if (prevState === EditorState.VectorEdit) {
                /* check for selected vectors */
                //mark all currently selected vectors as false and clear the list of selected vectors
                // console.log('number of selected vectors: %d', gobj.selectedVectors.length);
                editor.gobj.selectedVectors.forEach(vector => vector.selected = false);
                editor.gobj.selectedVectors.splice(0, editor.gobj.selectedVectors.length);

                //find the first vector that is highlighted
                const selectedVector: VectorEO = editor.gobj.vectors.find(vector => vector.highlighted);

                //add the selected vector to the object list of selected vectors and mark the vector as selected
                if (selectedVector) {
                    editor.gobj.selectedVectors.push(selectedVector);
                    selectedVector.selected = true;
                }
            }
        break;
    }
}