import adapter from '@/UI/adapter/adapterManager'
import ConchAdapter from '@/UI/adapter/ConchAdapter'
import Container from '@/UI/container/Container'
import Layout from '@/UI/layout/Layout'
describe('Container.js', () => {
  const layout = new Layout(document.createElement('div'), {})
  const layout2 = new Layout(document.createElement('div'), { isDrag: true })
  const test = {
    layout
  }

  const container = new Container(test, {})

  const container3 = new Container(test, {
    id: 'container-9omfsp71',
    'data-id': 'container-9omfsp71'
  })

  it('check Container factory', () => {
    // expect(
    //   Container.factory(test, {
    //     id: 'container-9omfsp71',
    //     'data-id': 'container-9omfsp71'
    //   })
    // ).toStrictEqual(container3)
  })

  it('check Container initDom', () => {
    expect(container.initDom()).toBe(container.root.dom)
  })

  it('check Container loadAdapter', () => {
    container.loadAdapter()
    adapter.regist('ConchAdapter', ConchAdapter)
    class Comp {
      constructor(dom, opts) {}
      setData(d) {}
      render() {}
    }
    window.conch = { Comp }
    ConchAdapter._loadConch()
    container.opts.adapter = { type: 'ConchAdapter', name: 'Comp', option: {} }
    container.loadAdapter()
  })

  it('check Container getSize', () => {
    expect(container.getSize()).toStrictEqual({ width: 500, height: 500 })
  })

  it('check Container getDom', () => {
    expect(container.getDom()).toBe(container.dom)
  })

  it('check Container hide', () => {
    container.isShow = false
    container.hide()
    expect(container.isShow).toBe(false)

    container.isShow = true
    container.hide()
    expect(container.isShow).toBe(false)
  })

  it('check Container show', () => {
    container.isShow = true
    container.show()
    expect(container.isShow).toBe(true)

    container.isShow = false
    container.show()
    expect(container.isShow).toBe(true)
  })

  it('check Container setOption', () => {
    container.adapter = {}
    container.adapter = { resize: 0.5, resize() {} }

    expect(() => container.setOption({ id: 11 })).toThrowError(
      '配置更新失败, 容器id无法更新, 请输入正确的配置'
    )

    container.setOption({ width: 100, height: 100 })
    expect(container.getSize()).toStrictEqual({ width: 100, height: 100 })

    container.setOption({ x: 10 })
    expect(container.style.x).toBe(10)
  })

  it('check Container destroy', () => {
    container.adapter = null
    container.destroy()
    expect(container.id).toBe(null)
    expect(container.dom).toBe(null)
  })

  it('check Container update', () => {
    const spyOn = jest.spyOn(container.style, 'getDirtyStyleList')
    container.dom = document.createElement('div')
    container.update()()
    expect(spyOn).toHaveBeenCalled()
  })
})
