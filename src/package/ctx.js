export class Ctx{
	canvas = null
	ctx = null
	constructor (canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
	}
	_rect() {
		this.ctx.fillStyle = 'rgb(0,20,40)'
		this.ctx.fillRect(0,0,200,200);
	}
}

export default Ctx
