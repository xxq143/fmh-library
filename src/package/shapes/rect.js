import {Shape} from '../shape';
import globalConfig from '../config';

export class Rect extends Shape {
	typeList = []

	constructor (config = globalConfig) {
		super(config)
		this.setType('shape')
		this.addType('rect', 'geo')
	}

	update () {
		this.x += 10
	}

	/**
	 * @description   覆盖父类方法
	 * @param {Ctx} ctx discribe
	 * @return {void}
	 */
	draw () {
		let ctx = this.getCtx()
		let {x, y, width, height} = this;
		ctx[`${this.drawType}Rect`](x, y, width, height)
	}
}

export default Rect
