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
	lastKey = ''	// 最后一次触发的键位
	lastType = ''	// 最后一次触发的事件类型
	codeList = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]	// 技能键列表
	directionKeyList = []	// 方向键位列表
	otherKeyList = []	// 技能键位列表
	otherKeyCode = []	// 最后触发的技能键
	directive = ''	// 方向组件键
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
	directionKeyMap = {
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
			this.lastKey = this.directionKeyMap[`_${e.keyCode}`]
			this.lastType = e.type
			if (e.type === 'keydown') {
				if (this.directionKeyList.length < 2) {
					this.directionKeyList.push(this.directionKeyMap[`_${e.keyCode}`])
				} else {
					this.directionKeyList.splice(this.directionKeyList.length - 1, 1, this.directionKeyMap[`_${e.keyCode}`])
				}
				if (this.otherKeyList.length === 0 && this.codeList.includes(e.keyCode)) {
					this.otherKeyCode = []
					this.otherKeyCode.push(e.keyCode)
				}
			} else if (e.type === 'keyup') {
				this.directionKeyList = this.directionKeyList.filter(key => key !== this.directionKeyMap[`_${e.keyCode}`])
				if (this.otherKeyCode[0] === e.keyCode) {
					this.otherKeyCode = []
				}
			}
			this.setPosition()
		}
	}

	setPosition () {
		let list = this.directionKeyList;
		if (list.length === 0) {
			this.directive = ''
		} else if (list.length === 1) {
			this.directive = list.join('')
		} else if (list.length === 2) {
			this.directive = list.join('')
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
