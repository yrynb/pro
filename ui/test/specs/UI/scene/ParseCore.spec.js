import ParseCore from '@/UI/scene/ParseCore'

describe('ParseCore.js', () => {
  const mockData = {
    children: [
      {
        option: {
          name: '图层',
          id: 'layer-3fr8ndon',
          order: 2
        },
        children: [
          {
            option: {
              name: '容器',
              id: 'container-zxom7h1f',
              order: 4,
              style: {
                position: 'absolute',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
                width: 792,
                height: 489,
                translate: [336, 171],
                backgroundImage:
                  'http://112.125.125.3/seabed/static/images/editor/cell.png'
              },
              top: 171,
              left: 336
            },
            type: 'free'
          },
          {
            option: {
              name: '容器',
              id: 'container-zxom7h1p',
              width: 792,
              height: 489,
              order: 4,
              style: {
                position: 'absolute',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
                width: 792,
                height: 489,
                translate: [336, 171],
                backgroundImage:
                  'http://112.125.125.3/seabed/static/images/editor/cell.png'
              },
              top: 171,
              left: 336
            },
            type: 'Group'
          }
        ]
      }
    ]
  }
  const pr = {
    createLayer() {
      return {
        createContainer() {}
      }
    }
  }
  const instance = new ParseCore()

  const transform = {
    layer() {},
    hasChildren() {
      return [1, 2]
    },
    container() {}
  }

  it('has renderUI', () => {
    const spy = jest.spyOn(instance, 'renderLayer')
    instance.renderUI(mockData, pr, transform)
    expect(spy).toHaveBeenCalled()
  })

  it('has renderLayer', () => {
    const spy = jest.spyOn(instance, 'renderContainer')
    instance.renderLayer(
      mockData.children[0],
      mockData.children[0],
      pr,
      transform
    )
    expect(spy).toHaveBeenCalled()
  })

  it('has renderContainer', () => {
    const spy = jest.spyOn(instance, 'renderContainer')
    instance.renderContainer(mockData.children[0].children, pr.createLayer())
    expect(spy).toHaveBeenCalled()
  })

  it('has importBase', () => {
    const spy = jest.spyOn(instance, 'pullIn')

    instance.importBase({})
    expect(spy).not.toHaveBeenCalled()

    instance.importBase('base')
    expect(spy).toHaveBeenCalled()
  })

  it('has importComponent', () => {
    const spy = jest.spyOn(instance, 'pullIn')

    const config = {
      component: [1, 2, 3]
    }

    instance.importComponent(config)
    expect(spy).toHaveBeenCalled()
  })

  it('has pullIn', () => {
    expect(typeof instance.pullIn('base', 'base')).toBe('object')
  })
})
