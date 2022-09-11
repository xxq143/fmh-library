import {Shape} from '../shape';
import globalConfig from '../config';

export class Line extends Shape {
	typeList = []

	constructor (config = globalConfig) {
		super(config)
		this.setType('shape')
		this.addType('line', 'geo')
		this.pointList = config.pointList || []
	}

	/**
	 * @description   覆盖父类方法
	 * @param {Ctx} ctx discribe
	 * @return {void}
	 */
	_draw () {
		let ctx = this.getCtx()
		if (this.drawType === 'stroke') {
			// 每次都重新绘制路径
			ctx.beginPath()
			if (type && type === 'change') {
				let firstPoint = this.pointList[this.pointList.length - 2]
				let nextPoint = this.pointList[this.pointList.length - 1]
				ctx.moveTo(firstPoint.x, firstPoint.y);
				ctx.lineTo(nextPoint.x, nextPoint.y)
				ctx[this.drawType]()
			} else {
				this.pointList.forEach((point, index) => {
					let {x, y} = point
					if (index === 0) {
						ctx.moveTo(x, y)
					} else {
						ctx.lineTo(x, y)
					}
				})
				ctx[this.drawType]()
			}
		} else {
			if (type && type === 'change') {
				let firstPoint = {
					x: 0, y: 0,
				}, nextPoint = {
					x: 50, y: 50,
				}, lastPoint = {
					x: 0, y: 50,
				};
				if (this.pointList.length > 2) {
					firstPoint = this.pointList[this.pointList.length - 3]
					nextPoint = this.pointList[this.pointList.length - 2]
					lastPoint = this.pointList[this.pointList.length - 1]
				}
				ctx.beginPath()
				ctx.moveTo(firstPoint.x, firstPoint.y);
				ctx.lineTo(nextPoint.x, nextPoint.y)
				ctx.lineTo(lastPoint.x, lastPoint.y)
				ctx.closePath()
				ctx[this.drawType]()
			} else {
				this.pointList.forEach((point, index) => {
					let {x, y} = point
					if (index === 0) {
						ctx.beginPath()
						ctx.moveTo(x, y)
					} else {
						ctx.lineTo(x, y)
					}
				})
				ctx.closePath()
				ctx[this.drawType]()
			}
		}
	}

	updatePoints (points) {
		this.pointList = points
		if (!this.getRoot().looping) {
			// 继续绘制
			this.drawRefresh()
		}
	}

	addPoints (points) {
		this.pointList.push(points)
		if (!this.getRoot().looping) {
			// 继续绘制
			this.drawChange()
		}
	}
}

export default Line
