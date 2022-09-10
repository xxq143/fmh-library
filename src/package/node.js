import globalConfig from './config.js'
import utils from './utils';
import Root from './root'
import Clock from './clock';

/**
 * @description	节点
 * @param {object} config 节点配置参数
 * @return {_node} Node
 */
export class Node {
	static node_id = 0
	config = {}
	static domEl = null

	constructor (config = globalConfig) {
		this.setAttr(config)
		this.initDom(config)
		// 创建时钟
		this.clock = new Clock(false)
		this.setParentId = this.setParentId.bind(this)
	}

	/**
	 * @description 合并属性并覆盖全局属性,修改this.config
	 * @method autoIncrementId  修改static:  Node.node_id 唯一自增
	 * @param {object} attrs 需要覆盖的属性
	 * @param mergeCfg 属性合并
	 * @return {void}
	 */

	setAttr (attrs) {
		let mergeCfg = Object.assign({}, globalConfig, attrs)
		this.config = mergeCfg
		Object.keys(mergeCfg).forEach(attr => {
			this[attr] = mergeCfg[attr]
		})
		this.autoIncrementId()
	}

	/**
	 * @description  globalConfig._id 唯一自增
	 * @return {void}
	 */
	autoIncrementId () {
		Node.node_id++;
		this._id = Node.node_id;
	}

	initDom (config) {
		if (Node.domEl) {
			return
		}
		let {domEl} = config
		if (domEl) {
			Node.domEl = domEl
		} else {
			Node.domEl = utils.createEl('root', globalConfig);
		}
		document.body.appendChild(Node.domEl)
	}

	setType (type) {
		this.nodeType = type
		this.addType(type)
	}

	addType (type, ...types) {
		this.typeList.push(type)
		types.forEach(item => {
			this.typeList.push(item)
		})
	}

	setParentId (id = null) {
		this._parentId = id;
	}

	nodeDraw () {
		if (this.nodeType === 'shape') {
			let ctx = this.getCurrentCtx(this)
			if (this.isDrawLayer) {
				this.getRoot().getLayers(this)[0].layerDraw(ctx)
			} else {
				// 是否开启动画，都会进行渲染操作
				this.shapeDraw(ctx)
			}
		}
	}

	getRoot () {
		return Root.instance;
	}

	getCurrentCtx () {
		return this.getRoot().nodes.filter(n => n._id === this._parentId)[0]._getCtx()
	}

	// 获取跟节点容器
	getRootContainer () {
		return Node.domEl
	}

	insertLayerToRootContainer (layer) {
		this.getRootContainer().appendChild(layer)
	}
}

export default Node
