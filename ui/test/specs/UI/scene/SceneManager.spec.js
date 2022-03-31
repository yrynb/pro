import SceneManager from '@/UI/scene/SceneManager'

let jsonData = {
  def: JSON.stringify({ opts: {}, children: [], type: 'canvas' })
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

describe('SceneManager.js', () => {
  const pr = {
    parent: {}
  }
  const sceneManager = new SceneManager()

  it('has factory', () => {
    expect(SceneManager.factory({})).toBeInstanceOf(SceneManager)
  })

  it('has parseScene', () => {
    const basePath = './'
    const scenes = ['60a33b5e8fab9855cd7b3c63']
    window.fetch = fetch
    const spy = jest.spyOn(sceneManager, 'parseScenes')
    sceneManager.parseScenes({ basePath, scenes })
    sceneManager.parseScenes({ basePath, scenes: scenes[0] })
    expect(spy).toHaveBeenCalled()
  })

  it('has divideScene', () => {
    const layer = {}
    sceneManager.divideScene(layer, 'defaultSceneId')
    sceneManager.divideScene(layer, '1234')
    sceneManager.divideScene({ hide() {}, show() {} }, 'defaultSceneId')

    expect(layer.sceneId).toBe('1234')
    expect(sceneManager._scenes.sceneObj.has('1234')).toBe(true)
    expect(sceneManager.divideScene(layer, {})).toBeFalsy()
  })

  it('has getSceneById', () => {
    expect(sceneManager.getSceneById('1234')).toEqual({
      layers: [
        {
          sceneId: '1234'
        }
      ],
      status: 'hide'
    })

    expect(sceneManager.getSceneById({})).toBeFalsy()
  })

  it('has deleteSceneById', () => {
    sceneManager.deleteSceneById('1234')
    expect(sceneManager._scenes.sceneObj.has('1234')).toBe(false)

    expect(sceneManager.deleteSceneById('22')).toBeFalsy()

    sceneManager.deleteSceneById({})
  })

  it('has hideOtherScenes', () => {
    const spy = jest.spyOn(sceneManager, '_hideOtherScene')
    sceneManager.hideOtherScenes()
    expect(spy).toHaveBeenCalled()

    const ss = new SceneManager()
    ss.divideScene({ hide() {}, show() {} }, 's1234')
    const spyf = jest.spyOn(ss, '_hideOtherScene')
    ss.hideOtherScenes('s1234')
    ss.hideOtherScenes({})
    expect(spyf).toHaveBeenCalled()
  })

  it('has hideSceneById', () => {
    const spy = jest.spyOn(sceneManager, 'setSceneStatus')
    sceneManager.hideSceneById('defaultSceneId')
    expect(spy).toHaveBeenCalled()
  })

  it('has showSceneById', () => {
    const spy = jest.spyOn(sceneManager, 'setSceneStatus')
    sceneManager.showSceneById('defaultSceneId')
    expect(spy).toHaveBeenCalled()
  })

  it('has setSceneStatus', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    sceneManager.setSceneStatus()
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('has getScenesGroup', () => {
    expect(typeof sceneManager.getScenesGroup()).toBe('object')
  })

  it('has getVisibleScene', () => {
    expect(typeof sceneManager.getVisibleScene()).toBe('object')
  })
})
