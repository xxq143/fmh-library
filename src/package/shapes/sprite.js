import Img from './img'
import globalConfig from '../config';
import utils from '../utils'
import Input from '../input'
import Node from '../node'

export class Sprite extends Img {
	spritePic = null

	/**
	 * @description 精灵图动画正渲染
	 * @param {Input} input
	 * @param {globalConfig} config
	 * @return {}
	 */
	constructor (input, list = [], config = globalConfig) {
		super(config)
		this.input = input;
		this.input.changeDomEl(Node.domEl)
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
			this.action = Object.keys(res.list)[2]
			utils.success('加载完成', res)
		}).catch(err => {
			console.log(err)
			utils.error('image load error', err);
		})
	}

	/**
	 * @description 处理内部精灵图的绘制
	 * @param {Ctx} ctx discribe
	 * @return {void}
	 */
	_draw (ctx) {
		// 如果精灵图已存在
		if (this.spritePic) {
			let speed = Math.abs(1 / (this.renderList[this.action].speed || this.speed))
			let position = Math.floor((this.clock.elapsedTime / speed) % this.renderList[this.action].length)
			let {image, x, y, width, height, dx, dy, dWidth, dHeight} = this.renderList[this.action][position];
			// this.x = Math.sin(this.clock.elapsedTime) * 100 + 100
			// this.y = Math.cos(this.clock.elapsedTime) * 10 + 100
			this.x = this.input.position.x
			this.y = this.input.position.y
			ctx.drawImage(image, x, y, width, height, this.x, this.y, dWidth, dHeight)
		}
	}

	/**
	 * @description 改变动画
	 * @param {string} action 当前动画序列帧
	 * @return {void}
	 */
	changeAction (action) {
		this.action = action
	}

	/**
	 * @description 重置动画速度
	 * @param {string} name 对应的动作  all: 重置所有
	 * @param {number} speed 动画速度
	 * @return {void}
	 */
	changeSpeed (name, speed) {
		if (name === 'all') {
			Object.keys(this.renderList).forEach(key => {
				this.renderList[key].speed = speed
			})
		} else {
			this.renderList[name].speed = speed
		}
	}

	/**
	 * @description  重置所有动画的速度
	 * @param {number} speed
	 * @return {void}
	 */
	resetAllSpeed (speed = this.speed) {
		this.changeSpeed('all', speed)
	}
}

export default Sprite
