import Container from '@/UI/container/Container'
import Layer from '@/UI/layer/Layer'
import Layout from '@/UI/layout/Layout'
import register from '@/UI/registe/registe'
import Style from '@/UI/style/Style'
import util from '@/common/util'
register.registClazz('Layer', Layer)
register.registClazz('Container', Container)
const layout = new Layout(document.createElement('div'), {})
const layer = layout.createLayer({})
const container = layer.createContainer({
  opts: {
    top: 2,
    left: 3
  }
})
class Test {
  constructor() {
    this.layout = new Layout(document.createElement('div'), {})
  }
}
const test = new Test()
const _styles = {
  backgroundImage: 'backgroundImage',
  translate: [1, 2],
  scale: [1, 2],
  rotate: 90,
  skew: [90, 180],
  matrix: [1, 2, 3, 4, 5, 6],
  margin: [1, 2, 3, 4],
  top: 2,
  padding: null,
  height: 'height',
  left: 'left'
}
describe('Style.js', () => {
  const instance = new Style(container)

  it('factory', () => {
    expect(Style.factory(container)).toBeInstanceOf(Style)
    expect(Style.factory(container)).toEqual(instance)
  })

  it('setOption', () => {
    expect(instance.setOption(123)).not.toBe(true)
    instance.setOption({ width: 10 })
    expect(instance.width).toBe(10)
  })

  it('getValue', () => {
    instance.setOption(_styles)
    expect(instance.getValue('backgroundImage')).toBe('url(backgroundImage)')
    expect(instance.getValue('transform')).toBe(
      'translate(1px, 2px) scale(1, 2) rotate(90deg) skew(90deg, 180deg) matrix(1,2,3,4,5,6)'
    )
    expect(instance.getValue('width')).toBe('10px')
    expect(instance.getValue('height')).toBe('height')

    expect(instance.getValue('margin')).toBe('1px 2px 3px 4px')
    expect(instance.getValue('top')).toBe('2px')
    expect(instance.getValue('left')).toBe('left')
    expect(instance.getValue('translate')).toBe('1 2')
  })

  it('getDirtyStyleList', () => {
    expect(util.isType(instance.dirtyMap, 'Object')).toBe(true)
    expect(util.confirmArr(instance.getDirtyStyleList())).toBe(true)
  })

  it('_setStyle', () => {
    instance._setStyle('name', { name: 'height', value: 20 })
    expect(instance._style.height).toBe(20)
    instance._setStyle('height', 30)
    expect(instance._style.height).toBe(30)
    expect(instance.dirtyMap.height).toBe(true)
    expect(instance.parent.dirty).toBe(true)
  })

  it('_setDistance', () => {
    expect(instance._setDistance(123)).toBeFalsy()
    const spyOn = jest.spyOn(instance, '_setStyle')
    instance._setDistance('padding', 0, 1)
    expect(instance._style.padding).toEqual([1, 0, 0, 0])
    expect(spyOn).toHaveBeenCalled()

    instance._setDistance('margin', 0, 10)
    expect(instance._style.margin).toEqual([10, 2, 3, 4])
  })

  it('_setTransform', () => {
    const spyOn = jest.spyOn(instance, '_setStyle')
    instance._setTransform('translateX', '10px')
    expect(spyOn).toHaveBeenCalled()
    expect(instance._style.translateX).toEqual('10px')
    instance._setTransform('translate', [1, 2])
    expect(instance._style.translate).toEqual([1, 2])
  })

  it('_getTransformStyleValue', () => {
    instance._setStyle('transform', { name: 'translate', value: 10 })
    instance._setStyle('transform', { name: 'scale', value: 10 })
    expect(instance._getTransformStyleValue()).toBe(
      'rotate(90deg) skew(90deg, 180deg) matrix(1,2,3,4,5,6)'
    )
  })

  it('formatValue', () => {
    expect(instance.formatValue(1)).toEqual([1, 1])
    expect(instance.formatValue([1, 2])).toEqual([1, 2])
  })

  it('set dirty', () => {
    instance.dirty = false
    expect(instance.parent.dirty).not.toBe(true)
  })

  it('get dirty', () => {
    expect(instance.dirty).not.toBe(true)
  })

  it('Proxy', () => {
    instance.paddingBottom = 10
    expect(instance._style.padding[2]).toBe(10)
  })
})
