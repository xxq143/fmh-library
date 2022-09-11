export const globalConfig = {
	_id: null,	// 唯一自增id
	_parentId: null,	// 父级节点
	domEl: null,	// dom容器
	maxLayers: 4,	// 最多4个图层
	isDrawLayer: true,	// 绘制整个图层否则绘制单个图形
	cvWidth: 500,
	cvHeight: 309,
	x: 0,
	y: 0,
	width: 50,
	height: 50,
	image: null,	// 图片	drawImage
	nodeType: '',	// 节点类型
	typeList: [],	// 类型列表，单个属性包含多个类型
}
export default globalConfig
