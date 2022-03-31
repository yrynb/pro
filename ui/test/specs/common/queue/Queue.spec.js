import queue from '@/common/queue'
const taskList = [() => {}]

describe('Queue.js', () => {
  it('addTask', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    queue.addTask()
    expect(consoleSpy).toHaveBeenCalled()
    const spy = jest.spyOn(queue, 'start')
    queue.addTask(() => {})
    expect(spy).toHaveBeenCalled()
  })
  it('isFinish', () => {
    expect(queue.isFinish()).toBe(true)
  })

  it('start', () => {
    queue._isRunning = true
    expect(queue.start()).toBe(false)

    queue._isRunning = false
    queue.queues = [...taskList]
    const spyExect = jest.spyOn(queue, '_exect')
    queue.start()
    expect(spyExect).toHaveBeenCalled()
  })

  it('_doExect', () => {
    expect(queue._doExect()).toBe(true)
    queue._getNow = () => {
      return 10
    }
    queue._curTime = () => {
      return 30
    }
    expect(queue._doExect(taskList)).toBe(true)
  })

  it('_exect', () => {
    queue._reDrawId = 123
    expect(queue._exect([], 234)).toBe(false)
    queue._curTime = () => {
      return 20
    }
    queue._exect(taskList, 123)
  })
})
