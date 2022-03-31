import Store from '@/common/store/Store'

describe('Store.js', () => {
  const UI = {
    state: {
      root: null
    },
    get: {
      getRoot: state => state.root
    },
    set: {
      setRoot: (state, root) => (state.root = root)
    }
  }

  let obj = {}

  it('check Store {UI, "UI"} registerToManager', () => {
    const store = new Store(UI, 'UI')
    expect(store.name).toBe('UI')

    store.registerToManager(obj)
    obj.UI.setRoot('div2')
    expect(obj.UI.setRoot('div')).toBe('div')
  })

  // it('check Store {UI} registerToManager', () => {
  //   const store2 = new Store(UI)
  //   expect(store2.name).toBe(undefined)

  //   store2.registerToManager(obj)
  //   obj.setRoot('div2')
  //   expect(obj.getRoot()).toBe('div2')
  // })
})
