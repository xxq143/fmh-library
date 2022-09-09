import Node from './node'
import Root from './root'
import globalConfig from './config.js'
import utils from './utils'

export class Container extends Node {
	children = []

	constructor (config = globalConfig) {
		super(config)
	}

	/**
	 * @description 添加节点
	 * @param {Node} node 节点
	 * @return {void}
	 */
	add (node) {
		let nodes = [...arguments]
		if (this.validLayersCount(nodes)) {
			nodes.forEach(n => {
				n.setParentId(this._id);
				this.children.push(n)
			})
			utils.info(`${nodes.length > 1 ? 'nodes' : 'node'} was added`, nodes)
			this.insetLayers()
			this.flatNodes()
			this._deepUpdate(this.getRoot())
		}
	}

	/**
	 * @description 校验图层数量，超过10个给出提示
	 * @param {Array<Node>} nodes 新增的节点
	 * @param {number} maxLayers 图层数量
	 * @return {boolean} true | false
	 */
	validLayersCount (nodes) {
		let newLayers = nodes.filter(node => node.nodeType === 'layer')
		let oldLayers = this.getRoot().getLayers()
		if (newLayers.length + oldLayers.length > this.maxLayers) {
			utils.warn(`图层超出最大数量${this.maxLayers}的限制范围,超出图层和节点已被过滤`, newLayers)
			return false
		} else {
			return true
		}
	}

	/**
	 * @description  将图层插入到真实dom中
	 * @return {void}
	 */
	insetLayers () {
		let layers = this.children.filter(child => child.nodeType.includes('layer'));
		layers.forEach(layer => {
			this.insertLayerToRootContainer(layer.canvas);
		})
	}

	/**
	 * @description  展开所有节点，并保存在跟节点上
	 * @param {type} key discribe
	 * @param {}
	 * @return {Root} Root.instance.nodes;
	 */
	flatNodes () {
		this.getRoot().nodes = utils.flatNodes([this.getRoot()])
	}

	/**
	 * @description 更新图层
	 * @param {type} key discribe
	 * @param {}
	 * @return {}
	 */
	_deepUpdate (node) {
		if (node.children && node.children.length > 0) {
			node.children.forEach(child => {
				this._deepUpdate(child)
			})
		} else {
			node.nodeDraw()
		}
	}
}

export default Container
