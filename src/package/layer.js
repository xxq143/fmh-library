import Container from './container'
import Canvas from './canvas'
import Ctx from './ctx'
import globalConfig from './config.js'
import Root from './root'

export class Layer extends Container {
	typeList = []
	canvas = null
	layerIndex = 0
	ctx = null
	clearStyle = 'rgba(255,255,255,0.1)'
	clearSpeed = 1

	constructor (config = globalConfig) {
		super(config)
		this.setType('layer')
		this.canvas = new Canvas(config).sceneCanvas;
		this.ctx = new Ctx(this.canvas).ctx
		this._getCtx = this._getCtx.bind(this)
		this._clear = this._clear.bind(this)
		this.layerDraw = this.layerDraw.bind(this)
	}

	setLayerIndex (index) {
		this.layerIndex = index
	}

	_getCtx () {
		return this.ctx;
	}

	removeChild (ins) {
		this.children = this.children.filter(child => child._id !== ins._id)
	}

	_clear (options = {x: 0, y: 0, width: this.cvWidth, height: this.cvHeight}) {
		if(Math.floor(Root.clock.elapsedTime * 10) % this.clearSpeed === 0) {
			// console.log(this.clearSpeed)
			let {x, y, width, height} = options
			this.ctx.clearRect(x, y, width, height)
			// this.ctx.fillStyle = this.clearStyle
			// this.ctx.save()
			// this.ctx.fillRect(x, y, width, height)
		}
	}

	changeClear(style) {
		this.clearStyle = style
	}
	changeClearSpeed(speed) {
		this.clearSpeed = speed
	}

	resetClear(){
		this.clearStyle = 'rgba(255,255,255,1)'
		this.clearSpeed = 1
	}
	/**
	 * @description 	更新画布的动画
	 * @param {Ctx} ctx 画笔
	 * @return {void}
	 */
	layerDraw (ctx = this._getCtx()) {
		this.children.forEach(child => {
			child.shapeDraw(ctx)
		})
	}
}

export default Layer
