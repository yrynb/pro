import Animator from '@/UI/animation/Animator'
import Container from '@/UI/container/Container'
import Layer from '@/UI/layer/Layer'
import Layout from '@/UI/layout/Layout'
import register from '@/UI/registe/registe'
register.registClazz('Layer', Layer)
register.registClazz('Container', Container)
const layout = new Layout(document.createElement('div'), {})
const layer = layout.createLayer({})
const container = layer.createContainer({
  opts: {
    top: 2,
    left: 3
  }
})

// const root = document.createElement('div')
// new Layout(root, { canvasWidth: 100, canvasHeight: 100 })

// const ct = new Container({}, {})
const animation = {
  translate: [1240, -606]
}

describe('test Animator.js', () => {
  let animator
  it('init', () => {
    animator = Animator.factory({
      target: container,
      animation,
      duration: 500,
      delay: 1000,
      callback: () => {}
    })
    expect(animator.tweens).toHaveLength(1)
  })

  it('start', () => {
    const spyFn = jest.spyOn(animator, 'start')
    animator.start()
    expect(spyFn).toHaveBeenCalledTimes(1)
  })

  it('pause', () => {
    animator.pause()
    expect(animator.paused).toBeTruthy()
  })

  it('pause', () => {
    expect(animator.stop()).toBe(undefined)
  })

  it('destroy', () => {
    expect(animator.destroy()).toBeFalsy()
  })

  it('_initDefaultTweens', () => {
    animator = new Animator({
      target: container,
      animation: { translate: [0, 0] },
      duration: undefined,
      delay: undefined,
      callback: () => {}
    })
    expect(animator.duration).toBe(0)
  })

  it('_initCustomTweens', () => {
    animator = new Animator({
      target: container,
      animation: () => {},
      duration: undefined,
      delay: undefined,
      callback: () => {}
    })
    expect(animator.duration).toBe(0)
  })
})
