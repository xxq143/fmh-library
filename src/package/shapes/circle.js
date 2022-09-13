import {Shape} from '../shape';
import globalConfig from '../config';

export class Circle extends Shape {
	typeList = []
	radius = 50
	startAngle = 0
	endAngle = Math.PI * 2
	anticlockwise = true	// 是否逆时针绘制
	constructor (config = globalConfig) {
		super(config)
		this.setType('shape')
		this.addType('circle', 'geo')
		this.initStatus(config)
	}

	initStatus (config) {
		this.radius = config.radius || this.radius
		this.startAngle = config.startAngle || this.startAngle
		this.endAngle = config.endAngle || this.endAngle
		this.anticlockwise = config.anticlockwise || this.anticlockwise
	}

	update () {
		this.x += 10
		let layer = this.getLayer()
		if (this.x >= this.getCvSize().width) {
			layer.removeChild(this)
		}
	}

	/**
	 * @description   覆盖父类方法
	 * @param {Ctx} ctx discribe
	 * @return {void}
	 */
	draw () {
		let ctx = this.getCtx()
		ctx.beginPath()
		let {x, y, radius, startAngle, endAngle, anticlockwise} = this;
		ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
		ctx[this.drawType]()
	}
}

export default Circle
