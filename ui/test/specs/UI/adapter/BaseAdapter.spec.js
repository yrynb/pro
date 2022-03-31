import BaseAdapter from '@/UI/adapter/BaseAdapter'

describe('BaseAdapter.js', () => {
  const baseAdapter = new BaseAdapter({
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
        }
      }
    }
  })

  // it('has a factory', () => {
  //   expect(
  //     BaseAdapter.factory && typeof BaseAdapter.factory === 'function'
  //   ).toBe(true)
  //   BaseAdapter.factory()
  // })

  it('has a initDom', () => {
    const _dom = document.createElement('div')
    _dom.style.width = '100px'
    _dom.style.height = '100px'
    expect(baseAdapter.dom).toEqual(_dom)
  })

  it('has a setOption', () => {
    baseAdapter.setOption({})
    expect(baseAdapter.opts).toEqual({})
  })

  it('has a setData', () => {
    baseAdapter.setData({})
    expect(baseAdapter.sourceData).toEqual({})
    baseAdapter.setData([])
    expect(baseAdapter.sourceData).toEqual([])
  })

  it('has a getOption', () => {
    expect(baseAdapter.getOption()).toEqual({})
  })

  it('has a getData', () => {
    expect(baseAdapter.getData()).toEqual([])
  })

  it('has a getInstance', () => {
    baseAdapter.instance = {}
    expect(baseAdapter.getInstance()).toEqual({})
  })

  it('has a destroy', () => {
    baseAdapter.destroy()
  })
})
