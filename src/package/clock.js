/**
 * @description 时钟，用于记录和控制，时间和时间间隔
 * @param {boolean} autoStart 自动开始
 * @param {number}	startTime	开始时间
 * @param {number}	oldTime		过去的时间
 * @param {number}	elapsedTime	经过的时间
 * @param {boolean}	running		运行中
 * @return {Clock}
 */
export class Clock {
	autoStart = true
	startTime = 0
	oldTime = 0
	elapsedTime = 0
	running = false

	constructor (autoStart) {
		this.autoStart = autoStart
	}

	start (elapsedTime) {
		this.startTime = now()
		this.oldTime = this.startTime
		this.elapsedTime = elapsedTime || 0
		this.running = true
	}

	stop () {
		this.getElapsedTime()
		this.running = false
		this.autoStart = false
	}

	getElapsedTime () {
		this.getDelta()
		return this.elapsedTime;
	}

	getDelta () {
		let diff = 0;
		if (this.autoStart && !this.running) {
			this.start();
			return 0
		}
		if (this.running) {
			let newTime = now();
			diff = (newTime - this.oldTime) / 1000
			this.oldTime = newTime
			this.elapsedTime += diff
		}
		console.log(diff)
		return diff
	}
}

function now () {
	return (typeof performance === 'undefined' ? Date : performance).now();
}

export default Clock
