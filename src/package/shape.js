import Node from './node'
import globalConfig from './config.js'
import utils from './utils'
import Root from './root'

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
	ctxAttrs = {
		lineWidth: 1,
		drawType: 'stroke',
		color: 'black',
	}
	lastElapsed = 0	// 记录暂停时记录的时间
	vx = 0
	vy = 0

	constructor (config = globalConfig) {
		super(config);
		this.setType('shape')
		Object.keys(this.ctxAttrs).forEach(attr => {
			this[attr] = this.ctxAttrs[attr]
		})
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
	//
	// update () {
	// 	console.log(1)
	// }
	//
	// draw () {
	// 	console.log(2)
	// }

	/**
	 * @description 开始单个图形的动画
	 * @param {function} callback 回调函数，用于外部定义动画
	 * @param {boolean} drawLayer 是否更新这个图层
	 * @return {void} 更新动画列表
	 */
	start (callback, drawLayer = true) {
		// if (drawLayer === false) {
		// 	this.isDrawLayer = false
		// }
		// let cbName = utils.setCbName(this);
		// let result = this.updateList.filter(cb => cb.name === cbName)
		// if (callback) {
		// 	let cb = {
		// 		fun: callback,
		// 		name: utils.setCbName(this),
		// 		playing: true,
		// 	}
		//
		// 	if (result.length === 0) {
		// 		this.updateList.push(cb)
		// 	} else {
		// 		this.updateList.forEach(cbItem => {
		// 			if (cbItem.name === cbName) {
		// 				cbItem.playing = true
		// 			}
		// 		})
		// 	}
		// } else if (result.length > 0) {
		// 	this.updateList.forEach(cbItem => {
		// 		if (cbItem.name === cbName) {
		// 			cbItem.playing = true
		// 		}
		// 	})
		// }
	}

	/**
	 * @description 停止单个图形动画
	 * @return {void}	更新动画列表
	 */
	stop () {
		// this.updateList.forEach(cb => {
		// 	if (cb.name === utils.setCbName(this)) {
		// 		cb.playing = false
		// 	}
		// })
	}

	/**
	 * @description 开启随机颜色
	 * @param {boolean} this.randomColor 开启随机颜色
	 * @return {void}
	 */
	openRandomColor () {
		this.randomColor = true
	}

	// 获取当前画布的画笔
	getCurrentLayerCtx () {
		let currentLayer = this.getRoot().getLayers(this)[0]
		return currentLayer._getCtx()
	}

	getLayer () {
		return this.getRoot().getLayers(this)[0]
	}

	getCvSize () {
		return {
			width: this.getRoot().config.cvWidth,
			height: this.getRoot().config.cvHeight,
		}
	}

}

export default Shape

