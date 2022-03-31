import Sequence from '@/UI/animation/Sequence'

describe('Sequence.js', () => {
  const pr = {}
  const instance = new Sequence(pr)

  it('has factory', () => {
    expect(Sequence.factory && typeof Sequence.factory === 'function').toBe(
      true
    )
  })

  it('has isFinish', () => {
    instance.totalTicks = []
    expect(instance.isFinish()).toBe(true)
  })

  it('has addTicks', () => {
    const spy = jest.spyOn(instance, 'addTicks')
    instance.addTicks(['1', '2', '3'], () => {})
    expect(spy).toHaveBeenCalled()
  })

  it('has getCurrentTicks', () => {
    instance.totalTicks = []
    expect(instance.getCurrentTicks()).toEqual([])

    instance.totalTicks = [
      [
        {
          tick: 1,
          tag: '22'
        }
      ],
      [
        {
          tick: 2,
          tag: '22'
        }
      ]
    ]
    instance.getCurrentTicks()

    instance.ticks = [
      [
        {
          tick: 1,
          tag: '11'
        }
      ]
    ]
    expect(instance.getCurrentTicks()).toStrictEqual([
      [
        {
          tick: 1,
          tag: '11'
        }
      ]
    ])
  })
})
