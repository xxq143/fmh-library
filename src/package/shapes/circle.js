import {Shape} from '../shape';
import globalConfig from '../config';

export class Circle extends Shape{
	typeList = []
	radius = 50
	startAngle = 0
	endAngle = Math.PI * 1.5
	anticlockwise = false	// 是否逆时针绘制
	constructor(config = globalConfig) {
		super(config)
		this.setType('shape')
		this.addType('circle', 'geo')
	}

	/**
	 * @description   覆盖父类方法
	 * @param {Ctx} ctx discribe
	 * @return {void}
	 */
	_draw (ctx) {
		let {x, y, radius, startAngle, endAngle, anticlockwise} = this;
		ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
		ctx[this.drawType]()
	}
}

export default Circle
