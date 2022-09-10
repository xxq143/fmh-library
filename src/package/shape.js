import Node from './node'
import globalConfig from './config.js'
import utils from './utils'

/**
 * @description 图形基础属性
 * @param {array<string>} typeList 图形类型，用于分组和判断如何绘制
 * @param {array<function>} updateList  更新动画的函数列表
 * @param {number} lineWidth  绘制线条宽度
 * @param {string} drawColor  绘制颜色样式
 * @param {string} drawType: stroke | fill  绘制类型  描边 ｜ 充填
 * @return {}
 */
export class Shape extends Node {
	typeList = []
	updateList = []
	updateTime = 0
	randomColor = false
	speed = 10
	renderList = []
	action = ''
	input = null
	ctxAttrs = {
		lineWidth: 1,
		drawType: 'stroke',
		color: 'black',
	}
	lastElapsed = 0	// 记录暂停时记录的时间

	constructor (config = globalConfig) {
		super(config);
		this.setType('shape')
		this.refreshClock = this.refreshClock.bind(this)
		this.startClock = this.startClock.bind(this)
		this.stopClock = this.stopClock.bind(this)
		Object.keys(this.ctxAttrs).forEach(attr => {
			this[attr] = this.ctxAttrs[attr]
		})
	}

	/**
	 * @description 更新动画
	 * @param {Ctx} ctx 对应图层的画笔
	 * @param {object} callback 回调函数
	 * @return {}
	 */
	// todo 目前动画有bug
	_update (ctx) {
		if (this.updateList.length > 0 && this.getRoot().looping) {
			this.updateList.forEach(cb => {
				if (cb.fun && cb.name && cb.playing) {
					cb.fun();
				}
			})
		}
		if (this.isDrawLayer) {
			// 绘制单个图层
			let layer = this.getRoot().getLayers(this)[0]
			layer._clear()
			layer.layerDraw(ctx)
		} else {
			// 绘制单个图形
			this.shapeDraw(ctx)
		}

	}

	setCtxAttrs (ctx) {
		Object.keys(this.ctxAttrs).forEach(attr => {
			if (attr === 'color') {
				if (this.randomColor) {
					this.changeCtxStatus('color', utils.randomColor())
				}
			} else {
				ctx[attr] = this[attr];
			}
		})
		ctx[`${this.drawType}Style`] = this.color;
	}

	setLineWidth (width) {
		this.changeCtxStatus('lineWidth', width)
	}

	setColor (color) {
		if (this.randomColor) {
			return
		}
		this.changeCtxStatus('color', color)
	}

	stroke () {
		this.changeCtxStatus('drawType', 'stroke')
	}

	fill () {
		this.changeCtxStatus('drawType', 'fill')
	}

	changeCtxStatus (key, value) {
		this[key] = value;
		this.ctxAttrs[key] = value
	}

	/**
	 * @description   集合图形绘制  该方法会被子类覆盖
	 * @param {Ctx} ctx discribe
	 * @param {string} type change | refresh  change：会基于上一次绘制结果继续绘制， refresh：会重置画笔后重新绘制
	 * @return {void}
	 */
	shapeDraw (ctx, type = 'change') {
		this.setCtxAttrs(ctx)
		ctx.save()
		if (this.getRoot().autoClear && !this.isDrawLayer) {
			this.getRoot().clear(this)
		}
		this._draw(ctx, type)
		this.controlUpdate()
	}

	controlUpdate () {
		// let speed = Math.abs(1 / (this.renderList[this.action].speed || this.speed))
		// console.log(speed)

	}

	refreshClock () {
		this.clock.getDelta();
	}

	startClock () {
		this.clock.start(this.lastElapsed)
	}

	stopClock () {
		this.lastElapsed = this.clock.elapsedTime;
		this.clock.stop()
	}

	/**
	 * @description 开始单个图形的动画
	 * @param {function} callback 回调函数，用于外部定义动画
	 * @param {boolean} drawLayer 是否更新这个图层
	 * @return {void} 更新动画列表
	 */
	start (callback, drawLayer = true) {
		if (drawLayer === false) {
			this.isDrawLayer = false
		}
		let cbName = utils.setCbName(this);
		let result = this.updateList.filter(cb => cb.name === cbName)
		if (callback) {
			let cb = {
				fun: callback,
				name: utils.setCbName(this),
				playing: true,
			}

			if (result.length === 0) {
				this.updateList.push(cb)
			} else {
				this.updateList.forEach(cbItem => {
					if (cbItem.name === cbName) {
						cbItem.playing = true
					}
				})
			}
		} else if (result.length > 0) {
			this.updateList.forEach(cbItem => {
				if (cbItem.name === cbName) {
					cbItem.playing = true
				}
			})
		}
	}

	/**
	 * @description 停止单个图形动画
	 * @return {void}	更新动画列表
	 */
	stop () {
		this.updateList.forEach(cb => {
			if (cb.name === utils.setCbName(this)) {
				cb.playing = false
			}
		})
	}

	// _setCallbackName () {
	// 	return `${this.nodeType}_${this._id}`
	// }

	/**
	 * @description 开启随机颜色
	 * @param {boolean} this.randomColor 开启随机颜色
	 * @return {void}
	 */
	openRandomColor () {
		this.randomColor = true
	}

	drawChange () {
		let ctx = this.getCurrentLayerCtx()
		this.shapeDraw(ctx)
	}

	drawRefresh () {
		let ctx = this.getCurrentLayerCtx()
		this.shapeDraw(ctx, 'refresh')
	}

	// 获取当前画布的画笔
	getCurrentLayerCtx () {
		let currentLayer = this.getRoot().getLayers().filter(layer => layer._id === this._parentId)[0]
		return currentLayer._getCtx()
	}


}

export default Shape

