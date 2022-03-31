describe('adapter.js', () => {
  it('ConchAdapter is a single class', () => {
    expect(1).toBe(1)
  })
})
import adapter from '@/UI/adapter/adapterManager'

describe('adapterManager.js', () => {
  class adapterClass {
    static factory() {
      return new adapterClass()
    }
  }
  it('has a regist', () => {
    // adapter.regist('component', {})
    expect(() => adapter.regist('component', {})).toThrowError(
      '注册的对象缺失factory静态方法'
    )
  })

  it('has a creatComponent', () => {
    class ParentClass {
      static factory(parent, name) {
        throw new Error('创建错误')
      }
    }

    adapter.regist('parentClass', ParentClass)
    expect(() =>
      adapter.creatComponent('parentClass', {}, 'test')
    ).toThrowError('创建parentClass出错')
  })
})
