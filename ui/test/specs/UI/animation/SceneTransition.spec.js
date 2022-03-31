import SceneTransition from '@/UI/animation/SceneTransition'
import Layout from '@/UI/layout/Layout'

describe('SceneTransition.js', () => {
  const root = document.createElement('div')
  let layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })

  const container1 = {
    opts: { x: 10, y: 10, left: 10, top: 10 },
    style: { width: 10, height: 10, scale: [1, 1] },
    root: { offsetWidth: 100, offsetHeight: 100 },
    parent: { parent: layout }
  }

  const container2 = {
    opts: { x: 10, y: 10, left: 10, top: 10 },
    style: { width: 10, height: 10, scale: [1, 1] },
    root: { offsetWidth: 100, offsetHeight: 100 },
    parent: { parent: layout }
  }

  const sceneTransition = SceneTransition.factory()

  it('check SceneTransition factory', () => {
    expect(sceneTransition).toStrictEqual(new SceneTransition())
  })

  it('check SceneTransition createAnimation', () => {
    sceneTransition.createAnimation([
      {
        target: [container1, container2],
        animation: ['fromLeft', 'fadeIn'],
        duration: [3000, 1000],
        delay: 1000
      }
    ])
  })

  it('check SceneTransition _loop', () => {
    expect(
      sceneTransition._loop(
        {
          target: container1,
          animation: ['fromTop', 'fadeIn'],
          duration: 3000,
          delay: 1000,
          easing: 'linear'
        },
        sceneTransition._getTarget.bind(sceneTransition)
      )
    ).toStrictEqual([
      {
        target: container1,
        animation: { translate: [0, 30] },
        duration: 3000,
        delay: 1000,
        easing: 'linear'
      },
      {
        target: container1,
        animation: { opacity: 1 },
        duration: 3000,
        delay: 1000,
        easing: 'linear'
      }
    ])
  })

  it('check SceneTransition _animator', () => {
    expect(
      sceneTransition._animator({
        target: container2,
        animation: 'fromTop',
        duration: 1000,
        delay: 1000,
        easing: 'linear'
      })
    ).toStrictEqual([
      {
        target: container2,
        animation: { translate: [0, 30] },
        duration: 1000,
        delay: 1000,
        easing: 'linear'
      }
    ])

    expect(
      sceneTransition._animator({
        target: container2,
        animation: 'fadeIn',
        duration: 1000,
        delay: 1000,
        easing: 'linear'
      })
    ).toStrictEqual([
      {
        target: container2,
        animation: { opacity: 1 },
        duration: 1000,
        delay: 1000,
        easing: 'linear'
      }
    ])
  })
})
