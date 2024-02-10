export default class Scene {
    constructor(config) {
        //init the canvas
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', config.width.toString());
        this.canvas.setAttribute('height', config.height.toString());
        document.getElementById('canvas-container').appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.frameRate = config.frameRate;
        this.objs = [];
        this.isPlaying = false;

        this.play();
    }

    //add an object to the scene
    add(obj) {
        if (obj.update && obj.draw)
          this.objs.push(obj);
    }

    //remove all elements from the scene and clear the canvas
    clear() {
        this.objs.splice(0,this.objs.length);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isPlaying = false;
    }

    //self-explanatory
    pause() {
        this.isPlaying = false;
    }

    //resumes the scene if paused, ignores if already playing
    play() {
        if (this.isPlaying)
            return;
        this.isPlaying = true;
        window.requestAnimationFrame(() => this.update());
    }

    //called once per frame
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.objs.length; i++) {
            const obj = this.objs[i];
            obj.update();
            obj.draw();
        }
        if (this.isPlaying)
            window.requestAnimationFrame(() => this.update());
    }
}