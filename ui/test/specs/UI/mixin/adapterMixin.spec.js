import adapterMixin from '@/UI/mixin/adapterMixin'
import Layout from '@/UI/layout/Layout'
import Layer from '@/UI/layer/Layer'
import Container from '@/UI/container/Container'
import register from '@/UI/registe/registe'
import adapterManager from '@/UI/adapter/adapterManager'
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
  constructor() {}
  static factory() {
    return new Test()
  }
  init() {}
  destroy() {}
}
describe('adapterMixin.js', () => {
  const proto = adapterMixin.prototype
  it('adapterMixin cannot be created', () => {
    expect(() => new adapterMixin()).toThrowError(
      'adapterMixin cannot be created'
    )
  })

  it('initAdapter', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    container.initAdapter({})
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('createAdapter', () => {
    adapterManager.regist('test', Test)
    container.createAdapter('test', Test)
    expect(container.adapter).toBeInstanceOf(Test)
  })

  it('destroyAdapter', () => {
    const spyOn = jest.spyOn(container.adapter, 'destroy')
    container.destroyAdapter()
    expect(spyOn).toHaveBeenCalled()
    expect(container.adapter).toBeNull()
  })
})
