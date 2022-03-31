/**
 * Drag类
 */
class Drag {
  constructor(parent) {
    // 鼠标距容器左边距
    this.leftSpace = 0
    // 鼠标距容器上边距
    this.topSpace = 0
    this.isdown = false
    // Container对象
    this.parent = parent
    // 获取dom节点
    this.dom = parent.getDom()
    // 修改this指向
    this.down = this._down.bind(this)
    this.up = this._up.bind(this)
    this.move = this._move.bind(this)

    this.initDrag()
  }

  /**
   * @desc 添加拖拽模块
   */
  initDrag() {
    // 添加鼠标按下监听
    this.dom.addEventListener('mousedown', this.down)
  }

  /**
   * @desc 移除mousedown监听
   */
  removeDown() {
    this.dom.removeEventListener('mousedown', this.down)
  }

  /**
   * @desc 鼠标按下
   * @param {event} e down事件
   */
  _down(e) {
    this.leftSpace = e.clientX - this.dom.offsetLeft
    this.topSpace = e.clientY - this.dom.offsetTop
    this.isdown = true
    this.parent.style.cursor = 'move'
    // 添加鼠标移动监听
    window.addEventListener('mousemove', this.move)

    // 添加鼠标抬起监听
    window.addEventListener('mouseup', this.up)

    e.stopPropagation()
  }

  /**
   * @desc 移动
   * @param {event} e move事件
   */
  _move(e) {
    if (!this.isdown) {
      return
    }

    this.parent.style.left = e.clientX - this.leftSpace
    this.parent.style.top = e.clientY - this.topSpace
  }

  /**
   * @desc 抬起
   */
  _up() {
    this.isdown = false
    window.removeEventListener('mousemove', this.move)
    window.removeEventListener('mouseup', this.up)
    this.parent.style.cursor = 'default'
  }
}
export default Drag
