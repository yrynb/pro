import Drag from '@/UI/modules/Drag'

let dom
const container = {
  getDom() {
    dom = document.createElement('div')
    return dom
  },
  style: { left: 0, right: 0 }
}
const drag = new Drag(container)
it('check Drag initDrag', () => {
  const spy = jest.spyOn(drag.dom, 'addEventListener')
  drag.initDrag()

  expect(spy).toHaveBeenCalled()
})
it('check Drag removeDown', () => {
  const spy = jest.spyOn(drag.dom, 'removeEventListener')
  drag.removeDown()

  expect(spy).toHaveBeenCalled()
})
it('check Drag _down', () => {
  const spy = jest.spyOn(window, 'addEventListener')
  const spy2 = jest.spyOn(window, 'addEventListener')
  drag._down({ clientX: 0, clientY: 0, stopPropagation() {} })

  expect(spy).toHaveBeenCalled()
  expect(spy2).toHaveBeenCalled()
})
it('check Drag _move isDown true', () => {
  drag._move({ clientX: 0, clientY: 0 })
  expect(drag.parent.style.left).toBe(0)
})
it('check Drag _move isDown false', () => {
  drag.isdown = false
  drag._move({ clientX: 0, clientY: 0 })
})
it('check Drag _up', () => {
  const spy = jest.spyOn(window, 'removeEventListener')
  const spy2 = jest.spyOn(window, 'removeEventListener')
  drag._up()

  expect(spy).toHaveBeenCalled()
  expect(spy2).toHaveBeenCalled()
})
