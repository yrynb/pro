import Parse from '@/UI/scene/Parse'

let jsonData = {
  def: JSON.stringify({ opts: {}, children: [], type: 'canvas' }),
  config: JSON.stringify({ opts: {}, children: [], type: 'canvas' })
}

const fetch = () => {
  return new Promise((resolve, reject) => {
    const res = {
      json: () => {
        return new Promise(_resolve => {
          _resolve(jsonData)
        })
      }
    }
    resolve(res)
  })
}
const basePath = './'
const scenes = ['60a33b5e8fab9855cd7b3c63']

describe('test Parse.js', () => {
  const parse = Parse.factory({
    hideOtherScenes: () => {
      return []
    },
    parent: {
      scenes: {
        getScenesGroup: () => {
          return []
        }
      }
    }
  })

  it('factory', () => {
    expect(Parse.factory({})).toBeInstanceOf(Parse)
  })

  it('async init', async () => {
    parse.importBase = () => Promise.resolve()
    window.fetch = fetch
    const spyFn = jest.spyOn(parse, 'init')
    await parse.init({ basePath, scenes })
    expect(spyFn).toHaveBeenCalledTimes(1)
    await parse.init({ basePath, scenes: scenes[0] })
    expect(spyFn).toHaveBeenCalledTimes(2)
  })

  it('test data.config/data.def is object', async () => {
    jsonData = {
      def: { opts: {}, children: [], type: 'canvas' },
      config: { opts: {}, children: [], type: 'canvas' }
    }
    window.fetch = fetch
    const spyFn = jest.spyOn(parse, 'fetchJson')
    parse.fetchJson(scenes[0])
    expect(spyFn).toHaveBeenCalledTimes(1)
  })

  it('test try catch', () => {
    parse.importComponent = Promise.resolve()
    jsonData = {
      def: (() => {
        return new Error(`parse json error`)
      })(),
      config: JSON.stringify({ opts: {}, children: [], type: 'canvas' })
    }
    let parseaError
    try {
      JSON.parse(jsonData.def)
    } catch (error) {
      parseaError = error
    }
    const spyFn = jest.spyOn(parse, 'fetchJson')
    parse.fetchJson(scenes[0])
    expect(spyFn).toHaveBeenCalledTimes(1)
  })

  it('test tranform', () => {
    const { layer, hasChildren, container } = parse.transform(
      scenes[0],
      basePath
    )
    const layerOpts = {
      option: {
        opts: {
          id: 'layer-1',
          order: 2,
          sceneId: scenes[0]
        }
      }
    }
    const containerOpts = {
      option: {
        id: 'container-1',
        order: 2,
        width: 100,
        height: 100,
        top: 20,
        left: 20,
        style: {},
        adapter: {
          option: {
            prefix: './scene/web'
          }
        }
      }
    }
    expect(layer(layerOpts)).toEqual({
      id: 'layer-1',
      order: 2,
      sceneId: '60a33b5e8fab9855cd7b3c63'
    })
    expect(hasChildren()).toEqual([])
    expect(hasChildren([{ children: [] }])).toEqual([])
    expect(hasChildren([{}])).toEqual([{}])
    expect(container(containerOpts)).toEqual(containerOpts.option)
    containerOpts.type = 'Group'
    expect(container(containerOpts)).toEqual({})
  })

  it('test && ||', () => {
    const { layer, hasChildren, container } = parse.transform(
      scenes[0],
      basePath
    )
    const layerOpts = {
      option: {
        id: 'layer-1',
        order: 2,
        sceneId: scenes[0]
      }
    }
    const containerOpts = {
      option: {
        opts: {
          id: 'container-1',
          order: 2,
          top: 20,
          left: 20
        },
        style: {
          width: 100,
          height: 100,
          backgroundImage: './scene/web',
          visibility: ''
        },
        adapter: {
          option: {
            prefix: './scene/web'
          }
        }
      }
    }
    const containerOptsRes = {
      id: 'container-1',
      order: 2,
      width: 100,
      height: 100,
      top: 20,
      left: 20,
      style: {
        width: 100,
        height: 100,
        backgroundImage: './scene/web',
        visibility: ''
      },
      adapter: {
        option: {
          prefix: './scene/web'
        }
      }
    }
    expect(layer(layerOpts)).toEqual({
      id: 'layer-1',
      order: 2,
      sceneId: '60a33b5e8fab9855cd7b3c63'
    })
    expect(container(containerOpts)).toEqual(containerOptsRes)

    const containerOptsNoAdapter = {
      option: {
        opts: {
          id: 'container-1',
          order: 2,
          top: 20,
          left: 20
        },
        style: {
          width: 100,
          height: 100,
          backgroundImage: './scene/web'
        }
      }
    }
    const containerOptsNoAdapterRes = {
      id: 'container-1',
      order: 2,
      style: {
        width: 100,
        height: 100,
        backgroundImage: './scene/web',
        visibility: ''
      },
      width: 100,
      height: 100,
      top: 20,
      left: 20,
      adapter: undefined
    }
    expect(container(containerOptsNoAdapter)).toEqual(containerOptsNoAdapterRes)
  })
})
