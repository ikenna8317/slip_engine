import Scene from './scene';
import MovingBox from './sceneobjs/custom/moving_box';
import BounceBox from './sceneobjs/custom/bounce_box';

const scene = new Scene({
    width: 1000,
    height: 800,
    frameRate: 25
});

const customBox = new MovingBox(scene, 50, 50, 12);
const customBox2 = new BounceBox(scene, 50, 170, 12);

scene.add(customBox);
scene.add(customBox2);