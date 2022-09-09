export function error (str, ...rest) {
	console.log('%c error: %s', 'color: red', str, rest)
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

export function createEl (tag, options) {
	let div = document.createElement(tag)
	if (options) {
		let {cvWidth, cvHeight, width, height} = options;
		div.style.position = options.position || 'absolute';
		div.style.top = options.top || '0';
		div.style.left = options.left || '0';
		div.style.border = '1px solid rgba(0,0,0,.05)';
		div.width = cvWidth;
		div.height = cvHeight
		if (width && height) {
			div.style.width = `${width}px`;
			div.style.height = `${height}px`;
		}
	}
	return div;
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
 * @param {number} scale 整体精灵图缩放大小
 * @return {Promise}
 */
export function generateSpritePicture (urls, scale = 10) {
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
			let colIndex = 0;
			for (const u of url) {
				const img = await loadImage(u)
				pic[url.name] = {}
				pic[url.name]['img'] = img
				pic[url.name]['len'] = colIndex
				result[url.name].push({
					image: img,
					x: colIndex * img.width,
					y: rowIndex * img.height,
					width: img.width,
					height: img.height,
				})
				colIndex++
			}
			rowIndex++
		}
		Object.keys(pic).forEach((key, index) => {
			maxWidth = Math.max(maxWidth, pic[key].img.width * pic[key].len);
			maxHeight = Math.max(maxHeight, pic[key].img.height * (index + 1))
		})

		let cv = createEl('canvas', {
			cvWidth: maxWidth,
			cvHeight: maxHeight,
			top: 400,
			position: 'relative',
		})
		cv.style.border = '2px solid red'
		let scaleCv = createEl('canvas', {
			cvWidth: maxWidth / scale,
			cvHeight: maxHeight / scale,
			top: 400,
			position: 'relative',
		})
		let ctx = cv.getContext('2d');
		let scaleCtx = scaleCv.getContext('2d');
		Object.keys(result).forEach(key => {
			result[key].forEach(item => {
				let {image, x, y, width, height} = item
				ctx.drawImage(image, x, y, width, height)
			})
		})
		scaleCtx.drawImage(cv, 0, 0, maxWidth, maxHeight, 0, 0, maxWidth / scale, maxHeight / scale);
		scaleCv.toBlob(async blob => {
			let url = URL.createObjectURL(blob);
			loadImage(url).then(img => {
				let list = {}
				Object.keys(result).map(item => {
					list[item] = [];
					result[item].forEach(picItem => {
						list[item].push({
							image: picItem.image,
							x: picItem.x / scale,
							y: picItem.y / scale,
							width: picItem.width / scale,
							height: picItem.width / scale,
						})
					})
				})
				let spriteResult = {
					img,
					list,
				}
				resolve(spriteResult)
			}).catch(err => {
				reject(err)
			})
		}, 'image/png', 1);
	})
}

export default {
	error,
	warn,
	info,
	flatNodes,
	createEl,
	randomColor,
	setCbName,
	loadImage,
	generateSpritePicture,
}
