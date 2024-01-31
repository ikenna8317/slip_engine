export default class Scene {
    constructor(config) {
        this.canvas = config.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.frameRate = config.frameRate;
        this.objs = [];
        this.isPlaying = true;
        this.timerID = setInterval(() => this.update(), 1000/this.frameRate);
    }

    //add an object to the scene
    add(obj) {
        if (obj.update && obj.draw)
          this.objs.push(obj);
    }

    //remove all elements from the scene and clear the canvas
    clear() {
        clearInterval(this.timerID);
        this.objs.splice(0,this.objs.length);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isPlaying = false;
    }

    //self-explanatory
    pause() {
        clearInterval(this.timerID);
        this.isPlaying = false;
    }

    //resumes the scene if paused, ignores if already playing
    play() {
        if (this.isPlaying)
            return;
        this.timerID = setInterval(() => this.update(), Math.floor(1000/this.frameRate));
        this.isPlaying = true;
    }

    //called once per frame
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.objs.length; i++) {
            const obj = this.objs[i];
            obj.update();
            obj.draw();
        }
    }
}