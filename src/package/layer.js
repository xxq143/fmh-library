import Container from './container'
import Canvas from './canvas'
import Ctx from './ctx'
import globalConfig from './config.js'

export class Layer extends Container {
	typeList = []
	canvas = null
	layerIndex = 0
	ctx = null

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

	_clear (options = {x: 0, y: 0, width: this.cvWidth, height: this.cvHeight}) {
		let {x, y, width, height} = options
		this.ctx.clearRect(x, y, width, height)
	}

	/**
	 * @description 	更新画布的动画
	 * @param {Ctx} ctx 画笔
	 * @return {void}
	 */
	layerDraw (ctx) {
		this.children.forEach(child => {
			child.shapeDraw(ctx)
		})
	}
}

export default Layer
