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
			this.insertLayers()
			this.flatNodes()
			// 等待同步任务执行完成后，再执行更新操作
			setTimeout(() => {
				this.updateAllLayers(this.getRoot().hasNodeLayers())
			})
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
	insertLayers () {
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
	// _deepUpdate (node) {
	// 	if (node.children && node.children.length > 0) {
	// 		node.children.forEach(child => {
	// 			this._deepUpdate(child)
	// 		})
	// 	} else {
	// 		node.nodeDraw()
	// 		console.log('add')
	// 	}
	// }

	updateAllLayers (layers) {
		this.isAllReady().then(res => {
			Root.ob.publish('allReady', res)
			utils.info('加载完成')
			layers.forEach(layer => {
				layer.layerUpdate()
			})
		}).catch(err => {
			utils.error('加载异常', err)
			Root.ob.publish('error', err)
		})
	}

	isAllReady () {
		return new Promise(async (resolve, reject) => {
			let nodes = this.getRoot().nodes.filter(node => node.nodeType === 'shape' && node.typeList.includes('img'));
			let len = nodes.length;
			let list = [];
			for (let node of nodes) {
				let readyNode = await node?.ready?.();
				list.push(readyNode);
			}
			if (list.length === len) {
				resolve(list)
			} else {
				reject(list)
			}
		})
	}
}

export default Container
