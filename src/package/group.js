import Container from './container'
import globalConfig from './config.js'
export class Group extends Container{
	typeList = []
	constructor(config = globalConfig) {
		super(config)
		this.setType('group')
	}
}
export default Group
