import Container from './container'
import Canvas from './canvas'
import Ctx from './ctx'
import globalConfig from './config.js'
import Root from './root'
import Node from './node'

export class Layer extends Container {
	typeList = []
	cvInstance = null
	canvas = null
	_layerIndex = null
	ctx = null
	clearStyle = 'rgba(255,255,255,0.1)'
	clearSpeed = 1

	constructor (config = globalConfig) {
		super(config)
		this.setType('layer')
		this.cvInstance = new Canvas(config)
		this.canvas = this.cvInstance.sceneCanvas;
		this.ctx = new Ctx(this.canvas).ctx
		this.initIndex()
	}

	initIndex () {
		Node.layer_index++;
		console.log('this', this)
		this._layerIndex = Node.layer_index
		this.cvInstance.setIndex(this._layerIndex)
	}

	updateIndex (layer, index) {
		layer.cvInstance.setIndex(this._layerIndex)
	}

	moveUp () {
		this.setIndex('up')
	}

	moveDown () {
		this.setIndex('down')
	}

	moveToTop () {
		this.setIndex('top')
	}

	moveToBottom () {
		this.setIndex('bottom')
	}

	setIndex (type) {
		let layers = this.getRoot().getLayers()
		let indexList = layers.map(layer => layer._layerIndex).sort((a, b) => a - b)
		console.log(indexList)
		if (type && type === 'top') {
			let top = indexList.reduce((pre, cur) => Math.max(pre, cur))
			let current = this._layerIndex;
			layers.forEach(layer => {
				if (layer._layerIndex === top) {
					layer._layerIndex = current
					this.updateIndex(layer, layer._layerIndex)
				}
			})
			this._layerIndex = top;
			this.updateIndex(this, this._layerIndex)
		} else if (type && type === 'bottom') {
			let bottom = indexList.reduce((pre, cur) => Math.min(pre, cur))
			let current = this._layerIndex;
			layers.forEach(layer => {
				if (layer._layerIndex === bottom) {
					layer._layerIndex = current
					this.updateIndex(layer, layer._layerIndex)
				}
			})
			this._layerIndex = bottom;
			this.updateIndex(this, this._layerIndex)
		} else if (type && type === 'down') {
			let current = this._layerIndex;
			let i = indexList.findIndex(index => index === current)
			if (i > 0) {
				let down = indexList[i - 1]
				layers.forEach(layer => {
					if (layer._layerIndex === down) {
						layer._layerIndex = current
						this.updateIndex(layer, layer._layerIndex)
					}
				})
				this._layerIndex = down
				this.updateIndex(this, this._layerIndex)
			}
		} else if (type && type === 'up') {
			let current = this._layerIndex;
			let i = indexList.findIndex(index => index === current)
			let max = indexList.reduce((pre, cur) => Math.max(pre, cur))
			if (current < max) {
				let up = indexList[i + 1]
				layers.forEach(layer => {
					if (layer._layerIndex === up) {
						layer._layerIndex = current
						this.updateIndex(layer, layer._layerIndex)
					}
				})
				this._layerIndex = up
				this.updateIndex(this, this._layerIndex)
			}
		}

	}

	_getCtx () {
		return this.ctx;
	}

	removeChild (ins) {
		this.children = this.children.filter(child => child._id !== ins._id)
	}

	_clear (options = {x: 0, y: 0, width: this.cvWidth, height: this.cvHeight}) {
		if (Math.floor(Root.clock.elapsedTime * 10) % this.clearSpeed === 0) {
			let {x, y, width, height} = options
			this.ctx.clearRect(x, y, width, height)
		}
	}

	changeClear (style) {
		this.clearStyle = style
	}

	changeClearSpeed (speed) {
		this.clearSpeed = speed
	}

	resetClear () {
		this.clearStyle = 'rgba(255,255,255,1)'
		this.clearSpeed = 1
	}

	/**
	 * @description 	更新画布的动画
	 * @param {Ctx} ctx 画笔
	 * @return {void}
	 */
	layerUpdate () {
		this._clear()
		this.children.forEach(child => {
			if (this.getRoot().looping) {
				child.update()
			}
			child.draw()
		})
	}
}

export default Layer
