import StoreManager from '@/common/store/StoreManager'

describe('StoreManager.js', () => {
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

  const storeManager = new StoreManager({ UI })

  it('check {state, get, set}', () => {
    expect(storeManager.UI.getRoot()).toBe(null)
  })
  it('check null', () => {
    new StoreManager(null)
  })
})
