import Displayable from '@/UI/displayable/Displayable'

class Test {}
const test = new Test()
const obj = { test: 1 }
const dom = document.createElement('div')

describe('test Displayable.js', () => {
  const instance = new Displayable(test, { id: '' }, dom)
  new Displayable(test)

  it('_initRootStyle', () => {
    const root = document.createElement('div')
    expect(instance._initRootStyle(root)).toBeUndefined()
  })

  it('_setMap', () => {
    const spyFn = jest.spyOn(instance, '_setMap')
    instance._setMap('1', obj)
    expect(spyFn).toHaveBeenCalled()
  })

  it('set repeat', () => {
    expect(() => instance._setMap('1', obj)).toThrowError('id不能重复')
  })

  it('_hasMap', () => {
    expect(instance._hasMap('1')).toBe(true)
  })

  it('_getMapById', () => {
    expect(instance._getMapById('1')).not.toBeNull()
    expect(instance._getMapById()).toBeNull()
  })

  it('_getMapKeys', () => {
    expect(instance._getMapKeys()).toEqual(['1'])
  })

  it('_getMapValues', () => {
    expect(instance._getMapValues()).toEqual([obj])
  })

  it('_clearMap', () => {
    instance._clearMap()
    expect(instance.clazzMap).toEqual(new Map())
  })

  it('_deleteMap', () => {
    expect(() => instance._deleteMap()).toThrowError('id不能为空')
    expect(instance._deleteMap('2')).toBe(false)
  })

  it('_initId', () => {
    instance.opts.id = 'optsId-1'
    expect(instance._initId()).toMatch(/optsId-/)

    instance.opts.id = ''
    expect(instance._initId('test')).toMatch(/test-/)

    instance.opts.id = ''
    expect(instance._initId()).toMatch(/framwork-/)
  })

  it('getAppRoot', () => {
    expect(instance.getAppRoot()).toBe(dom)
  })

  it('type', () => {
    expect(instance.type).toBe('displayable')
  })
})
