import MapHandle from '@/common/MapHandle'
class Test {
  constructor() {}
  static factory() {
    return new Test()
  }
}
describe('MapHandle.js', () => {
  const instance = new MapHandle()
  it('_set', () => {
    expect(() => {
      instance._set('name', 123)
    }).toThrow('注册的对象缺失factory静态方法')

    instance._set('test', Test)
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    instance._set('test', Test)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('_create', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    instance._create('name')
    expect(consoleSpy).toHaveBeenCalled()
    expect(instance._create('test')).toBeInstanceOf(Test)
  })
})
