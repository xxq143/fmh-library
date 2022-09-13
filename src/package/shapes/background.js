import Img from './img'
import globalConfig from '../config';
import Root from '../root';
import utils from '../utils';

export class Background extends Img {
	imgList = []
	loadList = []
	x2 = 0
	defaultSpeed = 0

	constructor (imgList = [], speed = 1, config = globalConfig, options = {}) {
		super(config, options)
		this.addType('background')
		this.imgList = imgList
		this.speed = speed;
		this.defaultSpeed = speed;
		this.createSpritePic(imgList).then(res => {
			console.log(res);
		})
	}

	/**
	 * @description 生成精灵图
	 * @param {array} list {type: []}
	 * @param {}
	 * @return {}
	 */
	async createSpritePic (list) {
		let index = 0
		for (let url of list) {
			let img = await utils.loadImage(url);
			console.log(this.config.cvHeight)
			let {image, dWidth, dHeight} = utils.calculateImgSize(img, this.config.cvHeight, true)
			this.x2 = dWidth

			this.loadList.push({
				image,
				x: dWidth * index,
				y: dHeight * index,
				width: dWidth,
				height: dHeight,
			})
			index++
		}
		if (list.length === this.loadList.length) {
			Root.ob.publish('ready', this)
		}
	}

	ready () {
		return new Promise((resolve, reject) => {
			Root.ob.on('ready', () => {
				resolve(this)
			})
		})
	}

	changeSpeed (speed) {
		this.speed = speed
	}

	resetSpeed () {
		this.speed = this.defaultSpeed
	}

	update () {
		let {width} = this.loadList[0]
		if (this.x < -width) {
			this.x = width + this.x2 - this.speed
		}
		if (this.x2 < -width) {
			this.x2 = width + this.x - this.speed
		}
		this.x = Math.floor(this.x - this.speed)
		this.x2 = Math.floor(this.x2 - this.speed)
	}

	draw () {
		let ctx = this.getCtx()
		let {image, width, height} = this.loadList[0]
		ctx.drawImage(image, this.x, 0, width, height)
		ctx.drawImage(image, this.x2, 0, width, height)

	}
}

export default Background
