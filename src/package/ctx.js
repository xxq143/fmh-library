export class Ctx{
	canvas = null
	ctx = null
	constructor (canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d', {alpha: true});
	}
}

export default Ctx
