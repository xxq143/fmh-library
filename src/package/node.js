import globalConfig from './config.js'
import utils from './utils';
import Root from './root'

/**
 * @description	节点
 * @param {object} config 节点配置参数
 * @return {_node} Node
 */
export class Node {
	static node_id = 0
	static layer_index = 0
	config = {}
	static domEl = null

	constructor (config = globalConfig) {
		this.setAttr(config)
		this.initDom(config)
		this.setParentId = this.setParentId.bind(this)
		this.getBg = this.getBg.bind(this)
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
		let {domEl, cvWidth, cvHeight} = config
		if (domEl) {
			domEl.style.width = `${cvWidth || globalConfig.cvWidth}px`
			domEl.style.height = `${cvHeight || globalConfig.cvHeight}px`
			domEl.style.position = 'relative'
			domEl.style.border = '2px dashed lime'
			Node.domEl = domEl
		} else {
			Node.domEl = utils.createEl('root', globalConfig);
			document.body.appendChild(Node.domEl)
		}
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

	getCtx () {
		return this.getRoot().getLayers(this)[0]._getCtx()
	}

	getBg () {
		return this.getRoot().nodes.filter(node => node.typeList.includes('background'))[0]
	}
}

export default Node
