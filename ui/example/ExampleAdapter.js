const baseAdapter = THING.UI.BaseAdapter

class ExampleAdapter extends baseAdapter {
  constructor(parent, name) {
    super(parent, name)
  }

  static factory(parent) {
    let instance = null

    instance = new ExampleAdapter(parent)

    return instance
  }

  init() {
    const dome = document.createElement('div')
    dome.innerHTML = 'Hello world'
    this.parent.getDom().appendChild(dome)
  }

  resize() {
    const size = this.parent.getSize()
    const width = size.width
    const height = size.height
    this.dom.style.width = `${width}px`
    this.dom.style.height = `${height}px`
  }

  setOption(opts) {
    super.setOption(opts)
  }

  setData(data) {
    super.setData(opts)
  }

  destroy() {
    this.instance && this.instance.destroy()
    super.destroy()
    this.parent = null
  }
}

export default ExampleAdapter
