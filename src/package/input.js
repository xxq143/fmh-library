import Node from './node'
import globalConfig from './config';
import utils from './utils'

function setEvent (types, cb, isKeyboard) {
	types.forEach(type => {
		if (isKeyboard) {
			window.addEventListener(type, cb, true)
		} else {
			Input.el.addEventListener(type, cb, true)
		}
	})

}

function removeEvent (types, cb, isKeyboard) {
	types.forEach(type => {
		if (isKeyboard) {
			window.removeEventListener(type, cb, true)
		} else {
			Input.el.removeEventListener(type, cb, true)
		}
	})

}

export class Input {
	lastKey = ''
	lastType = ''
	static el = null
	types = ['click']
	mouseEvent = [
		'click',
		'dblclick',
		'mouseup',
		'mousedown',
		'mousemove',
	]
	keyBoardEvent = [
		'keydown',
		'keyup',
	]
	position = {
		x: 0,
		y: 0,
	}
	oldPosition = {
		x: 0,
		y: 0,
	}
	keyMap = {
		'_38': 'u',
		'_40': 'd',
		'_37': 'l',
		'_39': 'r',
	}

	/**
	 * @description
	 * @param {Array<string>} type 事件类型
	 * @param {domElement} el
	 * @return {Input}
	 */
	constructor (type, el = window) {
		Input.el = el
		this.registryEvent(type)
		this.inputEvent = this.inputEvent.bind(this)
		let mouseEvents = this.types.filter(type => this.mouseEvent.includes(type))
		let keyboardEvents = this.types.filter(type => this.keyBoardEvent.includes(type))
		setEvent(mouseEvents, this.inputEvent)
		setEvent(keyboardEvents, this.inputEvent, true)
	}

	/**
	 * @description
	 * @param {type} key discribe
	 * @param {}
	 * @return {}
	 */
	registryEvent (type) {
		if (!type) {
			return
			utils.warn('事件未注册')
		}
		if (type === 'all') {
			this.types = this.keyBoardEvent.concat(this.mouseEvent)
		} else {
			if (utils.isArray(type)) {
				this.types = type
			} else if (utils.isString(type)) {
				this.types = [type]
			}
		}
	}

	inputEvent (e) {
		if (this.types.some(type => this.mouseEvent.includes(type)) && ['dblclick'].includes(e.type)) {
			this.oldPosition = JSON.parse(JSON.stringify(this.position))
			this.position.x = e.offsetX;
			this.position.y = e.offsetY;
		}
		if (this.types.some(type => this.keyBoardEvent.includes(type)) && this.keyBoardEvent.includes(e.type)) {
			this.lastKey = this.keyMap[`_${e.keyCode}`]
			this.lastType = e.type
		}
	}

	changeDomEl (el) {
		if (this.types.some(type => this.mouseEvent.includes(type))) {
			let mouseEvents = this.types.filter(type => this.mouseEvent.includes(type))
			removeEvent(mouseEvents, this.inputEvent)
			Input.el = el;
			setEvent(mouseEvents, this.inputEvent)
		}
	}
}

export default Input
