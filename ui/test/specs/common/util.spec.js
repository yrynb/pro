import util from '@/common/util'

describe('util.js', () => {
  it('sortByKey: sort list by Key', () => {
    const obj = {}
    const obj1 = { weight: 1 }
    const obj2 = { weight: 100 }
    const list = util.sortByKey([obj1, obj2], 'weight')
    expect(list[0]).toEqual(obj2)
    expect(list[1]).toEqual(obj1)

    const list1 = util.sortByKey([obj1, obj], 'weight')
    expect(list1).toEqual([obj1, obj])
  })

  it('Determine if the data type is a known data type', () => {
    const objects = [
      { target: '123', type: 'String' },
      { target: 123, type: 'Number' },
      { target: true, type: 'Boolean' },
      { target: undefined, type: 'Undefined' },
      { target: null, type: 'Null' },
      { target: () => {}, type: 'Function' },
      { target: [], type: 'Array' },
      { target: {}, type: 'Object' },
      { target: Symbol(1), type: 'Symbol' }
    ]
    objects.forEach(v => {
      expect(util.isType(v.target, v.type)).toBe(true)
    })
  })

  it('deepMixinOpts: Deep merge', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    util.deepMixinOpts(123, [])
    expect(consoleSpy).toHaveBeenCalled()

    const _noLen = { name: 'source has no length' }
    expect(util.deepMixinOpts(_noLen, ...[])).toEqual(_noLen)

    util.deepMixinOpts({}, ...[123, 456])
    expect(consoleSpy).toHaveBeenCalled()

    expect(
      util.deepMixinOpts(
        { name: 'test', deep: {} },
        { age: '18', deep: { num: 20 } }
      )
    ).toEqual({
      name: 'test',
      age: '18',
      deep: { num: 20 }
    })
  })

  it('_deepMixinOpts: Deep merge', () => {
    const target = { name: 'test' }
    util._deepMixinOpts(target, { name: 'deep', deep: {} })
    expect(target).toEqual({
      name: 'deep',
      deep: {}
    })
  })

  it('createElementName: Element name + random string', () => {
    const ele1 = 'framwork-'
    expect(util.createElementName().startsWith(ele1)).toBe(true)
    expect(util.createElementName().replace(ele1, '')).toHaveLength(8)

    const ele2 = 'layer'
    expect(util.createElementName(ele2).startsWith(`${ele2}-`)).toBe(true)
    expect(util.createElementName(ele2).replace(`${ele2}-`, '')).toHaveLength(8)
  })

  it('_applyMixin: Methods to mix in objects', () => {
    let target = () => {}
    let source1 = () => {}
    source1.prototype.on = () => {
      return 'source1: on'
    }
    let source2 = {
      emit() {
        return 'source2: emit'
      }
    }
    let source3 = {
      on() {
        return 'source3: on'
      }
    }
    util._applyMixin(target, source1)
    expect(target.prototype.on()).toBe('source1: on')
    util._applyMixin(target, source2)
    expect(target.prototype.emit()).toBe('source2: emit')
    util._applyMixin(target, source3, false)
    expect(target.prototype.on()).toBe('source3: on')
    util._applyMixin(target, source3)
    expect(target.prototype.on()).toBe('source3: on')
  })

  it('applyMixins: Methods to mix in objects', () => {
    let target = () => {}
    let source1 = () => {}
    source1.prototype.on = () => {
      return 'source1: on'
    }
    let source2 = () => {}
    source2.prototype.emit = () => {
      return 'source2: emit'
    }
    util.applyMixins(target, source1)
    expect(target.prototype.on()).toBe('source1: on')

    util.applyMixins(target, [source1, source2])
    expect(target.prototype.on()).toBe('source1: on')
    expect(target.prototype.emit()).toBe('source2: emit')
  })

  it("confirmArr: It's an array and it has a value", () => {
    expect(util.confirmArr(123)).toBe(false)
    expect(util.confirmArr([])).toBe(false)
    expect(util.confirmArr([1, 2, 3])).toBe(true)
  })

  class Test1 {}
  class Test2 extends Test1 {}
  class Test3 extends Test2 {}
  class Test4 {}
  it('inheritObject', () => {
    expect(util.inheritObject(Test1)).toEqual(new Test1())
  })

  it('inheritPrototype', () => {
    expect(util.inheritPrototype(Test3, Test1)).not.toBe(true)
    const spy = jest.spyOn(util, 'inheritObject')
    util.inheritPrototype(Test4, Test1)
    expect(spy).toHaveBeenCalled()
  })
})
