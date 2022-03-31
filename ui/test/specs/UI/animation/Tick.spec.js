import Animator from '@/UI/animation/Animator'
import Tick from '@/UI/animation/Tick'
import Container from '@/UI/container/Container'
import Layer from '@/UI/layer/Layer'
import Layout from '@/UI/layout/Layout'
import register from '@/UI/registe/registe'
register.registClazz('Layout', Layout)
register.registClazz('Layer', Layer)
register.registClazz('Container', Container)

describe('test Tick.js', () => {
  const root = document.createElement('div')
  let layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
  const layer = layout.createLayer()
  const container = layer.createContainer({
    id: 1,
    style: {
      width: 637,
      height: 198,
      top: 200,
      left: 40
    }
  })
  const animator = new Animator({
    target: container,
    animation: {
      translate: [100, 0]
    },
    duration: 1000,
    delay: 1000,
    callback: () => {}
  })
  let tick = new Tick(animator, {
    type: 'translate',
    endValue: [100, 0]
  })

  it('check Tick factory', () => {
    expect(
      Tick.factory(animator, {
        type: 'translate',
        endValue: [100, 0]
      })
    ).toBeInstanceOf(Tick)
  })

  it('check Tick init', () => {
    tick.startTime = Date.now()
    expect(tick.init()()).toBeTruthy()

    tick.startTime = Date.now() - 1900
    const spyFn = jest.spyOn(tick, 'run')
    tick.init()()
    expect(spyFn).toHaveBeenCalled()

    tick.startTime = Date.now() - 2900
    expect(tick.init()()).toBeFalsy()
  })

  it('check Tick getValue', () => {
    container.style.translate = null
    expect(tick.getValue('translate')).toStrictEqual([0, 0])

    container.style.scale = null
    expect(tick.getValue('scale')).toStrictEqual([1, 1])

    container.style.scale = [2, 2]
    expect(tick.getValue('scale')).toStrictEqual([2, 2])

    container.style.skew = null
    expect(tick.getValue('skew')).toStrictEqual([0, 0])

    container.style.skew = [1, 1]
    expect(tick.getValue('skew')).toStrictEqual([1, 1])

    container.style.width = 100
    tick = new Tick(animator, {
      type: 'width',
      endValue: 100
    })
    expect(tick.getValue('width')).toBe(100)
  })

  it('check Tick getEndValue', () => {
    container.style.translate = [0, 0]
    tick = new Tick(animator, {
      type: 'translate',
      endValue: [0, 0]
    })
    expect(tick.getEndValue('10')).toStrictEqual([10, 10])
    expect(tick.getEndValue(10)).toStrictEqual([10, 10])

    tick = new Tick(animator, {
      type: 'width',
      endValue: 1
    })
    container.style.width = 10
    expect(tick.getEndValue('10')).toStrictEqual(20)
    expect(tick.getEndValue(10)).toStrictEqual(20)
  })

  it('check Tick run', () => {
    tick.target = false
    expect(tick.run()).toBeFalsy()

    tick = new Tick(animator, {
      type: 'opacity',
      endValue: 0
    })
    tick.easingType = 'easeOut'
    expect(tick.run(90)).toBeTruthy()
  })

  it('check Tick stop', () => {
    expect(tick.stop()).toBeUndefined()
  })

  it('check Tick pause', () => {
    const spyOn = jest.spyOn(tick, 'getNow')
    tick.pause()
    expect(spyOn).toHaveBeenCalled()
  })
})
