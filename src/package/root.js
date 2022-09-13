import Container from './container'
import Clock from './clock'
import globalConfig from './config.js'
import utils from './utils';
import Observer from './observer'

/**
 * @description  跟节点为单例模式
 * @param {Root} instance 单例
 * @return {Root} instance
 */
export class Root extends Container {
	static instance = null
	static clock = null
	static ob = null
	nodes = []	// 所有节点
	autoClear = false	// 是否自动清除画布
	autoRender = true	// 是否自动绘制
	clearAll = false	// 全部清除
	looping = false	 // 动画执行中
	autoLooping = false //自动执行动画
	constructor (config = globalConfig) {
		super(config);
		this.getLayers = this.getLayers.bind(this)
		this.setType('root')
		Root.clock = new Clock()
		Root.ob = new Observer();

		if (new.target !== Root) {
			return
		}
		if (!Root.instance) {
			Root.instance = this;
		}
		this.animate = this.animate.bind(this)
		if (this.autoLooping) {
			Root.clock.start();
			this.looping = true;
			this.autoClear = true;
			this.animate();
		}
		return Root.instance
	}

	animate () {
		// todo 开启时钟
		this.syncClock()
		if (!this.looping) {
			return
		}
		if (this.autoRender) {
			this.rootUpdate()
		}
		requestAnimationFrame(this.animate)
	}

	rootUpdate () {
		let layers = this.hasNodeLayers();
		if (layers.length > 0) {
			layers.forEach(layer => {
				layer.layerUpdate()
			})
		}
	}

	stopClear () {
		this.clearAll = false;
	}

	stopLoop () {
		this.looping = false;
	}

	/**
	 * @description 开启动画，并修改相关参数
	 * @param {boolean} looping  是否执行动画中，控制动画是否执行
	 * @param {boolean} autoRender	更行渲染内容
	 * @param {boolean} autoClear	清空画布
	 * @param {boolean} clearAll		清空所有画布
	 * @return {}
	 */
	openAnimate () {
		console.log('open??????????????openAnimate')
		Root.clock.start();
		this.looping = true;
		this.autoRender = true;
		this.autoClear = true;
		this.clearAll = true;
		this.animate()
	}

	/**
	 * @description	返回图层，有节点参数则返回该节点对应的图层，否则返回全部图层
	 * @param {Node} node 单个节点
	 * @return {Array<Layer> | string} layers | layer
	 */
	getLayers (node) {
		if (node) {
			return this.nodes.filter(n => n.nodeType === 'layer' && node.nodeType === 'shape' && [node._parentId].includes(n._id))
		} else {
			return this.nodes.filter(n => n.nodeType === 'layer')
		}
	}

	hasNodeLayers () {
		return this.nodes.filter(n => n.nodeType === 'layer' && n.children.length > 0)
	}
}

export default Root
