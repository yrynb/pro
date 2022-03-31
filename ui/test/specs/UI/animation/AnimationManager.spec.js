// import AnimationSequence from '@/UI/animation/Sequence'
// import AnimateList from '@/UI/AnimateList'
import Layer from '@/UI/layer/Layer'
import Layout from '@/UI/layout/Layout'
import register from '@/UI/registe/registe'
register.registClazz('Layout', Layout)
register.registClazz('Layer', Layer)

describe('test AnimationManager.js', () => {
  const root = document.createElement('div')
  let layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
  let layer = layout.createLayer()
  let layer2 = layout.createLayer()
  layout.sceneTransition.createAnimation = () => {}
  const container = {
    opts: {
      x: 1,
      y: 1,
      left: 1,
      top: 1
    },
    parent: {
      pos: {
        x: 1,
        y: 1
      }
    },
    root: root,
    style: {
      scale: [1, 1]
    },
    update: () => {}
  }

  const customAnimation = {
    name: '11',
    before: () => {},
    tick: () => {},
    after: () => {}
  }

  let animation = layout.animation
  layout.scenes.divideScene(layer, '111')
  layout.scenes.divideScene(layer2, '222')

  animation.animationSequence.getCurrentTicks = () => [() => false]
  animation.animationSequence.callbacks = [() => 1]

  it('check AnimationManager _flush', () => {
    const spyOn = jest.spyOn(animation.animationSequence, 'getCurrentTicks')
    animation._flush()()
    expect(spyOn).toHaveBeenCalled()
  })

  // it('check AnimationManager startLoop', () => {
  //   // const spyOn = jest.spyOn(animation.animationSequence, 'getCurrentTicks')
  //   animation.startLoop()
  //   animation._isRunning = false
  //   // console.log(animation._isRunning)
  //   // const spyOn = jest.spyOn(animation, 'flush')
  //   // expect(spyOn).toHaveBeenCalled()
  //   // expect(
  //   //   (() => {
  //   //     animation.startLoop()
  //   //     animation._isRunning = false
  //   //   })()
  //   // ).toBeUndefined()
  // })

  it('check AnimationManager toggle', () => {
    animation.toggle(1)
    expect(animation.toggle(1)).toBeUndefined()

    const spyOn = jest.spyOn(animation, '_sceneAnimator')
    animation.toggle('111')
    expect(spyOn).toHaveBeenCalled()
  })

  it('check AnimationManager _moveOutSubArea', () => {
    expect(animation._moveOutSubArea('')).toBeUndefined()

    expect(animation._moveOutSubArea({ left: [container] })).toBeUndefined()
  })

  it('check AnimationManager _getAnimationOpts', () => {
    expect(animation._getAnimationOpts('')).toStrictEqual([])

    const spyOn = jest.spyOn(animation, '_getAnimationGroups')
    animation._getAnimationOpts({ left: [container] })
    expect(spyOn).toHaveBeenCalled()
  })

  it('check AnimationManager _isInWindow', () => {
    container.style = {
      scale: [1, 1],
      width: 100,
      left: 0,
      translate: [0, 0]
    }
    expect(animation._isInWindow([container])).toBeTruthy()
  })

  it('check AnimationManager _getAnimationGroups', () => {
    const spyOn = jest.spyOn(animation, '_getGroupsByPos')
    animation._getAnimationGroups([container], 'toLeft', 'linear')
    expect(spyOn).toHaveBeenCalled()
  })

  it('check AnimationManager _getGroupsByPos', () => {
    expect(animation._getGroupsByPos('')).toStrictEqual([])

    const spyOn = jest.spyOn(animation, '_getTop')
    animation._getGroupsByPos([container, container])
    expect(spyOn).toHaveBeenCalled()
  })

  it('check AnimationManager _setArea', () => {
    expect(animation._setArea('')).toStrictEqual({})

    const spyOn = jest.spyOn(animation, '_getArea')
    animation._setArea([container, container])
    expect(spyOn).toHaveBeenCalled()
  })

  // it('check AnimationManager _getArea', () => {
  //   root.width = 100
  //   container.left = 10
  //   expect(animation._getArea(container, root)).toBe('left')

  //   root.width = 100
  //   container.left = 100
  //   expect(animation._getArea(container, root)).toBe('right')
  // })

  it('check AnimationManager registAnimation', () => {
    expect(animation.registAnimation('11', customAnimation)).toBeUndefined()
  })

  it('check AnimationManager _dealCustomAnimation', () => {
    const spyOn = jest.spyOn(animation, '_getTicks')
    animation.customAnimations = new Map()
    animation.customAnimations.set('11', customAnimation)
    animation._dealCustomAnimation({
      target: [container],
      animation: '11'
    })
    expect(spyOn).toHaveBeenCalled()
  })

  it('check AnimationManager _dealDefaultAnimation', () => {
    const spyOn = jest.spyOn(animation, '_getTicks')
    animation._dealDefaultAnimation({
      target: container,
      duration: 100,
      animation: { translate: [0, 0] }
    })
    expect(spyOn).toHaveBeenCalled()
  })

  it('check AnimationManager _getTicks', () => {
    expect(animation._getTicks({ target: [{}, {}] })).toStrictEqual([])
  })
})
