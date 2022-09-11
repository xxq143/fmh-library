export function error (str, ...rest) {
	console.log('%c error: %s', 'color: red', str, rest)
}

export function success (str, ...rest) {
	console.log('%c success: %s', 'color: lime', str, rest)
}

export function warn (str, ...rest) {
	console.log('%c warn: %s', 'color: orange', str, rest)
}

export function info (str, ...rest) {
	console.log('%c info: %s', 'color: skyblue', str, rest)
}

export function flatNodes (data) {
	let result = []

	function deep (list) {
		list.forEach(item => {
			if (item.children && item.children.length > 0) {
				deep(item.children)
			}
			result.push(item)
		})
	}

	deep(data)
	return result
}

export function createEl (tag, options = {cvWidth: 500, cvHeight: 309}) {
	let el = null;
	let {cvWidth, cvHeight} = options;
	if (tag === 'root') {
		el = document.createElement('div')
		el.id = 'fmh-root'
		el.style.position = 'relative';
		el.style.border = '2px double lime';
		el.style.width = `${cvWidth}px`;
		el.style.height = `${cvHeight}px`;
	} else if (tag === 'layer') {
		el = document.createElement('canvas')
		if (options) {
			el.style.position = 'absolute';
			el.style.top = '0';
			el.style.left = '0';
			el.style.width = `${cvWidth}px`;
			el.style.height = `${cvHeight}px`;
		}
	} else if (tag === 'canvas') {
		el = document.createElement(tag)
		el.width = cvWidth;
		el.height = cvHeight;
	} else {
		el = document.createElement(tag)
	}
	return el;
}

export function randomColor () {
	let r = Math.floor(Math.random() * 256);
	let g = Math.floor(Math.random() * 256);
	let b = Math.floor(Math.random() * 256);
	return `rgb(${r}, ${g}, ${b})`
}

/**
 * @description
 * @param {Node} ins 节点实例
 * @return {string}
 */
export function setCbName (ins) {
	return `${ins.nodeType}_${ins._id}`
}

/**
 * @description 	图片加载
 * @param {string} src 图片路径
 * @return {Promise}
 */
export function loadImage (src) {
	return new Promise((resolve, reject) => {
		let image = new Image();
		image.src = src
		image.onload = () => {
			resolve(image)
		}
		image.onerror = (err) => {
			reject(err)
		}
	})
}

/**
 * @description	生成精灵图
 * @param {Array<object>} urls 动画列表  [{name: [url: 'str']}]
 * @param {number} size 每张图片的目标大小
 * @param {number} speed 每组图片的渲染速度，后期可调整
 * @return {Promise}
 */
export function generateSpritePicture (urls, size = 50, speed = 10, needAspectRatio = false) {
	return new Promise(async (resolve, reject) => {
		if (!urls || urls.length === 0) {
			reject();
			return
		}
		let result = {}
		let maxWidth = 0
		let maxHeight = 0
		let rowIndex = 0;
		let pic = {}
		for (const url of urls) {
			result[url.name] = []
			result[url.name].speed = speed;
			let colIndex = 0;
			for (const u of url) {
				const img = await loadImage(u).catch(err => reject(err))
				pic[url.name] = {
					img,
					len: colIndex,
				}
				let {width, height, dWidth, dHeight} = calculateImgSize(img, size, needAspectRatio)
				let imgItem = {
					image: img,
					x: 0,
					y: 0,
					width,
					height,
					dx: colIndex * size,
					dy: rowIndex * size,
					dWidth,
					dHeight,
				}
				result[url.name].push(imgItem)
				colIndex++
			}
			rowIndex++
		}
		Object.keys(pic).forEach((key, index) => {
			maxWidth = Math.max(maxWidth, size * pic[key].len);
			maxHeight = Math.max(maxHeight, size * (index + 1))
		})

		let cv = createEl('canvas', {
			cvWidth: maxWidth,
			cvHeight: maxHeight,
		})
		let ctx = cv.getContext('2d');
		// document.body.appendChild(cv)
		Object.keys(result).forEach(key => {
			result[key].forEach(item => {
				let {image, x, y, width, height, dx, dy, dWidth, dHeight} = item
				ctx.drawImage(image, x, y, width, height, dx, dy, dWidth, dHeight)
			})
		})
		canvasToBlob(cv).then(url => {
			loadImage(url).then(img => {
				let spriteResult = {
					img,
					list: result,
				}
				resolve(spriteResult)
			}).catch(err => {
				reject(err)
			});
		}).catch(err => {
			reject(err)
		})
	})
}

/**
 * @description 更具图片的宽高比，计算出图片的目标大小
 * @param {Image} img 图片源
 * @param {number} size 最终期望的图片大小
 * @param {boolean} needAspectRatio 是否需要保持宽高比
 * @return {object} {x: number, y: number}
 */
export function calculateImgSize (img, size, needAspectRatio = false) {
	let imgHeightSize = size;      // 图片高度缩放后大小 目标大小
	let imgWidthSize; // 图片宽度缩放后大小 目标大小
	let imgNaturalWidth = img.naturalWidth;    // 图片的自然宽度
	let imgNaturalHeight = img.naturalHeight;   // 图片的自然高度
	let imgAspectRatio;     // 图片的宽高比
	if (needAspectRatio) {
		imgAspectRatio = imgNaturalHeight / imgNaturalWidth;
		imgWidthSize = imgHeightSize / imgAspectRatio;
	} else {
		imgWidthSize = size;
	}

	return {
		image: img,
		dWidth: imgWidthSize,
		dHeight: imgHeightSize,
		width: imgNaturalWidth,
		height: imgNaturalHeight,
	}
}

export function canvasToBlob (canvas) {
	return new Promise((resolve) => {
		canvas.toBlob(blob => {
			let url = URL.createObjectURL(blob);
			resolve(url)
		}, 'image/png', 1)
	})
}

/**
 * @description 校验字段类型
 * @param {any} data
 * @return {string}
 */
export function checkType (data) {
	if ([null, undefined].includes(data)) {
		throw new Error(`校验字段不存在${data}`)
	}
	let type = Object.prototype.toString.call(data).toLowerCase()
	return type.substring(8, type.length - 1)
}

export function isArray (array) {
	return checkType(array) === 'array'
}

export function isString (str) {
	return checkType(str) === 'string'
}

export function isNumber (num) {
	return checkType(num) === 'number'
}

export default {
	error,
	success,
	warn,
	info,
	flatNodes,
	createEl,
	randomColor,
	setCbName,
	loadImage,
	generateSpritePicture,
	calculateImgSize,

	checkType,
	isArray,
	isString,
	isNumber,
}
