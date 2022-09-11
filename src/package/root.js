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
			console.log('open>>>>>>>>>>>>>>>>>constructor>')
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
			this.update()
		}
		requestAnimationFrame(this.animate)
	}

	/**
	 * @description	更新所有的时钟
	 * @return {void}
	 */
	// todo 目前动画有bug
	syncClock () {
		Root.clock.getDelta()
		this.nodes.filter(node => node.nodeType === 'shape' && node.updateList.length > 0).forEach(ins => {
			ins.updateList.forEach(cb => {
				// if (cb.playing) {
				// 	Root.clock.start()
				// } else if (!cb.playing) {
				// 	Root.clock.stop()
				// }
			})
		})
	}

	/**
	 * @description  清除画布，全部清除或单个清除
	 * @param {Node} node 节点信息  如果传入了某个节点，则清除当前节点的画布
	 * @return {void}
	 */
	clear (node) {
		let layers = this.getLayers(node);
		if (node && !this.clearAll && layers.length > 0) {
			layers.forEach(layer => {
				layer._clear()
			})
		} else if (this.clearAll && layers.length > 0) {
			layers.forEach(layer => {
				layer._clear()
			})
		}
	}

	update () {
		if (this.getLayers().length > 0) {
			// this.updateLayer()
			this.getLayers().forEach(layer => layer._clear())
			this.updateShape()
			// this.getLayers().forEach(layer => {
			// 	// 图层存在，且图层存在自元素，并且自元素未shape, 图形元素
			// 	if (layer.children && layer.children.length > 0) {
			// 		let ctx = layer._getCtx()
			// 		layer.children.forEach(shape => {
			// 			// 如果开启动画，但没有对应的回调方法，则不更新
			// 			if (shape.updateList.length > 0 && this.getRoot().looping) {
			// 				shape._update(ctx)
			// 			}
			// 		})
			// 	}
			// })
		}
	}

	updateShape() {
		this.nodes.forEach(node => {
			if(node.nodeType === 'shape') {
				// this.getLayers().forEach(layer => layer._clear())
				node.shapeUpdate()
			}
		})
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
			// todo 可能有点问题
			return this.nodes.filter(n => n.nodeType === 'layer' && [node._parentId].includes(n._id))
		} else {
			return this.nodes.filter(n => n.nodeType === 'layer')
		}
	}
}

export default Root
