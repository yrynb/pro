import util from '@/common/util'
describe('UI.js', () => {
  it('check THING', async () => {
    window.THING = null
    const _import = await import('@/UI')
    expect(util.isType(_import.UI, 'Object')).not.toBe(true)
  })
})
