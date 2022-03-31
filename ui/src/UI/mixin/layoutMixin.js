function layoutMixin() {
  throw new Error('layoutMixin cannot be created')
}
/**
 * @lends Layout.prototype
 */
layoutMixin.prototype = {
  /**
   * @desc 对元素按照传入的位置和放缩比例进行布局设置
   * @param {Layer|Container} el 需要进行布局的元素
   * @param {Object} opts {top, left, width, height}
   */
  doLayout(el, opts) {
    if (el.style) {
      el.style.transformOrigin = ['top', 'left']
    }

    const coord = this._computeNewCoord(el, {
      top: opts.top,
      left: opts.left,
      width: opts.width,
      height: opts.height
    })
    return this._doLayout(el, coord.top, coord.left, coord.ratio)
  },

  /**
   * @desc 对元素按照计算后的位置和放缩比例进行布局设置
   * @param {Layer|Container} el 需要进行布局的元素
   * @param {number} top 计算后的元素相对于root节点的top
   * @param {number} left 计算后的元素相对于root节点的left
   * @param {number} ratio 元素的放缩比例
   */
  _doLayout(el, top, left, ratio) {
    if (el.style) {
      el.style.translate = [left, top]
      el.style.scale = ratio
    }

    return {
      translate: [left, top],
      scale: ratio
    }
  },

  _computeNewCoord(
    el,
    { top: oldTop, left: oldLeft, width: canvasSizeX, height: canvasSizeY }
  ) {
    // TODO: constraints
    const index = el.constraints || 1

    // 获取调整到新布局后的元素放缩比例
    // TODO: scaleConstraints
    const ratio = this._getElRatio(
      el.scaleConstraints || 0,
      { width: el.root.clientWidth, height: el.root.clientHeight }, //newSize
      { width: canvasSizeX, height: canvasSizeY } //oldSize
    )

    // 获取新老布局上9点参照物位置
    const [oldTargetCoord, newTargetCoord] = this._getCoord(
      el.root.clientWidth,
      el.root.clientHeight,
      canvasSizeX,
      canvasSizeY
    )

    // 计算top left的差值
    const topDiff = (oldTargetCoord[index - 1][1] - oldTop) * ratio
    const leftDiff = (oldTargetCoord[index - 1][0] - oldLeft) * ratio

    // 按照差值计算新的top和left
    const top = newTargetCoord[index - 1][1] - topDiff
    const left = newTargetCoord[index - 1][0] - leftDiff

    return { left, top, ratio }
  },

  /**
   * @desc 按照新老画布尺寸和元素的constraints参照物目标计算新的放缩比例
   * @param {number} scaleConstraints 放缩比受影响方向 0横向，1纵向，2双向
   * @param {object} newSize 具有w,h属性的新画布尺寸
   * @param {*} oldSize 具有w,h属性的老画布尺寸
   */
  _getElRatio(scaleConstraints, newSize, oldSize) {
    let ratio = 1

    scaleConstraints === 0 && (ratio = newSize.width / oldSize.width)
    scaleConstraints === 1 && (ratio = newSize.height / oldSize.height)

    return ratio
  },

  /**
   * @desc 获取新老布局的9点参照物位置
   * @param {number} nw 新布局下的画布宽
   * @param {number} nh 新布局下的画布高
   * @param {number} w 老布局画布的宽
   * @param {number} h 老布局画布高
   */
  _getCoord(nw, nh, w, h) {
    return [this._computeCoord(w, h), this._computeCoord(nw, nh)]
  },

  /**
   * @desc 根据画布尺寸计算老的9点参照点位置
   * @param {object} canvasSize 画布尺寸
   */
  _computeCoord(w, h) {
    return [
      [0, 0],
      [w / 2, 0],
      [w, 0],
      [0, h / 2],
      [w / 2, h / 2],
      [w, h / 2],
      [0, h],
      [w / 2, h],
      [w, h]
    ]
  },

  computeNewCoord(
    el,
    { top: oldTop, left: oldLeft, width: canvasSizeX, height: canvasSizeY }
  ) {
    return this._computeNewCoord(el, {
      top: oldTop,
      left: oldLeft,
      width: canvasSizeX,
      height: canvasSizeY
    })
  }
}

export default layoutMixin
