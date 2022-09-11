export class Observer{
    static instance = null
    listeners = []
    constructor() {
        if (new.target !== Observer) {
			return
		}
		if (!Observer.instance) {
			Observer.instance = this;
		}
		return Observer.instance
    }
    on(key, fun) {
        this.listeners[key] = []
        this.listeners[key].push(fun)
    }
    off(key, fun) {
        let listenerList = this.listeners[key]
		if (!listenerList) {
			return false
		}
		if (!fun) {
			this.listeners[key] = [];
		} else {
			this.listeners[key].forEach((listen, index) => {
				if (listen === fun) {
					this.listeners.splice(index, 1)
				}
			})
		}
    }

    publish (key, ...arg) {
		let list = this.listeners[key] || []
		for (let fun of list) {
			fun.call(this, ...arg)
		}
	}
}

export default Observer