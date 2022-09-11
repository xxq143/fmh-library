import Img from './img'
import globalConfig from '../config';
import utils from '../utils'
import Input from '../input'
import Node from '../node'
import Root from '../root'
import Observer from '../observer'

export class Sprite extends Img {
	spritePic = null
	/**
	 * @description 精灵图动画正渲染
	 * @param {Input} input
	 * @param {globalConfig} config
	 * @return {}
	 */
	constructor (list = [], input, config = globalConfig) {
		super(config)
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
			this.action = Object.keys(res.list)[0]
			utils.success('加载完成', res)
			Root.ob.publish('ready', this)
		}).catch(err => {
			console.log(err)
			utils.error('image load error', err);
		})
	}

	ready() {
		return new Promise((resolve, reject) => {
			Root.ob.on('ready', () => {
				resolve(this)
			})
		})
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
			let speed = Math.abs(1 / (this.renderList[this.action].speed || this.speed))
			let position = Math.floor((Root.clock.elapsedTime / speed) % this.renderList[this.action].length)
			let {image, x, y, width, height, dx, dy, dWidth, dHeight} = this.renderList[this.action][position];
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

	/**
	 * @description 获取画布的边界范围
	 * @param {type} key discribe
	 * @param {}
	 * @return {object}
	 */
	getSize () {
		let width = this.renderList[this.action][0].dWidth / 2
		let height = this.renderList[this.action][0].dHeight / 2
		return {
			minX: width,
			maxX: this.cvWidth - width,
			minY: height,
			maxY: this.cvHeight - height,
		}
	}
	getItemImgSize() {
        return {
            width: Object.values(this.renderList)[0][0].dWidth,
            height: Object.values(this.renderList)[0][0].dHeight
        }
    }
}

export default Sprite
