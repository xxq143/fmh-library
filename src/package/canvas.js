import globalConfig from './config'
import utils from './utils'
export class Canvas {
	sceneCanvas = null
	constructor(config = globalConfig) {
		this.sceneCanvas = utils.createEl('layer')
		this.sceneCanvas.style.position = 'absolute';
		this.sceneCanvas.style.top = '0';
		this.sceneCanvas.style.left = '0';
		let {cvWidth, cvHeight} = config;
		this.sceneCanvas.width = cvWidth
		this.sceneCanvas.height = cvHeight
	}
}

export default Canvas
