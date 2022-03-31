import StoreManager from './StoreManager'

const comp = {
  state: {
    compContext: null
  },
  get: {
    getContext: state => state.compContext
  },
  set: {
    setContext: (state, context) => (state.compContext = context),
    clearContext: state => (state.compContext = null)
  }
}

const UI = {
  state: {
    root: null,
    isDrag: null
  },
  get: {
    getRoot: state => state.root,
    getDrag: state => state.isDrag
  },
  set: {
    setRoot: (state, root) => (state.root = root),
    setDrag: (state, isDrag) => (state.isDrag = isDrag)
  }
}
const THING = {
  state: {
    THING: null
  },
  set: {
    setTHING: (state, thing) => (state.THING = thing)
  },
  get: {
    getApp: state => state.THING && state.THING.App.current
  }
}

/**
 * @desc 告警
 */
const alarm = {
  state: {
    alarmTime: {}
  },
  set: {
    setAlarmTime: (state, times) => (state.alarmTime = times)
  },
  get: {
    getAlarmTime: state => state.alarmTime
  }
}

export default new StoreManager({
  comp,
  UI,
  THING,
  alarm
})
