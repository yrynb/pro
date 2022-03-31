import layoutMixin from '@/UI/mixin/layoutMixin'
import Layout from '@/UI/layout/Layout'
const layout = new Layout(document.createElement('div'), {})
const el = {
  root: document.createElement('div')
}
const opts = {
  top: 0,
  left: 0,
  width: 100,
  height: 100
}
describe('layoutMixin.js', () => {
  const proto = layoutMixin.prototype
  it('layoutMixin cannot be created', () => {
    expect(() => new layoutMixin()).toThrowError(
      'layoutMixin cannot be created'
    )
  })

  it('doLayout', () => {
    const _computeNewCoord = jest.spyOn(layout, '_computeNewCoord')
    const _doLayout = jest.spyOn(layout, '_doLayout')
    layout.doLayout(el, opts)
    expect(_computeNewCoord).toHaveBeenCalled()
    expect(_doLayout).toHaveBeenCalled()
  })

  it('_doLayout', () => {
    const _style = layout._doLayout(
      {
        ...el,
        style: {}
      },
      10,
      20,
      0.8
    )

    expect(_style).toEqual({ translate: [20, 10], scale: 0.8 })
  })

  it('_computeNewCoord', () => {
    const _getElRatio = jest.spyOn(layout, '_getElRatio')
    const _getCoord = jest.spyOn(layout, '_getCoord')
    layout._computeNewCoord(el, { top: 10, left: 20, width: 30, height: 40 })
    expect(_getElRatio).toHaveBeenCalled()
    expect(_getCoord).toHaveBeenCalled()
  })

  it('_getElRatio', () => {
    expect(layout._getElRatio(0, { width: 10 }, { width: 5 })).toBe(2)
    expect(layout._getElRatio(1, { height: 20 }, { height: 5 })).toBe(4)
  })
  it('_getCoord', () => {
    const _computeCoord = jest.spyOn(layout, '_computeCoord')
    layout._getCoord(10, 10, 2, 2)
    expect(_computeCoord).toHaveBeenCalledTimes(2)
  })

  it('computeNewCoord', () => {
    const _computeNewCoord = jest.spyOn(layout, '_computeNewCoord')
    layout.computeNewCoord(el, { top: 10, left: 10, width: 20, height: 20 })
    expect(_computeNewCoord).toHaveBeenCalled()
  })
})
