import EventBus from '@/common/EventBus'
import compMixin from '@/frame/mixin/compMixin'
import { expect } from '@jest/globals'
describe('eventBusMixin.js', () => {
  const proto = new EventBus()
  // it('eventBusMixin Cannot be created', () => {
  //   expect(() => new eventBusMixin()).toThrowError(
  //     'eventBusMixin cannot be created'
  //   )
  // })
  it('on: Register events and handlers', () => {
    try {
      proto.on('on', 123)
      expect(true).toBe(false)
    } catch (e) {
      expect(e.message).toBe('The event object is not properly formatted')
    }

    let step = 0
    proto.on('on', args => {
      expect(args).toBe(123)
      expect(step).toBe(0)
      step += 1
    })
    proto.on('on', args => {
      expect(args).toBe(123)
      expect(step).toBe(1)
    })
    proto.emit('on', 123)
  })

  it('once: check eventBusMixin once', () => {
    let step = 0
    proto.once('once', args => {
      expect(args).toBe(123)
      expect(step).toBe(0)
      step += 1
    })
    proto.emit('once', 123)
    proto.emit('once', 123)
  })
  const _offFunc1 = jest.fn()
  it('emit: trigger all callbacks for an event with arguments', () => {
    class Comp1 {
      constructor() {
        this.init()
      }
      init() {
        expect(this._name).toBe('comp1')
        expect(typeof this.on).toBe('function')
        const _eventOn = args => {
          expect(args).toBe('compEvent')
        }
        this.on('compEvent', _eventOn, this)
      }
    }
    class Comp2 {
      constructor() {
        this.init()
      }
      init() {
        expect(this._name).toBe('comp2')
        expect(typeof this.emit).toBe('function')
        this.emit('comp1:compEvent', 'compEvent')
        this.emit('compEvent', 'compEvent')
        proto.on('off2', _offFunc1)
      }
    }
    compMixin.prototype.registerComponent(Comp1, 'comp1')
    compMixin.prototype.registerComponent(Comp2, 'comp2')

    proto.on('emitArray', [])
    proto.on('emitArray', args => {
      expect(args).toBe('emitArray')
    })
    proto.emit('emitArray', 'emitArray')
  })

  it('off: Single event destruction', () => {
    try {
      proto.off('off', 123)
      expect(true).toBe(false)
    } catch (e) {
      expect(e.message).toBe('fn is not a function')
    }
    try {
      proto.off('off1', () => {})
    } catch (e) {
      expect(e).toEqual(true)
    }
    class Comp3 {
      constructor() {
        this.init()
      }
      init() {
        const _offFunc = jest.fn()
        this.on('off', _offFunc, this)
        this.on('off', _offFunc)
        this.emit('off')
        expect(_offFunc).toHaveBeenCalledTimes(2)
        this.off('off', _offFunc, this)
        this.emit('off')
        expect(_offFunc).toHaveBeenCalledTimes(3)
        this.off('off', _offFunc)
        this.emit('off')
        expect(_offFunc).toHaveBeenCalledTimes(3)
      }
    }
    compMixin.prototype.registerComponent(Comp3, 'comp3')
  })
  it(`clear: Deletes all events named 'event' for the current component`, () => {
    try {
      proto.clear('clear1', () => {})
    } catch (e) {
      expect(e).toEqual(true)
    }
    const _clearFunc = jest.fn()
    const _clearThis = { name: 'off' }
    proto.on('clear', _clearFunc, _clearThis)
    proto.on('clear', _clearFunc)
    proto.emit('clear')
    expect(_clearFunc).toHaveBeenCalledTimes(2)
    proto.clear('clear', _clearThis)
    proto.emit('clear')
    expect(_clearFunc).toHaveBeenCalledTimes(3)
    proto.clear('clear')
    expect(_clearFunc).toHaveBeenCalledTimes(3)
  })
  it(`clearAll: Delete all events named 'event'`, () => {
    try {
      proto.clearAll('clearAll1', () => {})
    } catch (e) {
      expect(e).toEqual(true)
    }
    const _allFunc = jest.fn()
    proto.on('clearAll', _allFunc)
    proto.on('clearAll', _allFunc)
    proto.emit('clearAll')
    expect(_allFunc).toHaveBeenCalledTimes(2)
    proto.clearAll('clearAll')
    proto.emit('clearAll')
    expect(_allFunc).toHaveBeenCalledTimes(2)
  })
})
