import adapter from './UI/adapter/adapterManager'
import BaseAdapter from './UI/adapter/BaseAdapter'
import ConchAdapter from './UI/adapter/ConchAdapter'
import Container from './UI/container/Container'
import Layer from './UI/layer/Layer'
import UI from './UI/layout/Layout'
import register from './UI/registe/registe'

// 注册 layout layer container 类
register.registClazz('Layout', UI)
register.registClazz('Layer', Layer)
register.registClazz('Container', Container)
// 将 conchAdapter 注册到 adapterManager 中
adapter.regist('ConchAdapter', ConchAdapter)

UI.adapter = UI.prototype.adapter = adapter
UI.BaseAdapter = BaseAdapter
if (THING) {
  THING.UI = UI
}

export default UI
