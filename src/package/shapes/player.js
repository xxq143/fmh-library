import Sprite from './sprite'
import globalConfig from '../config';
import utils from '../utils'
import Input from '../input'
import Node from '../node'
import Root from '../root'
import Circle from './circle'

export class Player extends Sprite {
	spritePic = null
	weight = 1
	attacking = false
	hasBullet = false
	timer = null

	/**
	 * @description 精灵图动画正渲染
	 * @param {Input} input
	 * @param {globalConfig} config
	 * @return {}
	 */
	constructor (list = [], input, config = globalConfig) {
		super(list, input, config)
		if (input) {
			this.input = input;
			this.input.changeDomEl(Node.domEl)
		}
		this.createSpritePic(list);
	}

	/**
	 * @description 生成精灵图
	 * @param {array} list {type: []}
	 * @param {}
	 * @return {}
	 */
	createSpritePic (list) {
		utils.generateSpritePicture(list).then(res => {
			// document.body.appendChild(res.img)
			this.renderList = res.list
			this.spritePic = res.img
			utils.success('加载完成', res)
			Root.ob.publish('ready', this)
			this.initStatus()
		}).catch(err => {
			console.log(err)
			utils.error('image load error', err);
		})
	}

	initStatus () {
		this.y = this.getCvSize().height - this.getItemImgSize().height
		this.action = 'walking'
	}

	resetYPosition () {
		this.y = this.getCvSize().height - this.getItemImgSize().height
	}

	/**
	 * @description 处理内部精灵图的绘制
	 * @param {Ctx} ctx discribe
	 * @return {void}
	 */
	_draw () {
		let ctx = this.getCtx()
		// 如果精灵图已存在
		if (this.spritePic) {
			let len = this.renderList[this.action].length
			let speed = Math.abs(1 / (this.renderList[this.action].speed || this.speed))
			let position = Math.floor((Root.clock.elapsedTime / speed) % len)
			let {image, x, y, width, height, dx, dy, dWidth, dHeight} = this.renderList[this.action][position];
			this.setDirection(position, len)
			ctx.drawImage(image, x, y, width, height, this.x, this.y, dWidth, dHeight)
		}
	}

	setDirection (position, len) {
		let ins = this;
		if (ins.input.otherKeyCode.length > 0) {
			if (ins.input.otherKeyCode[0] === 65 && !this.attacking) {
				ins.changeSpeed('attack', 100)
				ins.action = 'attack'
				if (!this.hasBullet) {
					this.createBullet(this)
					this.hasBullet = true
					this.timer = setTimeout(() => {
						this.hasBullet = false
						clearTimeout(this.timer)
						this.timer = null
					}, 100)
				}
				this.attacking = true
			} else if (ins.input.otherKeyCode.includes(32) && this.onGround()) {
				this.vy -= 20
				this.action = 'gothit'
			}
		}

		let directiveList = ['u', 'r', 'd', 'l', 'uu', 'rr', 'dd', 'll', 'ur', 'ru', 'ul', 'lu', 'dr', 'rd', 'dl', 'ld']

		// console.log(position, len, ins.action)
		if (position >= len && ['gothit'].includes(ins.action)) {
			this.action = 'walking'
		}

		if (['attack'].includes(ins.action) && position >= len - 2) {
			this.attacking = false
			this.action = 'walking'
		}

		if (!this.onGround() && ['attack', 'gothit', 'walking'].includes(ins.action)) {
			this.vy += this.weight;
		}

		if (this.vy > 0 && !this.onGround() && ins.input.directive.includes('d')) {
			this.weight = 10
		}
		this.y += this.vy

		if (this.onGround() && ['gothit', 'attack', 'walking'].includes(ins.action)) {
			this.vy = 0
			this.resetYPosition()
			if (ins.action === 'gothit') {
				this.action = 'walking'
				this.attacking = false;
				this.weight = 1
			}
		}
		// 行走
		if (['walking', 'attack', 'gothit'].includes(ins.action) && directiveList.includes(ins.input.directive)) {
			if (['u', 'uu'].includes(ins.input.directive)) {
				// ins.y -= speed
			} else if (['r', 'rr'].includes(ins.input.directive)) {
				ins.x += speed
				this.getBg().changeSpeed(this.getBg().defaultSpeed + 2)
			} else if (['d', 'dd'].includes(ins.input.directive)) {
				// ins.y += speed
			} else if (['l', 'll'].includes(ins.input.directive)) {
				ins.x -= speed
			} else if (['ur', 'ru'].includes(ins.input.directive)) {
				ins.x += speed
				// ins.y -= speed
			} else if (['ul', 'lu'].includes(ins.input.directive)) {
				ins.x -= speed
				// ins.y -= speed
			} else if (['dr', 'rd'].includes(ins.input.directive)) {
				ins.x += speed
				// ins.y += speed
			} else if (['dl', 'ld'].includes(ins.input.directive)) {
				ins.x -= speed
				// ins.y += speed
			}
		}

		if (!['r', 'rr', 'l', 'll'].includes(ins.input.directive)) {
			this.getBg().resetSpeed()
		}
		if (ins.input.directive && ins.action === 'walking') {
			ins.changeSpeed('walking', 100)
		} else if (!ins.input.directive && ins.action === 'walking') {
			ins.changeSpeed('walking', 10)
		}

		if (this.x >= this.getCvSize().width - this.getItemImgSize().width) {
			this.x = this.getCvSize().width - this.getItemImgSize().width
		}
		if (this.x <= 0) {
			this.x = 0
		}
	}

	onGround () {
		return this.y >= this.getCvSize().height - this.getItemImgSize().height
	}

	createBullet (ins) {
		let config = Object.assign({}, ins, {radius: 2})
		let bullet = new Circle(config)
		bullet.setColor(utils.randomColor())
		let layer = this.getLayer()
		layer.add(bullet);
		console.log(layer)
		bullet.start(() => {
			bullet.x += 6
			if (bullet.x >= this.getCvSize().width) {
				layer.removeChild(bullet)
			}
		})

	}
}

export default Player
