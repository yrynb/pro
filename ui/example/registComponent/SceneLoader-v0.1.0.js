!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : ((t =
        'undefined' != typeof globalThis ? globalThis : t || self).SceneLoader =
        e())
})(this, function () {
  'use strict'
  function c(t, e, r, n, o, i, a) {
    try {
      var u = t[i](a),
        c = u.value
    } catch (t) {
      return void r(t)
    }
    u.done ? e(c) : Promise.resolve(c).then(n, o)
  }
  function n(u) {
    return function () {
      var t = this,
        a = arguments
      return new Promise(function (e, r) {
        var n = u.apply(t, a)
        function o(t) {
          c(n, e, r, o, i, 'next', t)
        }
        function i(t) {
          c(n, e, r, o, i, 'throw', t)
        }
        o(void 0)
      })
    }
  }
  function o(t, e) {
    if (!(t instanceof e))
      throw new TypeError('Cannot call a class as a function')
  }
  function i(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r]
      ;(n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        'value' in n && (n.writable = !0),
        Object.defineProperty(t, n.key, n)
    }
  }
  function a(t, e, r) {
    return e && i(t.prototype, e), r && i(t, r), t
  }
  var t,
    u =
      ((function (e) {
        e = (function (a) {
          var c,
            t = Object.prototype,
            s = t.hasOwnProperty,
            e = 'function' == typeof Symbol ? Symbol : {},
            n = e.iterator || '@@iterator',
            r = e.asyncIterator || '@@asyncIterator',
            o = e.toStringTag || '@@toStringTag'
          function i(t, e, r) {
            return (
              Object.defineProperty(t, e, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
              }),
              t[e]
            )
          }
          try {
            i({}, '')
          } catch (t) {
            i = function (t, e, r) {
              return (t[e] = r)
            }
          }
          function u(t, e, r, n) {
            var o,
              i,
              a,
              u,
              e = e && e.prototype instanceof d ? e : d,
              e = Object.create(e.prototype),
              n = new E(n || [])
            return (
              (e._invoke =
                ((o = t),
                (i = r),
                (a = n),
                (u = l),
                function (t, e) {
                  if (u === h) throw new Error('Generator is already running')
                  if (u === y) {
                    if ('throw' === t) throw e
                    return O()
                  }
                  for (a.method = t, a.arg = e; ; ) {
                    var r = a.delegate
                    if (r) {
                      var n = (function t(e, r) {
                        var n = e.iterator[r.method]
                        if (n === c) {
                          if (((r.delegate = null), 'throw' === r.method)) {
                            if (
                              e.iterator.return &&
                              ((r.method = 'return'),
                              (r.arg = c),
                              t(e, r),
                              'throw' === r.method)
                            )
                              return m
                            ;(r.method = 'throw'),
                              (r.arg = new TypeError(
                                "The iterator does not provide a 'throw' method"
                              ))
                          }
                          return m
                        }
                        var n = f(n, e.iterator, r.arg)
                        if ('throw' === n.type)
                          return (
                            (r.method = 'throw'),
                            (r.arg = n.arg),
                            (r.delegate = null),
                            m
                          )
                        n = n.arg
                        if (!n)
                          return (
                            (r.method = 'throw'),
                            (r.arg = new TypeError(
                              'iterator result is not an object'
                            )),
                            (r.delegate = null),
                            m
                          )
                        {
                          if (!n.done) return n
                          ;(r[e.resultName] = n.value),
                            (r.next = e.nextLoc),
                            'return' !== r.method &&
                              ((r.method = 'next'), (r.arg = c))
                        }
                        r.delegate = null
                        return m
                      })(r, a)
                      if (n) {
                        if (n === m) continue
                        return n
                      }
                    }
                    if ('next' === a.method) a.sent = a._sent = a.arg
                    else if ('throw' === a.method) {
                      if (u === l) throw ((u = y), a.arg)
                      a.dispatchException(a.arg)
                    } else 'return' === a.method && a.abrupt('return', a.arg)
                    u = h
                    n = f(o, i, a)
                    if ('normal' === n.type) {
                      if (((u = a.done ? y : p), n.arg !== m))
                        return { value: n.arg, done: a.done }
                    } else
                      'throw' === n.type &&
                        ((u = y), (a.method = 'throw'), (a.arg = n.arg))
                  }
                })),
              e
            )
          }
          function f(t, e, r) {
            try {
              return { type: 'normal', arg: t.call(e, r) }
            } catch (t) {
              return { type: 'throw', arg: t }
            }
          }
          a.wrap = u
          var l = 'suspendedStart',
            p = 'suspendedYield',
            h = 'executing',
            y = 'completed',
            m = {}
          function d() {}
          function v() {}
          function w() {}
          var g = {}
          g[n] = function () {
            return this
          }
          ;(e = Object.getPrototypeOf), (e = e && e(e(k([]))))
          e && e !== t && s.call(e, n) && (g = e)
          var b = (w.prototype = d.prototype = Object.create(g))
          function _(t) {
            ;['next', 'throw', 'return'].forEach(function (e) {
              i(t, e, function (t) {
                return this._invoke(e, t)
              })
            })
          }
          function L(a, u) {
            var e
            this._invoke = function (r, n) {
              function t() {
                return new u(function (t, e) {
                  !(function e(t, r, n, o) {
                    t = f(a[t], a, r)
                    if ('throw' !== t.type) {
                      var i = t.arg
                      return (r = i.value) &&
                        'object' == typeof r &&
                        s.call(r, '__await')
                        ? u.resolve(r.__await).then(
                            function (t) {
                              e('next', t, n, o)
                            },
                            function (t) {
                              e('throw', t, n, o)
                            }
                          )
                        : u.resolve(r).then(
                            function (t) {
                              ;(i.value = t), n(i)
                            },
                            function (t) {
                              return e('throw', t, n, o)
                            }
                          )
                    }
                    o(t.arg)
                  })(r, n, t, e)
                })
              }
              return (e = e ? e.then(t, t) : t())
            }
          }
          function x(t) {
            var e = { tryLoc: t[0] }
            1 in t && (e.catchLoc = t[1]),
              2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
              this.tryEntries.push(e)
          }
          function P(t) {
            var e = t.completion || {}
            ;(e.type = 'normal'), delete e.arg, (t.completion = e)
          }
          function E(t) {
            ;(this.tryEntries = [{ tryLoc: 'root' }]),
              t.forEach(x, this),
              this.reset(!0)
          }
          function k(e) {
            if (e) {
              var t = e[n]
              if (t) return t.call(e)
              if ('function' == typeof e.next) return e
              if (!isNaN(e.length)) {
                var r = -1,
                  t = function t() {
                    for (; ++r < e.length; )
                      if (s.call(e, r))
                        return (t.value = e[r]), (t.done = !1), t
                    return (t.value = c), (t.done = !0), t
                  }
                return (t.next = t)
              }
            }
            return { next: O }
          }
          function O() {
            return { value: c, done: !0 }
          }
          return (
            (((v.prototype = b.constructor = w).constructor = v).displayName =
              i(w, o, 'GeneratorFunction')),
            (a.isGeneratorFunction = function (t) {
              t = 'function' == typeof t && t.constructor
              return (
                !!t &&
                (t === v || 'GeneratorFunction' === (t.displayName || t.name))
              )
            }),
            (a.mark = function (t) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, w)
                  : ((t.__proto__ = w), i(t, o, 'GeneratorFunction')),
                (t.prototype = Object.create(b)),
                t
              )
            }),
            (a.awrap = function (t) {
              return { __await: t }
            }),
            _(L.prototype),
            (L.prototype[r] = function () {
              return this
            }),
            (a.AsyncIterator = L),
            (a.async = function (t, e, r, n, o) {
              void 0 === o && (o = Promise)
              var i = new L(u(t, e, r, n), o)
              return a.isGeneratorFunction(e)
                ? i
                : i.next().then(function (t) {
                    return t.done ? t.value : i.next()
                  })
            }),
            _(b),
            i(b, o, 'Generator'),
            (b[n] = function () {
              return this
            }),
            (b.toString = function () {
              return '[object Generator]'
            }),
            (a.keys = function (r) {
              var t,
                n = []
              for (t in r) n.push(t)
              return (
                n.reverse(),
                function t() {
                  for (; n.length; ) {
                    var e = n.pop()
                    if (e in r) return (t.value = e), (t.done = !1), t
                  }
                  return (t.done = !0), t
                }
              )
            }),
            (a.values = k),
            (E.prototype = {
              constructor: E,
              reset: function (t) {
                if (
                  ((this.prev = 0),
                  (this.next = 0),
                  (this.sent = this._sent = c),
                  (this.done = !1),
                  (this.delegate = null),
                  (this.method = 'next'),
                  (this.arg = c),
                  this.tryEntries.forEach(P),
                  !t)
                )
                  for (var e in this)
                    't' === e.charAt(0) &&
                      s.call(this, e) &&
                      !isNaN(+e.slice(1)) &&
                      (this[e] = c)
              },
              stop: function () {
                this.done = !0
                var t = this.tryEntries[0].completion
                if ('throw' === t.type) throw t.arg
                return this.rval
              },
              dispatchException: function (r) {
                if (this.done) throw r
                var n = this
                function t(t, e) {
                  return (
                    (i.type = 'throw'),
                    (i.arg = r),
                    (n.next = t),
                    e && ((n.method = 'next'), (n.arg = c)),
                    !!e
                  )
                }
                for (var e = this.tryEntries.length - 1; 0 <= e; --e) {
                  var o = this.tryEntries[e],
                    i = o.completion
                  if ('root' === o.tryLoc) return t('end')
                  if (o.tryLoc <= this.prev) {
                    var a = s.call(o, 'catchLoc'),
                      u = s.call(o, 'finallyLoc')
                    if (a && u) {
                      if (this.prev < o.catchLoc) return t(o.catchLoc, !0)
                      if (this.prev < o.finallyLoc) return t(o.finallyLoc)
                    } else if (a) {
                      if (this.prev < o.catchLoc) return t(o.catchLoc, !0)
                    } else {
                      if (!u)
                        throw new Error(
                          'try statement without catch or finally'
                        )
                      if (this.prev < o.finallyLoc) return t(o.finallyLoc)
                    }
                  }
                }
              },
              abrupt: function (t, e) {
                for (var r = this.tryEntries.length - 1; 0 <= r; --r) {
                  var n = this.tryEntries[r]
                  if (
                    n.tryLoc <= this.prev &&
                    s.call(n, 'finallyLoc') &&
                    this.prev < n.finallyLoc
                  ) {
                    var o = n
                    break
                  }
                }
                var i = (o =
                  o &&
                  ('break' === t || 'continue' === t) &&
                  o.tryLoc <= e &&
                  e <= o.finallyLoc
                    ? null
                    : o)
                  ? o.completion
                  : {}
                return (
                  (i.type = t),
                  (i.arg = e),
                  o
                    ? ((this.method = 'next'), (this.next = o.finallyLoc), m)
                    : this.complete(i)
                )
              },
              complete: function (t, e) {
                if ('throw' === t.type) throw t.arg
                return (
                  'break' === t.type || 'continue' === t.type
                    ? (this.next = t.arg)
                    : 'return' === t.type
                    ? ((this.rval = this.arg = t.arg),
                      (this.method = 'return'),
                      (this.next = 'end'))
                    : 'normal' === t.type && e && (this.next = e),
                  m
                )
              },
              finish: function (t) {
                for (var e = this.tryEntries.length - 1; 0 <= e; --e) {
                  var r = this.tryEntries[e]
                  if (r.finallyLoc === t)
                    return this.complete(r.completion, r.afterLoc), P(r), m
                }
              },
              catch: function (t) {
                for (var e = this.tryEntries.length - 1; 0 <= e; --e) {
                  var r = this.tryEntries[e]
                  if (r.tryLoc === t) {
                    var n,
                      o = r.completion
                    return 'throw' === o.type && ((n = o.arg), P(r)), n
                  }
                }
                throw new Error('illegal catch attempt')
              },
              delegateYield: function (t, e, r) {
                return (
                  (this.delegate = {
                    iterator: k(t),
                    resultName: e,
                    nextLoc: r
                  }),
                  'next' === this.method && (this.arg = c),
                  m
                )
              }
            }),
            a
          )
        })(e.exports)
        try {
          regeneratorRuntime = e
        } catch (t) {
          Function('r', 'regeneratorRuntime = r')(e)
        }
      })((t = { exports: {} })),
      t.exports)
  function r(t, e) {
    return (r =
      Object.setPrototypeOf ||
      function (t, e) {
        return (t.__proto__ = e), t
      })(t, e)
  }
  function s(t, e) {
    if ('function' != typeof e && null !== e)
      throw new TypeError('Super expression must either be null or a function')
    ;(t.prototype = Object.create(e && e.prototype, {
      constructor: { value: t, writable: !0, configurable: !0 }
    })),
      e && r(t, e)
  }
  function f(t) {
    return (f =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (t) {
            return typeof t
          }
        : function (t) {
            return t &&
              'function' == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? 'symbol'
              : typeof t
          })(t)
  }
  function l(t, e) {
    return !e || ('object' !== f(e) && 'function' != typeof e)
      ? (function (t) {
          if (void 0 === t)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            )
          return t
        })(t)
      : e
  }
  function p(t) {
    return (p = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t)
        })(t)
  }
  function h(t) {
    o(this, h), (this.param = t), (this.scene = null)
  }
  function y(r) {
    var n = (function () {
      if ('undefined' == typeof Reflect || !Reflect.construct) return !1
      if (Reflect.construct.sham) return !1
      if ('function' == typeof Proxy) return !0
      try {
        return (
          Boolean.prototype.valueOf.call(
            Reflect.construct(Boolean, [], function () {})
          ),
          !0
        )
      } catch (t) {
        return !1
      }
    })()
    return function () {
      var t,
        e = p(r)
      return l(
        this,
        n
          ? ((t = p(this).constructor), Reflect.construct(e, arguments, t))
          : e.apply(this, arguments)
      )
    }
  }
  var e = (function () {
    s(r, h)
    var t,
      e = y(r)
    function r(t) {
      return o(this, r), e.call(this, t)
    }
    return (
      a(r, [
        {
          key: 'start',
          value:
            ((t = n(
              u.mark(function t() {
                var e = this
                return u.wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        return t.abrupt(
                          'return',
                          new Promise(function (t) {
                            ;(e.scene = new THING.Map()),
                              e.scene.baseLayers.add(
                                new THING.TileLayer(e.param)
                              ),
                              e.param.complete && e.param.complete(e.scene),
                              t(e.scene)
                          })
                        )
                      case 1:
                      case 'end':
                        return t.stop()
                    }
                }, t)
              })
            )),
            function () {
              return t.apply(this, arguments)
            })
        }
      ]),
      r
    )
  })()
  function m(r) {
    var n = (function () {
      if ('undefined' == typeof Reflect || !Reflect.construct) return !1
      if (Reflect.construct.sham) return !1
      if ('function' == typeof Proxy) return !0
      try {
        return (
          Boolean.prototype.valueOf.call(
            Reflect.construct(Boolean, [], function () {})
          ),
          !0
        )
      } catch (t) {
        return !1
      }
    })()
    return function () {
      var t,
        e = p(r)
      return l(
        this,
        n
          ? ((t = p(this).constructor), Reflect.construct(e, arguments, t))
          : e.apply(this, arguments)
      )
    }
  }
  var d = (function () {
      s(r, h)
      var t,
        e = m(r)
      function r(t) {
        return o(this, r), e.call(this, t)
      }
      return (
        a(r, [
          {
            key: 'start',
            value:
              ((t = n(
                u.mark(function t() {
                  var n = this
                  return u.wrap(function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return t.abrupt(
                            'return',
                            new Promise(function (e) {
                              var r = n.param.complete
                              ;(n.param.complete = function (t) {
                                r && r(t), e(n.scene)
                              }),
                                (n.scene = new THING.Campus(n.param))
                            })
                          )
                        case 1:
                        case 'end':
                          return t.stop()
                      }
                  }, t)
                })
              )),
              function () {
                return t.apply(this, arguments)
              })
          }
        ]),
        r
      )
    })(),
    v = (function () {
      function t() {
        o(this, t)
      }
      return (
        a(t, null, [
          {
            key: 'createMapLoader',
            value: function (t) {
              return new e(t)
            }
          },
          {
            key: 'createCampusLoader',
            value: function (t) {
              return new d(t)
            }
          }
        ]),
        t
      )
    })()
  return (function () {
    function e() {
      var t = (
          0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}
        ).bPreLoadCampus,
        t = void 0 === t || t
      o(this, e),
        (this._campusParam = []),
        (this._campusPosArr = []),
        (this._mapLoader = null),
        (this._campusLoaders = []),
        (this._mapPromise = null),
        (this._mapPromiseThen = null),
        (this._bPreLoadCampus = t)
    }
    var t, r
    return (
      a(e, [
        {
          key: 'setMap',
          value: function (t) {
            ;(this._campusPosArr = t ? t.position : []),
              (this._mapLoader = v.createMapLoader(t))
          }
        },
        {
          key: 'setCampus',
          value: function () {
            var t
            this._campusParam = (t = []).concat.apply(t, arguments)
          }
        },
        {
          key: '_setCampusPos',
          value: function (t, e) {
            e = THING.EarthUtils.convertLonlatToWorld(e, 1)
            t.matrix = THING.EarthUtils.buildEastUpSouthToWorldFrame(e)
          }
        },
        {
          key: '_init',
          value:
            ((r = n(
              u.mark(function t() {
                var e = this
                return u.wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (
                            (this._campusParam.forEach(function (t) {
                              'string' != typeof t.url &&
                                ((t.id = t.url.sceneId),
                                (t.url = ''.concat(
                                  t.url.bizData.sourcePath.real_scenceUrl.split(
                                    '.tjs'
                                  )[0],
                                  '/scene.json'
                                ))),
                                e._campusLoaders.push(v.createCampusLoader(t))
                            }),
                            this._mapLoader)
                          )
                            return (t.next = 4), this._mapLoader.start()
                          t.next = 4
                          break
                        case 4:
                          return (t.next = 6), this._loadCampus()
                        case 6:
                        case 'end':
                          return t.stop()
                      }
                  },
                  t,
                  this
                )
              })
            )),
            function () {
              return r.apply(this, arguments)
            })
        },
        {
          key: '_loadCampus',
          value:
            ((t = n(
              u.mark(function t() {
                var r,
                  n,
                  e,
                  o = this
                return u.wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          ;(r = this._campusLoaders.shift()),
                            (n = []),
                            (e = u.mark(function t() {
                              var e
                              return u.wrap(function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      return (t.next = 2), r.start()
                                    case 2:
                                      ;(e = t.sent),
                                        o._campusPosArr.forEach(function (t) {
                                          e.id === t.id &&
                                            o._setCampusPos(e, [
                                              t.lonlat[0],
                                              t.lonlat[1],
                                              1
                                            ])
                                        }),
                                        n.push(e),
                                        (r = o._campusLoaders.shift())
                                    case 6:
                                    case 'end':
                                      return t.stop()
                                  }
                              }, t)
                            }))
                        case 3:
                          if (r) return t.delegateYield(e(), 't0', 5)
                          t.next = 7
                          break
                        case 5:
                          t.next = 3
                          break
                        case 7:
                          return t.abrupt('return', n)
                        case 8:
                        case 'end':
                          return t.stop()
                      }
                  },
                  t,
                  this
                )
              })
            )),
            function () {
              return t.apply(this, arguments)
            })
        },
        {
          key: '_release',
          value: function () {
            ;(this._campusParam = null),
              (this._mapLoader = null),
              (this._campusLoaders = null),
              (this._mapPromise = null),
              (this._mapPromiseThen = null),
              (this._bPreLoadCampus = null),
              (this._campusPosArr = null)
          }
        },
        {
          key: 'apply',
          value: function (t) {
            var e,
              r = this
            t.inject({
              afterInit:
                ((e = n(
                  u.mark(function t() {
                    return u.wrap(function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.next = 2), r._init()
                          case 2:
                          case 'end':
                            return t.stop()
                        }
                    }, t)
                  })
                )),
                function () {
                  return e.apply(this, arguments)
                }),
              beforeDestroy: function () {
                r._release()
              }
            })
          }
        }
      ]),
      e
    )
  })()
})
