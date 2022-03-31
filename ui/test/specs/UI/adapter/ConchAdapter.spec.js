import ConchAdapter from '@/UI/adapter/ConchAdapter'

describe('ConchAdapter.js', () => {
  const pr = {
    getSize() {
      return {
        height: 100,
        width: 100
      }
    },
    getDom() {
      return {
        removeChild: function () {
          return true
        },
        appendChild() {}
      }
    },
    layout: {
      taskQueue: {
        addTask: fn => fn()
      }
    }
  }
  const str = '123'
  let conchAdapter = new ConchAdapter(pr, str)

  // 向 window 中添加一个 conch 对象， Comp为组件
  class Comp {
    constructor(dom, opts) {
      this.data = '222'
    }
    setOption(d) {
      this.opts = d
    }
    setData(d) {
      this.data = d
    }
    render() {}
    resize() {}
    destroy() {}
  }

  it('has _loadConch', () => {
    const spy = jest.spyOn(ConchAdapter, '_loadConch')
    ConchAdapter._loadConch()
    expect(spy).toHaveBeenCalled()

    window.conch = ''
    expect(ConchAdapter._loadConch()).toBeFalsy()
  })

  window.conch = { Comp }
  ConchAdapter._loadConch()
  const conchComp = new ConchAdapter(pr, 'Comp')
  conchComp.init()

  it('has a factory', () => {
    const spy = jest.spyOn(ConchAdapter, 'factory')
    ConchAdapter.factory(pr, 'Comp')
    expect(spy).toHaveBeenCalled()

    expect(() => ConchAdapter.factory(pr, '111')).toThrowError(
      'Conch没有加载或Conch中没有ID为111的组件'
    )
  })

  it('has a init', () => {
    // conchAdapter = new ConchAdapter(pr, 'Comp')
    // conchAdapter.init({})

    let conchInit = new ConchAdapter(pr, '12')
    expect(conchInit.instance).toBe(null)

    // 首次，获取conchComp 数据
    conchInit = new ConchAdapter(pr, 'Comp')
    conchInit.init({})
    expect(conchInit.sourceData).toEqual('222')
    // expect(conchInit.sourceData === conchComp.instance.data).toBe(true)

    conchInit = new ConchAdapter({ ...pr, layout: null }, '12')
    expect(conchInit.init({})).toBeUndefined()

    // conchInit = new ConchAdapter(pr, 'Comps')
    // expect(conchInit.init({})).toThrowError(
    //   '组件Comps未检测到，请先到spray-conch中下载对应的组件包'
    // )

    // // this.parent.staticData 存在时，执行 setData()
    pr.staticData = 456
    conchInit = new ConchAdapter(pr, 'Comp')
    const spyOn = jest.spyOn(conchInit, 'setData')
    conchInit.init({})
    expect(spyOn).toHaveBeenCalled()
    // expect(conchInit.componentInstance.data).toBe(456)

    // conchAdapter.parent.layout = null
    // expect(conchComp1.init()).toBeUndefined()
  })

  it('has a setOption', () => {
    conchComp.setOption({})
    expect(conchComp.opts).toEqual({})
  })

  it('has a setData', () => {
    conchComp.setData('1')
    expect(conchComp.sourceData).toEqual('1')
  })

  it('has a resize', () => {
    const spy = jest.spyOn(conchComp, 'resize')
    conchComp.resize()
    expect(spy).toHaveBeenCalled()
  })

  it('has a destroy', () => {
    conchComp.destroy()
    expect(conchComp.parent).toEqual(null)
  })
})
