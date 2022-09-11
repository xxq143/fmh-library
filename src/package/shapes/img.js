import {Shape} from '../shape';
import globalConfig from '../config';

export class Img extends Shape {
	typeList = []
	selfAttrs = {
		dx: 0,
		dy: 0,
		dWidth: globalConfig.cvWidth,
		dHeight: globalConfig.cvHeight,
	}
	useAttrs = false // 默认不使用后四位参数
	constructor (config = globalConfig, options) {
		super(config)
		this.setType('shape')
		this.addType('img', 'img')
		if (options) {
			// todo 后期修改名称
			this.useAttrs = true;
			Object.keys(this.selfAttrs).forEach(key => {
				this.selfAttrs[key] = options?.[key]
				this[key] = options?.[key]
			})
		}
	}

	/**
	 * @description   覆盖父类方法
	 * @param {Ctx} ctx discribe
	 * @return {void}
	 */
	_draw () {
		let ctx = this.getCtx()
		if (this.useAttrs) {
			let {image, x, y, width, height, dx, dy, dWidth, dHeight} = this;
			ctx.drawImage(image, x, y, width, height, dx, dy, dWidth, dHeight)
		} else {
			let {image, x, y, width, height} = this;
			ctx.drawImage(image, x, y, width, height)
		}
	}

	/**
	* @description 修改属性
	* @param {String} key 实例属性名称
	* @param {number|string} val 属性值
	* @return {void}
	*/
	changeAttr(key, val) {
		this[key] = val
		this.drawChange()
	}
}

export default Img
