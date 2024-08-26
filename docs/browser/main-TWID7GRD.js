var Zg = Object.defineProperty,
  Yg = Object.defineProperties;
var Qg = Object.getOwnPropertyDescriptors;
var ul = Object.getOwnPropertySymbols;
var Kg = Object.prototype.hasOwnProperty,
  Jg = Object.prototype.propertyIsEnumerable;
var ll = (t, e, r) =>
    e in t
      ? Zg(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  y = (t, e) => {
    for (var r in (e ||= {})) Kg.call(e, r) && ll(t, r, e[r]);
    if (ul) for (var r of ul(e)) Jg.call(e, r) && ll(t, r, e[r]);
    return t;
  },
  G = (t, e) => Yg(t, Qg(e));
var fi = (t, e, r) =>
  new Promise((n, i) => {
    var o = (c) => {
        try {
          a(r.next(c));
        } catch (u) {
          i(u);
        }
      },
      s = (c) => {
        try {
          a(r.throw(c));
        } catch (u) {
          i(u);
        }
      },
      a = (c) => (c.done ? n(c.value) : Promise.resolve(c.value).then(o, s));
    a((r = r.apply(t, e)).next());
  });
var dl = null;
var Ps = 1,
  fl = Symbol("SIGNAL");
function U(t) {
  let e = dl;
  return (dl = t), e;
}
var hl = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Xg(t) {
  if (!(Fs(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Ps)) {
    if (!t.producerMustRecompute(t) && !Ns(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = Ps);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Ps);
  }
}
function pl(t) {
  return t && (t.nextProducerIndex = 0), U(t);
}
function gl(t, e) {
  if (
    (U(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (Fs(t))
      for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
        Rs(t.producerNode[r], t.producerIndexOfThis[r]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function Ns(t) {
  hi(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e];
    if (n !== r.version || (Xg(r), n !== r.version)) return !0;
  }
  return !1;
}
function ml(t) {
  if ((hi(t), Fs(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      Rs(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function Rs(t, e) {
  if ((em(t), hi(t), t.liveConsumerNode.length === 1))
    for (let n = 0; n < t.producerNode.length; n++)
      Rs(t.producerNode[n], t.producerIndexOfThis[n]);
  let r = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    hi(i), (i.producerIndexOfThis[n] = e);
  }
}
function Fs(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function hi(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function em(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function tm() {
  throw new Error();
}
var nm = tm;
function vl(t) {
  nm = t;
}
function O(t) {
  return typeof t == "function";
}
function pn(t) {
  let r = t((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var pi = pn(
  (t) =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r);
    }
);
function ur(t, e) {
  if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var X = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let o of r) o.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (O(n))
        try {
          n();
        } catch (o) {
          e = o instanceof pi ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            yl(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof pi ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new pi(e);
    }
  }
  add(e) {
    var r;
    if (e && e !== this)
      if (this.closed) yl(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this;
    return r === e || (Array.isArray(r) && r.includes(e));
  }
  _addParent(e) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }
  _removeParent(e) {
    let { _parentage: r } = this;
    r === e ? (this._parentage = null) : Array.isArray(r) && ur(r, e);
  }
  remove(e) {
    let { _finalizers: r } = this;
    r && ur(r, e), e instanceof t && e._removeParent(this);
  }
};
X.EMPTY = (() => {
  let t = new X();
  return (t.closed = !0), t;
})();
var ks = X.EMPTY;
function gi(t) {
  return (
    t instanceof X ||
    (t && "closed" in t && O(t.remove) && O(t.add) && O(t.unsubscribe))
  );
}
function yl(t) {
  O(t) ? t() : t.unsubscribe();
}
var Ue = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var gn = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = gn;
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r);
  },
  clearTimeout(t) {
    let { delegate: e } = gn;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function mi(t) {
  gn.setTimeout(() => {
    let { onUnhandledError: e } = Ue;
    if (e) e(t);
    else throw t;
  });
}
function lr() {}
var Cl = Ls("C", void 0, void 0);
function _l(t) {
  return Ls("E", void 0, t);
}
function Dl(t) {
  return Ls("N", t, void 0);
}
function Ls(t, e, r) {
  return { kind: t, value: e, error: r };
}
var zt = null;
function mn(t) {
  if (Ue.useDeprecatedSynchronousErrorHandling) {
    let e = !zt;
    if ((e && (zt = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = zt;
      if (((zt = null), r)) throw n;
    }
  } else t();
}
function wl(t) {
  Ue.useDeprecatedSynchronousErrorHandling &&
    zt &&
    ((zt.errorThrown = !0), (zt.error = t));
}
var Gt = class extends X {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), gi(e) && e.add(this))
          : (this.destination = om);
    }
    static create(e, r, n) {
      return new vn(e, r, n);
    }
    next(e) {
      this.isStopped ? Vs(Dl(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? Vs(_l(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? Vs(Cl, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  rm = Function.prototype.bind;
function js(t, e) {
  return rm.call(t, e);
}
var Us = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(e);
        } catch (n) {
          vi(n);
        }
    }
    error(e) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(e);
        } catch (n) {
          vi(n);
        }
      else vi(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (r) {
          vi(r);
        }
    }
  },
  vn = class extends Gt {
    constructor(e, r, n) {
      super();
      let i;
      if (O(e) || !e)
        i = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let o;
        this && Ue.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && js(e.next, o),
              error: e.error && js(e.error, o),
              complete: e.complete && js(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new Us(i);
    }
  };
function vi(t) {
  Ue.useDeprecatedSynchronousErrorHandling ? wl(t) : mi(t);
}
function im(t) {
  throw t;
}
function Vs(t, e) {
  let { onStoppedNotification: r } = Ue;
  r && gn.setTimeout(() => r(t, e));
}
var om = { closed: !0, next: lr, error: im, complete: lr };
var yn = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function xe(t) {
  return t;
}
function Bs(...t) {
  return $s(t);
}
function $s(t) {
  return t.length === 0
    ? xe
    : t.length === 1
    ? t[0]
    : function (r) {
        return t.reduce((n, i) => i(n), r);
      };
}
var B = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new t();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, i) {
      let o = am(r) ? r : new vn(r, n, i);
      return (
        mn(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = bl(n)),
        new n((i, o) => {
          let s = new vn({
            next: (a) => {
              try {
                r(a);
              } catch (c) {
                o(c), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [yn]() {
      return this;
    }
    pipe(...r) {
      return $s(r)(this);
    }
    toPromise(r) {
      return (
        (r = bl(r)),
        new r((n, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => n(o)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function bl(t) {
  var e;
  return (e = t ?? Ue.Promise) !== null && e !== void 0 ? e : Promise;
}
function sm(t) {
  return t && O(t.next) && O(t.error) && O(t.complete);
}
function am(t) {
  return (t && t instanceof Gt) || (sm(t) && gi(t));
}
function Hs(t) {
  return O(t?.lift);
}
function V(t) {
  return (e) => {
    if (Hs(e))
      return e.lift(function (r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function j(t, e, r, n, i) {
  return new zs(t, e, r, n, i);
}
var zs = class extends Gt {
  constructor(e, r, n, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (c) {
              e.error(c);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (c) {
              e.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function Cn() {
  return V((t, e) => {
    let r = null;
    t._refCount++;
    let n = j(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null;
        return;
      }
      let i = t._connection,
        o = r;
      (r = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(n), n.closed || (r = t.connect());
  });
}
var _n = class extends B {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Hs(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new X();
      let r = this.getSubject();
      e.add(
        this.source.subscribe(
          j(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = X.EMPTY));
    }
    return e;
  }
  refCount() {
    return Cn()(this);
  }
};
var Ml = pn(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var le = (() => {
    class t extends B {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new yi(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new Ml();
      }
      next(r) {
        mn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        mn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        mn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: o } = this;
        return n || i
          ? ks
          : ((this.currentObservers = null),
            o.push(r),
            new X(() => {
              (this.currentObservers = null), ur(o, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: o } = this;
        n ? r.error(i) : o && r.complete();
      }
      asObservable() {
        let r = new B();
        return (r.source = this), r;
      }
    }
    return (t.create = (e, r) => new yi(e, r)), t;
  })(),
  yi = class extends le {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r);
    }
    next(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    error(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    complete() {
      var e, r;
      (r =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        r === void 0 ||
        r.call(e);
    }
    _subscribe(e) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(e)) !== null && n !== void 0
        ? n
        : ks;
    }
  };
var se = class extends le {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let r = super._subscribe(e);
    return !r.closed && e.next(this._value), r;
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this;
    if (e) throw r;
    return this._throwIfClosed(), n;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var Se = new B((t) => t.complete());
function El(t) {
  return t && O(t.schedule);
}
function Il(t) {
  return t[t.length - 1];
}
function Ci(t) {
  return O(Il(t)) ? t.pop() : void 0;
}
function wt(t) {
  return El(Il(t)) ? t.pop() : void 0;
}
function Sl(t, e, r, n) {
  function i(o) {
    return o instanceof r
      ? o
      : new r(function (s) {
          s(o);
        });
  }
  return new (r || (r = Promise))(function (o, s) {
    function a(l) {
      try {
        u(n.next(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      try {
        u(n.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      l.done ? o(l.value) : i(l.value).then(a, c);
    }
    u((n = n.apply(t, e || [])).next());
  });
}
function xl(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Wt(t) {
  return this instanceof Wt ? ((this.v = t), this) : new Wt(t);
}
function Tl(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    s("next"),
    s("throw"),
    s("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(f) {
    n[f] &&
      (i[f] = function (g) {
        return new Promise(function (C, A) {
          o.push([f, g, C, A]) > 1 || a(f, g);
        });
      });
  }
  function a(f, g) {
    try {
      c(n[f](g));
    } catch (C) {
      d(o[0][3], C);
    }
  }
  function c(f) {
    f.value instanceof Wt
      ? Promise.resolve(f.value.v).then(u, l)
      : d(o[0][2], f);
  }
  function u(f) {
    a("next", f);
  }
  function l(f) {
    a("throw", f);
  }
  function d(f, g) {
    f(g), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function Al(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    r;
  return e
    ? e.call(t)
    : ((t = typeof xl == "function" ? xl(t) : t[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(o) {
    r[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = t[o](s)), i(a, c, s.done, s.value);
        });
      };
  }
  function i(o, s, a, c) {
    Promise.resolve(c).then(function (u) {
      o({ value: u, done: a });
    }, s);
  }
}
var _i = (t) => t && typeof t.length == "number" && typeof t != "function";
function Di(t) {
  return O(t?.then);
}
function wi(t) {
  return O(t[yn]);
}
function bi(t) {
  return Symbol.asyncIterator && O(t?.[Symbol.asyncIterator]);
}
function Mi(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function cm() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Ei = cm();
function Ii(t) {
  return O(t?.[Ei]);
}
function xi(t) {
  return Tl(this, arguments, function* () {
    let r = t.getReader();
    try {
      for (;;) {
        let { value: n, done: i } = yield Wt(r.read());
        if (i) return yield Wt(void 0);
        yield yield Wt(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function Si(t) {
  return O(t?.getReader);
}
function K(t) {
  if (t instanceof B) return t;
  if (t != null) {
    if (wi(t)) return um(t);
    if (_i(t)) return lm(t);
    if (Di(t)) return dm(t);
    if (bi(t)) return Ol(t);
    if (Ii(t)) return fm(t);
    if (Si(t)) return hm(t);
  }
  throw Mi(t);
}
function um(t) {
  return new B((e) => {
    let r = t[yn]();
    if (O(r.subscribe)) return r.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function lm(t) {
  return new B((e) => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
    e.complete();
  });
}
function dm(t) {
  return new B((e) => {
    t.then(
      (r) => {
        e.closed || (e.next(r), e.complete());
      },
      (r) => e.error(r)
    ).then(null, mi);
  });
}
function fm(t) {
  return new B((e) => {
    for (let r of t) if ((e.next(r), e.closed)) return;
    e.complete();
  });
}
function Ol(t) {
  return new B((e) => {
    pm(t, e).catch((r) => e.error(r));
  });
}
function hm(t) {
  return Ol(xi(t));
}
function pm(t, e) {
  var r, n, i, o;
  return Sl(this, void 0, void 0, function* () {
    try {
      for (r = Al(t); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        n && !n.done && (o = r.return) && (yield o.call(r));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function Ce(t, e, r, n = 0, i = !1) {
  let o = e.schedule(function () {
    r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((t.add(o), !i)) return o;
}
function Ti(t, e = 0) {
  return V((r, n) => {
    r.subscribe(
      j(
        n,
        (i) => Ce(n, t, () => n.next(i), e),
        () => Ce(n, t, () => n.complete(), e),
        (i) => Ce(n, t, () => n.error(i), e)
      )
    );
  });
}
function Ai(t, e = 0) {
  return V((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e));
  });
}
function Pl(t, e) {
  return K(t).pipe(Ai(e), Ti(e));
}
function Nl(t, e) {
  return K(t).pipe(Ai(e), Ti(e));
}
function Rl(t, e) {
  return new B((r) => {
    let n = 0;
    return e.schedule(function () {
      n === t.length
        ? r.complete()
        : (r.next(t[n++]), r.closed || this.schedule());
    });
  });
}
function Fl(t, e) {
  return new B((r) => {
    let n;
    return (
      Ce(r, e, () => {
        (n = t[Ei]()),
          Ce(
            r,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              o ? r.complete() : r.next(i);
            },
            0,
            !0
          );
      }),
      () => O(n?.return) && n.return()
    );
  });
}
function Oi(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new B((r) => {
    Ce(r, e, () => {
      let n = t[Symbol.asyncIterator]();
      Ce(
        r,
        e,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function kl(t, e) {
  return Oi(xi(t), e);
}
function Ll(t, e) {
  if (t != null) {
    if (wi(t)) return Pl(t, e);
    if (_i(t)) return Rl(t, e);
    if (Di(t)) return Nl(t, e);
    if (bi(t)) return Oi(t, e);
    if (Ii(t)) return Fl(t, e);
    if (Si(t)) return kl(t, e);
  }
  throw Mi(t);
}
function Z(t, e) {
  return e ? Ll(t, e) : K(t);
}
function S(...t) {
  let e = wt(t);
  return Z(t, e);
}
function Dn(t, e) {
  let r = O(t) ? t : () => t,
    n = (i) => i.error(r());
  return new B(e ? (i) => e.schedule(n, 0, i) : n);
}
function Gs(t) {
  return !!t && (t instanceof B || (O(t.lift) && O(t.subscribe)));
}
var lt = pn(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function P(t, e) {
  return V((r, n) => {
    let i = 0;
    r.subscribe(
      j(n, (o) => {
        n.next(t.call(e, o, i++));
      })
    );
  });
}
var { isArray: gm } = Array;
function mm(t, e) {
  return gm(e) ? t(...e) : t(e);
}
function Pi(t) {
  return P((e) => mm(t, e));
}
var { isArray: vm } = Array,
  { getPrototypeOf: ym, prototype: Cm, keys: _m } = Object;
function Ni(t) {
  if (t.length === 1) {
    let e = t[0];
    if (vm(e)) return { args: e, keys: null };
    if (Dm(e)) {
      let r = _m(e);
      return { args: r.map((n) => e[n]), keys: r };
    }
  }
  return { args: t, keys: null };
}
function Dm(t) {
  return t && typeof t == "object" && ym(t) === Cm;
}
function Ri(t, e) {
  return t.reduce((r, n, i) => ((r[n] = e[i]), r), {});
}
function dr(...t) {
  let e = wt(t),
    r = Ci(t),
    { args: n, keys: i } = Ni(t);
  if (n.length === 0) return Z([], e);
  let o = new B(wm(n, e, i ? (s) => Ri(i, s) : xe));
  return r ? o.pipe(Pi(r)) : o;
}
function wm(t, e, r = xe) {
  return (n) => {
    jl(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let c = 0; c < i; c++)
          jl(
            e,
            () => {
              let u = Z(t[c], e),
                l = !1;
              u.subscribe(
                j(
                  n,
                  (d) => {
                    (o[c] = d), l || ((l = !0), a--), a || n.next(r(o.slice()));
                  },
                  () => {
                    --s || n.complete();
                  }
                )
              );
            },
            n
          );
      },
      n
    );
  };
}
function jl(t, e, r) {
  t ? Ce(r, t, e) : e();
}
function Vl(t, e, r, n, i, o, s, a) {
  let c = [],
    u = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !c.length && !u && e.complete();
    },
    g = (A) => (u < n ? C(A) : c.push(A)),
    C = (A) => {
      o && e.next(A), u++;
      let I = !1;
      K(r(A, l++)).subscribe(
        j(
          e,
          (_) => {
            i?.(_), o ? g(_) : e.next(_);
          },
          () => {
            I = !0;
          },
          void 0,
          () => {
            if (I)
              try {
                for (u--; c.length && u < n; ) {
                  let _ = c.shift();
                  s ? Ce(e, s, () => C(_)) : C(_);
                }
                f();
              } catch (_) {
                e.error(_);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      j(e, g, () => {
        (d = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function J(t, e, r = 1 / 0) {
  return O(e)
    ? J((n, i) => P((o, s) => e(n, o, i, s))(K(t(n, i))), r)
    : (typeof e == "number" && (r = e), V((n, i) => Vl(n, i, t, r)));
}
function wn(t = 1 / 0) {
  return J(xe, t);
}
function Ul() {
  return wn(1);
}
function bn(...t) {
  return Ul()(Z(t, wt(t)));
}
function Fi(t) {
  return new B((e) => {
    K(t()).subscribe(e);
  });
}
function Ws(...t) {
  let e = Ci(t),
    { args: r, keys: n } = Ni(t),
    i = new B((o) => {
      let { length: s } = r;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        u = s;
      for (let l = 0; l < s; l++) {
        let d = !1;
        K(r[l]).subscribe(
          j(
            o,
            (f) => {
              d || ((d = !0), u--), (a[l] = f);
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (u || o.next(n ? Ri(n, a) : a), o.complete());
            }
          )
        );
      }
    });
  return e ? i.pipe(Pi(e)) : i;
}
function _e(t, e) {
  return V((r, n) => {
    let i = 0;
    r.subscribe(j(n, (o) => t.call(e, o, i++) && n.next(o)));
  });
}
function bt(t) {
  return V((e, r) => {
    let n = null,
      i = !1,
      o;
    (n = e.subscribe(
      j(r, void 0, void 0, (s) => {
        (o = K(t(s, bt(t)(e)))),
          n ? (n.unsubscribe(), (n = null), o.subscribe(r)) : (i = !0);
      })
    )),
      i && (n.unsubscribe(), (n = null), o.subscribe(r));
  });
}
function Bl(t, e, r, n, i) {
  return (o, s) => {
    let a = r,
      c = e,
      u = 0;
    o.subscribe(
      j(
        s,
        (l) => {
          let d = u++;
          (c = a ? t(c, l, d) : ((a = !0), l)), n && s.next(c);
        },
        i &&
          (() => {
            a && s.next(c), s.complete();
          })
      )
    );
  };
}
function dt(t, e) {
  return O(e) ? J(t, e, 1) : J(t, 1);
}
function Mt(t) {
  return V((e, r) => {
    let n = !1;
    e.subscribe(
      j(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => {
          n || r.next(t), r.complete();
        }
      )
    );
  });
}
function ft(t) {
  return t <= 0
    ? () => Se
    : V((e, r) => {
        let n = 0;
        e.subscribe(
          j(r, (i) => {
            ++n <= t && (r.next(i), t <= n && r.complete());
          })
        );
      });
}
function qs(t) {
  return P(() => t);
}
function ki(t = bm) {
  return V((e, r) => {
    let n = !1;
    e.subscribe(
      j(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => (n ? r.complete() : r.error(t()))
      )
    );
  });
}
function bm() {
  return new lt();
}
function Et(t) {
  return V((e, r) => {
    try {
      e.subscribe(r);
    } finally {
      r.add(t);
    }
  });
}
function Ke(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? _e((i, o) => t(i, o, n)) : xe,
      ft(1),
      r ? Mt(e) : ki(() => new lt())
    );
}
function Mn(t) {
  return t <= 0
    ? () => Se
    : V((e, r) => {
        let n = [];
        e.subscribe(
          j(
            r,
            (i) => {
              n.push(i), t < n.length && n.shift();
            },
            () => {
              for (let i of n) r.next(i);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            }
          )
        );
      });
}
function Zs(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? _e((i, o) => t(i, o, n)) : xe,
      Mn(1),
      r ? Mt(e) : ki(() => new lt())
    );
}
function Ys(t, e) {
  return V(Bl(t, e, arguments.length >= 2, !0));
}
function Qs(...t) {
  let e = wt(t);
  return V((r, n) => {
    (e ? bn(t, r, e) : bn(t, r)).subscribe(n);
  });
}
function De(t, e) {
  return V((r, n) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && n.complete();
    r.subscribe(
      j(
        n,
        (c) => {
          i?.unsubscribe();
          let u = 0,
            l = o++;
          K(t(c, l)).subscribe(
            (i = j(
              n,
              (d) => n.next(e ? e(c, d, l, u++) : d),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function Ks(t) {
  return V((e, r) => {
    K(t).subscribe(j(r, () => r.complete(), lr)), !r.closed && e.subscribe(r);
  });
}
function ne(t, e, r) {
  let n = O(t) || e || r ? { next: t, error: e, complete: r } : t;
  return n
    ? V((i, o) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        i.subscribe(
          j(
            o,
            (c) => {
              var u;
              (u = n.next) === null || u === void 0 || u.call(n, c), o.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = n.complete) === null || c === void 0 || c.call(n),
                o.complete();
            },
            (c) => {
              var u;
              (a = !1),
                (u = n.error) === null || u === void 0 || u.call(n, c),
                o.error(c);
            },
            () => {
              var c, u;
              a && ((c = n.unsubscribe) === null || c === void 0 || c.call(n)),
                (u = n.finalize) === null || u === void 0 || u.call(n);
            }
          )
        );
      })
    : xe;
}
var Sd = "https://g.co/ng/security#xss",
  b = class extends Error {
    constructor(e, r) {
      super(mo(e, r)), (this.code = e);
    }
  };
function mo(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
function Er(t) {
  return { toString: t }.toString();
}
var Li = "__parameters__";
function Mm(t) {
  return function (...r) {
    if (t) {
      let n = t(...r);
      for (let i in n) this[i] = n[i];
    }
  };
}
function Td(t, e, r) {
  return Er(() => {
    let n = Mm(e);
    function i(...o) {
      if (this instanceof i) return n.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(c, u, l) {
        let d = c.hasOwnProperty(Li)
          ? c[Li]
          : Object.defineProperty(c, Li, { value: [] })[Li];
        for (; d.length <= l; ) d.push(null);
        return (d[l] = d[l] || []).push(s), c;
      }
    }
    return (
      r && (i.prototype = Object.create(r.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
var qt = globalThis;
function H(t) {
  for (let e in t) if (t[e] === H) return e;
  throw Error("Could not find renamed property on target object.");
}
function Em(t, e) {
  for (let r in e) e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r]);
}
function ve(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(ve).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let r = e.indexOf(`
`);
  return r === -1 ? e : e.substring(0, r);
}
function $l(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var Im = H({ __forward_ref__: H });
function nn(t) {
  return (
    (t.__forward_ref__ = nn),
    (t.toString = function () {
      return ve(this());
    }),
    t
  );
}
function ge(t) {
  return Ad(t) ? t() : t;
}
function Ad(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(Im) && t.__forward_ref__ === nn
  );
}
function w(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function rt(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function vo(t) {
  return Hl(t, Pd) || Hl(t, Nd);
}
function Od(t) {
  return vo(t) !== null;
}
function Hl(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function xm(t) {
  let e = t && (t[Pd] || t[Nd]);
  return e || null;
}
function zl(t) {
  return t && (t.hasOwnProperty(Gl) || t.hasOwnProperty(Sm)) ? t[Gl] : null;
}
var Pd = H({ ɵprov: H }),
  Gl = H({ ɵinj: H }),
  Nd = H({ ngInjectableDef: H }),
  Sm = H({ ngInjectorDef: H }),
  D = class {
    constructor(e, r) {
      (this._desc = e),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof r == "number"
          ? (this.__NG_ELEMENT_ID__ = r)
          : r !== void 0 &&
            (this.ɵprov = w({
              token: this,
              providedIn: r.providedIn || "root",
              factory: r.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Rd(t) {
  return t && !!t.ɵproviders;
}
var Tm = H({ ɵcmp: H }),
  Am = H({ ɵdir: H }),
  Om = H({ ɵpipe: H }),
  Pm = H({ ɵmod: H }),
  Wi = H({ ɵfac: H }),
  fr = H({ __NG_ELEMENT_ID__: H }),
  Wl = H({ __NG_ENV_ID__: H });
function yo(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function Nm(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : yo(t);
}
function Rm(t, e) {
  let r = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new b(-200, t);
}
function ic(t, e) {
  throw new b(-201, !1);
}
var R = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(R || {}),
  pa;
function Fd() {
  return pa;
}
function ke(t) {
  let e = pa;
  return (pa = t), e;
}
function kd(t, e, r) {
  let n = vo(t);
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & R.Optional) return null;
  if (e !== void 0) return e;
  ic(t, "Injector");
}
var Fm = {},
  hr = Fm,
  ga = "__NG_DI_FLAG__",
  qi = "ngTempTokenPath",
  km = "ngTokenPath",
  Lm = /\n/gm,
  jm = "\u0275",
  ql = "__source",
  Tn;
function Vm() {
  return Tn;
}
function It(t) {
  let e = Tn;
  return (Tn = t), e;
}
function Um(t, e = R.Default) {
  if (Tn === void 0) throw new b(-203, !1);
  return Tn === null
    ? kd(t, void 0, e)
    : Tn.get(t, e & R.Optional ? null : void 0, e);
}
function x(t, e = R.Default) {
  return (Fd() || Um)(ge(t), e);
}
function v(t, e = R.Default) {
  return x(t, Co(e));
}
function Co(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function ma(t) {
  let e = [];
  for (let r = 0; r < t.length; r++) {
    let n = ge(t[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new b(900, !1);
      let i,
        o = R.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          c = Bm(a);
        typeof c == "number" ? (c === -1 ? (i = a.token) : (o |= c)) : (i = a);
      }
      e.push(x(i, o));
    } else e.push(x(n));
  }
  return e;
}
function Ld(t, e) {
  return (t[ga] = e), (t.prototype[ga] = e), t;
}
function Bm(t) {
  return t[ga];
}
function $m(t, e, r, n) {
  let i = t[qi];
  throw (
    (e[ql] && i.unshift(e[ql]),
    (t.message = Hm(
      `
` + t.message,
      i,
      r,
      n
    )),
    (t[km] = i),
    (t[qi] = null),
    t)
  );
}
function Hm(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == jm
      ? t.slice(2)
      : t;
  let i = ve(e);
  if (Array.isArray(e)) i = e.map(ve).join(" -> ");
  else if (typeof e == "object") {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : ve(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${r}${n ? "(" + n + ")" : ""}[${i}]: ${t.replace(
    Lm,
    `
  `
  )}`;
}
var _o = Ld(Td("Optional"), 8);
var oc = Ld(Td("SkipSelf"), 4);
function On(t, e) {
  let r = t.hasOwnProperty(Wi);
  return r ? t[Wi] : null;
}
function sc(t, e) {
  t.forEach((r) => (Array.isArray(r) ? sc(r, e) : e(r)));
}
function jd(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function Zi(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function zm(t, e, r, n) {
  let i = t.length;
  if (i == e) t.push(r, n);
  else if (i === 1) t.push(n, t[0]), (t[0] = r);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = r), (t[e + 1] = n);
  }
}
function Gm(t, e, r) {
  let n = Ir(t, e);
  return n >= 0 ? (t[n | 1] = r) : ((n = ~n), zm(t, n, e, r)), n;
}
function Js(t, e) {
  let r = Ir(t, e);
  if (r >= 0) return t[r | 1];
}
function Ir(t, e) {
  return Wm(t, e, 1);
}
function Wm(t, e, r) {
  let n = 0,
    i = t.length >> r;
  for (; i !== n; ) {
    let o = n + ((i - n) >> 1),
      s = t[o << r];
    if (e === s) return o << r;
    s > e ? (i = o) : (n = o + 1);
  }
  return ~(i << r);
}
var Pn = {},
  Le = [],
  Nn = new D(""),
  Vd = new D("", -1),
  Ud = new D(""),
  Yi = class {
    get(e, r = hr) {
      if (r === hr) {
        let n = new Error(`NullInjectorError: No provider for ${ve(e)}!`);
        throw ((n.name = "NullInjectorError"), n);
      }
      return r;
    }
  },
  Bd = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(Bd || {}),
  et = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(et || {}),
  de = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(de || {});
function qm(t, e, r) {
  let n = t.length;
  for (;;) {
    let i = t.indexOf(e, r);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === n || t.charCodeAt(i + o) <= 32) return i;
    }
    r = i + 1;
  }
}
function va(t, e, r) {
  let n = 0;
  for (; n < r.length; ) {
    let i = r[n];
    if (typeof i == "number") {
      if (i !== 0) break;
      n++;
      let o = r[n++],
        s = r[n++],
        a = r[n++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = r[++n];
      Zm(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), n++;
    }
  }
  return n;
}
function $d(t) {
  return t === 3 || t === 4 || t === 6;
}
function Zm(t) {
  return t.charCodeAt(0) === 64;
}
function pr(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let r = -1;
      for (let n = 0; n < e.length; n++) {
        let i = e[n];
        typeof i == "number"
          ? (r = i)
          : r === 0 ||
            (r === -1 || r === 2
              ? Zl(t, r, i, null, e[++n])
              : Zl(t, r, i, null, null));
      }
    }
  return t;
}
function Zl(t, e, r, n, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == "number") break;
    if (a === r) {
      if (n === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (n === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, n !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, r),
    n !== null && t.splice(o++, 0, n),
    i !== null && t.splice(o++, 0, i);
}
var Hd = "ng-template";
function Ym(t, e, r, n) {
  let i = 0;
  if (n) {
    for (; i < e.length && typeof e[i] == "string"; i += 2)
      if (e[i] === "class" && qm(e[i + 1].toLowerCase(), r, 0) !== -1)
        return !0;
  } else if (ac(t)) return !1;
  if (((i = e.indexOf(1, i)), i > -1)) {
    let o;
    for (; ++i < e.length && typeof (o = e[i]) == "string"; )
      if (o.toLowerCase() === r) return !0;
  }
  return !1;
}
function ac(t) {
  return t.type === 4 && t.value !== Hd;
}
function Qm(t, e, r) {
  let n = t.type === 4 && !r ? Hd : t.value;
  return e === n;
}
function Km(t, e, r) {
  let n = 4,
    i = t.attrs,
    o = i !== null ? ev(i) : 0,
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == "number") {
      if (!s && !Be(n) && !Be(c)) return !1;
      if (s && Be(c)) continue;
      (s = !1), (n = c | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (c !== "" && !Qm(t, c, r)) || (c === "" && e.length === 1))
        ) {
          if (Be(n)) return !1;
          s = !0;
        }
      } else if (n & 8) {
        if (i === null || !Ym(t, i, c, r)) {
          if (Be(n)) return !1;
          s = !0;
        }
      } else {
        let u = e[++a],
          l = Jm(c, i, ac(t), r);
        if (l === -1) {
          if (Be(n)) return !1;
          s = !0;
          continue;
        }
        if (u !== "") {
          let d;
          if (
            (l > o ? (d = "") : (d = i[l + 1].toLowerCase()), n & 2 && u !== d)
          ) {
            if (Be(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return Be(n) || s;
}
function Be(t) {
  return (t & 1) === 0;
}
function Jm(t, e, r, n) {
  if (e === null) return -1;
  let i = 0;
  if (n || !r) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return tv(e, t);
}
function Xm(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if (Km(t, e[n], r)) return !0;
  return !1;
}
function ev(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e];
    if ($d(r)) return e;
  }
  return t.length;
}
function tv(t, e) {
  let r = t.indexOf(4);
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r];
      if (typeof n == "number") return -1;
      if (n === e) return r;
      r++;
    }
  return -1;
}
function Yl(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function nv(t) {
  let e = t[0],
    r = 1,
    n = 2,
    i = "",
    o = !1;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      if (n & 2) {
        let a = t[++r];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else n & 8 ? (i += "." + s) : n & 4 && (i += " " + s);
    else
      i !== "" && !Be(s) && ((e += Yl(o, i)), (i = "")),
        (n = s),
        (o = o || !Be(n));
    r++;
  }
  return i !== "" && (e += Yl(o, i)), e;
}
function rv(t) {
  return t.map(nv).join(",");
}
function iv(t) {
  let e = [],
    r = [],
    n = 1,
    i = 2;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++n]) : i === 8 && r.push(o);
    else {
      if (!Be(i)) break;
      i = o;
    }
    n++;
  }
  return { attrs: e, classes: r };
}
function W(t) {
  return Er(() => {
    let e = Zd(t),
      r = G(y({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Bd.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || et.Emulated,
        styles: t.styles || Le,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    Yd(r);
    let n = t.dependencies;
    return (
      (r.directiveDefs = Kl(n, !1)), (r.pipeDefs = Kl(n, !0)), (r.id = av(r)), r
    );
  });
}
function ov(t) {
  return St(t) || zd(t);
}
function sv(t) {
  return t !== null;
}
function it(t) {
  return Er(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Le,
    declarations: t.declarations || Le,
    imports: t.imports || Le,
    exports: t.exports || Le,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function Ql(t, e) {
  if (t == null) return Pn;
  let r = {};
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let i = t[n],
        o,
        s,
        a = de.None;
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        e ? ((r[o] = a !== de.None ? [n, a] : n), (e[o] = s)) : (r[o] = n);
    }
  return r;
}
function ae(t) {
  return Er(() => {
    let e = Zd(t);
    return Yd(e), e;
  });
}
function St(t) {
  return t[Tm] || null;
}
function zd(t) {
  return t[Am] || null;
}
function Gd(t) {
  return t[Om] || null;
}
function Wd(t) {
  let e = St(t) || zd(t) || Gd(t);
  return e !== null ? e.standalone : !1;
}
function qd(t, e) {
  let r = t[Pm] || null;
  if (!r && e === !0)
    throw new Error(`Type ${ve(t)} does not have '\u0275mod' property.`);
  return r;
}
function Zd(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || Pn,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || Le,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Ql(t.inputs, e),
    outputs: Ql(t.outputs),
    debugInfo: null,
  };
}
function Yd(t) {
  t.features?.forEach((e) => e(t));
}
function Kl(t, e) {
  if (!t) return null;
  let r = e ? Gd : ov;
  return () => (typeof t == "function" ? t() : t).map((n) => r(n)).filter(sv);
}
function av(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of r) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), "c" + e;
}
function Bn(t) {
  return { ɵproviders: t };
}
function cv(...t) {
  return { ɵproviders: Qd(!0, t), ɵfromNgModule: !0 };
}
function Qd(t, ...e) {
  let r = [],
    n = new Set(),
    i,
    o = (s) => {
      r.push(s);
    };
  return (
    sc(e, (s) => {
      let a = s;
      ya(a, o, [], n) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && Kd(i, o),
    r
  );
}
function Kd(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: i } = t[r];
    cc(i, (o) => {
      e(o, n);
    });
  }
}
function ya(t, e, r, n) {
  if (((t = ge(t)), !t)) return !1;
  let i = null,
    o = zl(t),
    s = !o && St(t);
  if (!o && !s) {
    let c = t.ngModule;
    if (((o = zl(c)), o)) i = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = n.has(i);
  if (s) {
    if (a) return !1;
    if ((n.add(i), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let u of c) ya(u, e, r, n);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      n.add(i);
      let u;
      try {
        sc(o.imports, (l) => {
          ya(l, e, r, n) && ((u ||= []), u.push(l));
        });
      } finally {
      }
      u !== void 0 && Kd(u, e);
    }
    if (!a) {
      let u = On(i) || (() => new i());
      e({ provide: i, useFactory: u, deps: Le }, i),
        e({ provide: Ud, useValue: i, multi: !0 }, i),
        e({ provide: Nn, useValue: () => x(i), multi: !0 }, i);
    }
    let c = o.providers;
    if (c != null && !a) {
      let u = t;
      cc(c, (l) => {
        e(l, u);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function cc(t, e) {
  for (let r of t)
    Rd(r) && (r = r.ɵproviders), Array.isArray(r) ? cc(r, e) : e(r);
}
var uv = H({ provide: String, useValue: H });
function Jd(t) {
  return t !== null && typeof t == "object" && uv in t;
}
function lv(t) {
  return !!(t && t.useExisting);
}
function dv(t) {
  return !!(t && t.useFactory);
}
function Rn(t) {
  return typeof t == "function";
}
function fv(t) {
  return !!t.useClass;
}
var Do = new D(""),
  Bi = {},
  hv = {},
  Xs;
function uc() {
  return Xs === void 0 && (Xs = new Yi()), Xs;
}
var fe = class {},
  gr = class extends fe {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        _a(e, (s) => this.processProvider(s)),
        this.records.set(Vd, En(void 0, this)),
        i.has("environment") && this.records.set(fe, En(void 0, this));
      let o = this.records.get(Do);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(Ud, Le, R.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let e = U(null);
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy();
        let r = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let n of r) n();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          U(e);
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let r = It(this),
        n = ke(void 0),
        i;
      try {
        return e();
      } finally {
        It(r), ke(n);
      }
    }
    get(e, r = hr, n = R.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Wl))) return e[Wl](this);
      n = Co(n);
      let i,
        o = It(this),
        s = ke(void 0);
      try {
        if (!(n & R.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let u = yv(e) && vo(e);
            u && this.injectableDefInScope(u)
              ? (c = En(Ca(e), Bi))
              : (c = null),
              this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = n & R.Self ? uc() : this.parent;
        return (r = n & R.Optional && r === hr ? null : r), a.get(e, r);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[qi] = a[qi] || []).unshift(ve(e)), o)) throw a;
          return $m(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        ke(s), It(o);
      }
    }
    resolveInjectorInitializers() {
      let e = U(null),
        r = It(this),
        n = ke(void 0),
        i;
      try {
        let o = this.get(Nn, Le, R.Self);
        for (let s of o) s();
      } finally {
        It(r), ke(n), U(e);
      }
    }
    toString() {
      let e = [],
        r = this.records;
      for (let n of r.keys()) e.push(ve(n));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new b(205, !1);
    }
    processProvider(e) {
      e = ge(e);
      let r = Rn(e) ? e : ge(e && e.provide),
        n = gv(e);
      if (!Rn(e) && e.multi === !0) {
        let i = this.records.get(r);
        i ||
          ((i = En(void 0, Bi, !0)),
          (i.factory = () => ma(i.multi)),
          this.records.set(r, i)),
          (r = e),
          i.multi.push(e);
      }
      this.records.set(r, n);
    }
    hydrate(e, r) {
      let n = U(null);
      try {
        return (
          r.value === Bi && ((r.value = hv), (r.value = r.factory())),
          typeof r.value == "object" &&
            r.value &&
            vv(r.value) &&
            this._ngOnDestroyHooks.add(r.value),
          r.value
        );
      } finally {
        U(n);
      }
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let r = ge(e.providedIn);
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function Ca(t) {
  let e = vo(t),
    r = e !== null ? e.factory : On(t);
  if (r !== null) return r;
  if (t instanceof D) throw new b(204, !1);
  if (t instanceof Function) return pv(t);
  throw new b(204, !1);
}
function pv(t) {
  if (t.length > 0) throw new b(204, !1);
  let r = xm(t);
  return r !== null ? () => r.factory(t) : () => new t();
}
function gv(t) {
  if (Jd(t)) return En(void 0, t.useValue);
  {
    let e = Xd(t);
    return En(e, Bi);
  }
}
function Xd(t, e, r) {
  let n;
  if (Rn(t)) {
    let i = ge(t);
    return On(i) || Ca(i);
  } else if (Jd(t)) n = () => ge(t.useValue);
  else if (dv(t)) n = () => t.useFactory(...ma(t.deps || []));
  else if (lv(t)) n = () => x(ge(t.useExisting));
  else {
    let i = ge(t && (t.useClass || t.provide));
    if (mv(t)) n = () => new i(...ma(t.deps));
    else return On(i) || Ca(i);
  }
  return n;
}
function En(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 };
}
function mv(t) {
  return !!t.deps;
}
function vv(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function yv(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof D);
}
function _a(t, e) {
  for (let r of t)
    Array.isArray(r) ? _a(r, e) : r && Rd(r) ? _a(r.ɵproviders, e) : e(r);
}
function qe(t, e) {
  t instanceof gr && t.assertNotDestroyed();
  let r,
    n = It(t),
    i = ke(void 0);
  try {
    return e();
  } finally {
    It(n), ke(i);
  }
}
function ef() {
  return Fd() !== void 0 || Vm() != null;
}
function Cv(t) {
  if (!ef()) throw new b(-203, !1);
}
function _v(t) {
  return typeof t == "function";
}
var pt = 0,
  F = 1,
  T = 2,
  he = 3,
  $e = 4,
  Ze = 5,
  mr = 6,
  vr = 7,
  we = 8,
  Fn = 9,
  He = 10,
  ee = 11,
  yr = 12,
  Jl = 13,
  $n = 14,
  ze = 15,
  wo = 16,
  In = 17,
  kn = 18,
  bo = 19,
  tf = 20,
  xt = 21,
  ea = 22,
  Qt = 23,
  Ge = 25,
  nf = 1;
var Kt = 7,
  Qi = 8,
  Ki = 9,
  ye = 10,
  lc = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(lc || {});
function Zt(t) {
  return Array.isArray(t) && typeof t[nf] == "object";
}
function gt(t) {
  return Array.isArray(t) && t[nf] === !0;
}
function dc(t) {
  return (t.flags & 4) !== 0;
}
function Mo(t) {
  return t.componentOffset > -1;
}
function Eo(t) {
  return (t.flags & 1) === 1;
}
function Tt(t) {
  return !!t.template;
}
function Dv(t) {
  return (t[T] & 512) !== 0;
}
var Da = class {
  constructor(e, r, n) {
    (this.previousValue = e), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function rf(t, e, r, n) {
  e !== null ? e.applyValueToInputSignal(e, n) : (t[r] = n);
}
function rn() {
  return of;
}
function of(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = bv), wv;
}
rn.ngInherit = !0;
function wv() {
  let t = af(this),
    e = t?.current;
  if (e) {
    let r = t.previous;
    if (r === Pn) t.previous = e;
    else for (let n in e) r[n] = e[n];
    (t.current = null), this.ngOnChanges(e);
  }
}
function bv(t, e, r, n, i) {
  let o = this.declaredInputs[n],
    s = af(t) || Mv(t, { previous: Pn, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    u = c[o];
  (a[o] = new Da(u && u.currentValue, r, c === Pn)), rf(t, e, i, r);
}
var sf = "__ngSimpleChanges__";
function af(t) {
  return t[sf] || null;
}
function Mv(t, e) {
  return (t[sf] = e);
}
var Xl = null;
var Je = function (t, e, r) {
    Xl?.(t, e, r);
  },
  cf = "svg",
  Ev = "math",
  Iv = !1;
function xv() {
  return Iv;
}
function tt(t) {
  for (; Array.isArray(t); ) t = t[pt];
  return t;
}
function uf(t, e) {
  return tt(e[t]);
}
function je(t, e) {
  return tt(e[t.index]);
}
function fc(t, e) {
  return t.data[e];
}
function Sv(t, e) {
  return t[e];
}
function Pt(t, e) {
  let r = e[t];
  return Zt(r) ? r : r[pt];
}
function hc(t) {
  return (t[T] & 128) === 128;
}
function Tv(t) {
  return gt(t[he]);
}
function Ln(t, e) {
  return e == null ? null : t[e];
}
function lf(t) {
  t[In] = 0;
}
function Av(t) {
  t[T] & 1024 || ((t[T] |= 1024), hc(t) && Cr(t));
}
function Ov(t, e) {
  for (; t > 0; ) (e = e[$n]), t--;
  return e;
}
function pc(t) {
  return !!(t[T] & 9216 || t[Qt]?.dirty);
}
function wa(t) {
  t[He].changeDetectionScheduler?.notify(1),
    pc(t)
      ? Cr(t)
      : t[T] & 64 &&
        (xv()
          ? ((t[T] |= 1024), Cr(t))
          : t[He].changeDetectionScheduler?.notify());
}
function Cr(t) {
  t[He].changeDetectionScheduler?.notify();
  let e = _r(t);
  for (; e !== null && !(e[T] & 8192 || ((e[T] |= 8192), !hc(e))); ) e = _r(e);
}
function df(t, e) {
  if ((t[T] & 256) === 256) throw new b(911, !1);
  t[xt] === null && (t[xt] = []), t[xt].push(e);
}
function Pv(t, e) {
  if (t[xt] === null) return;
  let r = t[xt].indexOf(e);
  r !== -1 && t[xt].splice(r, 1);
}
function _r(t) {
  let e = t[he];
  return gt(e) ? e[he] : e;
}
var k = { lFrame: yf(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function Nv() {
  return k.lFrame.elementDepthCount;
}
function Rv() {
  k.lFrame.elementDepthCount++;
}
function Fv() {
  k.lFrame.elementDepthCount--;
}
function ff() {
  return k.bindingsEnabled;
}
function kv() {
  return k.skipHydrationRootTNode !== null;
}
function Lv(t) {
  return k.skipHydrationRootTNode === t;
}
function jv() {
  k.skipHydrationRootTNode = null;
}
function z() {
  return k.lFrame.lView;
}
function be() {
  return k.lFrame.tView;
}
function Me() {
  let t = hf();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function hf() {
  return k.lFrame.currentTNode;
}
function Vv() {
  let t = k.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function on(t, e) {
  let r = k.lFrame;
  (r.currentTNode = t), (r.isParent = e);
}
function gc() {
  return k.lFrame.isParent;
}
function pf() {
  k.lFrame.isParent = !1;
}
function Uv() {
  return k.lFrame.contextLView;
}
function Bv() {
  let t = k.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function $v(t) {
  return (k.lFrame.bindingIndex = t);
}
function Io() {
  return k.lFrame.bindingIndex++;
}
function Hv(t) {
  let e = k.lFrame,
    r = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), r;
}
function zv() {
  return k.lFrame.inI18n;
}
function Gv(t, e) {
  let r = k.lFrame;
  (r.bindingIndex = r.bindingRootIndex = t), ba(e);
}
function Wv() {
  return k.lFrame.currentDirectiveIndex;
}
function ba(t) {
  k.lFrame.currentDirectiveIndex = t;
}
function qv(t) {
  let e = k.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function gf(t) {
  k.lFrame.currentQueryIndex = t;
}
function Zv(t) {
  let e = t[F];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Ze] : null;
}
function mf(t, e, r) {
  if (r & R.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(r & R.Host); )
      if (((i = Zv(o)), i === null || ((o = o[$n]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let n = (k.lFrame = vf());
  return (n.currentTNode = e), (n.lView = t), !0;
}
function mc(t) {
  let e = vf(),
    r = t[F];
  (k.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1);
}
function vf() {
  let t = k.lFrame,
    e = t === null ? null : t.child;
  return e === null ? yf(t) : e;
}
function yf(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function Cf() {
  let t = k.lFrame;
  return (k.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var _f = Cf;
function vc() {
  let t = Cf();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function Yv(t) {
  return (k.lFrame.contextLView = Ov(t, k.lFrame.contextLView))[we];
}
function sn() {
  return k.lFrame.selectedIndex;
}
function Jt(t) {
  k.lFrame.selectedIndex = t;
}
function yc() {
  let t = k.lFrame;
  return fc(t.tView, t.selectedIndex);
}
function Te() {
  k.lFrame.currentNamespace = cf;
}
function Ae() {
  Qv();
}
function Qv() {
  k.lFrame.currentNamespace = null;
}
function Kv() {
  return k.lFrame.currentNamespace;
}
var Df = !0;
function xo() {
  return Df;
}
function So(t) {
  Df = t;
}
function Jv(t, e, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (n) {
    let s = of(e);
    (r.preOrderHooks ??= []).push(t, s),
      (r.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (r.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((r.preOrderHooks ??= []).push(t, o),
      (r.preOrderCheckHooks ??= []).push(t, o));
}
function To(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let o = t.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: u,
        ngOnDestroy: l,
      } = o;
    s && (t.contentHooks ??= []).push(-r, s),
      a &&
        ((t.contentHooks ??= []).push(r, a),
        (t.contentCheckHooks ??= []).push(r, a)),
      c && (t.viewHooks ??= []).push(-r, c),
      u &&
        ((t.viewHooks ??= []).push(r, u), (t.viewCheckHooks ??= []).push(r, u)),
      l != null && (t.destroyHooks ??= []).push(r, l);
  }
}
function $i(t, e, r) {
  wf(t, e, 3, r);
}
function Hi(t, e, r, n) {
  (t[T] & 3) === r && wf(t, e, r, n);
}
function ta(t, e) {
  let r = t[T];
  (r & 3) === e && ((r &= 16383), (r += 1), (t[T] = r));
}
function wf(t, e, r, n) {
  let i = n !== void 0 ? t[In] & 65535 : 0,
    o = n ?? -1,
    s = e.length - 1,
    a = 0;
  for (let c = i; c < s; c++)
    if (typeof e[c + 1] == "number") {
      if (((a = e[c]), n != null && a >= n)) break;
    } else
      e[c] < 0 && (t[In] += 65536),
        (a < o || o == -1) &&
          (Xv(t, r, e, c), (t[In] = (t[In] & 4294901760) + c + 2)),
        c++;
}
function ed(t, e) {
  Je(4, t, e);
  let r = U(null);
  try {
    e.call(t);
  } finally {
    U(r), Je(5, t, e);
  }
}
function Xv(t, e, r, n) {
  let i = r[n] < 0,
    o = r[n + 1],
    s = i ? -r[n] : r[n],
    a = t[s];
  i
    ? t[T] >> 14 < t[In] >> 16 &&
      (t[T] & 3) === e &&
      ((t[T] += 16384), ed(a, o))
    : ed(a, o);
}
var An = -1,
  Xt = class {
    constructor(e, r, n) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function ey(t) {
  return t instanceof Xt;
}
function ty(t) {
  return (t.flags & 8) !== 0;
}
function ny(t) {
  return (t.flags & 16) !== 0;
}
function bf(t) {
  return t !== An;
}
function Ji(t) {
  return t & 32767;
}
function ry(t) {
  return t >> 16;
}
function Xi(t, e) {
  let r = ry(t),
    n = e;
  for (; r > 0; ) (n = n[$n]), r--;
  return n;
}
var Ma = !0;
function td(t) {
  let e = Ma;
  return (Ma = t), e;
}
var iy = 256,
  Mf = iy - 1,
  Ef = 5,
  oy = 0,
  Xe = {};
function sy(t, e, r) {
  let n;
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(fr) && (n = r[fr]),
    n == null && (n = r[fr] = oy++);
  let i = n & Mf,
    o = 1 << i;
  e.data[t + (i >> Ef)] |= o;
}
function eo(t, e) {
  let r = If(t, e);
  if (r !== -1) return r;
  let n = e[F];
  n.firstCreatePass &&
    ((t.injectorIndex = e.length),
    na(n.data, t),
    na(e, null),
    na(n.blueprint, null));
  let i = Cc(t, e),
    o = t.injectorIndex;
  if (bf(i)) {
    let s = Ji(i),
      a = Xi(i, e),
      c = a[F].data;
    for (let u = 0; u < 8; u++) e[o + u] = a[s + u] | c[s + u];
  }
  return (e[o + 8] = i), o;
}
function na(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function If(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Cc(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let r = 0,
    n = null,
    i = e;
  for (; i !== null; ) {
    if (((n = Of(i)), n === null)) return An;
    if ((r++, (i = i[$n]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return An;
}
function Ea(t, e, r) {
  sy(t, e, r);
}
function ay(t, e) {
  if (e === "class") return t.classes;
  if (e === "style") return t.styles;
  let r = t.attrs;
  if (r) {
    let n = r.length,
      i = 0;
    for (; i < n; ) {
      let o = r[i];
      if ($d(o)) break;
      if (o === 0) i = i + 2;
      else if (typeof o == "number")
        for (i++; i < n && typeof r[i] == "string"; ) i++;
      else {
        if (o === e) return r[i + 1];
        i = i + 2;
      }
    }
  }
  return null;
}
function xf(t, e, r) {
  if (r & R.Optional || t !== void 0) return t;
  ic(e, "NodeInjector");
}
function Sf(t, e, r, n) {
  if (
    (r & R.Optional && n === void 0 && (n = null), !(r & (R.Self | R.Host)))
  ) {
    let i = t[Fn],
      o = ke(void 0);
    try {
      return i ? i.get(e, n, r & R.Optional) : kd(e, n, r & R.Optional);
    } finally {
      ke(o);
    }
  }
  return xf(n, e, r);
}
function Tf(t, e, r, n = R.Default, i) {
  if (t !== null) {
    if (e[T] & 2048 && !(n & R.Self)) {
      let s = fy(t, e, r, n, Xe);
      if (s !== Xe) return s;
    }
    let o = Af(t, e, r, n, Xe);
    if (o !== Xe) return o;
  }
  return Sf(e, r, n, i);
}
function Af(t, e, r, n, i) {
  let o = ly(r);
  if (typeof o == "function") {
    if (!mf(e, t, n)) return n & R.Host ? xf(i, r, n) : Sf(e, r, n, i);
    try {
      let s;
      if (((s = o(n)), s == null && !(n & R.Optional))) ic(r);
      else return s;
    } finally {
      _f();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = If(t, e),
      c = An,
      u = n & R.Host ? e[ze][Ze] : null;
    for (
      (a === -1 || n & R.SkipSelf) &&
      ((c = a === -1 ? Cc(t, e) : e[a + 8]),
      c === An || !rd(n, !1)
        ? (a = -1)
        : ((s = e[F]), (a = Ji(c)), (e = Xi(c, e))));
      a !== -1;

    ) {
      let l = e[F];
      if (nd(o, a, l.data)) {
        let d = cy(a, e, r, s, n, u);
        if (d !== Xe) return d;
      }
      (c = e[a + 8]),
        c !== An && rd(n, e[F].data[a + 8] === u) && nd(o, a, e)
          ? ((s = l), (a = Ji(c)), (e = Xi(c, e)))
          : (a = -1);
    }
  }
  return i;
}
function cy(t, e, r, n, i, o) {
  let s = e[F],
    a = s.data[t + 8],
    c = n == null ? Mo(a) && Ma : n != s && (a.type & 3) !== 0,
    u = i & R.Host && o === a,
    l = uy(a, s, r, c, u);
  return l !== null ? jn(e, s, l, a) : Xe;
}
function uy(t, e, r, n, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    c = t.directiveStart,
    u = t.directiveEnd,
    l = o >> 20,
    d = n ? a : a + l,
    f = i ? a + l : u;
  for (let g = d; g < f; g++) {
    let C = s[g];
    if ((g < c && r === C) || (g >= c && C.type === r)) return g;
  }
  if (i) {
    let g = s[c];
    if (g && Tt(g) && g.type === r) return c;
  }
  return null;
}
function jn(t, e, r, n) {
  let i = t[r],
    o = e.data;
  if (ey(i)) {
    let s = i;
    s.resolving && Rm(Nm(o[r]));
    let a = td(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      u = s.injectImpl ? ke(s.injectImpl) : null,
      l = mf(t, n, R.Default);
    try {
      (i = t[r] = s.factory(void 0, o, t, n)),
        e.firstCreatePass && r >= n.directiveStart && Jv(r, o[r], e);
    } finally {
      u !== null && ke(u), td(a), (s.resolving = !1), _f();
    }
  }
  return i;
}
function ly(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(fr) ? t[fr] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & Mf : dy) : e;
}
function nd(t, e, r) {
  let n = 1 << t;
  return !!(r[e + (t >> Ef)] & n);
}
function rd(t, e) {
  return !(t & R.Self) && !(t & R.Host && e);
}
var Yt = class {
  constructor(e, r) {
    (this._tNode = e), (this._lView = r);
  }
  get(e, r, n) {
    return Tf(this._tNode, this._lView, e, Co(n), r);
  }
};
function dy() {
  return new Yt(Me(), z());
}
function an(t) {
  return Er(() => {
    let e = t.prototype.constructor,
      r = e[Wi] || Ia(e),
      n = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== n; ) {
      let o = i[Wi] || Ia(i);
      if (o && o !== r) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function Ia(t) {
  return Ad(t)
    ? () => {
        let e = Ia(ge(t));
        return e && e();
      }
    : On(t);
}
function fy(t, e, r, n, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[T] & 2048 && !(s[T] & 512); ) {
    let a = Af(o, s, r, n | R.Self, Xe);
    if (a !== Xe) return a;
    let c = o.parent;
    if (!c) {
      let u = s[tf];
      if (u) {
        let l = u.get(r, Xe, n);
        if (l !== Xe) return l;
      }
      (c = Of(s)), (s = s[$n]);
    }
    o = c;
  }
  return i;
}
function Of(t) {
  let e = t[F],
    r = e.type;
  return r === 2 ? e.declTNode : r === 1 ? t[Ze] : null;
}
function _c(t) {
  return ay(Me(), t);
}
function id(t, e = null, r = null, n) {
  let i = Pf(t, e, r, n);
  return i.resolveInjectorInitializers(), i;
}
function Pf(t, e = null, r = null, n, i = new Set()) {
  let o = [r || Le, cv(t)];
  return (
    (n = n || (typeof t == "object" ? void 0 : ve(t))),
    new gr(o, e || uc(), n || null, i)
  );
}
var mt = (() => {
  let e = class e {
    static create(n, i) {
      if (Array.isArray(n)) return id({ name: "" }, i, n, "");
      {
        let o = n.name ?? "";
        return id({ name: o }, n.parent, n.providers, o);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = hr),
    (e.NULL = new Yi()),
    (e.ɵprov = w({ token: e, providedIn: "any", factory: () => x(Vd) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var hy = "ngOriginalError";
function ra(t) {
  return t[hy];
}
var nt = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let r = this._findOriginalError(e);
      this._console.error("ERROR", e),
        r && this._console.error("ORIGINAL ERROR", r);
    }
    _findOriginalError(e) {
      let r = e && ra(e);
      for (; r && ra(r); ) r = ra(r);
      return r || null;
    }
  },
  Nf = new D("", {
    providedIn: "root",
    factory: () => v(nt).handleError.bind(void 0),
  }),
  Dc = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = py), (e.__NG_ENV_ID__ = (n) => n);
    let t = e;
    return t;
  })(),
  xa = class extends Dc {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return df(this._lView, e), () => Pv(this._lView, e);
    }
  };
function py() {
  return new xa(z());
}
function gy() {
  return Ao(Me(), z());
}
function Ao(t, e) {
  return new Ye(je(t, e));
}
var Ye = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  e.__NG_ELEMENT_ID__ = gy;
  let t = e;
  return t;
})();
var Sa = class extends le {
  constructor(e = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = e),
      ef() && (this.destroyRef = v(Dc, { optional: !0 }) ?? void 0);
  }
  emit(e) {
    let r = U(null);
    try {
      super.next(e);
    } finally {
      U(r);
    }
  }
  subscribe(e, r, n) {
    let i = e,
      o = r || (() => null),
      s = n;
    if (e && typeof e == "object") {
      let c = e;
      (i = c.next?.bind(c)), (o = c.error?.bind(c)), (s = c.complete?.bind(c));
    }
    this.__isAsync && ((o = ia(o)), i && (i = ia(i)), s && (s = ia(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof X && e.add(a), a;
  }
};
function ia(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var me = Sa;
function Rf(t) {
  return (t.flags & 128) === 128;
}
var Ff = new Map(),
  my = 0;
function vy() {
  return my++;
}
function yy(t) {
  Ff.set(t[bo], t);
}
function Cy(t) {
  Ff.delete(t[bo]);
}
var od = "__ngContext__";
function At(t, e) {
  Zt(e) ? ((t[od] = e[bo]), yy(e)) : (t[od] = e);
}
function kf(t) {
  return jf(t[yr]);
}
function Lf(t) {
  return jf(t[$e]);
}
function jf(t) {
  for (; t !== null && !gt(t); ) t = t[$e];
  return t;
}
var Ta;
function Vf(t) {
  Ta = t;
}
function _y() {
  if (Ta !== void 0) return Ta;
  if (typeof document < "u") return document;
  throw new b(210, !1);
}
var wc = new D("", { providedIn: "root", factory: () => Dy }),
  Dy = "ng",
  bc = new D(""),
  ot = new D("", { providedIn: "platform", factory: () => "unknown" });
var Mc = new D("", {
  providedIn: "root",
  factory: () =>
    _y().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var wy = "h",
  by = "b";
var My = () => null;
function Ec(t, e, r = !1) {
  return My(t, e, r);
}
var Uf = !1,
  Ey = new D("", { providedIn: "root", factory: () => Uf });
var ji;
function Iy() {
  if (ji === void 0 && ((ji = null), qt.trustedTypes))
    try {
      ji = qt.trustedTypes.createPolicy("angular#unsafe-bypass", {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return ji;
}
function sd(t) {
  return Iy()?.createScriptURL(t) || t;
}
var to = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Sd})`;
  }
};
function xr(t) {
  return t instanceof to ? t.changingThisBreaksApplicationSecurity : t;
}
function Ic(t, e) {
  let r = xy(t);
  if (r != null && r !== e) {
    if (r === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${r} (see ${Sd})`);
  }
  return r === e;
}
function xy(t) {
  return (t instanceof to && t.getTypeName()) || null;
}
var Sy = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Bf(t) {
  return (t = String(t)), t.match(Sy) ? t : "unsafe:" + t;
}
var Oo = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(Oo || {});
function Oe(t) {
  let e = Hf();
  return e ? e.sanitize(Oo.URL, t) || "" : Ic(t, "URL") ? xr(t) : Bf(yo(t));
}
function Ty(t) {
  let e = Hf();
  if (e) return sd(e.sanitize(Oo.RESOURCE_URL, t) || "");
  if (Ic(t, "ResourceURL")) return sd(xr(t));
  throw new b(904, !1);
}
function Ay(t, e) {
  return (e === "src" &&
    (t === "embed" ||
      t === "frame" ||
      t === "iframe" ||
      t === "media" ||
      t === "script")) ||
    (e === "href" && (t === "base" || t === "link"))
    ? Ty
    : Oe;
}
function $f(t, e, r) {
  return Ay(e, r)(t);
}
function Hf() {
  let t = z();
  return t && t[He].sanitizer;
}
var Oy = /^>|^->|<!--|-->|--!>|<!-$/g,
  Py = /(<|>)/g,
  Ny = "\u200B$1\u200B";
function Ry(t) {
  return t.replace(Oy, (e) => e.replace(Py, Ny));
}
function zf(t) {
  return t instanceof Function ? t() : t;
}
function Fy(t) {
  return (t ?? v(mt)).get(ot) === "browser";
}
var ht = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    );
  })(ht || {}),
  ky;
function xc(t, e) {
  return ky(t, e);
}
function xn(t, e, r, n, i) {
  if (n != null) {
    let o,
      s = !1;
    gt(n) ? (o = n) : Zt(n) && ((s = !0), (n = n[pt]));
    let a = tt(n);
    t === 0 && r !== null
      ? i == null
        ? Zf(e, r, a)
        : no(e, r, a, i || null, !0)
      : t === 1 && r !== null
      ? no(e, r, a, i || null, !0)
      : t === 2
      ? e0(e, a, s)
      : t === 3 && e.destroyNode(a),
      o != null && n0(e, t, o, r, i);
  }
}
function Ly(t, e) {
  return t.createText(e);
}
function jy(t, e, r) {
  t.setValue(e, r);
}
function Vy(t, e) {
  return t.createComment(Ry(e));
}
function Gf(t, e, r) {
  return t.createElement(e, r);
}
function Uy(t, e) {
  Wf(t, e), (e[pt] = null), (e[Ze] = null);
}
function By(t, e, r, n, i, o) {
  (n[pt] = i), (n[Ze] = e), Ro(t, n, r, 1, i, o);
}
function Wf(t, e) {
  e[He].changeDetectionScheduler?.notify(1), Ro(t, e, e[ee], 2, null, null);
}
function $y(t) {
  let e = t[yr];
  if (!e) return oa(t[F], t);
  for (; e; ) {
    let r = null;
    if (Zt(e)) r = e[yr];
    else {
      let n = e[ye];
      n && (r = n);
    }
    if (!r) {
      for (; e && !e[$e] && e !== t; ) Zt(e) && oa(e[F], e), (e = e[he]);
      e === null && (e = t), Zt(e) && oa(e[F], e), (r = e && e[$e]);
    }
    e = r;
  }
}
function Hy(t, e, r, n) {
  let i = ye + n,
    o = r.length;
  n > 0 && (r[i - 1][$e] = e),
    n < o - ye
      ? ((e[$e] = r[i]), jd(r, ye + n, e))
      : (r.push(e), (e[$e] = null)),
    (e[he] = r);
  let s = e[wo];
  s !== null && r !== s && zy(s, e);
  let a = e[kn];
  a !== null && a.insertView(t), wa(e), (e[T] |= 128);
}
function zy(t, e) {
  let r = t[Ki],
    i = e[he][he][ze];
  e[ze] !== i && (t[T] |= lc.HasTransplantedViews),
    r === null ? (t[Ki] = [e]) : r.push(e);
}
function qf(t, e) {
  let r = t[Ki],
    n = r.indexOf(e);
  r.splice(n, 1);
}
function Dr(t, e) {
  if (t.length <= ye) return;
  let r = ye + e,
    n = t[r];
  if (n) {
    let i = n[wo];
    i !== null && i !== t && qf(i, n), e > 0 && (t[r - 1][$e] = n[$e]);
    let o = Zi(t, ye + e);
    Uy(n[F], n);
    let s = o[kn];
    s !== null && s.detachView(o[F]),
      (n[he] = null),
      (n[$e] = null),
      (n[T] &= -129);
  }
  return n;
}
function Po(t, e) {
  if (!(e[T] & 256)) {
    let r = e[ee];
    r.destroyNode && Ro(t, e, r, 3, null, null), $y(e);
  }
}
function oa(t, e) {
  if (e[T] & 256) return;
  let r = U(null);
  try {
    (e[T] &= -129),
      (e[T] |= 256),
      e[Qt] && ml(e[Qt]),
      Wy(t, e),
      Gy(t, e),
      e[F].type === 1 && e[ee].destroy();
    let n = e[wo];
    if (n !== null && gt(e[he])) {
      n !== e[he] && qf(n, e);
      let i = e[kn];
      i !== null && i.detachView(t);
    }
    Cy(e);
  } finally {
    U(r);
  }
}
function Gy(t, e) {
  let r = t.cleanup,
    n = e[vr];
  if (r !== null)
    for (let o = 0; o < r.length - 1; o += 2)
      if (typeof r[o] == "string") {
        let s = r[o + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2);
      } else {
        let s = n[r[o + 1]];
        r[o].call(s);
      }
  n !== null && (e[vr] = null);
  let i = e[xt];
  if (i !== null) {
    e[xt] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function Wy(t, e) {
  let r;
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = e[r[n]];
      if (!(i instanceof Xt)) {
        let o = r[n + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              c = o[s + 1];
            Je(4, a, c);
            try {
              c.call(a);
            } finally {
              Je(5, a, c);
            }
          }
        else {
          Je(4, i, o);
          try {
            o.call(i);
          } finally {
            Je(5, i, o);
          }
        }
      }
    }
}
function qy(t, e, r) {
  return Zy(t, e.parent, r);
}
function Zy(t, e, r) {
  let n = e;
  for (; n !== null && n.type & 40; ) (e = n), (n = e.parent);
  if (n === null) return r[pt];
  {
    let { componentOffset: i } = n;
    if (i > -1) {
      let { encapsulation: o } = t.data[n.directiveStart + i];
      if (o === et.None || o === et.Emulated) return null;
    }
    return je(n, r);
  }
}
function no(t, e, r, n, i) {
  t.insertBefore(e, r, n, i);
}
function Zf(t, e, r) {
  t.appendChild(e, r);
}
function ad(t, e, r, n, i) {
  n !== null ? no(t, e, r, n, i) : Zf(t, e, r);
}
function Yy(t, e, r, n) {
  t.removeChild(e, r, n);
}
function Sc(t, e) {
  return t.parentNode(e);
}
function Qy(t, e) {
  return t.nextSibling(e);
}
function Ky(t, e, r) {
  return Xy(t, e, r);
}
function Jy(t, e, r) {
  return t.type & 40 ? je(t, r) : null;
}
var Xy = Jy,
  cd;
function No(t, e, r, n) {
  let i = qy(t, n, e),
    o = e[ee],
    s = n.parent || e[Ze],
    a = Ky(s, n, e);
  if (i != null)
    if (Array.isArray(r))
      for (let c = 0; c < r.length; c++) ad(o, i, r[c], a, !1);
    else ad(o, i, r, a, !1);
  cd !== void 0 && cd(o, n, e, r, i);
}
function zi(t, e) {
  if (e !== null) {
    let r = e.type;
    if (r & 3) return je(e, t);
    if (r & 4) return Aa(-1, t[e.index]);
    if (r & 8) {
      let n = e.child;
      if (n !== null) return zi(t, n);
      {
        let i = t[e.index];
        return gt(i) ? Aa(-1, i) : tt(i);
      }
    } else {
      if (r & 32) return xc(e, t)() || tt(t[e.index]);
      {
        let n = Yf(t, e);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let i = _r(t[ze]);
          return zi(i, n);
        } else return zi(t, e.next);
      }
    }
  }
  return null;
}
function Yf(t, e) {
  if (e !== null) {
    let n = t[ze][Ze],
      i = e.projection;
    return n.projection[i];
  }
  return null;
}
function Aa(t, e) {
  let r = ye + t + 1;
  if (r < e.length) {
    let n = e[r],
      i = n[F].firstChild;
    if (i !== null) return zi(n, i);
  }
  return e[Kt];
}
function e0(t, e, r) {
  let n = Sc(t, e);
  n && Yy(t, n, e, r);
}
function Tc(t, e, r, n, i, o, s) {
  for (; r != null; ) {
    let a = n[r.index],
      c = r.type;
    if (
      (s && e === 0 && (a && At(tt(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (c & 8) Tc(t, e, r.child, n, i, o, !1), xn(e, t, i, a, o);
      else if (c & 32) {
        let u = xc(r, n),
          l;
        for (; (l = u()); ) xn(e, t, i, l, o);
        xn(e, t, i, a, o);
      } else c & 16 ? t0(t, e, n, r, i, o) : xn(e, t, i, a, o);
    r = s ? r.projectionNext : r.next;
  }
}
function Ro(t, e, r, n, i, o) {
  Tc(r, n, t.firstChild, e, i, o, !1);
}
function t0(t, e, r, n, i, o) {
  let s = r[ze],
    c = s[Ze].projection[n.projection];
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u];
      xn(e, t, i, l, o);
    }
  else {
    let u = c,
      l = s[he];
    Rf(n) && (u.flags |= 128), Tc(t, e, u, l, i, o, !0);
  }
}
function n0(t, e, r, n, i) {
  let o = r[Kt],
    s = tt(r);
  o !== s && xn(e, t, n, o, i);
  for (let a = ye; a < r.length; a++) {
    let c = r[a];
    Ro(c[F], c, t, e, n, o);
  }
}
function r0(t, e, r, n, i) {
  if (e) i ? t.addClass(r, n) : t.removeClass(r, n);
  else {
    let o = n.indexOf("-") === -1 ? void 0 : ht.DashCase;
    i == null
      ? t.removeStyle(r, n, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= ht.Important)),
        t.setStyle(r, n, i, o));
  }
}
function i0(t, e, r) {
  t.setAttribute(e, "style", r);
}
function Qf(t, e, r) {
  r === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", r);
}
function Kf(t, e, r) {
  let { mergedAttrs: n, classes: i, styles: o } = r;
  n !== null && va(t, e, n),
    i !== null && Qf(t, e, i),
    o !== null && i0(t, e, o);
}
var Nt = {};
function M(t = 1) {
  Jf(be(), z(), sn() + t, !1);
}
function Jf(t, e, r, n) {
  if (!n)
    if ((e[T] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && $i(e, o, r);
    } else {
      let o = t.preOrderHooks;
      o !== null && Hi(e, o, 0, r);
    }
  Jt(r);
}
function L(t, e = R.Default) {
  let r = z();
  if (r === null) return x(t, e);
  let n = Me();
  return Tf(n, r, ge(t), e);
}
function Xf() {
  let t = "invalid";
  throw new Error(t);
}
function eh(t, e, r, n, i, o) {
  let s = U(null);
  try {
    let a = null;
    i & de.SignalBased && (a = e[n][fl]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & de.HasDecoratorInputTransform &&
        (o = t.inputTransforms[n].call(e, o)),
      t.setInput !== null ? t.setInput(e, a, o, r, n) : rf(e, a, n, o);
  } finally {
    U(s);
  }
}
function o0(t, e) {
  let r = t.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        if (i < 0) Jt(~i);
        else {
          let o = i,
            s = r[++n],
            a = r[++n];
          Gv(s, o);
          let c = e[o];
          a(2, c);
        }
      }
    } finally {
      Jt(-1);
    }
}
function Fo(t, e, r, n, i, o, s, a, c, u, l) {
  let d = e.blueprint.slice();
  return (
    (d[pt] = i),
    (d[T] = n | 4 | 128 | 8 | 64),
    (u !== null || (t && t[T] & 2048)) && (d[T] |= 2048),
    lf(d),
    (d[he] = d[$n] = t),
    (d[we] = r),
    (d[He] = s || (t && t[He])),
    (d[ee] = a || (t && t[ee])),
    (d[Fn] = c || (t && t[Fn]) || null),
    (d[Ze] = o),
    (d[bo] = vy()),
    (d[mr] = l),
    (d[tf] = u),
    (d[ze] = e.type == 2 ? t[ze] : d),
    d
  );
}
function Sr(t, e, r, n, i) {
  let o = t.data[e];
  if (o === null) (o = s0(t, e, r, n, i)), zv() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = r), (o.value = n), (o.attrs = i);
    let s = Vv();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return on(o, !0), o;
}
function s0(t, e, r, n, i) {
  let o = hf(),
    s = gc(),
    a = s ? o : o && o.parent,
    c = (t.data[e] = d0(t, a, r, e, n, i));
  return (
    t.firstChild === null && (t.firstChild = c),
    o !== null &&
      (s
        ? o.child == null && c.parent !== null && (o.child = c)
        : o.next === null && ((o.next = c), (c.prev = o))),
    c
  );
}
function th(t, e, r, n) {
  if (r === 0) return -1;
  let i = e.length;
  for (let o = 0; o < r; o++) e.push(n), t.blueprint.push(n), t.data.push(null);
  return i;
}
function nh(t, e, r, n, i) {
  let o = sn(),
    s = n & 2;
  try {
    Jt(-1), s && e.length > Ge && Jf(t, e, Ge, !1), Je(s ? 2 : 0, i), r(n, i);
  } finally {
    Jt(o), Je(s ? 3 : 1, i);
  }
}
function Ac(t, e, r) {
  if (dc(e)) {
    let n = U(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        if (a.contentQueries) {
          let c = r[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      U(n);
    }
  }
}
function Oc(t, e, r) {
  ff() && (v0(t, e, r, je(r, e)), (r.flags & 64) === 64 && sh(t, e, r));
}
function Pc(t, e, r = je) {
  let n = e.localNames;
  if (n !== null) {
    let i = e.index + 1;
    for (let o = 0; o < n.length; o += 2) {
      let s = n[o + 1],
        a = s === -1 ? r(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function rh(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = Nc(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function Nc(t, e, r, n, i, o, s, a, c, u, l) {
  let d = Ge + n,
    f = d + i,
    g = a0(d, f),
    C = typeof u == "function" ? u() : u;
  return (g[F] = {
    type: t,
    blueprint: g,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: g.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: C,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function a0(t, e) {
  let r = [];
  for (let n = 0; n < e; n++) r.push(n < t ? null : Nt);
  return r;
}
function c0(t, e, r, n) {
  let o = n.get(Ey, Uf) || r === et.ShadowDom,
    s = t.selectRootElement(e, o);
  return u0(s), s;
}
function u0(t) {
  l0(t);
}
var l0 = () => null;
function d0(t, e, r, n, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    kv() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function ud(t, e, r, n, i) {
  for (let o in e) {
    if (!e.hasOwnProperty(o)) continue;
    let s = e[o];
    if (s === void 0) continue;
    n ??= {};
    let a,
      c = de.None;
    Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
    let u = o;
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue;
      u = i[o];
    }
    t === 0 ? ld(n, r, u, a, c) : ld(n, r, u, a);
  }
  return n;
}
function ld(t, e, r, n, i) {
  let o;
  t.hasOwnProperty(r) ? (o = t[r]).push(e, n) : (o = t[r] = [e, n]),
    i !== void 0 && o.push(i);
}
function f0(t, e, r) {
  let n = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    c = null,
    u = null;
  for (let l = n; l < i; l++) {
    let d = o[l],
      f = r ? r.get(d) : null,
      g = f ? f.inputs : null,
      C = f ? f.outputs : null;
    (c = ud(0, d.inputs, l, c, g)), (u = ud(1, d.outputs, l, u, C));
    let A = c !== null && s !== null && !ac(e) ? S0(c, l, s) : null;
    a.push(A);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (e.flags |= 8),
    c.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = u);
}
function h0(t) {
  return t === "class"
    ? "className"
    : t === "for"
    ? "htmlFor"
    : t === "formaction"
    ? "formAction"
    : t === "innerHtml"
    ? "innerHTML"
    : t === "readonly"
    ? "readOnly"
    : t === "tabindex"
    ? "tabIndex"
    : t;
}
function ih(t, e, r, n, i, o, s, a) {
  let c = je(e, r),
    u = e.inputs,
    l;
  !a && u != null && (l = u[n])
    ? (Fc(t, r, l, n, i), Mo(e) && p0(r, e.index))
    : e.type & 3
    ? ((n = h0(n)),
      (i = s != null ? s(i, e.value || "", n) : i),
      o.setProperty(c, n, i))
    : e.type & 12;
}
function p0(t, e) {
  let r = Pt(e, t);
  r[T] & 16 || (r[T] |= 64);
}
function Rc(t, e, r, n) {
  if (ff()) {
    let i = n === null ? null : { "": -1 },
      o = C0(t, r),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && oh(t, e, r, s, i, a),
      i && _0(r, n, i);
  }
  r.mergedAttrs = pr(r.mergedAttrs, r.attrs);
}
function oh(t, e, r, n, i, o) {
  for (let u = 0; u < n.length; u++) Ea(eo(r, e), t, n[u].type);
  w0(r, t.data.length, n.length);
  for (let u = 0; u < n.length; u++) {
    let l = n[u];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    c = th(t, e, n.length, null);
  for (let u = 0; u < n.length; u++) {
    let l = n[u];
    (r.mergedAttrs = pr(r.mergedAttrs, l.hostAttrs)),
      b0(t, r, e, c, l),
      D0(c, l, i),
      l.contentQueries !== null && (r.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (r.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      c++;
  }
  f0(t, r, o);
}
function g0(t, e, r, n, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    m0(s) != a && s.push(a), s.push(r, n, o);
  }
}
function m0(t) {
  let e = t.length;
  for (; e > 0; ) {
    let r = t[--e];
    if (typeof r == "number" && r < 0) return r;
  }
  return 0;
}
function v0(t, e, r, n) {
  let i = r.directiveStart,
    o = r.directiveEnd;
  Mo(r) && M0(e, r, t.data[i + r.componentOffset]),
    t.firstCreatePass || eo(r, e),
    At(n, e);
  let s = r.initialInputs;
  for (let a = i; a < o; a++) {
    let c = t.data[a],
      u = jn(e, t, a, r);
    if ((At(u, e), s !== null && x0(e, a - i, u, c, r, s), Tt(c))) {
      let l = Pt(r.index, e);
      l[we] = jn(e, t, a, r);
    }
  }
}
function sh(t, e, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    o = r.index,
    s = Wv();
  try {
    Jt(o);
    for (let a = n; a < i; a++) {
      let c = t.data[a],
        u = e[a];
      ba(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          y0(c, u);
    }
  } finally {
    Jt(-1), ba(s);
  }
}
function y0(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function C0(t, e) {
  let r = t.directiveRegistry,
    n = null,
    i = null;
  if (r)
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      if (Xm(e, s.selectors, !1))
        if ((n || (n = []), Tt(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              n.unshift(...a, s);
            let c = a.length;
            Oa(t, e, c);
          } else n.unshift(s), Oa(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, n, i), n.push(s);
    }
  return n === null ? null : [n, i];
}
function Oa(t, e, r) {
  (e.componentOffset = r), (t.components ??= []).push(e.index);
}
function _0(t, e, r) {
  if (e) {
    let n = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = r[e[i + 1]];
      if (o == null) throw new b(-301, !1);
      n.push(e[i], o);
    }
  }
}
function D0(t, e, r) {
  if (r) {
    if (e.exportAs)
      for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
    Tt(e) && (r[""] = t);
  }
}
function w0(t, e, r) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + r),
    (t.providerIndexes = e);
}
function b0(t, e, r, n, i) {
  t.data[n] = i;
  let o = i.factory || (i.factory = On(i.type, !0)),
    s = new Xt(o, Tt(i), L);
  (t.blueprint[n] = s), (r[n] = s), g0(t, e, n, th(t, r, i.hostVars, Nt), i);
}
function M0(t, e, r) {
  let n = je(e, t),
    i = rh(r),
    o = t[He].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = ko(
    t,
    Fo(t, i, null, s, n, e, null, o.createRenderer(n, r), null, null, null)
  );
  t[e.index] = a;
}
function E0(t, e, r, n, i, o) {
  let s = je(t, e);
  I0(e[ee], s, o, t.value, r, n, i);
}
function I0(t, e, r, n, i, o, s) {
  if (o == null) t.removeAttribute(e, i, r);
  else {
    let a = s == null ? yo(o) : s(o, n || "", i);
    t.setAttribute(e, i, a, r);
  }
}
function x0(t, e, r, n, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        u = s[a++],
        l = s[a++],
        d = s[a++];
      eh(n, r, c, u, l, d);
    }
}
function S0(t, e, r) {
  let n = null,
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (t.hasOwnProperty(o)) {
      n === null && (n = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === e) {
          n.push(o, s[a + 1], s[a + 2], r[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return n;
}
function ah(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null];
}
function ch(t, e) {
  let r = t.contentQueries;
  if (r !== null) {
    let n = U(null);
    try {
      for (let i = 0; i < r.length; i += 2) {
        let o = r[i],
          s = r[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          gf(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      U(n);
    }
  }
}
function ko(t, e) {
  return t[yr] ? (t[Jl][$e] = e) : (t[yr] = e), (t[Jl] = e), e;
}
function Pa(t, e, r) {
  gf(0);
  let n = U(null);
  try {
    e(t, r);
  } finally {
    U(n);
  }
}
function T0(t) {
  return t[vr] || (t[vr] = []);
}
function A0(t) {
  return t.cleanup || (t.cleanup = []);
}
function uh(t, e) {
  let r = t[Fn],
    n = r ? r.get(nt, null) : null;
  n && n.handleError(e);
}
function Fc(t, e, r, n, i) {
  for (let o = 0; o < r.length; ) {
    let s = r[o++],
      a = r[o++],
      c = r[o++],
      u = e[s],
      l = t.data[s];
    eh(l, u, n, a, c, i);
  }
}
function O0(t, e, r) {
  let n = uf(e, t);
  jy(t[ee], n, r);
}
function P0(t, e) {
  let r = Pt(e, t),
    n = r[F];
  N0(n, r);
  let i = r[pt];
  i !== null && r[mr] === null && (r[mr] = Ec(i, r[Fn])), kc(n, r, r[we]);
}
function N0(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function kc(t, e, r) {
  mc(e);
  try {
    let n = t.viewQuery;
    n !== null && Pa(1, n, r);
    let i = t.template;
    i !== null && nh(t, e, i, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[kn]?.finishViewCreation(t),
      t.staticContentQueries && ch(t, e),
      t.staticViewQueries && Pa(2, t.viewQuery, r);
    let o = t.components;
    o !== null && R0(e, o);
  } catch (n) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      n)
    );
  } finally {
    (e[T] &= -5), vc();
  }
}
function R0(t, e) {
  for (let r = 0; r < e.length; r++) P0(t, e[r]);
}
function Lc(t, e, r, n) {
  let i = U(null);
  try {
    let o = e.tView,
      a = t[T] & 4096 ? 4096 : 16,
      c = Fo(
        t,
        o,
        r,
        a,
        null,
        e,
        null,
        null,
        n?.injector ?? null,
        n?.embeddedViewInjector ?? null,
        n?.dehydratedView ?? null
      ),
      u = t[e.index];
    c[wo] = u;
    let l = t[kn];
    return l !== null && (c[kn] = l.createEmbeddedView(o)), kc(o, c, r), c;
  } finally {
    U(i);
  }
}
function F0(t, e) {
  let r = ye + e;
  if (r < t.length) return t[r];
}
function ro(t, e) {
  return !e || e.firstChild === null || Rf(t);
}
function jc(t, e, r, n = !0) {
  let i = e[F];
  if ((Hy(i, e, t, r), n)) {
    let s = Aa(r, t),
      a = e[ee],
      c = Sc(a, t[Kt]);
    c !== null && By(i, t[Ze], a, e, c, s);
  }
  let o = e[mr];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function k0(t, e) {
  let r = Dr(t, e);
  return r !== void 0 && Po(r[F], r), r;
}
function io(t, e, r, n, i = !1) {
  for (; r !== null; ) {
    let o = e[r.index];
    o !== null && n.push(tt(o)), gt(o) && L0(o, n);
    let s = r.type;
    if (s & 8) io(t, e, r.child, n);
    else if (s & 32) {
      let a = xc(r, e),
        c;
      for (; (c = a()); ) n.push(c);
    } else if (s & 16) {
      let a = Yf(e, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let c = _r(e[ze]);
        io(c[F], c, a, n, !0);
      }
    }
    r = i ? r.projectionNext : r.next;
  }
  return n;
}
function L0(t, e) {
  for (let r = ye; r < t.length; r++) {
    let n = t[r],
      i = n[F].firstChild;
    i !== null && io(n[F], n, i, e);
  }
  t[Kt] !== t[pt] && e.push(t[Kt]);
}
var lh = [];
function j0(t) {
  return t[Qt] ?? V0(t);
}
function V0(t) {
  let e = lh.pop() ?? Object.create(B0);
  return (e.lView = t), e;
}
function U0(t) {
  t.lView[Qt] !== t && ((t.lView = null), lh.push(t));
}
var B0 = G(y({}, hl), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (t) => {
      Cr(t.lView);
    },
    consumerOnSignalRead() {
      this.lView[Qt] = this;
    },
  }),
  dh = 100;
function fh(t, e = !0, r = 0) {
  let n = t[He],
    i = n.rendererFactory,
    o = !1;
  o || i.begin?.();
  try {
    $0(t, r);
  } catch (s) {
    throw (e && uh(t, s), s);
  } finally {
    o || (i.end?.(), n.inlineEffectRunner?.flush());
  }
}
function $0(t, e) {
  Na(t, e);
  let r = 0;
  for (; pc(t); ) {
    if (r === dh) throw new b(103, !1);
    r++, Na(t, 1);
  }
}
function H0(t, e, r, n) {
  let i = e[T];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[He].inlineEffectRunner?.flush(), mc(e);
  let s = null,
    a = null;
  !o && z0(t) && ((a = j0(e)), (s = pl(a)));
  try {
    lf(e), $v(t.bindingStartIndex), r !== null && nh(t, e, r, 2, n);
    let c = (i & 3) === 3;
    if (!o)
      if (c) {
        let d = t.preOrderCheckHooks;
        d !== null && $i(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && Hi(e, d, 0, null), ta(e, 0);
      }
    if ((G0(e), hh(e, 0), t.contentQueries !== null && ch(t, e), !o))
      if (c) {
        let d = t.contentCheckHooks;
        d !== null && $i(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && Hi(e, d, 1), ta(e, 1);
      }
    o0(t, e);
    let u = t.components;
    u !== null && gh(e, u, 0);
    let l = t.viewQuery;
    if ((l !== null && Pa(2, l, n), !o))
      if (c) {
        let d = t.viewCheckHooks;
        d !== null && $i(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && Hi(e, d, 2), ta(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[ea])) {
      for (let d of e[ea]) d();
      e[ea] = null;
    }
    o || (e[T] &= -73);
  } catch (c) {
    throw (Cr(e), c);
  } finally {
    a !== null && (gl(a, s), U0(a)), vc();
  }
}
function z0(t) {
  return t.type !== 2;
}
function hh(t, e) {
  for (let r = kf(t); r !== null; r = Lf(r))
    for (let n = ye; n < r.length; n++) {
      let i = r[n];
      ph(i, e);
    }
}
function G0(t) {
  for (let e = kf(t); e !== null; e = Lf(e)) {
    if (!(e[T] & lc.HasTransplantedViews)) continue;
    let r = e[Ki];
    for (let n = 0; n < r.length; n++) {
      let i = r[n],
        o = i[he];
      Av(i);
    }
  }
}
function W0(t, e, r) {
  let n = Pt(e, t);
  ph(n, r);
}
function ph(t, e) {
  hc(t) && Na(t, e);
}
function Na(t, e) {
  let n = t[F],
    i = t[T],
    o = t[Qt],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && Ns(o))),
    o && (o.dirty = !1),
    (t[T] &= -9217),
    s)
  )
    H0(n, t, n.template, t[we]);
  else if (i & 8192) {
    hh(t, 1);
    let a = n.components;
    a !== null && gh(t, a, 1);
  }
}
function gh(t, e, r) {
  for (let n = 0; n < e.length; n++) W0(t, e[n], r);
}
function Vc(t) {
  for (t[He].changeDetectionScheduler?.notify(); t; ) {
    t[T] |= 64;
    let e = _r(t);
    if (Dv(t) && !e) return t;
    t = e;
  }
  return null;
}
var en = class {
    get rootNodes() {
      let e = this._lView,
        r = e[F];
      return io(r, e, r.firstChild, []);
    }
    constructor(e, r, n = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[we];
    }
    set context(e) {
      this._lView[we] = e;
    }
    get destroyed() {
      return (this._lView[T] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[he];
        if (gt(e)) {
          let r = e[Qi],
            n = r ? r.indexOf(this) : -1;
          n > -1 && (Dr(e, n), Zi(r, n));
        }
        this._attachedToViewContainer = !1;
      }
      Po(this._lView[F], this._lView);
    }
    onDestroy(e) {
      df(this._lView, e);
    }
    markForCheck() {
      Vc(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[T] &= -129;
    }
    reattach() {
      wa(this._lView), (this._lView[T] |= 128);
    }
    detectChanges() {
      (this._lView[T] |= 1024), fh(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new b(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), Wf(this._lView[F], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new b(902, !1);
      (this._appRef = e), wa(this._lView);
    }
  },
  Lo = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = Y0;
    let t = e;
    return t;
  })(),
  q0 = Lo,
  Z0 = class extends q0 {
    constructor(e, r, n) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = r),
        (this.elementRef = n);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r);
    }
    createEmbeddedViewImpl(e, r, n) {
      let i = Lc(this._declarationLView, this._declarationTContainer, e, {
        embeddedViewInjector: r,
        dehydratedView: n,
      });
      return new en(i);
    }
  };
function Y0() {
  return mh(Me(), z());
}
function mh(t, e) {
  return t.type & 4 ? new Z0(e, t, Ao(t, e)) : null;
}
var gT = new RegExp(`^(\\d+)*(${by}|${wy})*(.*)`);
var Q0 = () => null;
function oo(t, e) {
  return Q0(t, e);
}
var so = class {},
  Ra = class {},
  ao = class {};
function K0(t) {
  let e = Error(`No component factory found for ${ve(t)}.`);
  return (e[J0] = t), e;
}
var J0 = "ngComponent";
var Fa = class {
    resolveComponentFactory(e) {
      throw K0(e);
    }
  },
  jo = (() => {
    let e = class e {};
    e.NULL = new Fa();
    let t = e;
    return t;
  })(),
  wr = class {},
  st = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => X0();
    let t = e;
    return t;
  })();
function X0() {
  let t = z(),
    e = Me(),
    r = Pt(e.index, t);
  return (Zt(r) ? r : t)[ee];
}
var eC = (() => {
    let e = class e {};
    e.ɵprov = w({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  sa = {};
var dd = new Set();
function Tr(t) {
  dd.has(t) ||
    (dd.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
function fd(...t) {}
function tC() {
  let t = typeof qt.requestAnimationFrame == "function",
    e = qt[t ? "requestAnimationFrame" : "setTimeout"],
    r = qt[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && r) {
    let n = e[Zone.__symbol__("OriginalDelegate")];
    n && (e = n);
    let i = r[Zone.__symbol__("OriginalDelegate")];
    i && (r = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: r };
}
var Q = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new me(!1)),
        (this.onMicrotaskEmpty = new me(!1)),
        (this.onStable = new me(!1)),
        (this.onError = new me(!1)),
        typeof Zone > "u")
      )
        throw new b(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = tC().nativeRequestAnimationFrame),
        iC(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new b(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new b(909, !1);
    }
    run(e, r, n) {
      return this._inner.run(e, r, n);
    }
    runTask(e, r, n, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, nC, fd, fd);
      try {
        return o.runTask(s, r, n);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  nC = {};
function Uc(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function rC(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      qt,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                ka(t),
                (t.isCheckStableRunning = !0),
                Uc(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    ka(t));
}
function iC(t) {
  let e = () => {
    rC(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, o, s, a) => {
      if (oC(a)) return r.invokeTask(i, o, s, a);
      try {
        return hd(t), r.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          pd(t);
      }
    },
    onInvoke: (r, n, i, o, s, a, c) => {
      try {
        return hd(t), r.invoke(i, o, s, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), pd(t);
      }
    },
    onHasTask: (r, n, i, o) => {
      r.hasTask(i, o),
        n === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), ka(t), Uc(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (r, n, i, o) => (
      r.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function ka(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function hd(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function pd(t) {
  t._nesting--, Uc(t);
}
function oC(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
var Sn = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(Sn || {}),
  sC = { destroy() {} };
function Vo(t, e) {
  !e && Cv(Vo);
  let r = e?.injector ?? v(mt);
  if (!Fy(r)) return sC;
  Tr("NgAfterNextRender");
  let n = r.get(Bc),
    i = (n.handler ??= new ja()),
    o = e?.phase ?? Sn.MixedReadWrite,
    s = () => {
      i.unregister(c), a();
    },
    a = r.get(Dc).onDestroy(s),
    c = qe(
      r,
      () =>
        new La(o, () => {
          s(), t();
        })
    );
  return i.register(c), { destroy: s };
}
var La = class {
    constructor(e, r) {
      (this.phase = e),
        (this.callbackFn = r),
        (this.zone = v(Q)),
        (this.errorHandler = v(nt, { optional: !0 })),
        v(so, { optional: !0 })?.notify(1);
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  ja = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [Sn.EarlyRead]: new Set(),
          [Sn.Write]: new Set(),
          [Sn.MixedReadWrite]: new Set(),
          [Sn.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let e of Object.values(this.buckets)) for (let r of e) r.invoke();
      this.executingCallbacks = !1;
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  Bc = (() => {
    let e = class e {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        this.executeInternalCallbacks(), this.handler?.execute();
      }
      executeInternalCallbacks() {
        let n = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let i of n) i();
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = w({ token: e, providedIn: "root", factory: () => new e() });
    let t = e;
    return t;
  })();
function co(t, e, r) {
  let n = r ? t.styles : null,
    i = r ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = $l(i, a);
      else if (o == 2) {
        let c = a,
          u = e[++s];
        n = $l(n, c + ": " + u + ";");
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n),
    r ? (t.classes = i) : (t.classesWithoutHost = i);
}
var uo = class extends jo {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let r = St(e);
    return new Vn(r, this.ngModule);
  }
};
function gd(t) {
  let e = [];
  for (let r in t) {
    if (!t.hasOwnProperty(r)) continue;
    let n = t[r];
    n !== void 0 &&
      e.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r });
  }
  return e;
}
function aC(t) {
  let e = t.toLowerCase();
  return e === "svg" ? cf : e === "math" ? Ev : null;
}
var Va = class {
    constructor(e, r) {
      (this.injector = e), (this.parentInjector = r);
    }
    get(e, r, n) {
      n = Co(n);
      let i = this.injector.get(e, sa, n);
      return i !== sa || r === sa ? i : this.parentInjector.get(e, r, n);
    }
  },
  Vn = class extends ao {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = gd(e.inputs);
      if (r !== null)
        for (let i of n)
          r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
      return n;
    }
    get outputs() {
      return gd(this.componentDef.outputs);
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = rv(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(e, r, n, i) {
      let o = U(null);
      try {
        i = i || this.ngModule;
        let s = i instanceof fe ? i : i?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new Va(e, s) : e,
          c = a.get(wr, null);
        if (c === null) throw new b(407, !1);
        let u = a.get(eC, null),
          l = a.get(Bc, null),
          d = a.get(so, null),
          f = {
            rendererFactory: c,
            sanitizer: u,
            inlineEffectRunner: null,
            afterRenderEventManager: l,
            changeDetectionScheduler: d,
          },
          g = c.createRenderer(null, this.componentDef),
          C = this.componentDef.selectors[0][0] || "div",
          A = n
            ? c0(g, n, this.componentDef.encapsulation, a)
            : Gf(g, C, aC(C)),
          I = 512;
        this.componentDef.signals
          ? (I |= 4096)
          : this.componentDef.onPush || (I |= 16);
        let _ = null;
        A !== null && (_ = Ec(A, a, !0));
        let ue = Nc(0, null, null, 1, 0, null, null, null, null, null, null),
          oe = Fo(null, ue, null, I, null, null, f, g, a, null, _);
        mc(oe);
        let Y, Qe;
        try {
          let Ie = this.componentDef,
            Dt,
            Os = null;
          Ie.findHostDirectiveDefs
            ? ((Dt = []),
              (Os = new Map()),
              Ie.findHostDirectiveDefs(Ie, Dt, Os),
              Dt.push(Ie))
            : (Dt = [Ie]);
          let Wg = cC(oe, A),
            qg = uC(Wg, A, Ie, Dt, oe, f, g);
          (Qe = fc(ue, Ge)),
            A && fC(g, Ie, A, n),
            r !== void 0 && hC(Qe, this.ngContentSelectors, r),
            (Y = dC(qg, Ie, Dt, Os, oe, [pC])),
            kc(ue, oe, null);
        } finally {
          vc();
        }
        return new Ua(this.componentType, Y, Ao(Qe, oe), oe, Qe);
      } finally {
        U(o);
      }
    }
  },
  Ua = class extends Ra {
    constructor(e, r, n, i, o) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new en(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        i;
      if (n !== null && (i = n[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), r))
        )
          return;
        let o = this._rootLView;
        Fc(o[F], o, i, e, r), this.previousInputValues.set(e, r);
        let s = Pt(this._tNode.index, o);
        Vc(s);
      }
    }
    get injector() {
      return new Yt(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function cC(t, e) {
  let r = t[F],
    n = Ge;
  return (t[n] = e), Sr(r, n, 2, "#host", null);
}
function uC(t, e, r, n, i, o, s) {
  let a = i[F];
  lC(n, t, e, s);
  let c = null;
  e !== null && (c = Ec(e, i[Fn]));
  let u = o.rendererFactory.createRenderer(e, r),
    l = 16;
  r.signals ? (l = 4096) : r.onPush && (l = 64);
  let d = Fo(i, rh(r), null, l, i[t.index], t, o, u, null, null, c);
  return (
    a.firstCreatePass && Oa(a, t, n.length - 1), ko(i, d), (i[t.index] = d)
  );
}
function lC(t, e, r, n) {
  for (let i of t) e.mergedAttrs = pr(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (co(e, e.mergedAttrs, !0), r !== null && Kf(n, r, e));
}
function dC(t, e, r, n, i, o) {
  let s = Me(),
    a = i[F],
    c = je(s, i);
  oh(a, i, s, r, null, n);
  for (let l = 0; l < r.length; l++) {
    let d = s.directiveStart + l,
      f = jn(i, a, d, s);
    At(f, i);
  }
  sh(a, i, s), c && At(c, i);
  let u = jn(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[we] = i[we] = u), o !== null)) for (let l of o) l(u, e);
  return Ac(a, s, i), u;
}
function fC(t, e, r, n) {
  if (n) va(t, r, ["ng-version", "17.3.9"]);
  else {
    let { attrs: i, classes: o } = iv(e.selectors[0]);
    i && va(t, r, i), o && o.length > 0 && Qf(t, r, o.join(" "));
  }
}
function hC(t, e, r) {
  let n = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = r[i];
    n.push(o != null ? Array.from(o) : null);
  }
}
function pC() {
  let t = Me();
  To(z()[F], t);
}
var Hn = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = gC;
  let t = e;
  return t;
})();
function gC() {
  let t = Me();
  return vC(t, z());
}
var mC = Hn,
  vh = class extends mC {
    constructor(e, r, n) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return Ao(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Yt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Cc(this._hostTNode, this._hostLView);
      if (bf(e)) {
        let r = Xi(e, this._hostLView),
          n = Ji(e),
          i = r[F].data[n + 8];
        return new Yt(i, r);
      } else return new Yt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let r = md(this._lContainer);
      return (r !== null && r[e]) || null;
    }
    get length() {
      return this._lContainer.length - ye;
    }
    createEmbeddedView(e, r, n) {
      let i, o;
      typeof n == "number"
        ? (i = n)
        : n != null && ((i = n.index), (o = n.injector));
      let s = oo(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(r || {}, o, s);
      return this.insertImpl(a, i, ro(this._hostTNode, s)), a;
    }
    createComponent(e, r, n, i, o) {
      let s = e && !_v(e),
        a;
      if (s) a = r;
      else {
        let C = r || {};
        (a = C.index),
          (n = C.injector),
          (i = C.projectableNodes),
          (o = C.environmentInjector || C.ngModuleRef);
      }
      let c = s ? e : new Vn(St(e)),
        u = n || this.parentInjector;
      if (!o && c.ngModule == null) {
        let A = (s ? u : this.parentInjector).get(fe, null);
        A && (o = A);
      }
      let l = St(c.componentType ?? {}),
        d = oo(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        g = c.create(u, i, f, o);
      return this.insertImpl(g.hostView, a, ro(this._hostTNode, d)), g;
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0);
    }
    insertImpl(e, r, n) {
      let i = e._lView;
      if (Tv(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = i[he],
            u = new vh(c, c[Ze], c[he]);
          u.detach(u.indexOf(e));
        }
      }
      let o = this._adjustIndex(r),
        s = this._lContainer;
      return jc(s, i, o, n), e.attachToViewContainerRef(), jd(aa(s), o, e), e;
    }
    move(e, r) {
      return this.insert(e, r);
    }
    indexOf(e) {
      let r = md(this._lContainer);
      return r !== null ? r.indexOf(e) : -1;
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = Dr(this._lContainer, r);
      n && (Zi(aa(this._lContainer), r), Po(n[F], n));
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = Dr(this._lContainer, r);
      return n && Zi(aa(this._lContainer), r) != null ? new en(n) : null;
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r;
    }
  };
function md(t) {
  return t[Qi];
}
function aa(t) {
  return t[Qi] || (t[Qi] = []);
}
function vC(t, e) {
  let r,
    n = e[t.index];
  return (
    gt(n) ? (r = n) : ((r = ah(n, e, null, t)), (e[t.index] = r), ko(e, r)),
    CC(r, e, t, n),
    new vh(r, t, e)
  );
}
function yC(t, e) {
  let r = t[ee],
    n = r.createComment(""),
    i = je(e, t),
    o = Sc(r, i);
  return no(r, o, n, Qy(r, i), !1), n;
}
var CC = wC,
  _C = () => !1;
function DC(t, e, r) {
  return _C(t, e, r);
}
function wC(t, e, r, n) {
  if (t[Kt]) return;
  let i;
  r.type & 8 ? (i = tt(n)) : (i = yC(e, r)), (t[Kt] = i);
}
function bC(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function Rt(t) {
  let e = bC(t.type),
    r = !0,
    n = [t];
  for (; e; ) {
    let i;
    if (Tt(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new b(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (r) {
        n.push(i);
        let s = t;
        (s.inputs = Vi(t.inputs)),
          (s.inputTransforms = Vi(t.inputTransforms)),
          (s.declaredInputs = Vi(t.declaredInputs)),
          (s.outputs = Vi(t.outputs));
        let a = i.hostBindings;
        a && SC(t, a);
        let c = i.viewQuery,
          u = i.contentQueries;
        if (
          (c && IC(t, c),
          u && xC(t, u),
          MC(t, i),
          Em(t.outputs, i.outputs),
          Tt(i) && i.data.animation)
        ) {
          let l = t.data;
          l.animation = (l.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === Rt && (r = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  EC(n);
}
function MC(t, e) {
  for (let r in e.inputs) {
    if (!e.inputs.hasOwnProperty(r) || t.inputs.hasOwnProperty(r)) continue;
    let n = e.inputs[r];
    if (
      n !== void 0 &&
      ((t.inputs[r] = n),
      (t.declaredInputs[r] = e.declaredInputs[r]),
      e.inputTransforms !== null)
    ) {
      let i = Array.isArray(n) ? n[0] : n;
      if (!e.inputTransforms.hasOwnProperty(i)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[i] = e.inputTransforms[i]);
    }
  }
}
function EC(t) {
  let e = 0,
    r = null;
  for (let n = t.length - 1; n >= 0; n--) {
    let i = t[n];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = pr(i.hostAttrs, (r = pr(r, i.hostAttrs))));
  }
}
function Vi(t) {
  return t === Pn ? {} : t === Le ? [] : t;
}
function IC(t, e) {
  let r = t.viewQuery;
  r
    ? (t.viewQuery = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.viewQuery = e);
}
function xC(t, e) {
  let r = t.contentQueries;
  r
    ? (t.contentQueries = (n, i, o) => {
        e(n, i, o), r(n, i, o);
      })
    : (t.contentQueries = e);
}
function SC(t, e) {
  let r = t.hostBindings;
  r
    ? (t.hostBindings = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.hostBindings = e);
}
function $c(t) {
  let e = t.inputConfig,
    r = {};
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let i = e[n];
      Array.isArray(i) && i[3] && (r[n] = i[3]);
    }
  t.inputTransforms = r;
}
var Ot = class {},
  br = class {};
var Ba = class extends Ot {
    constructor(e, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new uo(this));
      let i = qd(e);
      (this._bootstrapComponents = zf(i.bootstrap)),
        (this._r3Injector = Pf(
          e,
          r,
          [
            { provide: Ot, useValue: this },
            { provide: jo, useValue: this.componentFactoryResolver },
            ...n,
          ],
          ve(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  $a = class extends br {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new Ba(this.moduleType, e, []);
    }
  };
var lo = class extends Ot {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new uo(this)),
      (this.instance = null);
    let r = new gr(
      [
        ...e.providers,
        { provide: Ot, useValue: this },
        { provide: jo, useValue: this.componentFactoryResolver },
      ],
      e.parent || uc(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = r),
      e.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function Uo(t, e, r = null) {
  return new lo({
    providers: t,
    parent: e,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
var cn = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new se(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function yh(t) {
  return AC(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function TC(t, e) {
  if (Array.isArray(t)) for (let r = 0; r < t.length; r++) e(t[r]);
  else {
    let r = t[Symbol.iterator](),
      n;
    for (; !(n = r.next()).done; ) e(n.value);
  }
}
function AC(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
function OC(t, e, r) {
  return (t[e] = r);
}
function zn(t, e, r) {
  let n = t[e];
  return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function PC(t) {
  return (t.flags & 32) === 32;
}
function NC(t, e, r, n, i, o, s, a, c) {
  let u = e.consts,
    l = Sr(e, t, 4, s || null, Ln(u, a));
  Rc(e, r, l, Ln(u, c)), To(e, l);
  let d = (l.tView = Nc(
    2,
    l,
    n,
    i,
    o,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    u,
    null
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, l), (d.queries = e.queries.embeddedTView(l))),
    l
  );
}
function We(t, e, r, n, i, o, s, a) {
  let c = z(),
    u = be(),
    l = t + Ge,
    d = u.firstCreatePass ? NC(l, u, c, e, r, n, i, o, s) : u.data[l];
  on(d, !1);
  let f = RC(u, c, d, t);
  xo() && No(u, c, f, d), At(f, c);
  let g = ah(f, c, f, d);
  return (
    (c[l] = g),
    ko(c, g),
    DC(g, d, c),
    Eo(d) && Oc(u, c, d),
    s != null && Pc(c, d, a),
    We
  );
}
var RC = FC;
function FC(t, e, r, n) {
  return So(!0), e[ee].createComment("");
}
function Bo(t, e, r, n) {
  let i = z(),
    o = Io();
  if (zn(i, o, e)) {
    let s = be(),
      a = yc();
    E0(a, i, t, e, r, n);
  }
  return Bo;
}
function Ch(t, e, r, n) {
  return zn(t, Io(), r) ? e + yo(r) + n : Nt;
}
function Ui(t, e) {
  return (t << 17) | (e << 2);
}
function tn(t) {
  return (t >> 17) & 32767;
}
function kC(t) {
  return (t & 2) == 2;
}
function LC(t, e) {
  return (t & 131071) | (e << 17);
}
function Ha(t) {
  return t | 2;
}
function Un(t) {
  return (t & 131068) >> 2;
}
function ca(t, e) {
  return (t & -131069) | (e << 2);
}
function jC(t) {
  return (t & 1) === 1;
}
function za(t) {
  return t | 1;
}
function VC(t, e, r, n, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = tn(s),
    c = Un(s);
  t[n] = r;
  let u = !1,
    l;
  if (Array.isArray(r)) {
    let d = r;
    (l = d[1]), (l === null || Ir(d, l) > 0) && (u = !0);
  } else l = r;
  if (i)
    if (c !== 0) {
      let f = tn(t[a + 1]);
      (t[n + 1] = Ui(f, a)),
        f !== 0 && (t[f + 1] = ca(t[f + 1], n)),
        (t[a + 1] = LC(t[a + 1], n));
    } else
      (t[n + 1] = Ui(a, 0)), a !== 0 && (t[a + 1] = ca(t[a + 1], n)), (a = n);
  else
    (t[n + 1] = Ui(c, 0)),
      a === 0 ? (a = n) : (t[c + 1] = ca(t[c + 1], n)),
      (c = n);
  u && (t[n + 1] = Ha(t[n + 1])),
    vd(t, l, n, !0),
    vd(t, l, n, !1),
    UC(e, l, t, n, o),
    (s = Ui(a, c)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function UC(t, e, r, n, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    Ir(o, e) >= 0 &&
    (r[n + 1] = za(r[n + 1]));
}
function vd(t, e, r, n) {
  let i = t[r + 1],
    o = e === null,
    s = n ? tn(i) : Un(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let c = t[s],
      u = t[s + 1];
    BC(c, e) && ((a = !0), (t[s + 1] = n ? za(u) : Ha(u))),
      (s = n ? tn(u) : Un(u));
  }
  a && (t[r + 1] = n ? Ha(i) : za(i));
}
function BC(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? Ir(t, e) >= 0
    : !1;
}
function te(t, e, r) {
  let n = z(),
    i = Io();
  if (zn(n, i, e)) {
    let o = be(),
      s = yc();
    ih(o, s, n, t, e, n[ee], r, !1);
  }
  return te;
}
function yd(t, e, r, n, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  Fc(t, r, o[s], s, n);
}
function Ar(t, e, r) {
  return _h(t, e, r, !1), Ar;
}
function Gn(t, e) {
  return _h(t, e, null, !0), Gn;
}
function _h(t, e, r, n) {
  let i = z(),
    o = be(),
    s = Hv(2);
  if ((o.firstUpdatePass && HC(o, t, s, n), e !== Nt && zn(i, s, e))) {
    let a = o.data[sn()];
    ZC(o, a, i, i[ee], t, (i[s + 1] = YC(e, r)), n, s);
  }
}
function $C(t, e) {
  return e >= t.expandoStartIndex;
}
function HC(t, e, r, n) {
  let i = t.data;
  if (i[r + 1] === null) {
    let o = i[sn()],
      s = $C(t, r);
    QC(o, n) && e === null && !s && (e = !1),
      (e = zC(i, o, e, n)),
      VC(i, o, e, r, s, n);
  }
}
function zC(t, e, r, n) {
  let i = qv(t),
    o = n ? e.residualClasses : e.residualStyles;
  if (i === null)
    (n ? e.classBindings : e.styleBindings) === 0 &&
      ((r = ua(null, t, e, r, n)), (r = Mr(r, e.attrs, n)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((r = ua(i, t, e, r, n)), o === null)) {
        let c = GC(t, e, n);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = ua(null, t, e, c[1], n)),
          (c = Mr(c, e.attrs, n)),
          WC(t, e, n, c));
      } else o = qC(t, e, n);
  }
  return (
    o !== void 0 && (n ? (e.residualClasses = o) : (e.residualStyles = o)), r
  );
}
function GC(t, e, r) {
  let n = r ? e.classBindings : e.styleBindings;
  if (Un(n) !== 0) return t[tn(n)];
}
function WC(t, e, r, n) {
  let i = r ? e.classBindings : e.styleBindings;
  t[tn(i)] = n;
}
function qC(t, e, r) {
  let n,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    n = Mr(n, s, r);
  }
  return Mr(n, e.attrs, r);
}
function ua(t, e, r, n, i) {
  let o = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast;
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((o = e[a]), (n = Mr(n, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (r.directiveStylingLast = a), n;
}
function Mr(t, e, r) {
  let n = r ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === n &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          Gm(t, s, r ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function ZC(t, e, r, n, i, o, s, a) {
  if (!(e.type & 3)) return;
  let c = t.data,
    u = c[a + 1],
    l = jC(u) ? Cd(c, e, r, i, Un(u), s) : void 0;
  if (!fo(l)) {
    fo(o) || (kC(u) && (o = Cd(c, null, r, i, a, s)));
    let d = uf(sn(), r);
    r0(n, s, d, i, o);
  }
}
function Cd(t, e, r, n, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let c = t[i],
      u = Array.isArray(c),
      l = u ? c[1] : c,
      d = l === null,
      f = r[i + 1];
    f === Nt && (f = d ? Le : void 0);
    let g = d ? Js(f, n) : l === n ? f : void 0;
    if ((u && !fo(g) && (g = Js(c, n)), fo(g) && ((a = g), s))) return a;
    let C = t[i + 1];
    i = s ? tn(C) : Un(C);
  }
  if (e !== null) {
    let c = o ? e.residualClasses : e.residualStyles;
    c != null && (a = Js(c, n));
  }
  return a;
}
function fo(t) {
  return t !== void 0;
}
function YC(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = ve(xr(t)))),
    t
  );
}
function QC(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
var Ga = class {
  destroy(e) {}
  updateValue(e, r) {}
  swap(e, r) {
    let n = Math.min(e, r),
      i = Math.max(e, r),
      o = this.detach(i);
    if (i - n > 1) {
      let s = this.detach(n);
      this.attach(n, o), this.attach(i, s);
    } else this.attach(n, o);
  }
  move(e, r) {
    this.attach(r, this.detach(e));
  }
};
function la(t, e, r, n, i) {
  return t === r && Object.is(e, n) ? 1 : Object.is(i(t, e), i(r, n)) ? -1 : 0;
}
function KC(t, e, r) {
  let n,
    i,
    o = 0,
    s = t.length - 1;
  if (Array.isArray(e)) {
    let a = e.length - 1;
    for (; o <= s && o <= a; ) {
      let c = t.at(o),
        u = e[o],
        l = la(o, c, o, u, r);
      if (l !== 0) {
        l < 0 && t.updateValue(o, u), o++;
        continue;
      }
      let d = t.at(s),
        f = e[a],
        g = la(s, d, a, f, r);
      if (g !== 0) {
        g < 0 && t.updateValue(s, f), s--, a--;
        continue;
      }
      let C = r(o, c),
        A = r(s, d),
        I = r(o, u);
      if (Object.is(I, A)) {
        let _ = r(a, f);
        Object.is(_, C)
          ? (t.swap(o, s), t.updateValue(s, f), a--, s--)
          : t.move(s, o),
          t.updateValue(o, u),
          o++;
        continue;
      }
      if (((n ??= new ho()), (i ??= Dd(t, o, s, r)), Wa(t, n, o, I)))
        t.updateValue(o, u), o++, s++;
      else if (i.has(I)) n.set(C, t.detach(o)), s--;
      else {
        let _ = t.create(o, e[o]);
        t.attach(o, _), o++, s++;
      }
    }
    for (; o <= a; ) _d(t, n, r, o, e[o]), o++;
  } else if (e != null) {
    let a = e[Symbol.iterator](),
      c = a.next();
    for (; !c.done && o <= s; ) {
      let u = t.at(o),
        l = c.value,
        d = la(o, u, o, l, r);
      if (d !== 0) d < 0 && t.updateValue(o, l), o++, (c = a.next());
      else {
        (n ??= new ho()), (i ??= Dd(t, o, s, r));
        let f = r(o, l);
        if (Wa(t, n, o, f)) t.updateValue(o, l), o++, s++, (c = a.next());
        else if (!i.has(f))
          t.attach(o, t.create(o, l)), o++, s++, (c = a.next());
        else {
          let g = r(o, u);
          n.set(g, t.detach(o)), s--;
        }
      }
    }
    for (; !c.done; ) _d(t, n, r, t.length, c.value), (c = a.next());
  }
  for (; o <= s; ) t.destroy(t.detach(s--));
  n?.forEach((a) => {
    t.destroy(a);
  });
}
function Wa(t, e, r, n) {
  return e !== void 0 && e.has(n)
    ? (t.attach(r, e.get(n)), e.delete(n), !0)
    : !1;
}
function _d(t, e, r, n, i) {
  if (Wa(t, e, n, r(n, i))) t.updateValue(n, i);
  else {
    let o = t.create(n, i);
    t.attach(n, o);
  }
}
function Dd(t, e, r, n) {
  let i = new Set();
  for (let o = e; o <= r; o++) i.add(n(o, t.at(o)));
  return i;
}
var ho = class {
  constructor() {
    (this.kvMap = new Map()), (this._vMap = void 0);
  }
  has(e) {
    return this.kvMap.has(e);
  }
  delete(e) {
    if (!this.has(e)) return !1;
    let r = this.kvMap.get(e);
    return (
      this._vMap !== void 0 && this._vMap.has(r)
        ? (this.kvMap.set(e, this._vMap.get(r)), this._vMap.delete(r))
        : this.kvMap.delete(e),
      !0
    );
  }
  get(e) {
    return this.kvMap.get(e);
  }
  set(e, r) {
    if (this.kvMap.has(e)) {
      let n = this.kvMap.get(e);
      this._vMap === void 0 && (this._vMap = new Map());
      let i = this._vMap;
      for (; i.has(n); ) n = i.get(n);
      i.set(n, r);
    } else this.kvMap.set(e, r);
  }
  forEach(e) {
    for (let [r, n] of this.kvMap)
      if ((e(n, r), this._vMap !== void 0)) {
        let i = this._vMap;
        for (; i.has(n); ) (n = i.get(n)), e(n, r);
      }
  }
};
var qa = class {
  constructor(e, r, n) {
    (this.lContainer = e), (this.$implicit = r), (this.$index = n);
  }
  get $count() {
    return this.lContainer.length - ye;
  }
};
function Ft(t) {
  return t;
}
var Za = class {
  constructor(e, r, n) {
    (this.hasEmptyBlock = e), (this.trackByFn = r), (this.liveCollection = n);
  }
};
function kt(t, e, r, n, i, o, s, a, c, u, l, d, f) {
  Tr("NgControlFlow");
  let g = c !== void 0,
    C = z(),
    A = a ? s.bind(C[ze][we]) : s,
    I = new Za(g, A);
  (C[Ge + t] = I), We(t + 1, e, r, n, i, o), g && We(t + 2, c, u, l, d, f);
}
var Ya = class extends Ga {
  constructor(e, r, n) {
    super(),
      (this.lContainer = e),
      (this.hostLView = r),
      (this.templateTNode = n),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - ye;
  }
  at(e) {
    return this.getLView(e)[we].$implicit;
  }
  attach(e, r) {
    let n = r[mr];
    (this.needsIndexUpdate ||= e !== this.length),
      jc(this.lContainer, r, e, ro(this.templateTNode, n));
  }
  detach(e) {
    return (
      (this.needsIndexUpdate ||= e !== this.length - 1), JC(this.lContainer, e)
    );
  }
  create(e, r) {
    let n = oo(this.lContainer, this.templateTNode.tView.ssrId);
    return Lc(
      this.hostLView,
      this.templateTNode,
      new qa(this.lContainer, r, e),
      { dehydratedView: n }
    );
  }
  destroy(e) {
    Po(e[F], e);
  }
  updateValue(e, r) {
    this.getLView(e)[we].$implicit = r;
  }
  reset() {
    this.needsIndexUpdate = !1;
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let e = 0; e < this.length; e++) this.getLView(e)[we].$index = e;
  }
  getLView(e) {
    return XC(this.lContainer, e);
  }
};
function Lt(t) {
  let e = U(null),
    r = sn();
  try {
    let n = z(),
      i = n[F],
      o = n[r];
    if (o.liveCollection === void 0) {
      let a = r + 1,
        c = wd(n, a),
        u = bd(i, a);
      o.liveCollection = new Ya(c, n, u);
    } else o.liveCollection.reset();
    let s = o.liveCollection;
    if ((KC(s, t, o.trackByFn), s.updateIndexes(), o.hasEmptyBlock)) {
      let a = Io(),
        c = s.length === 0;
      if (zn(n, a, c)) {
        let u = r + 2,
          l = wd(n, u);
        if (c) {
          let d = bd(i, u),
            f = oo(l, d.tView.ssrId),
            g = Lc(n, d, void 0, { dehydratedView: f });
          jc(l, g, 0, ro(d, f));
        } else k0(l, 0);
      }
    }
  } finally {
    U(e);
  }
}
function wd(t, e) {
  return t[e];
}
function JC(t, e) {
  return Dr(t, e);
}
function XC(t, e) {
  return F0(t, e);
}
function bd(t, e) {
  return fc(t, e);
}
function e_(t, e, r, n, i, o) {
  let s = e.consts,
    a = Ln(s, i),
    c = Sr(e, t, 2, n, a);
  return (
    Rc(e, r, c, Ln(s, o)),
    c.attrs !== null && co(c, c.attrs, !1),
    c.mergedAttrs !== null && co(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function h(t, e, r, n) {
  let i = z(),
    o = be(),
    s = Ge + t,
    a = i[ee],
    c = o.firstCreatePass ? e_(s, o, i, e, r, n) : o.data[s],
    u = t_(o, i, c, a, e, t);
  i[s] = u;
  let l = Eo(c);
  return (
    on(c, !0),
    Kf(a, u, c),
    !PC(c) && xo() && No(o, i, u, c),
    Nv() === 0 && At(u, i),
    Rv(),
    l && (Oc(o, i, c), Ac(o, c, i)),
    n !== null && Pc(i, c),
    h
  );
}
function p() {
  let t = Me();
  gc() ? pf() : ((t = t.parent), on(t, !1));
  let e = t;
  Lv(e) && jv(), Fv();
  let r = be();
  return (
    r.firstCreatePass && (To(r, t), dc(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      ty(e) &&
      yd(r, e, z(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      ny(e) &&
      yd(r, e, z(), e.stylesWithoutHost, !1),
    p
  );
}
function E(t, e, r, n) {
  return h(t, e, r, n), p(), E;
}
var t_ = (t, e, r, n, i, o) => (So(!0), Gf(n, i, Kv()));
function n_(t, e, r, n, i) {
  let o = e.consts,
    s = Ln(o, n),
    a = Sr(e, t, 8, "ng-container", s);
  s !== null && co(a, s, !0);
  let c = Ln(o, i);
  return Rc(e, r, a, c), e.queries !== null && e.queries.elementStart(e, a), a;
}
function $o(t, e, r) {
  let n = z(),
    i = be(),
    o = t + Ge,
    s = i.firstCreatePass ? n_(o, i, n, e, r) : i.data[o];
  on(s, !0);
  let a = r_(i, n, s, t);
  return (
    (n[o] = a),
    xo() && No(i, n, a, s),
    At(a, n),
    Eo(s) && (Oc(i, n, s), Ac(i, s, n)),
    r != null && Pc(n, s),
    $o
  );
}
function Ho() {
  let t = Me(),
    e = be();
  return (
    gc() ? pf() : ((t = t.parent), on(t, !1)),
    e.firstCreatePass && (To(e, t), dc(t) && e.queries.elementEnd(t)),
    Ho
  );
}
function Hc(t, e, r) {
  return $o(t, e, r), Ho(), Hc;
}
var r_ = (t, e, r, n) => (So(!0), Vy(e[ee], ""));
var po = "en-US";
var i_ = po;
function o_(t) {
  typeof t == "string" && (i_ = t.toLowerCase().replace(/_/g, "-"));
}
function Ee(t, e, r, n) {
  let i = z(),
    o = be(),
    s = Me();
  return a_(o, i, i[ee], s, t, e, n), Ee;
}
function s_(t, e, r, n) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === r && i[o + 1] === n) {
        let a = e[vr],
          c = i[o + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function a_(t, e, r, n, i, o, s) {
  let a = Eo(n),
    u = t.firstCreatePass && A0(t),
    l = e[we],
    d = T0(e),
    f = !0;
  if (n.type & 3 || s) {
    let A = je(n, e),
      I = s ? s(A) : A,
      _ = d.length,
      ue = s ? (Y) => s(tt(Y[n.index])) : n.index,
      oe = null;
    if ((!s && a && (oe = s_(t, e, i, n.index)), oe !== null)) {
      let Y = oe.__ngLastListenerFn__ || oe;
      (Y.__ngNextListenerFn__ = o), (oe.__ngLastListenerFn__ = o), (f = !1);
    } else {
      o = Ed(n, e, l, o, !1);
      let Y = r.listen(I, i, o);
      d.push(o, Y), u && u.push(i, ue, _, _ + 1);
    }
  } else o = Ed(n, e, l, o, !1);
  let g = n.outputs,
    C;
  if (f && g !== null && (C = g[i])) {
    let A = C.length;
    if (A)
      for (let I = 0; I < A; I += 2) {
        let _ = C[I],
          ue = C[I + 1],
          Qe = e[_][ue].subscribe(o),
          Ie = d.length;
        d.push(o, Qe), u && u.push(i, n.index, Ie, -(Ie + 1));
      }
  }
}
function Md(t, e, r, n) {
  let i = U(null);
  try {
    return Je(6, e, r), r(n) !== !1;
  } catch (o) {
    return uh(t, o), !1;
  } finally {
    Je(7, e, r), U(i);
  }
}
function Ed(t, e, r, n, i) {
  return function o(s) {
    if (s === Function) return n;
    let a = t.componentOffset > -1 ? Pt(t.index, e) : e;
    Vc(a);
    let c = Md(e, r, n, s),
      u = o.__ngNextListenerFn__;
    for (; u; ) (c = Md(e, r, u, s) && c), (u = u.__ngNextListenerFn__);
    return i && c === !1 && s.preventDefault(), c;
  };
}
function Dh(t = 1) {
  return Yv(t);
}
function Wn(t, e, r) {
  return un(t, "", e, "", r), Wn;
}
function un(t, e, r, n, i) {
  let o = z(),
    s = Ch(o, e, r, n);
  if (s !== Nt) {
    let a = be(),
      c = yc();
    ih(a, c, o, t, s, o[ee], i, !1);
  }
  return un;
}
function zc(t) {
  let e = Uv();
  return Sv(e, Ge + t);
}
function m(t, e = "") {
  let r = z(),
    n = be(),
    i = t + Ge,
    o = n.firstCreatePass ? Sr(n, i, 1, e, null) : n.data[i],
    s = c_(n, r, o, e, t);
  (r[i] = s), xo() && No(n, r, s, o), on(o, !1);
}
var c_ = (t, e, r, n, i) => (So(!0), Ly(e[ee], n));
function re(t) {
  return Pe("", t, ""), re;
}
function Pe(t, e, r) {
  let n = z(),
    i = Ch(n, t, e, r);
  return i !== Nt && O0(n, sn(), i), Pe;
}
function u_(t, e, r) {
  let n = be();
  if (n.firstCreatePass) {
    let i = Tt(t);
    Qa(r, n.data, n.blueprint, i, !0), Qa(e, n.data, n.blueprint, i, !1);
  }
}
function Qa(t, e, r, n, i) {
  if (((t = ge(t)), Array.isArray(t)))
    for (let o = 0; o < t.length; o++) Qa(t[o], e, r, n, i);
  else {
    let o = be(),
      s = z(),
      a = Me(),
      c = Rn(t) ? t : ge(t.provide),
      u = Xd(t),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20;
    if (Rn(t) || !t.multi) {
      let g = new Xt(u, i, L),
        C = fa(c, e, i ? l : l + f, d);
      C === -1
        ? (Ea(eo(a, s), o, c),
          da(o, t, e.length),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(g),
          s.push(g))
        : ((r[C] = g), (s[C] = g));
    } else {
      let g = fa(c, e, l + f, d),
        C = fa(c, e, l, l + f),
        A = g >= 0 && r[g],
        I = C >= 0 && r[C];
      if ((i && !I) || (!i && !A)) {
        Ea(eo(a, s), o, c);
        let _ = f_(i ? d_ : l_, r.length, i, n, u);
        !i && I && (r[C].providerFactory = _),
          da(o, t, e.length, 0),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(_),
          s.push(_);
      } else {
        let _ = wh(r[i ? C : g], u, !i && n);
        da(o, t, g > -1 ? g : C, _);
      }
      !i && n && I && r[C].componentProviders++;
    }
  }
}
function da(t, e, r, n) {
  let i = Rn(e),
    o = fv(e);
  if (i || o) {
    let c = (o ? ge(e.useClass) : e).prototype.ngOnDestroy;
    if (c) {
      let u = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let l = u.indexOf(r);
        l === -1 ? u.push(r, [n, c]) : u[l + 1].push(n, c);
      } else u.push(r, c);
    }
  }
}
function wh(t, e, r) {
  return r && t.componentProviders++, t.multi.push(e) - 1;
}
function fa(t, e, r, n) {
  for (let i = r; i < n; i++) if (e[i] === t) return i;
  return -1;
}
function l_(t, e, r, n) {
  return Ka(this.multi, []);
}
function d_(t, e, r, n) {
  let i = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = jn(r, r[F], this.providerFactory.index, n);
    (o = a.slice(0, s)), Ka(i, o);
    for (let c = s; c < a.length; c++) o.push(a[c]);
  } else (o = []), Ka(i, o);
  return o;
}
function Ka(t, e) {
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    e.push(n());
  }
  return e;
}
function f_(t, e, r, n, i) {
  let o = new Xt(t, r, L);
  return (
    (o.multi = []),
    (o.index = e),
    (o.componentProviders = 0),
    wh(o, i, n && !r),
    o
  );
}
function Or(t, e = []) {
  return (r) => {
    r.providersResolver = (n, i) => u_(n, i ? i(t) : t, e);
  };
}
var h_ = (() => {
  let e = class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let i = Qd(!1, n.type),
          o =
            i.length > 0
              ? Uo([i], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = w({
    token: e,
    providedIn: "environment",
    factory: () => new e(x(fe)),
  });
  let t = e;
  return t;
})();
function q(t) {
  Tr("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(h_).getOrCreateStandaloneInjector(t));
}
function bh(t, e, r, n) {
  return g_(z(), Bv(), t, e, r, n);
}
function p_(t, e) {
  let r = t[e];
  return r === Nt ? void 0 : r;
}
function g_(t, e, r, n, i, o) {
  let s = e + r;
  return zn(t, s, i) ? OC(t, s + 1, o ? n.call(o, i) : n(i)) : p_(t, s + 1);
}
function Gc(t, e) {
  return mh(t, e);
}
var zo = (() => {
  let e = class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" }));
  let t = e;
  return t;
})();
var Mh = new D("");
function ln(t) {
  return !!t && typeof t.then == "function";
}
function Eh(t) {
  return !!t && typeof t.subscribe == "function";
}
var Go = new D(""),
  Ih = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            (this.resolve = n), (this.reject = i);
          })),
          (this.appInits = v(Go, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let s = o();
          if (ln(s)) n.push(s);
          else if (Eh(s)) {
            let a = new Promise((c, u) => {
              s.subscribe({ complete: c, error: u });
            });
            n.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Pr = new D("");
function m_() {
  vl(() => {
    throw new b(600, !1);
  });
}
function v_(t) {
  return t.isBoundToModule;
}
function y_(t, e, r) {
  try {
    let n = r();
    return ln(n)
      ? n.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : n;
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n);
  }
}
var qn = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = v(Nf)),
        (this.afterRenderEffectManager = v(Bc)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new le()),
        (this.afterTick = new le()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = v(cn).hasPendingTasks.pipe(P((n) => !n))),
        (this._injector = v(fe));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, i) {
      let o = n instanceof ao;
      if (!this._injector.get(Ih).done) {
        let g = !o && Wd(n),
          C = !1;
        throw new b(405, C);
      }
      let a;
      o ? (a = n) : (a = this._injector.get(jo).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let c = v_(a) ? void 0 : this._injector.get(Ot),
        u = i || a.selector,
        l = a.create(mt.NULL, [], u, c),
        d = l.location.nativeElement,
        f = l.injector.get(Mh, null);
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            ha(this.components, l),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(n) {
      if (this._runningTick) throw new b(101, !1);
      let i = U(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(n);
      } catch (o) {
        this.internalErrorHandler(o);
      } finally {
        this.afterTick.next(), (this._runningTick = !1), U(i);
      }
    }
    detectChangesInAttachedViews(n) {
      let i = 0,
        o = this.afterRenderEffectManager;
      for (;;) {
        if (i === dh) throw new b(103, !1);
        if (n) {
          let s = i === 0;
          this.beforeRender.next(s);
          for (let { _lView: a, notifyErrorHandler: c } of this._views)
            C_(a, s, c);
        }
        if (
          (i++,
          o.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => Ja(s)
          ) &&
            (o.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => Ja(s)
            )))
        )
          break;
      }
    }
    attachView(n) {
      let i = n;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(n) {
      let i = n;
      ha(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let i = this._injector.get(Pr, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => ha(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new b(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function ha(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function C_(t, e, r) {
  (!e && !Ja(t)) || __(t, r, e);
}
function Ja(t) {
  return pc(t);
}
function __(t, e, r) {
  let n;
  r ? ((n = 0), (t[T] |= 1024)) : t[T] & 64 ? (n = 0) : (n = 1), fh(t, e, n);
}
var Xa = class {
    constructor(e, r) {
      (this.ngModuleFactory = e), (this.componentFactories = r);
    }
  },
  Wo = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new $a(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          o = qd(n),
          s = zf(o.declarations).reduce((a, c) => {
            let u = St(c);
            return u && a.push(new Vn(u)), a;
          }, []);
        return new Xa(i, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var D_ = (() => {
  let e = class e {
    constructor() {
      (this.zone = v(Q)), (this.applicationRef = v(qn));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function w_(t) {
  return [
    { provide: Q, useFactory: t },
    {
      provide: Nn,
      multi: !0,
      useFactory: () => {
        let e = v(D_, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: Nn,
      multi: !0,
      useFactory: () => {
        let e = v(I_);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: Nf, useFactory: b_ },
  ];
}
function b_() {
  let t = v(Q),
    e = v(nt);
  return (r) => t.runOutsideAngular(() => e.handleError(r));
}
function M_(t) {
  let e = w_(() => new Q(E_(t)));
  return Bn([[], e]);
}
function E_(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var I_ = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new X()),
        (this.initialized = !1),
        (this.zone = v(Q)),
        (this.pendingTasks = v(cn));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              Q.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            Q.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function x_() {
  return (typeof $localize < "u" && $localize.locale) || po;
}
var Wc = new D("", {
  providedIn: "root",
  factory: () => v(Wc, R.Optional | R.SkipSelf) || x_(),
});
var xh = new D("");
var Gi = null;
function S_(t = [], e) {
  return mt.create({
    name: e,
    providers: [
      { provide: Do, useValue: "platform" },
      { provide: xh, useValue: new Set([() => (Gi = null)]) },
      ...t,
    ],
  });
}
function T_(t = []) {
  if (Gi) return Gi;
  let e = S_(t);
  return (Gi = e), m_(), A_(e), e;
}
function A_(t) {
  t.get(bc, null)?.forEach((r) => r());
}
var Zn = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = O_;
  let t = e;
  return t;
})();
function O_(t) {
  return P_(Me(), z(), (t & 16) === 16);
}
function P_(t, e, r) {
  if (Mo(t) && !r) {
    let n = Pt(t.index, e);
    return new en(n, n);
  } else if (t.type & 47) {
    let n = e[ze];
    return new en(n, e);
  }
  return null;
}
var ec = class {
    constructor() {}
    supports(e) {
      return yh(e);
    }
    create(e) {
      return new tc(e);
    }
  },
  N_ = (t, e) => e,
  tc = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || N_);
    }
    forEachItem(e) {
      let r;
      for (r = this._itHead; r !== null; r = r._next) e(r);
    }
    forEachOperation(e) {
      let r = this._itHead,
        n = this._removalsHead,
        i = 0,
        o = null;
      for (; r || n; ) {
        let s = !n || (r && r.currentIndex < Id(n, i, o)) ? r : n,
          a = Id(s, i, o),
          c = s.currentIndex;
        if (s === n) i--, (n = n._nextRemoved);
        else if (((r = r._next), s.previousIndex == null)) i++;
        else {
          o || (o = []);
          let u = a - i,
            l = c - i;
          if (u != l) {
            for (let f = 0; f < u; f++) {
              let g = f < o.length ? o[f] : (o[f] = 0),
                C = g + f;
              l <= C && C < u && (o[f] = g + 1);
            }
            let d = s.previousIndex;
            o[d] = l - u;
          }
        }
        a !== c && e(s, a, c);
      }
    }
    forEachPreviousItem(e) {
      let r;
      for (r = this._previousItHead; r !== null; r = r._nextPrevious) e(r);
    }
    forEachAddedItem(e) {
      let r;
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
    }
    forEachMovedItem(e) {
      let r;
      for (r = this._movesHead; r !== null; r = r._nextMoved) e(r);
    }
    forEachRemovedItem(e) {
      let r;
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
    }
    forEachIdentityChange(e) {
      let r;
      for (r = this._identityChangesHead; r !== null; r = r._nextIdentityChange)
        e(r);
    }
    diff(e) {
      if ((e == null && (e = []), !yh(e))) throw new b(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let r = this._itHead,
        n = !1,
        i,
        o,
        s;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (o = e[a]),
            (s = this._trackByFn(a, o)),
            r === null || !Object.is(r.trackById, s)
              ? ((r = this._mismatch(r, o, s, a)), (n = !0))
              : (n && (r = this._verifyReinsertion(r, o, s, a)),
                Object.is(r.item, o) || this._addIdentityChange(r, o)),
            (r = r._next);
      } else
        (i = 0),
          TC(e, (a) => {
            (s = this._trackByFn(i, a)),
              r === null || !Object.is(r.trackById, s)
                ? ((r = this._mismatch(r, a, s, i)), (n = !0))
                : (n && (r = this._verifyReinsertion(r, a, s, i)),
                  Object.is(r.item, a) || this._addIdentityChange(r, a)),
              (r = r._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(r), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, r, n, i) {
      let o;
      return (
        e === null ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(n, null)),
        e !== null
          ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
            this._reinsertAfter(e, o, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(n, i)),
            e !== null
              ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new nc(r, n), o, i))),
        e
      );
    }
    _verifyReinsertion(e, r, n, i) {
      let o =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(n, null);
      return (
        o !== null
          ? (e = this._reinsertAfter(o, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let r = e._next;
        this._addToRemovals(this._unlink(e)), (e = r);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, r, n) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        o = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
        o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
        this._insertAfter(e, r, n),
        this._addToMoves(e, n),
        e
      );
    }
    _moveAfter(e, r, n) {
      return (
        this._unlink(e), this._insertAfter(e, r, n), this._addToMoves(e, n), e
      );
    }
    _addAfter(e, r, n) {
      return (
        this._insertAfter(e, r, n),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, r, n) {
      let i = r === null ? this._itHead : r._next;
      return (
        (e._next = i),
        (e._prev = r),
        i === null ? (this._itTail = e) : (i._prev = e),
        r === null ? (this._itHead = e) : (r._next = e),
        this._linkedRecords === null && (this._linkedRecords = new go()),
        this._linkedRecords.put(e),
        (e.currentIndex = n),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let r = e._prev,
        n = e._next;
      return (
        r === null ? (this._itHead = n) : (r._next = n),
        n === null ? (this._itTail = r) : (n._prev = r),
        e
      );
    }
    _addToMoves(e, r) {
      return (
        e.previousIndex === r ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new go()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, r) {
      return (
        (e.item = r),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  nc = class {
    constructor(e, r) {
      (this.item = e),
        (this.trackById = r),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  rc = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, r) {
      let n;
      for (n = this._head; n !== null; n = n._nextDup)
        if ((r === null || r <= n.currentIndex) && Object.is(n.trackById, e))
          return n;
      return null;
    }
    remove(e) {
      let r = e._prevDup,
        n = e._nextDup;
      return (
        r === null ? (this._head = n) : (r._nextDup = n),
        n === null ? (this._tail = r) : (n._prevDup = r),
        this._head === null
      );
    }
  },
  go = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let r = e.trackById,
        n = this.map.get(r);
      n || ((n = new rc()), this.map.set(r, n)), n.add(e);
    }
    get(e, r) {
      let n = e,
        i = this.map.get(n);
      return i ? i.get(e, r) : null;
    }
    remove(e) {
      let r = e.trackById;
      return this.map.get(r).remove(e) && this.map.delete(r), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function Id(t, e, r) {
  let n = t.previousIndex;
  if (n === null) return n;
  let i = 0;
  return r && n < r.length && (i = r[n]), n + e + i;
}
function xd() {
  return new qc([new ec()]);
}
var qc = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n;
    }
    static create(n, i) {
      if (i != null) {
        let o = i.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (i) => e.create(n, i || xd()),
        deps: [[e, new oc(), new _o()]],
      };
    }
    find(n) {
      let i = this.factories.find((o) => o.supports(n));
      if (i != null) return i;
      throw new b(901, !1);
    }
  };
  e.ɵprov = w({ token: e, providedIn: "root", factory: xd });
  let t = e;
  return t;
})();
function Sh(t) {
  try {
    let { rootComponent: e, appProviders: r, platformProviders: n } = t,
      i = T_(n),
      o = [M_(), ...(r || [])],
      a = new lo({
        providers: o,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      }).injector,
      c = a.get(Q);
    return c.run(() => {
      a.resolveInjectorInitializers();
      let u = a.get(nt, null),
        l;
      c.runOutsideAngular(() => {
        l = c.onError.subscribe({
          next: (g) => {
            u.handleError(g);
          },
        });
      });
      let d = () => a.destroy(),
        f = i.get(xh);
      return (
        f.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), f.delete(d);
        }),
        y_(u, c, () => {
          let g = a.get(Ih);
          return (
            g.runInitializers(),
            g.donePromise.then(() => {
              let C = a.get(Wc, po);
              o_(C || po);
              let A = a.get(qn);
              return e !== void 0 && A.bootstrap(e), A;
            })
          );
        })
      );
    });
  } catch (e) {
    return Promise.reject(e);
  }
}
function Yn(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
function Th(t) {
  let e = St(t);
  if (!e) return null;
  let r = new Vn(e);
  return {
    get selector() {
      return r.selector;
    },
    get type() {
      return r.componentType;
    },
    get inputs() {
      return r.inputs;
    },
    get outputs() {
      return r.outputs;
    },
    get ngContentSelectors() {
      return r.ngContentSelectors;
    },
    get isStandalone() {
      return e.standalone;
    },
    get isSignal() {
      return e.signals;
    },
  };
}
var Fh = null;
function yt() {
  return Fh;
}
function kh(t) {
  Fh ??= t;
}
var qo = class {};
var pe = new D(""),
  eu = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => v(R_), providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Lh = new D(""),
  R_ = (() => {
    let e = class e extends eu {
      constructor() {
        super(),
          (this._doc = v(pe)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return yt().getBaseHref(this._doc);
      }
      onPopState(n) {
        let i = yt().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("popstate", n, !1),
          () => i.removeEventListener("popstate", n)
        );
      }
      onHashChange(n) {
        let i = yt().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("hashchange", n, !1),
          () => i.removeEventListener("hashchange", n)
        );
      }
      get href() {
        return this._location.href;
      }
      get protocol() {
        return this._location.protocol;
      }
      get hostname() {
        return this._location.hostname;
      }
      get port() {
        return this._location.port;
      }
      get pathname() {
        return this._location.pathname;
      }
      get search() {
        return this._location.search;
      }
      get hash() {
        return this._location.hash;
      }
      set pathname(n) {
        this._location.pathname = n;
      }
      pushState(n, i, o) {
        this._history.pushState(n, i, o);
      }
      replaceState(n, i, o) {
        this._history.replaceState(n, i, o);
      }
      forward() {
        this._history.forward();
      }
      back() {
        this._history.back();
      }
      historyGo(n = 0) {
        this._history.go(n);
      }
      getState() {
        return this._history.state;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })();
function tu(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let r = 0;
  return (
    t.endsWith("/") && r++,
    e.startsWith("/") && r++,
    r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + "/" + e
  );
}
function Ah(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === "/" ? 1 : 0);
  return t.slice(0, n) + t.slice(r);
}
function vt(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var Ct = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => v(nu), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  jh = new D(""),
  nu = (() => {
    let e = class e extends Ct {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            v(pe).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return tu(this._baseHref, n);
      }
      path(n = !1) {
        let i =
            this._platformLocation.pathname + vt(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${i}${o}` : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + vt(s));
        this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + vt(s));
        this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(eu), x(jh, 8));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Vh = (() => {
    let e = class e extends Ct {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._baseHref = ""),
          (this._removeListenerFns = []),
          i != null && (this._baseHref = i);
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      path(n = !1) {
        let i = this._platformLocation.hash ?? "#";
        return i.length > 0 ? i.substring(1) : i;
      }
      prepareExternalUrl(n) {
        let i = tu(this._baseHref, n);
        return i.length > 0 ? "#" + i : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + vt(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + vt(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(eu), x(jh, 8));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Kn = (() => {
    let e = class e {
      constructor(n) {
        (this._subject = new me()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = n);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = L_(Ah(Oh(i)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: o.state,
              type: o.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(n = !1) {
        return this.normalize(this._locationStrategy.path(n));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(n, i = "") {
        return this.path() == this.normalize(n + vt(i));
      }
      normalize(n) {
        return e.stripTrailingSlash(k_(this._basePath, Oh(n)));
      }
      prepareExternalUrl(n) {
        return (
          n && n[0] !== "/" && (n = "/" + n),
          this._locationStrategy.prepareExternalUrl(n)
        );
      }
      go(n, i = "", o = null) {
        this._locationStrategy.pushState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + vt(i)), o);
      }
      replaceState(n, i = "", o = null) {
        this._locationStrategy.replaceState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + vt(i)), o);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(n = 0) {
        this._locationStrategy.historyGo?.(n);
      }
      onUrlChange(n) {
        return (
          this._urlChangeListeners.push(n),
          (this._urlChangeSubscription ??= this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
          () => {
            let i = this._urlChangeListeners.indexOf(n);
            this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(n = "", i) {
        this._urlChangeListeners.forEach((o) => o(n, i));
      }
      subscribe(n, i, o) {
        return this._subject.subscribe({ next: n, error: i, complete: o });
      }
    };
    (e.normalizeQueryParams = vt),
      (e.joinWithSlash = tu),
      (e.stripTrailingSlash = Ah),
      (e.ɵfac = function (i) {
        return new (i || e)(x(Ct));
      }),
      (e.ɵprov = w({ token: e, factory: () => F_(), providedIn: "root" }));
    let t = e;
    return t;
  })();
function F_() {
  return new Kn(x(Ct));
}
function k_(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let r = e.substring(t.length);
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : e;
}
function Oh(t) {
  return t.replace(/\/index.html$/, "");
}
function L_(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/);
    return r;
  }
  return t;
}
function Zo(t, e) {
  e = encodeURIComponent(e);
  for (let r of t.split(";")) {
    let n = r.indexOf("="),
      [i, o] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var Zc = /\s+/,
  Ph = [],
  Uh = (() => {
    let e = class e {
      constructor(n, i) {
        (this._ngEl = n),
          (this._renderer = i),
          (this.initialClasses = Ph),
          (this.stateMap = new Map());
      }
      set klass(n) {
        this.initialClasses = n != null ? n.trim().split(Zc) : Ph;
      }
      set ngClass(n) {
        this.rawClass = typeof n == "string" ? n.trim().split(Zc) : n;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let n = this.rawClass;
        if (Array.isArray(n) || n instanceof Set)
          for (let i of n) this._updateState(i, !0);
        else if (n != null)
          for (let i of Object.keys(n)) this._updateState(i, !!n[i]);
        this._applyStateDiff();
      }
      _updateState(n, i) {
        let o = this.stateMap.get(n);
        o !== void 0
          ? (o.enabled !== i && ((o.changed = !0), (o.enabled = i)),
            (o.touched = !0))
          : this.stateMap.set(n, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let n of this.stateMap) {
          let i = n[0],
            o = n[1];
          o.changed
            ? (this._toggleClass(i, o.enabled), (o.changed = !1))
            : o.touched ||
              (o.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (o.touched = !1);
        }
      }
      _toggleClass(n, i) {
        (n = n.trim()),
          n.length > 0 &&
            n.split(Zc).forEach((o) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(Ye), L(st));
    }),
      (e.ɵdir = ae({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [de.None, "class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var Yc = class {
    constructor(e, r, n, i) {
      (this.$implicit = e),
        (this.ngForOf = r),
        (this.index = n),
        (this.count = i);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  Yo = (() => {
    let e = class e {
      set ngForOf(n) {
        (this._ngForOf = n), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(n) {
        this._trackByFn = n;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(n, i, o) {
        (this._viewContainer = n),
          (this._template = i),
          (this._differs = o),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(n) {
        n && (this._template = n);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let n = this._ngForOf;
          if (!this._differ && n)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(n).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let n = this._differ.diff(this._ngForOf);
          n && this._applyChanges(n);
        }
      }
      _applyChanges(n) {
        let i = this._viewContainer;
        n.forEachOperation((o, s, a) => {
          if (o.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new Yc(o.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            );
          else if (a == null) i.remove(s === null ? void 0 : s);
          else if (s !== null) {
            let c = i.get(s);
            i.move(c, a), Nh(c, o);
          }
        });
        for (let o = 0, s = i.length; o < s; o++) {
          let c = i.get(o).context;
          (c.index = o), (c.count = s), (c.ngForOf = this._ngForOf);
        }
        n.forEachIdentityChange((o) => {
          let s = i.get(o.currentIndex);
          Nh(s, o);
        });
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(Hn), L(Lo), L(qc));
    }),
      (e.ɵdir = ae({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function Nh(t, e) {
  t.context.$implicit = e.item;
}
var Qo = (() => {
    let e = class e {
      constructor(n, i) {
        (this._viewContainer = n),
          (this._context = new Qc()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = i);
      }
      set ngIf(n) {
        (this._context.$implicit = this._context.ngIf = n), this._updateView();
      }
      set ngIfThen(n) {
        Rh("ngIfThen", n),
          (this._thenTemplateRef = n),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(n) {
        Rh("ngIfElse", n),
          (this._elseTemplateRef = n),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context
              )));
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(Hn), L(Lo));
    }),
      (e.ɵdir = ae({
        type: e,
        selectors: [["", "ngIf", ""]],
        inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  Qc = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function Rh(t, e) {
  if (!!!(!e || e.createEmbeddedView))
    throw new Error(`${t} must be a TemplateRef, but received '${ve(e)}'.`);
}
var Ne = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = it({ type: e })),
      (e.ɵinj = rt({}));
    let t = e;
    return t;
  })(),
  ru = "browser",
  j_ = "server";
function V_(t) {
  return t === ru;
}
function Ko(t) {
  return t === j_;
}
var Bh = (() => {
    let e = class e {};
    e.ɵprov = w({
      token: e,
      providedIn: "root",
      factory: () => (V_(v(ot)) ? new Kc(v(pe), window) : new Jc()),
    });
    let t = e;
    return t;
  })(),
  Kc = class {
    constructor(e, r) {
      (this.document = e), (this.window = r), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      let r = U_(this.document, e);
      r && (this.scrollToElement(r), r.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let r = e.getBoundingClientRect(),
        n = r.left + this.window.pageXOffset,
        i = r.top + this.window.pageYOffset,
        o = this.offset();
      this.window.scrollTo(n - o[0], i - o[1]);
    }
  };
function U_(t, e) {
  let r = t.getElementById(e) || t.getElementsByName(e)[0];
  if (r) return r;
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let n = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = n.currentNode;
    for (; i; ) {
      let o = i.shadowRoot;
      if (o) {
        let s = o.getElementById(e) || o.querySelector(`[name="${e}"]`);
        if (s) return s;
      }
      i = n.nextNode();
    }
  }
  return null;
}
var Jc = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  Qn = class {};
var Fr = class {},
  Xo = class {},
  dn = class t {
    constructor(e) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        e
          ? typeof e == "string"
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  e
                    .split(
                      `
`
                    )
                    .forEach((r) => {
                      let n = r.indexOf(":");
                      if (n > 0) {
                        let i = r.slice(0, n),
                          o = i.toLowerCase(),
                          s = r.slice(n + 1).trim();
                        this.maybeSetNormalizedName(i, o),
                          this.headers.has(o)
                            ? this.headers.get(o).push(s)
                            : this.headers.set(o, [s]);
                      }
                    });
              })
            : typeof Headers < "u" && e instanceof Headers
            ? ((this.headers = new Map()),
              e.forEach((r, n) => {
                this.setHeaderEntries(n, r);
              }))
            : (this.lazyInit = () => {
                (this.headers = new Map()),
                  Object.entries(e).forEach(([r, n]) => {
                    this.setHeaderEntries(r, n);
                  });
              })
          : (this.headers = new Map());
    }
    has(e) {
      return this.init(), this.headers.has(e.toLowerCase());
    }
    get(e) {
      this.init();
      let r = this.headers.get(e.toLowerCase());
      return r && r.length > 0 ? r[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(e) {
      return this.init(), this.headers.get(e.toLowerCase()) || null;
    }
    append(e, r) {
      return this.clone({ name: e, value: r, op: "a" });
    }
    set(e, r) {
      return this.clone({ name: e, value: r, op: "s" });
    }
    delete(e, r) {
      return this.clone({ name: e, value: r, op: "d" });
    }
    maybeSetNormalizedName(e, r) {
      this.normalizedNames.has(r) || this.normalizedNames.set(r, e);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof t
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
          (this.lazyUpdate = null)));
    }
    copyFrom(e) {
      e.init(),
        Array.from(e.headers.keys()).forEach((r) => {
          this.headers.set(r, e.headers.get(r)),
            this.normalizedNames.set(r, e.normalizedNames.get(r));
        });
    }
    clone(e) {
      let r = new t();
      return (
        (r.lazyInit =
          this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
        (r.lazyUpdate = (this.lazyUpdate || []).concat([e])),
        r
      );
    }
    applyUpdate(e) {
      let r = e.name.toLowerCase();
      switch (e.op) {
        case "a":
        case "s":
          let n = e.value;
          if ((typeof n == "string" && (n = [n]), n.length === 0)) return;
          this.maybeSetNormalizedName(e.name, r);
          let i = (e.op === "a" ? this.headers.get(r) : void 0) || [];
          i.push(...n), this.headers.set(r, i);
          break;
        case "d":
          let o = e.value;
          if (!o) this.headers.delete(r), this.normalizedNames.delete(r);
          else {
            let s = this.headers.get(r);
            if (!s) return;
            (s = s.filter((a) => o.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(r), this.normalizedNames.delete(r))
                : this.headers.set(r, s);
          }
          break;
      }
    }
    setHeaderEntries(e, r) {
      let n = (Array.isArray(r) ? r : [r]).map((o) => o.toString()),
        i = e.toLowerCase();
      this.headers.set(i, n), this.maybeSetNormalizedName(e, i);
    }
    forEach(e) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((r) =>
          e(this.normalizedNames.get(r), this.headers.get(r))
        );
    }
  };
var ou = class {
  encodeKey(e) {
    return $h(e);
  }
  encodeValue(e) {
    return $h(e);
  }
  decodeKey(e) {
    return decodeURIComponent(e);
  }
  decodeValue(e) {
    return decodeURIComponent(e);
  }
};
function H_(t, e) {
  let r = new Map();
  return (
    t.length > 0 &&
      t
        .replace(/^\?/, "")
        .split("&")
        .forEach((i) => {
          let o = i.indexOf("="),
            [s, a] =
              o == -1
                ? [e.decodeKey(i), ""]
                : [e.decodeKey(i.slice(0, o)), e.decodeValue(i.slice(o + 1))],
            c = r.get(s) || [];
          c.push(a), r.set(s, c);
        }),
    r
  );
}
var z_ = /%(\d[a-f0-9])/gi,
  G_ = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function $h(t) {
  return encodeURIComponent(t).replace(z_, (e, r) => G_[r] ?? e);
}
function Jo(t) {
  return `${t}`;
}
var jt = class t {
  constructor(e = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = e.encoder || new ou()),
      e.fromString)
    ) {
      if (e.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = H_(e.fromString, this.encoder);
    } else
      e.fromObject
        ? ((this.map = new Map()),
          Object.keys(e.fromObject).forEach((r) => {
            let n = e.fromObject[r],
              i = Array.isArray(n) ? n.map(Jo) : [Jo(n)];
            this.map.set(r, i);
          }))
        : (this.map = null);
  }
  has(e) {
    return this.init(), this.map.has(e);
  }
  get(e) {
    this.init();
    let r = this.map.get(e);
    return r ? r[0] : null;
  }
  getAll(e) {
    return this.init(), this.map.get(e) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(e, r) {
    return this.clone({ param: e, value: r, op: "a" });
  }
  appendAll(e) {
    let r = [];
    return (
      Object.keys(e).forEach((n) => {
        let i = e[n];
        Array.isArray(i)
          ? i.forEach((o) => {
              r.push({ param: n, value: o, op: "a" });
            })
          : r.push({ param: n, value: i, op: "a" });
      }),
      this.clone(r)
    );
  }
  set(e, r) {
    return this.clone({ param: e, value: r, op: "s" });
  }
  delete(e, r) {
    return this.clone({ param: e, value: r, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((e) => {
          let r = this.encoder.encodeKey(e);
          return this.map
            .get(e)
            .map((n) => r + "=" + this.encoder.encodeValue(n))
            .join("&");
        })
        .filter((e) => e !== "")
        .join("&")
    );
  }
  clone(e) {
    let r = new t({ encoder: this.encoder });
    return (
      (r.cloneFrom = this.cloneFrom || this),
      (r.updates = (this.updates || []).concat(e)),
      r
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
        this.updates.forEach((e) => {
          switch (e.op) {
            case "a":
            case "s":
              let r = (e.op === "a" ? this.map.get(e.param) : void 0) || [];
              r.push(Jo(e.value)), this.map.set(e.param, r);
              break;
            case "d":
              if (e.value !== void 0) {
                let n = this.map.get(e.param) || [],
                  i = n.indexOf(Jo(e.value));
                i !== -1 && n.splice(i, 1),
                  n.length > 0
                    ? this.map.set(e.param, n)
                    : this.map.delete(e.param);
              } else {
                this.map.delete(e.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var su = class {
  constructor() {
    this.map = new Map();
  }
  set(e, r) {
    return this.map.set(e, r), this;
  }
  get(e) {
    return (
      this.map.has(e) || this.map.set(e, e.defaultValue()), this.map.get(e)
    );
  }
  delete(e) {
    return this.map.delete(e), this;
  }
  has(e) {
    return this.map.has(e);
  }
  keys() {
    return this.map.keys();
  }
};
function W_(t) {
  switch (t) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function Hh(t) {
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function zh(t) {
  return typeof Blob < "u" && t instanceof Blob;
}
function Gh(t) {
  return typeof FormData < "u" && t instanceof FormData;
}
function q_(t) {
  return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var Rr = class t {
    constructor(e, r, n, i) {
      (this.url = r),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = e.toUpperCase());
      let o;
      if (
        (W_(this.method) || i
          ? ((this.body = n !== void 0 ? n : null), (o = i))
          : (o = n),
        o &&
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          (this.transferCache = o.transferCache)),
        (this.headers ??= new dn()),
        (this.context ??= new su()),
        !this.params)
      )
        (this.params = new jt()), (this.urlWithParams = r);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = r;
        else {
          let a = r.indexOf("?"),
            c = a === -1 ? "?" : a < r.length - 1 ? "&" : "";
          this.urlWithParams = r + c + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == "string" ||
          Hh(this.body) ||
          zh(this.body) ||
          Gh(this.body) ||
          q_(this.body)
        ? this.body
        : this.body instanceof jt
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || Gh(this.body)
        ? null
        : zh(this.body)
        ? this.body.type || null
        : Hh(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof jt
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(e = {}) {
      let r = e.method || this.method,
        n = e.url || this.url,
        i = e.responseType || this.responseType,
        o = e.transferCache ?? this.transferCache,
        s = e.body !== void 0 ? e.body : this.body,
        a = e.withCredentials ?? this.withCredentials,
        c = e.reportProgress ?? this.reportProgress,
        u = e.headers || this.headers,
        l = e.params || this.params,
        d = e.context ?? this.context;
      return (
        e.setHeaders !== void 0 &&
          (u = Object.keys(e.setHeaders).reduce(
            (f, g) => f.set(g, e.setHeaders[g]),
            u
          )),
        e.setParams &&
          (l = Object.keys(e.setParams).reduce(
            (f, g) => f.set(g, e.setParams[g]),
            l
          )),
        new t(r, n, s, {
          params: l,
          headers: u,
          context: d,
          reportProgress: c,
          responseType: i,
          withCredentials: a,
          transferCache: o,
        })
      );
    }
  },
  Jn = (function (t) {
    return (
      (t[(t.Sent = 0)] = "Sent"),
      (t[(t.UploadProgress = 1)] = "UploadProgress"),
      (t[(t.ResponseHeader = 2)] = "ResponseHeader"),
      (t[(t.DownloadProgress = 3)] = "DownloadProgress"),
      (t[(t.Response = 4)] = "Response"),
      (t[(t.User = 5)] = "User"),
      t
    );
  })(Jn || {}),
  kr = class {
    constructor(e, r = ns.Ok, n = "OK") {
      (this.headers = e.headers || new dn()),
        (this.status = e.status !== void 0 ? e.status : r),
        (this.statusText = e.statusText || n),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  au = class t extends kr {
    constructor(e = {}) {
      super(e), (this.type = Jn.ResponseHeader);
    }
    clone(e = {}) {
      return new t({
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  es = class t extends kr {
    constructor(e = {}) {
      super(e),
        (this.type = Jn.Response),
        (this.body = e.body !== void 0 ? e.body : null);
    }
    clone(e = {}) {
      return new t({
        body: e.body !== void 0 ? e.body : this.body,
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  ts = class extends kr {
    constructor(e) {
      super(e, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              e.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              e.url || "(unknown url)"
            }: ${e.status} ${e.statusText}`),
        (this.error = e.error || null);
    }
  },
  ns = (function (t) {
    return (
      (t[(t.Continue = 100)] = "Continue"),
      (t[(t.SwitchingProtocols = 101)] = "SwitchingProtocols"),
      (t[(t.Processing = 102)] = "Processing"),
      (t[(t.EarlyHints = 103)] = "EarlyHints"),
      (t[(t.Ok = 200)] = "Ok"),
      (t[(t.Created = 201)] = "Created"),
      (t[(t.Accepted = 202)] = "Accepted"),
      (t[(t.NonAuthoritativeInformation = 203)] =
        "NonAuthoritativeInformation"),
      (t[(t.NoContent = 204)] = "NoContent"),
      (t[(t.ResetContent = 205)] = "ResetContent"),
      (t[(t.PartialContent = 206)] = "PartialContent"),
      (t[(t.MultiStatus = 207)] = "MultiStatus"),
      (t[(t.AlreadyReported = 208)] = "AlreadyReported"),
      (t[(t.ImUsed = 226)] = "ImUsed"),
      (t[(t.MultipleChoices = 300)] = "MultipleChoices"),
      (t[(t.MovedPermanently = 301)] = "MovedPermanently"),
      (t[(t.Found = 302)] = "Found"),
      (t[(t.SeeOther = 303)] = "SeeOther"),
      (t[(t.NotModified = 304)] = "NotModified"),
      (t[(t.UseProxy = 305)] = "UseProxy"),
      (t[(t.Unused = 306)] = "Unused"),
      (t[(t.TemporaryRedirect = 307)] = "TemporaryRedirect"),
      (t[(t.PermanentRedirect = 308)] = "PermanentRedirect"),
      (t[(t.BadRequest = 400)] = "BadRequest"),
      (t[(t.Unauthorized = 401)] = "Unauthorized"),
      (t[(t.PaymentRequired = 402)] = "PaymentRequired"),
      (t[(t.Forbidden = 403)] = "Forbidden"),
      (t[(t.NotFound = 404)] = "NotFound"),
      (t[(t.MethodNotAllowed = 405)] = "MethodNotAllowed"),
      (t[(t.NotAcceptable = 406)] = "NotAcceptable"),
      (t[(t.ProxyAuthenticationRequired = 407)] =
        "ProxyAuthenticationRequired"),
      (t[(t.RequestTimeout = 408)] = "RequestTimeout"),
      (t[(t.Conflict = 409)] = "Conflict"),
      (t[(t.Gone = 410)] = "Gone"),
      (t[(t.LengthRequired = 411)] = "LengthRequired"),
      (t[(t.PreconditionFailed = 412)] = "PreconditionFailed"),
      (t[(t.PayloadTooLarge = 413)] = "PayloadTooLarge"),
      (t[(t.UriTooLong = 414)] = "UriTooLong"),
      (t[(t.UnsupportedMediaType = 415)] = "UnsupportedMediaType"),
      (t[(t.RangeNotSatisfiable = 416)] = "RangeNotSatisfiable"),
      (t[(t.ExpectationFailed = 417)] = "ExpectationFailed"),
      (t[(t.ImATeapot = 418)] = "ImATeapot"),
      (t[(t.MisdirectedRequest = 421)] = "MisdirectedRequest"),
      (t[(t.UnprocessableEntity = 422)] = "UnprocessableEntity"),
      (t[(t.Locked = 423)] = "Locked"),
      (t[(t.FailedDependency = 424)] = "FailedDependency"),
      (t[(t.TooEarly = 425)] = "TooEarly"),
      (t[(t.UpgradeRequired = 426)] = "UpgradeRequired"),
      (t[(t.PreconditionRequired = 428)] = "PreconditionRequired"),
      (t[(t.TooManyRequests = 429)] = "TooManyRequests"),
      (t[(t.RequestHeaderFieldsTooLarge = 431)] =
        "RequestHeaderFieldsTooLarge"),
      (t[(t.UnavailableForLegalReasons = 451)] = "UnavailableForLegalReasons"),
      (t[(t.InternalServerError = 500)] = "InternalServerError"),
      (t[(t.NotImplemented = 501)] = "NotImplemented"),
      (t[(t.BadGateway = 502)] = "BadGateway"),
      (t[(t.ServiceUnavailable = 503)] = "ServiceUnavailable"),
      (t[(t.GatewayTimeout = 504)] = "GatewayTimeout"),
      (t[(t.HttpVersionNotSupported = 505)] = "HttpVersionNotSupported"),
      (t[(t.VariantAlsoNegotiates = 506)] = "VariantAlsoNegotiates"),
      (t[(t.InsufficientStorage = 507)] = "InsufficientStorage"),
      (t[(t.LoopDetected = 508)] = "LoopDetected"),
      (t[(t.NotExtended = 510)] = "NotExtended"),
      (t[(t.NetworkAuthenticationRequired = 511)] =
        "NetworkAuthenticationRequired"),
      t
    );
  })(ns || {});
function iu(t, e) {
  return {
    body: e,
    headers: t.headers,
    context: t.context,
    observe: t.observe,
    params: t.params,
    reportProgress: t.reportProgress,
    responseType: t.responseType,
    withCredentials: t.withCredentials,
    transferCache: t.transferCache,
  };
}
var cu = (() => {
  let e = class e {
    constructor(n) {
      this.handler = n;
    }
    request(n, i, o = {}) {
      let s;
      if (n instanceof Rr) s = n;
      else {
        let u;
        o.headers instanceof dn ? (u = o.headers) : (u = new dn(o.headers));
        let l;
        o.params &&
          (o.params instanceof jt
            ? (l = o.params)
            : (l = new jt({ fromObject: o.params }))),
          (s = new Rr(n, i, o.body !== void 0 ? o.body : null, {
            headers: u,
            context: o.context,
            params: l,
            reportProgress: o.reportProgress,
            responseType: o.responseType || "json",
            withCredentials: o.withCredentials,
            transferCache: o.transferCache,
          }));
      }
      let a = S(s).pipe(dt((u) => this.handler.handle(u)));
      if (n instanceof Rr || o.observe === "events") return a;
      let c = a.pipe(_e((u) => u instanceof es));
      switch (o.observe || "body") {
        case "body":
          switch (s.responseType) {
            case "arraybuffer":
              return c.pipe(
                P((u) => {
                  if (u.body !== null && !(u.body instanceof ArrayBuffer))
                    throw new Error("Response is not an ArrayBuffer.");
                  return u.body;
                })
              );
            case "blob":
              return c.pipe(
                P((u) => {
                  if (u.body !== null && !(u.body instanceof Blob))
                    throw new Error("Response is not a Blob.");
                  return u.body;
                })
              );
            case "text":
              return c.pipe(
                P((u) => {
                  if (u.body !== null && typeof u.body != "string")
                    throw new Error("Response is not a string.");
                  return u.body;
                })
              );
            case "json":
            default:
              return c.pipe(P((u) => u.body));
          }
        case "response":
          return c;
        default:
          throw new Error(`Unreachable: unhandled observe type ${o.observe}}`);
      }
    }
    delete(n, i = {}) {
      return this.request("DELETE", n, i);
    }
    get(n, i = {}) {
      return this.request("GET", n, i);
    }
    head(n, i = {}) {
      return this.request("HEAD", n, i);
    }
    jsonp(n, i) {
      return this.request("JSONP", n, {
        params: new jt().append(i, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json",
      });
    }
    options(n, i = {}) {
      return this.request("OPTIONS", n, i);
    }
    patch(n, i, o = {}) {
      return this.request("PATCH", n, iu(o, i));
    }
    post(n, i, o = {}) {
      return this.request("POST", n, iu(o, i));
    }
    put(n, i, o = {}) {
      return this.request("PUT", n, iu(o, i));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(x(Fr));
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function Yh(t, e) {
  return e(t);
}
function Z_(t, e) {
  return (r, n) => e.intercept(r, { handle: (i) => t(i, n) });
}
function Y_(t, e, r) {
  return (n, i) => qe(r, () => e(n, (o) => t(o, i)));
}
var Q_ = new D(""),
  uu = new D(""),
  K_ = new D(""),
  J_ = new D("");
function X_() {
  let t = null;
  return (e, r) => {
    t === null && (t = (v(Q_, { optional: !0 }) ?? []).reduceRight(Z_, Yh));
    let n = v(cn),
      i = n.add();
    return t(e, r).pipe(Et(() => n.remove(i)));
  };
}
var Wh = (() => {
  let e = class e extends Fr {
    constructor(n, i) {
      super(),
        (this.backend = n),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = v(cn));
      let o = v(J_, { optional: !0 });
      this.backend = o ?? n;
    }
    handle(n) {
      if (this.chain === null) {
        let o = Array.from(
          new Set([...this.injector.get(uu), ...this.injector.get(K_, [])])
        );
        this.chain = o.reduceRight((s, a) => Y_(s, a, this.injector), Yh);
      }
      let i = this.pendingTasks.add();
      return this.chain(n, (o) => this.backend.handle(o)).pipe(
        Et(() => this.pendingTasks.remove(i))
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(x(Xo), x(fe));
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var eD = /^\)\]\}',?\n/;
function tD(t) {
  return "responseURL" in t && t.responseURL
    ? t.responseURL
    : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
    ? t.getResponseHeader("X-Request-URL")
    : null;
}
var qh = (() => {
    let e = class e {
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === "JSONP") throw new b(-2800, !1);
        let i = this.xhrFactory;
        return (i.ɵloadImpl ? Z(i.ɵloadImpl()) : S(null)).pipe(
          De(
            () =>
              new B((s) => {
                let a = i.build();
                if (
                  (a.open(n.method, n.urlWithParams),
                  n.withCredentials && (a.withCredentials = !0),
                  n.headers.forEach((I, _) =>
                    a.setRequestHeader(I, _.join(","))
                  ),
                  n.headers.has("Accept") ||
                    a.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*"
                    ),
                  !n.headers.has("Content-Type"))
                ) {
                  let I = n.detectContentTypeHeader();
                  I !== null && a.setRequestHeader("Content-Type", I);
                }
                if (n.responseType) {
                  let I = n.responseType.toLowerCase();
                  a.responseType = I !== "json" ? I : "text";
                }
                let c = n.serializeBody(),
                  u = null,
                  l = () => {
                    if (u !== null) return u;
                    let I = a.statusText || "OK",
                      _ = new dn(a.getAllResponseHeaders()),
                      ue = tD(a) || n.url;
                    return (
                      (u = new au({
                        headers: _,
                        status: a.status,
                        statusText: I,
                        url: ue,
                      })),
                      u
                    );
                  },
                  d = () => {
                    let {
                        headers: I,
                        status: _,
                        statusText: ue,
                        url: oe,
                      } = l(),
                      Y = null;
                    _ !== ns.NoContent &&
                      (Y =
                        typeof a.response > "u" ? a.responseText : a.response),
                      _ === 0 && (_ = Y ? ns.Ok : 0);
                    let Qe = _ >= 200 && _ < 300;
                    if (n.responseType === "json" && typeof Y == "string") {
                      let Ie = Y;
                      Y = Y.replace(eD, "");
                      try {
                        Y = Y !== "" ? JSON.parse(Y) : null;
                      } catch (Dt) {
                        (Y = Ie),
                          Qe && ((Qe = !1), (Y = { error: Dt, text: Y }));
                      }
                    }
                    Qe
                      ? (s.next(
                          new es({
                            body: Y,
                            headers: I,
                            status: _,
                            statusText: ue,
                            url: oe || void 0,
                          })
                        ),
                        s.complete())
                      : s.error(
                          new ts({
                            error: Y,
                            headers: I,
                            status: _,
                            statusText: ue,
                            url: oe || void 0,
                          })
                        );
                  },
                  f = (I) => {
                    let { url: _ } = l(),
                      ue = new ts({
                        error: I,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: _ || void 0,
                      });
                    s.error(ue);
                  },
                  g = !1,
                  C = (I) => {
                    g || (s.next(l()), (g = !0));
                    let _ = { type: Jn.DownloadProgress, loaded: I.loaded };
                    I.lengthComputable && (_.total = I.total),
                      n.responseType === "text" &&
                        a.responseText &&
                        (_.partialText = a.responseText),
                      s.next(_);
                  },
                  A = (I) => {
                    let _ = { type: Jn.UploadProgress, loaded: I.loaded };
                    I.lengthComputable && (_.total = I.total), s.next(_);
                  };
                return (
                  a.addEventListener("load", d),
                  a.addEventListener("error", f),
                  a.addEventListener("timeout", f),
                  a.addEventListener("abort", f),
                  n.reportProgress &&
                    (a.addEventListener("progress", C),
                    c !== null &&
                      a.upload &&
                      a.upload.addEventListener("progress", A)),
                  a.send(c),
                  s.next({ type: Jn.Sent }),
                  () => {
                    a.removeEventListener("error", f),
                      a.removeEventListener("abort", f),
                      a.removeEventListener("load", d),
                      a.removeEventListener("timeout", f),
                      n.reportProgress &&
                        (a.removeEventListener("progress", C),
                        c !== null &&
                          a.upload &&
                          a.upload.removeEventListener("progress", A)),
                      a.readyState !== a.DONE && a.abort();
                  }
                );
              })
          )
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(Qn));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Qh = new D(""),
  nD = "XSRF-TOKEN",
  rD = new D("", { providedIn: "root", factory: () => nD }),
  iD = "X-XSRF-TOKEN",
  oD = new D("", { providedIn: "root", factory: () => iD }),
  rs = class {},
  sD = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this.doc = n),
          (this.platform = i),
          (this.cookieName = o),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let n = this.doc.cookie || "";
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = Zo(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(pe), x(ot), x(rD));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function aD(t, e) {
  let r = t.url.toLowerCase();
  if (
    !v(Qh) ||
    t.method === "GET" ||
    t.method === "HEAD" ||
    r.startsWith("http://") ||
    r.startsWith("https://")
  )
    return e(t);
  let n = v(rs).getToken(),
    i = v(oD);
  return (
    n != null &&
      !t.headers.has(i) &&
      (t = t.clone({ headers: t.headers.set(i, n) })),
    e(t)
  );
}
var Kh = (function (t) {
  return (
    (t[(t.Interceptors = 0)] = "Interceptors"),
    (t[(t.LegacyInterceptors = 1)] = "LegacyInterceptors"),
    (t[(t.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
    (t[(t.NoXsrfProtection = 3)] = "NoXsrfProtection"),
    (t[(t.JsonpSupport = 4)] = "JsonpSupport"),
    (t[(t.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
    (t[(t.Fetch = 6)] = "Fetch"),
    t
  );
})(Kh || {});
function cD(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function uD(...t) {
  let e = [
    cu,
    qh,
    Wh,
    { provide: Fr, useExisting: Wh },
    { provide: Xo, useExisting: qh },
    { provide: uu, useValue: aD, multi: !0 },
    { provide: Qh, useValue: !0 },
    { provide: rs, useClass: sD },
  ];
  for (let r of t) e.push(...r.ɵproviders);
  return Bn(e);
}
var Zh = new D("");
function lD() {
  return cD(Kh.LegacyInterceptors, [
    { provide: Zh, useFactory: X_ },
    { provide: uu, useExisting: Zh, multi: !0 },
  ]);
}
var Jh = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = it({ type: e })),
    (e.ɵinj = rt({ providers: [uD(lD())] }));
  let t = e;
  return t;
})();
var fu = class extends qo {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  hu = class t extends fu {
    static makeCurrent() {
      kh(new t());
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, r) {
      return r === "window"
        ? window
        : r === "document"
        ? e
        : r === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let r = fD();
      return r == null ? null : hD(r);
    }
    resetBaseElement() {
      Lr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return Zo(document.cookie, e);
    }
  },
  Lr = null;
function fD() {
  return (
    (Lr = Lr || document.querySelector("base")),
    Lr ? Lr.getAttribute("href") : null
  );
}
function hD(t) {
  return new URL(t, document.baseURI).pathname;
}
var pD = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  pu = new D(""),
  np = (() => {
    let e = class e {
      constructor(n, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, i, o) {
        return this._findPluginFor(i).addEventListener(n, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(n))), !i))
          throw new b(5101, !1);
        return this._eventNameToPlugin.set(n, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(pu), x(Q));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  is = class {
    constructor(e) {
      this._doc = e;
    }
  },
  lu = "ng-app-id",
  rp = (() => {
    let e = class e {
      constructor(n, i, o, s = {}) {
        (this.doc = n),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Ko(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((i) => i.remove()), n.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n);
      }
      onStyleRemoved(n) {
        let i = this.styleRef;
        i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${lu}="${this.appId}"]`);
        if (n?.length) {
          let i = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(n, i) {
        let o = this.styleRef;
        if (o.has(n)) {
          let s = o.get(n);
          return (s.usage += i), s.usage;
        }
        return o.set(n, { usage: i, elements: [] }), i;
      }
      getStyleElement(n, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === n) return o.delete(i), s.removeAttribute(lu), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(lu, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, i) {
        let o = this.getStyleElement(n, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(pe), x(wc), x(Mc, 8), x(ot));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  du = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  mu = /%COMP%/g,
  ip = "%COMP%",
  gD = `_nghost-${ip}`,
  mD = `_ngcontent-${ip}`,
  vD = !0,
  yD = new D("", { providedIn: "root", factory: () => vD });
function CD(t) {
  return mD.replace(mu, t);
}
function _D(t) {
  return gD.replace(mu, t);
}
function op(t, e) {
  return e.map((r) => r.replace(mu, t));
}
var Xh = (() => {
    let e = class e {
      constructor(n, i, o, s, a, c, u, l = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = u),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Ko(c)),
          (this.defaultRenderer = new jr(n, a, u, this.platformIsServer));
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === et.ShadowDom &&
          (i = G(y({}, i), { encapsulation: et.Emulated }));
        let o = this.getOrCreateRenderer(n, i);
        return (
          o instanceof os
            ? o.applyToHost(n)
            : o instanceof Vr && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            c = this.ngZone,
            u = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (i.encapsulation) {
            case et.Emulated:
              s = new os(u, l, i, this.appId, d, a, c, f);
              break;
            case et.ShadowDom:
              return new gu(u, l, n, i, a, c, this.nonce, f);
            default:
              s = new Vr(u, l, i, d, a, c, f);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        x(np),
        x(rp),
        x(wc),
        x(yD),
        x(pe),
        x(ot),
        x(Q),
        x(Mc)
      );
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  jr = class {
    constructor(e, r, n, i) {
      (this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, r) {
      return r
        ? this.doc.createElementNS(du[r] || r, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, r) {
      (ep(e) ? e.content : e).appendChild(r);
    }
    insertBefore(e, r, n) {
      e && (ep(e) ? e.content : e).insertBefore(r, n);
    }
    removeChild(e, r) {
      e && e.removeChild(r);
    }
    selectRootElement(e, r) {
      let n = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!n) throw new b(-5104, !1);
      return r || (n.textContent = ""), n;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, r, n, i) {
      if (i) {
        r = i + ":" + r;
        let o = du[i];
        o ? e.setAttributeNS(o, r, n) : e.setAttribute(r, n);
      } else e.setAttribute(r, n);
    }
    removeAttribute(e, r, n) {
      if (n) {
        let i = du[n];
        i ? e.removeAttributeNS(i, r) : e.removeAttribute(`${n}:${r}`);
      } else e.removeAttribute(r);
    }
    addClass(e, r) {
      e.classList.add(r);
    }
    removeClass(e, r) {
      e.classList.remove(r);
    }
    setStyle(e, r, n, i) {
      i & (ht.DashCase | ht.Important)
        ? e.style.setProperty(r, n, i & ht.Important ? "important" : "")
        : (e.style[r] = n);
    }
    removeStyle(e, r, n) {
      n & ht.DashCase ? e.style.removeProperty(r) : (e.style[r] = "");
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n);
    }
    setValue(e, r) {
      e.nodeValue = r;
    }
    listen(e, r, n) {
      if (
        typeof e == "string" &&
        ((e = yt().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${r}`);
      return this.eventManager.addEventListener(
        e,
        r,
        this.decoratePreventDefault(n)
      );
    }
    decoratePreventDefault(e) {
      return (r) => {
        if (r === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function ep(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var gu = class extends jr {
    constructor(e, r, n, i, o, s, a, c) {
      super(e, o, s, c),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let u = op(i.id, i.styles);
      for (let l of u) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r);
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
    }
    removeChild(e, r) {
      return super.removeChild(this.nodeOrShadowRoot(e), r);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Vr = class extends jr {
    constructor(e, r, n, i, o, s, a, c) {
      super(e, o, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? op(c, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  os = class extends Vr {
    constructor(e, r, n, i, o, s, a, c) {
      let u = i + "-" + n.id;
      super(e, r, n, o, s, a, c, u),
        (this.contentAttr = CD(u)),
        (this.hostAttr = _D(u));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, r) {
      let n = super.createElement(e, r);
      return super.setAttribute(n, this.contentAttr, ""), n;
    }
  },
  DD = (() => {
    let e = class e extends is {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, i, o) {
        return (
          n.addEventListener(i, o, !1), () => this.removeEventListener(n, i, o)
        );
      }
      removeEventListener(n, i, o) {
        return n.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(pe));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  tp = ["alt", "control", "meta", "shift"],
  wD = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  bD = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  MD = (() => {
    let e = class e extends is {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => yt().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = e._normalizeKey(i.pop()),
          a = "",
          c = i.indexOf("code");
        if (
          (c > -1 && (i.splice(c, 1), (a = "code.")),
          tp.forEach((l) => {
            let d = i.indexOf(l);
            d > -1 && (i.splice(d, 1), (a += l + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let u = {};
        return (u.domEventName = o), (u.fullKey = a), u;
      }
      static matchEventFullKeyCode(n, i) {
        let o = wD[n.key] || n.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = n.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              tp.forEach((a) => {
                if (a !== o) {
                  let c = bD[a];
                  c(n) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(n, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(pe));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function sp(t, e) {
  return Sh(y({ rootComponent: t }, ED(e)));
}
function ED(t) {
  return {
    appProviders: [...AD, ...(t?.providers ?? [])],
    platformProviders: TD,
  };
}
function ID() {
  hu.makeCurrent();
}
function xD() {
  return new nt();
}
function SD() {
  return Vf(document), document;
}
var TD = [
  { provide: ot, useValue: ru },
  { provide: bc, useValue: ID, multi: !0 },
  { provide: pe, useFactory: SD, deps: [] },
];
var AD = [
  { provide: Do, useValue: "root" },
  { provide: nt, useFactory: xD, deps: [] },
  { provide: pu, useClass: DD, multi: !0, deps: [pe, Q, ot] },
  { provide: pu, useClass: MD, multi: !0, deps: [pe] },
  Xh,
  rp,
  np,
  { provide: wr, useExisting: Xh },
  { provide: Qn, useClass: pD, deps: [] },
  [],
];
var ap = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(x(pe));
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var N = "primary",
  ti = Symbol("RouteTitle"),
  Du = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function rr(t) {
  return new Du(t);
}
function PD(t, e, r) {
  let n = r.path.split("/");
  if (
    n.length > t.length ||
    (r.pathMatch === "full" && (e.hasChildren() || n.length < t.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < n.length; o++) {
    let s = n[o],
      a = t[o];
    if (s.startsWith(":")) i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, n.length), posParams: i };
}
function ND(t, e) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; ++r) if (!at(t[r], e[r])) return !1;
  return !0;
}
function at(t, e) {
  let r = t ? wu(t) : void 0,
    n = e ? wu(e) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let i;
  for (let o = 0; o < r.length; o++)
    if (((i = r[o]), !mp(t[i], e[i]))) return !1;
  return !0;
}
function wu(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function mp(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let r = [...t].sort(),
      n = [...e].sort();
    return r.every((i, o) => n[o] === i);
  } else return t === e;
}
function vp(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Ht(t) {
  return Gs(t) ? t : ln(t) ? Z(Promise.resolve(t)) : S(t);
}
var RD = { exact: Cp, subset: _p },
  yp = { exact: FD, subset: kD, ignored: () => !0 };
function cp(t, e, r) {
  return (
    RD[r.paths](t.root, e.root, r.matrixParams) &&
    yp[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function FD(t, e) {
  return at(t, e);
}
function Cp(t, e, r) {
  if (
    !hn(t.segments, e.segments) ||
    !cs(t.segments, e.segments, r) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let n in e.children)
    if (!t.children[n] || !Cp(t.children[n], e.children[n], r)) return !1;
  return !0;
}
function kD(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((r) => mp(t[r], e[r]))
  );
}
function _p(t, e, r) {
  return Dp(t, e, e.segments, r);
}
function Dp(t, e, r, n) {
  if (t.segments.length > r.length) {
    let i = t.segments.slice(0, r.length);
    return !(!hn(i, r) || e.hasChildren() || !cs(i, r, n));
  } else if (t.segments.length === r.length) {
    if (!hn(t.segments, r) || !cs(t.segments, r, n)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !_p(t.children[i], e.children[i], n)) return !1;
    return !0;
  } else {
    let i = r.slice(0, t.segments.length),
      o = r.slice(t.segments.length);
    return !hn(t.segments, i) || !cs(t.segments, i, n) || !t.children[N]
      ? !1
      : Dp(t.children[N], e, o, n);
  }
}
function cs(t, e, r) {
  return e.every((n, i) => yp[r](t[i].parameters, n.parameters));
}
var Vt = class {
    constructor(e = new $([], {}), r = {}, n = null) {
      (this.root = e), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= rr(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return VD.serialize(this);
    }
  },
  $ = class {
    constructor(e, r) {
      (this.segments = e),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return us(this);
    }
  },
  fn = class {
    constructor(e, r) {
      (this.path = e), (this.parameters = r);
    }
    get parameterMap() {
      return (this._parameterMap ??= rr(this.parameters)), this._parameterMap;
    }
    toString() {
      return bp(this);
    }
  };
function LD(t, e) {
  return hn(t, e) && t.every((r, n) => at(r.parameters, e[n].parameters));
}
function hn(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function jD(t, e) {
  let r = [];
  return (
    Object.entries(t.children).forEach(([n, i]) => {
      n === N && (r = r.concat(e(i, n)));
    }),
    Object.entries(t.children).forEach(([n, i]) => {
      n !== N && (r = r.concat(e(i, n)));
    }),
    r
  );
}
var ni = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => new Wr(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Wr = class {
    parse(e) {
      let r = new Mu(e);
      return new Vt(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      );
    }
    serialize(e) {
      let r = `/${Ur(e.root, !0)}`,
        n = $D(e.queryParams),
        i = typeof e.fragment == "string" ? `#${UD(e.fragment)}` : "";
      return `${r}${n}${i}`;
    }
  },
  VD = new Wr();
function us(t) {
  return t.segments.map((e) => bp(e)).join("/");
}
function Ur(t, e) {
  if (!t.hasChildren()) return us(t);
  if (e) {
    let r = t.children[N] ? Ur(t.children[N], !1) : "",
      n = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== N && n.push(`${i}:${Ur(o, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    );
  } else {
    let r = jD(t, (n, i) =>
      i === N ? [Ur(t.children[N], !1)] : [`${i}:${Ur(n, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[N] != null
      ? `${us(t)}/${r[0]}`
      : `${us(t)}/(${r.join("//")})`;
  }
}
function wp(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function ss(t) {
  return wp(t).replace(/%3B/gi, ";");
}
function UD(t) {
  return encodeURI(t);
}
function bu(t) {
  return wp(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function ls(t) {
  return decodeURIComponent(t);
}
function up(t) {
  return ls(t.replace(/\+/g, "%20"));
}
function bp(t) {
  return `${bu(t.path)}${BD(t.parameters)}`;
}
function BD(t) {
  return Object.entries(t)
    .map(([e, r]) => `;${bu(e)}=${bu(r)}`)
    .join("");
}
function $D(t) {
  let e = Object.entries(t)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((i) => `${ss(r)}=${ss(i)}`).join("&")
        : `${ss(r)}=${ss(n)}`
    )
    .filter((r) => r);
  return e.length ? `?${e.join("&")}` : "";
}
var HD = /^[^\/()?;#]+/;
function vu(t) {
  let e = t.match(HD);
  return e ? e[0] : "";
}
var zD = /^[^\/()?;=#]+/;
function GD(t) {
  let e = t.match(zD);
  return e ? e[0] : "";
}
var WD = /^[^=?&#]+/;
function qD(t) {
  let e = t.match(WD);
  return e ? e[0] : "";
}
var ZD = /^[^&#]+/;
function YD(t) {
  let e = t.match(ZD);
  return e ? e[0] : "";
}
var Mu = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new $([], {})
        : new $([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (e.length > 0 || Object.keys(r).length > 0) && (n[N] = new $(e, r)),
      n
    );
  }
  parseSegment() {
    let e = vu(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new b(4009, !1);
    return this.capture(e), new fn(ls(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let r = GD(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let i = vu(this.remaining);
      i && ((n = i), this.capture(n));
    }
    e[ls(r)] = ls(n);
  }
  parseQueryParam(e) {
    let r = qD(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let s = YD(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let i = up(r),
      o = up(n);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = vu(this.remaining),
        i = this.remaining[n.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new b(4010, !1);
      let o;
      n.indexOf(":") > -1
        ? ((o = n.slice(0, n.indexOf(":"))), this.capture(o), this.capture(":"))
        : e && (o = N);
      let s = this.parseChildren();
      (r[o] = Object.keys(s).length === 1 ? s[N] : new $([], s)),
        this.consumeOptional("//");
    }
    return r;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new b(4011, !1);
  }
};
function Mp(t) {
  return t.segments.length > 0 ? new $([], { [N]: t }) : t;
}
function Ep(t) {
  let e = {};
  for (let [n, i] of Object.entries(t.children)) {
    let o = Ep(i);
    if (n === N && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[n] = o);
  }
  let r = new $(t.segments, e);
  return QD(r);
}
function QD(t) {
  if (t.numberOfChildren === 1 && t.children[N]) {
    let e = t.children[N];
    return new $(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function ir(t) {
  return t instanceof Vt;
}
function KD(t, e, r = null, n = null) {
  let i = Ip(t);
  return xp(i, e, r, n);
}
function Ip(t) {
  let e;
  function r(o) {
    let s = {};
    for (let c of o.children) {
      let u = r(c);
      s[c.outlet] = u;
    }
    let a = new $(o.url, s);
    return o === t && (e = a), a;
  }
  let n = r(t.root),
    i = Mp(n);
  return e ?? i;
}
function xp(t, e, r, n) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return yu(i, i, i, r, n);
  let o = JD(e);
  if (o.toRoot()) return yu(i, i, new $([], {}), r, n);
  let s = XD(o, i, t),
    a = s.processChildren
      ? Hr(s.segmentGroup, s.index, o.commands)
      : Tp(s.segmentGroup, s.index, o.commands);
  return yu(i, s.segmentGroup, a, r, n);
}
function ds(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function qr(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function yu(t, e, r, n, i) {
  let o = {};
  n &&
    Object.entries(n).forEach(([c, u]) => {
      o[c] = Array.isArray(u) ? u.map((l) => `${l}`) : `${u}`;
    });
  let s;
  t === e ? (s = r) : (s = Sp(t, e, r));
  let a = Mp(Ep(s));
  return new Vt(a, o, i);
}
function Sp(t, e, r) {
  let n = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (n[i] = r) : (n[i] = Sp(o, e, r));
    }),
    new $(t.segments, n)
  );
}
var fs = class {
  constructor(e, r, n) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      e && n.length > 0 && ds(n[0]))
    )
      throw new b(4003, !1);
    let i = n.find(qr);
    if (i && i !== vp(n)) throw new b(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function JD(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new fs(!0, 0, t);
  let e = 0,
    r = !1,
    n = t.reduce((i, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([c, u]) => {
              a[c] = typeof u == "string" ? u.split("/") : u;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != "string"
        ? [...i, o]
        : s === 0
        ? (o.split("/").forEach((a, c) => {
            (c == 0 && a === ".") ||
              (c == 0 && a === ""
                ? (r = !0)
                : a === ".."
                ? e++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, o];
    }, []);
  return new fs(r, e, n);
}
var tr = class {
  constructor(e, r, n) {
    (this.segmentGroup = e), (this.processChildren = r), (this.index = n);
  }
};
function XD(t, e, r) {
  if (t.isAbsolute) return new tr(e, !0, 0);
  if (!r) return new tr(e, !1, NaN);
  if (r.parent === null) return new tr(r, !0, 0);
  let n = ds(t.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n;
  return ew(r, i, t.numberOfDoubleDots);
}
function ew(t, e, r) {
  let n = t,
    i = e,
    o = r;
  for (; o > i; ) {
    if (((o -= i), (n = n.parent), !n)) throw new b(4005, !1);
    i = n.segments.length;
  }
  return new tr(n, !1, i - o);
}
function tw(t) {
  return qr(t[0]) ? t[0].outlets : { [N]: t };
}
function Tp(t, e, r) {
  if (((t ??= new $([], {})), t.segments.length === 0 && t.hasChildren()))
    return Hr(t, e, r);
  let n = nw(t, e, r),
    i = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < t.segments.length) {
    let o = new $(t.segments.slice(0, n.pathIndex), {});
    return (
      (o.children[N] = new $(t.segments.slice(n.pathIndex), t.children)),
      Hr(o, 0, i)
    );
  } else
    return n.match && i.length === 0
      ? new $(t.segments, {})
      : n.match && !t.hasChildren()
      ? Eu(t, e, r)
      : n.match
      ? Hr(t, 0, i)
      : Eu(t, e, r);
}
function Hr(t, e, r) {
  if (r.length === 0) return new $(t.segments, {});
  {
    let n = tw(r),
      i = {};
    if (
      Object.keys(n).some((o) => o !== N) &&
      t.children[N] &&
      t.numberOfChildren === 1 &&
      t.children[N].segments.length === 0
    ) {
      let o = Hr(t.children[N], e, r);
      return new $(t.segments, o.children);
    }
    return (
      Object.entries(n).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = Tp(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        n[o] === void 0 && (i[o] = s);
      }),
      new $(t.segments, i)
    );
  }
}
function nw(t, e, r) {
  let n = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (n >= r.length) return o;
    let s = t.segments[i],
      a = r[n];
    if (qr(a)) break;
    let c = `${a}`,
      u = n < r.length - 1 ? r[n + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && u && typeof u == "object" && u.outlets === void 0) {
      if (!dp(c, u, s)) return o;
      n += 2;
    } else {
      if (!dp(c, {}, s)) return o;
      n++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: n };
}
function Eu(t, e, r) {
  let n = t.segments.slice(0, e),
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (qr(o)) {
      let c = rw(o.outlets);
      return new $(n, c);
    }
    if (i === 0 && ds(r[0])) {
      let c = t.segments[e];
      n.push(new fn(c.path, lp(r[0]))), i++;
      continue;
    }
    let s = qr(o) ? o.outlets[N] : `${o}`,
      a = i < r.length - 1 ? r[i + 1] : null;
    s && a && ds(a)
      ? (n.push(new fn(s, lp(a))), (i += 2))
      : (n.push(new fn(s, {})), i++);
  }
  return new $(n, {});
}
function rw(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (e[r] = Eu(new $([], {}), 0, n));
    }),
    e
  );
}
function lp(t) {
  let e = {};
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function dp(t, e, r) {
  return t == r.path && at(e, r.parameters);
}
var zr = "imperative",
  ie = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = "NavigationStart"),
      (t[(t.NavigationEnd = 1)] = "NavigationEnd"),
      (t[(t.NavigationCancel = 2)] = "NavigationCancel"),
      (t[(t.NavigationError = 3)] = "NavigationError"),
      (t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
      (t[(t.ResolveStart = 5)] = "ResolveStart"),
      (t[(t.ResolveEnd = 6)] = "ResolveEnd"),
      (t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
      (t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (t[(t.ActivationStart = 13)] = "ActivationStart"),
      (t[(t.ActivationEnd = 14)] = "ActivationEnd"),
      (t[(t.Scroll = 15)] = "Scroll"),
      (t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
      t
    );
  })(ie || {}),
  Ve = class {
    constructor(e, r) {
      (this.id = e), (this.url = r);
    }
  },
  or = class extends Ve {
    constructor(e, r, n = "imperative", i = null) {
      super(e, r),
        (this.type = ie.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  ct = class extends Ve {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = ie.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Fe = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    );
  })(Fe || {}),
  hs = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(hs || {}),
  Ut = class extends Ve {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = ie.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Bt = class extends Ve {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = ie.NavigationSkipped);
    }
  },
  Zr = class extends Ve {
    constructor(e, r, n, i) {
      super(e, r),
        (this.error = n),
        (this.target = i),
        (this.type = ie.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  ps = class extends Ve {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ie.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Iu = class extends Ve {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ie.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  xu = class extends Ve {
    constructor(e, r, n, i, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = ie.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Su = class extends Ve {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ie.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Tu = class extends Ve {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ie.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Au = class {
    constructor(e) {
      (this.route = e), (this.type = ie.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Ou = class {
    constructor(e) {
      (this.route = e), (this.type = ie.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Pu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ie.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Nu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ie.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Ru = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ie.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Fu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ie.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  gs = class {
    constructor(e, r, n) {
      (this.routerEvent = e),
        (this.position = r),
        (this.anchor = n),
        (this.type = ie.Scroll);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  Yr = class {},
  Qr = class {
    constructor(e) {
      this.url = e;
    }
  };
var ku = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new ri()),
        (this.attachRef = null);
    }
  },
  ri = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(n, i) {
        let o = this.getOrCreateContext(n);
        (o.outlet = i), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let i = this.getContext(n);
        return i || ((i = new ku()), this.contexts.set(n, i)), i;
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ms = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let r = this.pathFromRoot(e);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(e) {
      let r = Lu(e, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(e) {
      let r = Lu(e, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(e) {
      let r = ju(e, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return ju(e, this._root).map((r) => r.value);
    }
  };
function Lu(t, e) {
  if (t === e.value) return e;
  for (let r of e.children) {
    let n = Lu(t, r);
    if (n) return n;
  }
  return null;
}
function ju(t, e) {
  if (t === e.value) return [e];
  for (let r of e.children) {
    let n = ju(t, r);
    if (n.length) return n.unshift(e), n;
  }
  return [];
}
var Re = class {
  constructor(e, r) {
    (this.value = e), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function er(t) {
  let e = {};
  return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var vs = class extends ms {
  constructor(e, r) {
    super(e), (this.snapshot = r), Zu(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Ap(t) {
  let e = iw(t),
    r = new se([new fn("", {})]),
    n = new se({}),
    i = new se({}),
    o = new se({}),
    s = new se(""),
    a = new $t(r, n, o, s, i, N, t, e.root);
  return (a.snapshot = e.root), new vs(new Re(a, []), e);
}
function iw(t) {
  let e = {},
    r = {},
    n = {},
    i = "",
    o = new Kr([], e, n, i, r, N, t, null, {});
  return new ys("", new Re(o, []));
}
var $t = class {
  constructor(e, r, n, i, o, s, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(P((u) => u[ti])) ?? S(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(P((e) => rr(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(P((e) => rr(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function qu(t, e, r = "emptyOnly") {
  let n,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (r === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: y(y({}, e.params), t.params),
          data: y(y({}, e.data), t.data),
          resolve: y(y(y(y({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (n = {
          params: y({}, t.params),
          data: y({}, t.data),
          resolve: y(y({}, t.data), t._resolvedData ?? {}),
        }),
    i && Pp(i) && (n.resolve[ti] = i.title),
    n
  );
}
var Kr = class {
    get title() {
      return this.data?.[ti];
    }
    constructor(e, r, n, i, o, s, a, c, u) {
      (this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = u);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= rr(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= rr(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((n) => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${r}')`;
    }
  },
  ys = class extends ms {
    constructor(e, r) {
      super(r), (this.url = e), Zu(this, r);
    }
    toString() {
      return Op(this._root);
    }
  };
function Zu(t, e) {
  (e.value._routerState = t), e.children.forEach((r) => Zu(t, r));
}
function Op(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(Op).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function Cu(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot;
    (t.snapshot = r),
      at(e.queryParams, r.queryParams) ||
        t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      at(e.params, r.params) || t.paramsSubject.next(r.params),
      ND(e.url, r.url) || t.urlSubject.next(r.url),
      at(e.data, r.data) || t.dataSubject.next(r.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function Vu(t, e) {
  let r = at(t.params, e.params) && LD(t.url, e.url),
    n = !t.parent != !e.parent;
  return r && !n && (!t.parent || Vu(t.parent, e.parent));
}
function Pp(t) {
  return typeof t.title == "string" || t.title === null;
}
var Yu = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = N),
          (this.activateEvents = new me()),
          (this.deactivateEvents = new me()),
          (this.attachEvents = new me()),
          (this.detachEvents = new me()),
          (this.parentContexts = v(ri)),
          (this.location = v(Hn)),
          (this.changeDetector = v(Zn)),
          (this.environmentInjector = v(fe)),
          (this.inputBinder = v(ws, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: o } = n.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new b(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new b(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new b(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, i) {
        (this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new b(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          a = n.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          u = new Uu(n, c, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: u,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = ae({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [rn],
      }));
    let t = e;
    return t;
  })(),
  Uu = class t {
    __ngOutletInjector(e) {
      return new t(this.route, this.childContexts, e);
    }
    constructor(e, r, n) {
      (this.route = e), (this.childContexts = r), (this.parent = n);
    }
    get(e, r) {
      return e === $t
        ? this.route
        : e === ri
        ? this.childContexts
        : this.parent.get(e, r);
    }
  },
  ws = new D(""),
  fp = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map();
      }
      bindActivatedRouteToOutletComponent(n) {
        this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
      }
      unsubscribeFromRouteData(n) {
        this.outletDataSubscriptions.get(n)?.unsubscribe(),
          this.outletDataSubscriptions.delete(n);
      }
      subscribeToRouteData(n) {
        let { activatedRoute: i } = n,
          o = dr([i.queryParams, i.params, i.data])
            .pipe(
              De(
                ([s, a, c], u) => (
                  (c = y(y(y({}, s), a), c)),
                  u === 0 ? S(c) : Promise.resolve(c)
                )
              )
            )
            .subscribe((s) => {
              if (
                !n.isActivated ||
                !n.activatedComponentRef ||
                n.activatedRoute !== i ||
                i.component === null
              ) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              let a = Th(i.component);
              if (!a) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              for (let { templateName: c } of a.inputs)
                n.activatedComponentRef.setInput(c, s[c]);
            });
        this.outletDataSubscriptions.set(n, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function ow(t, e, r) {
  let n = Jr(t, e._root, r ? r._root : void 0);
  return new vs(n, e);
}
function Jr(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = e.value;
    let i = sw(t, e, r);
    return new Re(n, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => Jr(t, a))),
          s
        );
      }
    }
    let n = aw(e.value),
      i = e.children.map((o) => Jr(t, o));
    return new Re(n, i);
  }
}
function sw(t, e, r) {
  return e.children.map((n) => {
    for (let i of r.children)
      if (t.shouldReuseRoute(n.value, i.value.snapshot)) return Jr(t, n, i);
    return Jr(t, n);
  });
}
function aw(t) {
  return new $t(
    new se(t.url),
    new se(t.params),
    new se(t.queryParams),
    new se(t.fragment),
    new se(t.data),
    t.outlet,
    t.component,
    t
  );
}
var Np = "ngNavigationCancelingError";
function Rp(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = ir(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = Fp(!1, Fe.Redirect);
  return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function Fp(t, e) {
  let r = new Error(`NavigationCancelingError: ${t || ""}`);
  return (r[Np] = !0), (r.cancellationCode = e), r;
}
function cw(t) {
  return kp(t) && ir(t.url);
}
function kp(t) {
  return !!t && t[Np];
}
var uw = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [q],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && E(0, "router-outlet");
      },
      dependencies: [Yu],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function lw(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = Uo(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function Qu(t) {
  let e = t.children && t.children.map(Qu),
    r = e ? G(y({}, t), { children: e }) : y({}, t);
  return (
    !r.component &&
      !r.loadComponent &&
      (e || r.loadChildren) &&
      r.outlet &&
      r.outlet !== N &&
      (r.component = uw),
    r
  );
}
function ut(t) {
  return t.outlet || N;
}
function dw(t, e) {
  let r = t.filter((n) => ut(n) === e);
  return r.push(...t.filter((n) => ut(n) !== e)), r;
}
function ii(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var fw = (t, e, r, n) =>
    P(
      (i) => (
        new Bu(e, i.targetRouterState, i.currentRouterState, r, n).activate(t),
        i
      )
    ),
  Bu = class {
    constructor(e, r, n, i, o) {
      (this.routeReuseStrategy = e),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, e),
        Cu(this.futureState.root),
        this.activateChildRoutes(r, n, e);
    }
    deactivateChildRoutes(e, r, n) {
      let i = er(r);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], n), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, n);
        });
    }
    deactivateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if (i === o)
        if (i.component) {
          let s = n.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, r, s.children);
        } else this.deactivateChildRoutes(e, r, n);
      else o && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r);
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = er(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = er(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(e, r, n) {
      let i = er(r);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], n),
          this.forwardEvent(new Fu(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new Nu(e.value.snapshot));
    }
    activateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if ((Cu(i), i === o))
        if (i.component) {
          let s = n.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, r, s.children);
        } else this.activateChildRoutes(e, r, n);
      else if (i.component) {
        let s = n.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Cu(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = ii(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, n);
    }
  },
  Cs = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  nr = class {
    constructor(e, r) {
      (this.component = e), (this.route = r);
    }
  };
function hw(t, e, r) {
  let n = t._root,
    i = e ? e._root : null;
  return Br(n, i, r, [n.value]);
}
function pw(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function ar(t, e) {
  let r = Symbol(),
    n = e.get(t, r);
  return n === r ? (typeof t == "function" && !Od(t) ? t : e.get(t)) : n;
}
function Br(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = er(e);
  return (
    t.children.forEach((s) => {
      gw(s, o[s.value.outlet], r, n.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => Gr(a, r.getContext(s), i)),
    i
  );
}
function gw(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = t.value,
    s = e ? e.value : null,
    a = r ? r.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let c = mw(s, o, o.routeConfig.runGuardsAndResolvers);
    c
      ? i.canActivateChecks.push(new Cs(n))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? Br(t, e, a ? a.children : null, n, i) : Br(t, e, r, n, i),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new nr(a.outlet.component, s));
  } else
    s && Gr(e, a, i),
      i.canActivateChecks.push(new Cs(n)),
      o.component
        ? Br(t, null, a ? a.children : null, n, i)
        : Br(t, null, r, n, i);
  return i;
}
function mw(t, e, r) {
  if (typeof r == "function") return r(t, e);
  switch (r) {
    case "pathParamsChange":
      return !hn(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !hn(t.url, e.url) || !at(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Vu(t, e) || !at(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !Vu(t, e);
  }
}
function Gr(t, e, r) {
  let n = er(t),
    i = t.value;
  Object.entries(n).forEach(([o, s]) => {
    i.component
      ? e
        ? Gr(s, e.children.getContext(o), r)
        : Gr(s, null, r)
      : Gr(s, e, r);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new nr(e.outlet.component, i))
        : r.canDeactivateChecks.push(new nr(null, i))
      : r.canDeactivateChecks.push(new nr(null, i));
}
function oi(t) {
  return typeof t == "function";
}
function vw(t) {
  return typeof t == "boolean";
}
function yw(t) {
  return t && oi(t.canLoad);
}
function Cw(t) {
  return t && oi(t.canActivate);
}
function _w(t) {
  return t && oi(t.canActivateChild);
}
function Dw(t) {
  return t && oi(t.canDeactivate);
}
function ww(t) {
  return t && oi(t.canMatch);
}
function Lp(t) {
  return t instanceof lt || t?.name === "EmptyError";
}
var as = Symbol("INITIAL_VALUE");
function sr() {
  return De((t) =>
    dr(t.map((e) => e.pipe(ft(1), Qs(as)))).pipe(
      P((e) => {
        for (let r of e)
          if (r !== !0) {
            if (r === as) return as;
            if (r === !1 || r instanceof Vt) return r;
          }
        return !0;
      }),
      _e((e) => e !== as),
      ft(1)
    )
  );
}
function bw(t, e) {
  return J((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && o.length === 0
      ? S(G(y({}, r), { guardsResult: !0 }))
      : Mw(s, n, i, t).pipe(
          J((a) => (a && vw(a) ? Ew(n, o, t, e) : S(a))),
          P((a) => G(y({}, r), { guardsResult: a }))
        );
  });
}
function Mw(t, e, r, n) {
  return Z(t).pipe(
    J((i) => Aw(i.component, i.route, r, e, n)),
    Ke((i) => i !== !0, !0)
  );
}
function Ew(t, e, r, n) {
  return Z(e).pipe(
    dt((i) =>
      bn(
        xw(i.route.parent, n),
        Iw(i.route, n),
        Tw(t, i.path, r),
        Sw(t, i.route, r)
      )
    ),
    Ke((i) => i !== !0, !0)
  );
}
function Iw(t, e) {
  return t !== null && e && e(new Ru(t)), S(!0);
}
function xw(t, e) {
  return t !== null && e && e(new Pu(t)), S(!0);
}
function Sw(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!n || n.length === 0) return S(!0);
  let i = n.map((o) =>
    Fi(() => {
      let s = ii(e) ?? r,
        a = ar(o, s),
        c = Cw(a) ? a.canActivate(e, t) : qe(s, () => a(e, t));
      return Ht(c).pipe(Ke());
    })
  );
  return S(i).pipe(sr());
}
function Tw(t, e, r) {
  let n = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => pw(s))
      .filter((s) => s !== null)
      .map((s) =>
        Fi(() => {
          let a = s.guards.map((c) => {
            let u = ii(s.node) ?? r,
              l = ar(c, u),
              d = _w(l) ? l.canActivateChild(n, t) : qe(u, () => l(n, t));
            return Ht(d).pipe(Ke());
          });
          return S(a).pipe(sr());
        })
      );
  return S(o).pipe(sr());
}
function Aw(t, e, r, n, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return S(!0);
  let s = o.map((a) => {
    let c = ii(e) ?? i,
      u = ar(a, c),
      l = Dw(u) ? u.canDeactivate(t, e, r, n) : qe(c, () => u(t, e, r, n));
    return Ht(l).pipe(Ke());
  });
  return S(s).pipe(sr());
}
function Ow(t, e, r, n) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return S(!0);
  let o = i.map((s) => {
    let a = ar(s, t),
      c = yw(a) ? a.canLoad(e, r) : qe(t, () => a(e, r));
    return Ht(c);
  });
  return S(o).pipe(sr(), jp(n));
}
function jp(t) {
  return Bs(
    ne((e) => {
      if (ir(e)) throw Rp(t, e);
    }),
    P((e) => e === !0)
  );
}
function Pw(t, e, r, n) {
  let i = e.canMatch;
  if (!i || i.length === 0) return S(!0);
  let o = i.map((s) => {
    let a = ar(s, t),
      c = ww(a) ? a.canMatch(e, r) : qe(t, () => a(e, r));
    return Ht(c);
  });
  return S(o).pipe(sr(), jp(n));
}
var Xr = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  _s = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function Xn(t) {
  return Dn(new Xr(t));
}
function Nw(t) {
  return Dn(new b(4e3, !1));
}
function Rw(t) {
  return Dn(Fp(!1, Fe.GuardRejected));
}
var $u = class {
    constructor(e, r) {
      (this.urlSerializer = e), (this.urlTree = r);
    }
    lineralizeSegments(e, r) {
      let n = [],
        i = r.root;
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return S(n);
        if (i.numberOfChildren > 1 || !i.children[N]) return Nw(e.redirectTo);
        i = i.children[N];
      }
    }
    applyRedirectCommands(e, r, n) {
      let i = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        e,
        n
      );
      if (r.startsWith("/")) throw new _s(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, r, n, i) {
      let o = this.createSegmentGroup(e, r.root, n, i);
      return new Vt(
        o,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      );
    }
    createQueryParams(e, r) {
      let n = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == "string" && o.startsWith(":")) {
            let a = o.substring(1);
            n[i] = r[a];
          } else n[i] = o;
        }),
        n
      );
    }
    createSegmentGroup(e, r, n, i) {
      let o = this.createSegments(e, r.segments, n, i),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, c]) => {
          s[a] = this.createSegmentGroup(e, c, n, i);
        }),
        new $(o, s)
      );
    }
    createSegments(e, r, n, i) {
      return r.map((o) =>
        o.path.startsWith(":")
          ? this.findPosParam(e, o, i)
          : this.findOrReturn(o, n)
      );
    }
    findPosParam(e, r, n) {
      let i = n[r.path.substring(1)];
      if (!i) throw new b(4001, !1);
      return i;
    }
    findOrReturn(e, r) {
      let n = 0;
      for (let i of r) {
        if (i.path === e.path) return r.splice(n), i;
        n++;
      }
      return e;
    }
  },
  Hu = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function Fw(t, e, r, n, i) {
  let o = Ku(t, e, r);
  return o.matched
    ? ((n = lw(e, n)),
      Pw(n, e, r, i).pipe(P((s) => (s === !0 ? o : y({}, Hu)))))
    : S(o);
}
function Ku(t, e, r) {
  if (e.path === "**") return kw(r);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || r.length > 0)
      ? y({}, Hu)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || PD)(r, t, e);
  if (!i) return y({}, Hu);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, c]) => {
    o[a] = c.path;
  });
  let s =
    i.consumed.length > 0
      ? y(y({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: r.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function kw(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? vp(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function hp(t, e, r, n) {
  return r.length > 0 && Vw(t, r, n)
    ? {
        segmentGroup: new $(e, jw(n, new $(r, t.children))),
        slicedSegments: [],
      }
    : r.length === 0 && Uw(t, r, n)
    ? {
        segmentGroup: new $(t.segments, Lw(t, r, n, t.children)),
        slicedSegments: r,
      }
    : { segmentGroup: new $(t.segments, t.children), slicedSegments: r };
}
function Lw(t, e, r, n) {
  let i = {};
  for (let o of r)
    if (bs(t, e, o) && !n[ut(o)]) {
      let s = new $([], {});
      i[ut(o)] = s;
    }
  return y(y({}, n), i);
}
function jw(t, e) {
  let r = {};
  r[N] = e;
  for (let n of t)
    if (n.path === "" && ut(n) !== N) {
      let i = new $([], {});
      r[ut(n)] = i;
    }
  return r;
}
function Vw(t, e, r) {
  return r.some((n) => bs(t, e, n) && ut(n) !== N);
}
function Uw(t, e, r) {
  return r.some((n) => bs(t, e, n));
}
function bs(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === "";
}
function Bw(t, e, r, n) {
  return ut(t) !== n && (n === N || !bs(e, r, t)) ? !1 : Ku(e, t, r).matched;
}
function $w(t, e, r) {
  return e.length === 0 && !t.children[r];
}
var zu = class {};
function Hw(t, e, r, n, i, o, s = "emptyOnly") {
  return new Gu(t, e, r, n, i, s, o).recognize();
}
var zw = 31,
  Gu = class {
    constructor(e, r, n, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new $u(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new b(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = hp(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        P((r) => {
          let n = new Kr(
              [],
              Object.freeze({}),
              Object.freeze(y({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              N,
              this.rootComponentType,
              null,
              {}
            ),
            i = new Re(n, r),
            o = new ys("", i),
            s = KD(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, N).pipe(
        bt((n) => {
          if (n instanceof _s)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof Xr ? this.noMatchError(n) : n;
        })
      );
    }
    inheritParamsAndData(e, r) {
      let n = e.value,
        i = qu(n, r, this.paramsInheritanceStrategy);
      (n.params = Object.freeze(i.params)),
        (n.data = Object.freeze(i.data)),
        e.children.forEach((o) => this.inheritParamsAndData(o, n));
    }
    processSegmentGroup(e, r, n, i) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n)
        : this.processSegment(e, r, n, n.segments, i, !0).pipe(
            P((o) => (o instanceof Re ? [o] : []))
          );
    }
    processChildren(e, r, n) {
      let i = [];
      for (let o of Object.keys(n.children))
        o === "primary" ? i.unshift(o) : i.push(o);
      return Z(i).pipe(
        dt((o) => {
          let s = n.children[o],
            a = dw(r, o);
          return this.processSegmentGroup(e, a, s, o);
        }),
        Ys((o, s) => (o.push(...s), o)),
        Mt(null),
        Zs(),
        J((o) => {
          if (o === null) return Xn(n);
          let s = Vp(o);
          return Gw(s), S(s);
        })
      );
    }
    processSegment(e, r, n, i, o, s) {
      return Z(r).pipe(
        dt((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            r,
            a,
            n,
            i,
            o,
            s
          ).pipe(
            bt((c) => {
              if (c instanceof Xr) return S(null);
              throw c;
            })
          )
        ),
        Ke((a) => !!a),
        bt((a) => {
          if (Lp(a)) return $w(n, i, o) ? S(new zu()) : Xn(n);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, r, n, i, o, s, a) {
      return Bw(n, i, o, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, n, o, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, r, n, o, s)
          : Xn(i)
        : Xn(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, i, o, s) {
      let {
        matched: a,
        consumedSegments: c,
        positionalParamSegments: u,
        remainingSegments: l,
      } = Ku(r, i, o);
      if (!a) return Xn(r);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > zw && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(c, i.redirectTo, u);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(J((f) => this.processSegment(e, n, r, f.concat(l), s, !1)));
    }
    matchSegmentAgainstRoute(e, r, n, i, o) {
      let s = Fw(r, n, i, e, this.urlSerializer);
      return (
        n.path === "**" && (r.children = {}),
        s.pipe(
          De((a) =>
            a.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, i).pipe(
                  De(({ routes: c }) => {
                    let u = n._loadedInjector ?? e,
                      {
                        consumedSegments: l,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      g = new Kr(
                        l,
                        f,
                        Object.freeze(y({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        qw(n),
                        ut(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        Zw(n)
                      ),
                      { segmentGroup: C, slicedSegments: A } = hp(r, l, d, c);
                    if (A.length === 0 && C.hasChildren())
                      return this.processChildren(u, c, C).pipe(
                        P((_) => (_ === null ? null : new Re(g, _)))
                      );
                    if (c.length === 0 && A.length === 0)
                      return S(new Re(g, []));
                    let I = ut(n) === o;
                    return this.processSegment(u, c, C, A, I ? N : o, !0).pipe(
                      P((_) => new Re(g, _ instanceof Re ? [_] : []))
                    );
                  })
                ))
              : Xn(r)
          )
        )
      );
    }
    getChildConfig(e, r, n) {
      return r.children
        ? S({ routes: r.children, injector: e })
        : r.loadChildren
        ? r._loadedRoutes !== void 0
          ? S({ routes: r._loadedRoutes, injector: r._loadedInjector })
          : Ow(e, r, n, this.urlSerializer).pipe(
              J((i) =>
                i
                  ? this.configLoader.loadChildren(e, r).pipe(
                      ne((o) => {
                        (r._loadedRoutes = o.routes),
                          (r._loadedInjector = o.injector);
                      })
                    )
                  : Rw(r)
              )
            )
        : S({ routes: [], injector: e });
    }
  };
function Gw(t) {
  t.sort((e, r) =>
    e.value.outlet === N
      ? -1
      : r.value.outlet === N
      ? 1
      : e.value.outlet.localeCompare(r.value.outlet)
  );
}
function Ww(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function Vp(t) {
  let e = [],
    r = new Set();
  for (let n of t) {
    if (!Ww(n)) {
      e.push(n);
      continue;
    }
    let i = e.find((o) => n.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : e.push(n);
  }
  for (let n of r) {
    let i = Vp(n.children);
    e.push(new Re(n.value, i));
  }
  return e.filter((n) => !r.has(n));
}
function qw(t) {
  return t.data || {};
}
function Zw(t) {
  return t.resolve || {};
}
function Yw(t, e, r, n, i, o) {
  return J((s) =>
    Hw(t, e, r, n, s.extractedUrl, i, o).pipe(
      P(({ state: a, tree: c }) =>
        G(y({}, s), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function Qw(t, e) {
  return J((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r;
    if (!i.length) return S(r);
    let o = new Set(i.map((c) => c.route)),
      s = new Set();
    for (let c of o) if (!s.has(c)) for (let u of Up(c)) s.add(u);
    let a = 0;
    return Z(s).pipe(
      dt((c) =>
        o.has(c)
          ? Kw(c, n, t, e)
          : ((c.data = qu(c, c.parent, t).resolve), S(void 0))
      ),
      ne(() => a++),
      Mn(1),
      J((c) => (a === s.size ? S(r) : Se))
    );
  });
}
function Up(t) {
  let e = t.children.map((r) => Up(r)).flat();
  return [t, ...e];
}
function Kw(t, e, r, n) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !Pp(i) && (o[ti] = i.title),
    Jw(o, t, e, n).pipe(
      P(
        (s) => (
          (t._resolvedData = s), (t.data = qu(t, t.parent, r).resolve), null
        )
      )
    )
  );
}
function Jw(t, e, r, n) {
  let i = wu(t);
  if (i.length === 0) return S({});
  let o = {};
  return Z(i).pipe(
    J((s) =>
      Xw(t[s], e, r, n).pipe(
        Ke(),
        ne((a) => {
          o[s] = a;
        })
      )
    ),
    Mn(1),
    qs(o),
    bt((s) => (Lp(s) ? Se : Dn(s)))
  );
}
function Xw(t, e, r, n) {
  let i = ii(e) ?? n,
    o = ar(t, i),
    s = o.resolve ? o.resolve(e, r) : qe(i, () => o(e, r));
  return Ht(s);
}
function _u(t) {
  return De((e) => {
    let r = t(e);
    return r ? Z(r).pipe(P(() => e)) : S(e);
  });
}
var Bp = (() => {
    let e = class e {
      buildTitle(n) {
        let i,
          o = n.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === N));
        return i;
      }
      getResolvedTitleForRoute(n) {
        return n.data[ti];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => v(e1), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  e1 = (() => {
    let e = class e extends Bp {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let i = this.buildTitle(n);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(ap));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  si = new D("", { providedIn: "root", factory: () => ({}) }),
  ei = new D(""),
  Ju = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = v(Wo));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return S(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let i = Ht(n.loadComponent()).pipe(
            P($p),
            ne((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            Et(() => {
              this.componentLoaders.delete(n);
            })
          ),
          o = new _n(i, () => new le()).pipe(Cn());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return S({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = t1(i, this.compiler, n, this.onLoadEndListener).pipe(
            Et(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new _n(s, () => new le()).pipe(Cn());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function t1(t, e, r, n) {
  return Ht(t.loadChildren()).pipe(
    P($p),
    J((i) =>
      i instanceof br || Array.isArray(i) ? S(i) : Z(e.compileModuleAsync(i))
    ),
    P((i) => {
      n && n(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(r).injector),
            (s = o.get(ei, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Qu), injector: o }
      );
    })
  );
}
function n1(t) {
  return t && typeof t == "object" && "default" in t;
}
function $p(t) {
  return n1(t) ? t.default : t;
}
var Xu = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => v(r1), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  r1 = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, i) {
        return n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Hp = new D(""),
  zp = new D("");
function i1(t, e, r) {
  let n = t.get(zp),
    i = t.get(pe);
  return t.get(Q).runOutsideAngular(() => {
    if (!i.startViewTransition || n.skipNextTransition)
      return (n.skipNextTransition = !1), new Promise((u) => setTimeout(u));
    let o,
      s = new Promise((u) => {
        o = u;
      }),
      a = i.startViewTransition(() => (o(), o1(t))),
      { onViewTransitionCreated: c } = n;
    return c && qe(t, () => c({ transition: a, from: e, to: r })), s;
  });
}
function o1(t) {
  return new Promise((e) => {
    Vo(e, { injector: t });
  });
}
var el = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new le()),
        (this.transitionAbortSubject = new le()),
        (this.configLoader = v(Ju)),
        (this.environmentInjector = v(fe)),
        (this.urlSerializer = v(ni)),
        (this.rootContexts = v(ri)),
        (this.location = v(Kn)),
        (this.inputBindingEnabled = v(ws, { optional: !0 }) !== null),
        (this.titleStrategy = v(Bp)),
        (this.options = v(si, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = v(Xu)),
        (this.createViewTransition = v(Hp, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => S(void 0)),
        (this.rootComponentType = null);
      let n = (o) => this.events.next(new Au(o)),
        i = (o) => this.events.next(new Ou(o));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = n);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let i = ++this.navigationId;
      this.transitions?.next(G(y(y({}, this.transitions.value), n), { id: i }));
    }
    setupNavigations(n, i, o) {
      return (
        (this.transitions = new se({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: zr,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          _e((s) => s.id !== 0),
          P((s) =>
            G(y({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          De((s) => {
            let a = !1,
              c = !1;
            return S(s).pipe(
              De((u) => {
                if (this.navigationId > s.id)
                  return (
                    this.cancelNavigationTransition(
                      s,
                      "",
                      Fe.SupersededByNewNavigation
                    ),
                    Se
                  );
                (this.currentTransition = s),
                  (this.currentNavigation = {
                    id: u.id,
                    initialUrl: u.rawUrl,
                    extractedUrl: u.extractedUrl,
                    trigger: u.source,
                    extras: u.extras,
                    previousNavigation: this.lastSuccessfulNavigation
                      ? G(y({}, this.lastSuccessfulNavigation), {
                          previousNavigation: null,
                        })
                      : null,
                  });
                let l =
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = u.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!l && d !== "reload") {
                  let f = "";
                  return (
                    this.events.next(
                      new Bt(
                        u.id,
                        this.urlSerializer.serialize(u.rawUrl),
                        f,
                        hs.IgnoredSameUrlNavigation
                      )
                    ),
                    u.resolve(null),
                    Se
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(u.rawUrl))
                  return S(u).pipe(
                    De((f) => {
                      let g = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new or(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState
                          )
                        ),
                        g !== this.transitions?.getValue()
                          ? Se
                          : Promise.resolve(f)
                      );
                    }),
                    Yw(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    ne((f) => {
                      (s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = G(
                          y({}, this.currentNavigation),
                          { finalUrl: f.urlAfterRedirects }
                        ));
                      let g = new ps(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot
                      );
                      this.events.next(g);
                    })
                  );
                if (
                  l &&
                  this.urlHandlingStrategy.shouldProcessUrl(u.currentRawUrl)
                ) {
                  let {
                      id: f,
                      extractedUrl: g,
                      source: C,
                      restoredState: A,
                      extras: I,
                    } = u,
                    _ = new or(f, this.urlSerializer.serialize(g), C, A);
                  this.events.next(_);
                  let ue = Ap(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      G(y({}, u), {
                        targetSnapshot: ue,
                        urlAfterRedirects: g,
                        extras: G(y({}, I), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = g),
                    S(s)
                  );
                } else {
                  let f = "";
                  return (
                    this.events.next(
                      new Bt(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        f,
                        hs.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    u.resolve(null),
                    Se
                  );
                }
              }),
              ne((u) => {
                let l = new Iu(
                  u.id,
                  this.urlSerializer.serialize(u.extractedUrl),
                  this.urlSerializer.serialize(u.urlAfterRedirects),
                  u.targetSnapshot
                );
                this.events.next(l);
              }),
              P(
                (u) => (
                  (this.currentTransition = s =
                    G(y({}, u), {
                      guards: hw(
                        u.targetSnapshot,
                        u.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              bw(this.environmentInjector, (u) => this.events.next(u)),
              ne((u) => {
                if (((s.guardsResult = u.guardsResult), ir(u.guardsResult)))
                  throw Rp(this.urlSerializer, u.guardsResult);
                let l = new xu(
                  u.id,
                  this.urlSerializer.serialize(u.extractedUrl),
                  this.urlSerializer.serialize(u.urlAfterRedirects),
                  u.targetSnapshot,
                  !!u.guardsResult
                );
                this.events.next(l);
              }),
              _e((u) =>
                u.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(u, "", Fe.GuardRejected),
                    !1)
              ),
              _u((u) => {
                if (u.guards.canActivateChecks.length)
                  return S(u).pipe(
                    ne((l) => {
                      let d = new Su(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    De((l) => {
                      let d = !1;
                      return S(l).pipe(
                        Qw(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        ne({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                l,
                                "",
                                Fe.NoDataFromResolver
                              );
                          },
                        })
                      );
                    }),
                    ne((l) => {
                      let d = new Tu(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              _u((u) => {
                let l = (d) => {
                  let f = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        ne((g) => {
                          d.component = g;
                        }),
                        P(() => {})
                      )
                    );
                  for (let g of d.children) f.push(...l(g));
                  return f;
                };
                return dr(l(u.targetSnapshot.root)).pipe(Mt(null), ft(1));
              }),
              _u(() => this.afterPreactivation()),
              De(() => {
                let { currentSnapshot: u, targetSnapshot: l } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    u.root,
                    l.root
                  );
                return d ? Z(d).pipe(P(() => s)) : S(s);
              }),
              P((u) => {
                let l = ow(
                  n.routeReuseStrategy,
                  u.targetSnapshot,
                  u.currentRouterState
                );
                return (
                  (this.currentTransition = s =
                    G(y({}, u), { targetRouterState: l })),
                  (this.currentNavigation.targetRouterState = l),
                  s
                );
              }),
              ne(() => {
                this.events.next(new Yr());
              }),
              fw(
                this.rootContexts,
                n.routeReuseStrategy,
                (u) => this.events.next(u),
                this.inputBindingEnabled
              ),
              ft(1),
              ne({
                next: (u) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new ct(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      u.targetRouterState.snapshot
                    ),
                    u.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              Ks(
                this.transitionAbortSubject.pipe(
                  ne((u) => {
                    throw u;
                  })
                )
              ),
              Et(() => {
                !a &&
                  !c &&
                  this.cancelNavigationTransition(
                    s,
                    "",
                    Fe.SupersededByNewNavigation
                  ),
                  this.currentTransition?.id === s.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null));
              }),
              bt((u) => {
                if (((c = !0), kp(u)))
                  this.events.next(
                    new Ut(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      u.message,
                      u.cancellationCode
                    )
                  ),
                    cw(u) ? this.events.next(new Qr(u.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new Zr(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      u,
                      s.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    s.resolve(n.errorHandler(u));
                  } catch (l) {
                    this.options.resolveNavigationPromiseOnError
                      ? s.resolve(!1)
                      : s.reject(l);
                  }
                }
                return Se;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(n, i, o) {
      let s = new Ut(n.id, this.urlSerializer.serialize(n.extractedUrl), i, o);
      this.events.next(s), n.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function s1(t) {
  return t !== zr;
}
var a1 = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => v(c1), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Wu = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig;
    }
  },
  c1 = (() => {
    let e = class e extends Wu {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = an(e)))(o || e);
      };
    })()),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Gp = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => v(u1), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  u1 = (() => {
    let e = class e extends Gp {
      constructor() {
        super(...arguments),
          (this.location = v(Kn)),
          (this.urlSerializer = v(ni)),
          (this.options = v(si, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = v(Xu)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Vt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Ap(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && n(i.url, i.state);
        });
      }
      handleRouterEvent(n, i) {
        if (n instanceof or) this.stateMemento = this.createStateMemento();
        else if (n instanceof Bt) this.rawUrlTree = i.initialUrl;
        else if (n instanceof ps) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          n instanceof Yr
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : n instanceof Ut &&
              (n.code === Fe.GuardRejected || n.code === Fe.NoDataFromResolver)
            ? this.restoreHistory(i)
            : n instanceof Zr
            ? this.restoreHistory(i, !0)
            : n instanceof ct &&
              ((this.lastSuccessfulId = n.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, i) {
        let o = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = y(y({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, "", a);
        } else {
          let s = y(
            y({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(o, "", s);
        }
      }
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: i }
          : { navigationId: n };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = an(e)))(o || e);
      };
    })()),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  $r = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })($r || {});
function Wp(t, e) {
  t.events
    .pipe(
      _e(
        (r) =>
          r instanceof ct ||
          r instanceof Ut ||
          r instanceof Zr ||
          r instanceof Bt
      ),
      P((r) =>
        r instanceof ct || r instanceof Bt
          ? $r.COMPLETE
          : (
              r instanceof Ut
                ? r.code === Fe.Redirect ||
                  r.code === Fe.SupersededByNewNavigation
                : !1
            )
          ? $r.REDIRECTING
          : $r.FAILED
      ),
      _e((r) => r !== $r.REDIRECTING),
      ft(1)
    )
    .subscribe(() => {
      e();
    });
}
function l1(t) {
  throw t;
}
var d1 = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  f1 = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  _t = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = v(zo)),
          (this.stateManager = v(Gp)),
          (this.options = v(si, { optional: !0 }) || {}),
          (this.pendingTasks = v(cn)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = v(el)),
          (this.urlSerializer = v(ni)),
          (this.location = v(Kn)),
          (this.urlHandlingStrategy = v(Xu)),
          (this._events = new le()),
          (this.errorHandler = this.options.errorHandler || l1),
          (this.navigated = !1),
          (this.routeReuseStrategy = v(a1)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = v(ei, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!v(ws, { optional: !0 })),
          (this.eventsSubscription = new X()),
          (this.isNgZoneEnabled = v(Q) instanceof Q && Q.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof Ut &&
                  i.code !== Fe.Redirect &&
                  i.code !== Fe.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof ct) this.navigated = !0;
              else if (i instanceof Qr) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  c = {
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || s1(o.source),
                  };
                this.scheduleNavigation(a, zr, null, c, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            p1(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              zr,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", i);
              }, 0);
            }
          );
      }
      navigateToSyncWithBrowser(n, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let u = y({}, o);
          delete u.navigationId,
            delete u.ɵrouterPageId,
            Object.keys(u).length !== 0 && (s.state = u);
        }
        let c = this.parseUrl(n);
        this.scheduleNavigation(c, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(Qu)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: u,
          } = i,
          l = u ? this.currentUrlTree.fragment : a,
          d = null;
        switch (c) {
          case "merge":
            d = y(y({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let f;
        try {
          let g = o ? o.snapshot : this.routerState.snapshot.root;
          f = Ip(g);
        } catch {
          (typeof n[0] != "string" || !n[0].startsWith("/")) && (n = []),
            (f = this.currentUrlTree.root);
        }
        return xp(f, n, d, l ?? null);
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let o = ir(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, zr, null, i);
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return h1(n), this.navigateByUrl(this.createUrlTree(n, i), i);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, i) {
        let o;
        if (
          (i === !0 ? (o = y({}, d1)) : i === !1 ? (o = y({}, f1)) : (o = i),
          ir(n))
        )
          return cp(this.currentUrlTree, n, o);
        let s = this.parseUrl(n);
        return cp(this.currentUrlTree, s, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {}
        );
      }
      scheduleNavigation(n, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, u, l;
        a
          ? ((c = a.resolve), (u = a.reject), (l = a.promise))
          : (l = new Promise((f, g) => {
              (c = f), (u = g);
            }));
        let d = this.pendingTasks.add();
        return (
          Wp(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: c,
            reject: u,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((f) => Promise.reject(f))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function h1(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new b(4008, !1);
}
function p1(t) {
  return !(t instanceof Yr) && !(t instanceof Qr);
}
var qp = (() => {
  let e = class e {
    constructor(n, i, o, s, a, c) {
      (this.router = n),
        (this.route = i),
        (this.tabIndexAttribute = o),
        (this.renderer = s),
        (this.el = a),
        (this.locationStrategy = c),
        (this.href = null),
        (this.commands = null),
        (this.onChanges = new le()),
        (this.preserveFragment = !1),
        (this.skipLocationChange = !1),
        (this.replaceUrl = !1);
      let u = a.nativeElement.tagName?.toLowerCase();
      (this.isAnchorElement = u === "a" || u === "area"),
        this.isAnchorElement
          ? (this.subscription = n.events.subscribe((l) => {
              l instanceof ct && this.updateHref();
            }))
          : this.setTabIndexIfNotOnNativeEl("0");
    }
    setTabIndexIfNotOnNativeEl(n) {
      this.tabIndexAttribute != null ||
        this.isAnchorElement ||
        this.applyAttributeValue("tabindex", n);
    }
    ngOnChanges(n) {
      this.isAnchorElement && this.updateHref(), this.onChanges.next(this);
    }
    set routerLink(n) {
      n != null
        ? ((this.commands = Array.isArray(n) ? n : [n]),
          this.setTabIndexIfNotOnNativeEl("0"))
        : ((this.commands = null), this.setTabIndexIfNotOnNativeEl(null));
    }
    onClick(n, i, o, s, a) {
      let c = this.urlTree;
      if (
        c === null ||
        (this.isAnchorElement &&
          (n !== 0 ||
            i ||
            o ||
            s ||
            a ||
            (typeof this.target == "string" && this.target != "_self")))
      )
        return !0;
      let u = {
        skipLocationChange: this.skipLocationChange,
        replaceUrl: this.replaceUrl,
        state: this.state,
        info: this.info,
      };
      return this.router.navigateByUrl(c, u), !this.isAnchorElement;
    }
    ngOnDestroy() {
      this.subscription?.unsubscribe();
    }
    updateHref() {
      let n = this.urlTree;
      this.href =
        n !== null && this.locationStrategy
          ? this.locationStrategy?.prepareExternalUrl(
              this.router.serializeUrl(n)
            )
          : null;
      let i =
        this.href === null
          ? null
          : $f(this.href, this.el.nativeElement.tagName.toLowerCase(), "href");
      this.applyAttributeValue("href", i);
    }
    applyAttributeValue(n, i) {
      let o = this.renderer,
        s = this.el.nativeElement;
      i !== null ? o.setAttribute(s, n, i) : o.removeAttribute(s, n);
    }
    get urlTree() {
      return this.commands === null
        ? null
        : this.router.createUrlTree(this.commands, {
            relativeTo:
              this.relativeTo !== void 0 ? this.relativeTo : this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: this.preserveFragment,
          });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(L(_t), L($t), _c("tabindex"), L(st), L(Ye), L(Ct));
  }),
    (e.ɵdir = ae({
      type: e,
      selectors: [["", "routerLink", ""]],
      hostVars: 1,
      hostBindings: function (i, o) {
        i & 1 &&
          Ee("click", function (a) {
            return o.onClick(
              a.button,
              a.ctrlKey,
              a.shiftKey,
              a.altKey,
              a.metaKey
            );
          }),
          i & 2 && Bo("target", o.target);
      },
      inputs: {
        target: "target",
        queryParams: "queryParams",
        fragment: "fragment",
        queryParamsHandling: "queryParamsHandling",
        state: "state",
        info: "info",
        relativeTo: "relativeTo",
        preserveFragment: [
          de.HasDecoratorInputTransform,
          "preserveFragment",
          "preserveFragment",
          Yn,
        ],
        skipLocationChange: [
          de.HasDecoratorInputTransform,
          "skipLocationChange",
          "skipLocationChange",
          Yn,
        ],
        replaceUrl: [
          de.HasDecoratorInputTransform,
          "replaceUrl",
          "replaceUrl",
          Yn,
        ],
        routerLink: "routerLink",
      },
      standalone: !0,
      features: [$c, rn],
    }));
  let t = e;
  return t;
})();
var Ds = class {};
var g1 = (() => {
    let e = class e {
      constructor(n, i, o, s, a) {
        (this.router = n),
          (this.injector = o),
          (this.preloadingStrategy = s),
          (this.loader = a);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            _e((n) => n instanceof ct),
            dt(() => this.preload())
          )
          .subscribe(() => {});
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config);
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
      }
      processRoutes(n, i) {
        let o = [];
        for (let s of i) {
          s.providers &&
            !s._injector &&
            (s._injector = Uo(s.providers, n, `Route: ${s.path}`));
          let a = s._injector ?? n,
            c = s._loadedInjector ?? a;
          ((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            o.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              o.push(this.processRoutes(c, s.children ?? s._loadedRoutes));
        }
        return Z(o).pipe(wn());
      }
      preloadConfig(n, i) {
        return this.preloadingStrategy.preload(i, () => {
          let o;
          i.loadChildren && i.canLoad === void 0
            ? (o = this.loader.loadChildren(n, i))
            : (o = S(null));
          let s = o.pipe(
            J((a) =>
              a === null
                ? S(void 0)
                : ((i._loadedRoutes = a.routes),
                  (i._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? n, a.routes))
            )
          );
          if (i.loadComponent && !i._loadedComponent) {
            let a = this.loader.loadComponent(i);
            return Z([s, a]).pipe(wn());
          } else return s;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(_t), x(Wo), x(fe), x(Ds), x(Ju));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Zp = new D(""),
  m1 = (() => {
    let e = class e {
      constructor(n, i, o, s, a = {}) {
        (this.urlSerializer = n),
          (this.transitions = i),
          (this.viewportScroller = o),
          (this.zone = s),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = "imperative"),
          (this.restoredId = 0),
          (this.store = {}),
          (this.environmentInjector = v(fe)),
          (a.scrollPositionRestoration ||= "disabled"),
          (a.anchorScrolling ||= "disabled");
      }
      init() {
        this.options.scrollPositionRestoration !== "disabled" &&
          this.viewportScroller.setHistoryScrollRestoration("manual"),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents());
      }
      createScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof or
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = n.navigationTrigger),
              (this.restoredId = n.restoredState
                ? n.restoredState.navigationId
                : 0))
            : n instanceof ct
            ? ((this.lastId = n.id),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.urlAfterRedirects).fragment
              ))
            : n instanceof Bt &&
              n.code === hs.IgnoredSameUrlNavigation &&
              ((this.lastSource = void 0),
              (this.restoredId = 0),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.url).fragment
              ));
        });
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof gs &&
            (n.position
              ? this.options.scrollPositionRestoration === "top"
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === "enabled" &&
                  this.viewportScroller.scrollToPosition(n.position)
              : n.anchor && this.options.anchorScrolling === "enabled"
              ? this.viewportScroller.scrollToAnchor(n.anchor)
              : this.options.scrollPositionRestoration !== "disabled" &&
                this.viewportScroller.scrollToPosition([0, 0]));
        });
      }
      scheduleScrollEvent(n, i) {
        this.zone.runOutsideAngular(() =>
          fi(this, null, function* () {
            yield new Promise((o) => {
              setTimeout(() => {
                o();
              }),
                Vo(
                  () => {
                    o();
                  },
                  { injector: this.environmentInjector }
                );
            }),
              this.zone.run(() => {
                this.transitions.events.next(
                  new gs(
                    n,
                    this.lastSource === "popstate"
                      ? this.store[this.restoredId]
                      : null,
                    i
                  )
                );
              });
          })
        );
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      Xf();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Yp(t, ...e) {
  return Bn([
    { provide: ei, multi: !0, useValue: t },
    [],
    { provide: $t, useFactory: Qp, deps: [_t] },
    { provide: Pr, multi: !0, useFactory: Kp },
    e.map((r) => r.ɵproviders),
  ]);
}
function Qp(t) {
  return t.routerState.root;
}
function ai(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function Kp() {
  let t = v(mt);
  return (e) => {
    let r = t.get(qn);
    if (e !== r.components[0]) return;
    let n = t.get(_t),
      i = t.get(Jp);
    t.get(tl) === 1 && n.initialNavigation(),
      t.get(Xp, null, R.Optional)?.setUpPreloading(),
      t.get(Zp, null, R.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var Jp = new D("", { factory: () => new le() }),
  tl = new D("", { providedIn: "root", factory: () => 1 });
function v1() {
  return ai(2, [
    { provide: tl, useValue: 0 },
    {
      provide: Go,
      multi: !0,
      deps: [mt],
      useFactory: (e) => {
        let r = e.get(Lh, Promise.resolve());
        return () =>
          r.then(
            () =>
              new Promise((n) => {
                let i = e.get(_t),
                  o = e.get(Jp);
                Wp(i, () => {
                  n(!0);
                }),
                  (e.get(el).afterPreactivation = () => (
                    n(!0), o.closed ? S(void 0) : o
                  )),
                  i.initialNavigation();
              })
          );
      },
    },
  ]);
}
function y1() {
  return ai(3, [
    {
      provide: Go,
      multi: !0,
      useFactory: () => {
        let e = v(_t);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: tl, useValue: 2 },
  ]);
}
var Xp = new D("");
function C1(t) {
  return ai(0, [
    { provide: Xp, useExisting: g1 },
    { provide: Ds, useExisting: t },
  ]);
}
function _1() {
  return ai(8, [fp, { provide: ws, useExisting: fp }]);
}
function D1(t) {
  let e = [
    { provide: Hp, useValue: i1 },
    {
      provide: zp,
      useValue: y({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return ai(9, e);
}
var pp = new D("ROUTER_FORROOT_GUARD"),
  w1 = [
    Kn,
    { provide: ni, useClass: Wr },
    _t,
    ri,
    { provide: $t, useFactory: Qp, deps: [_t] },
    Ju,
    [],
  ],
  Ms = (() => {
    let e = class e {
      constructor(n) {}
      static forRoot(n, i) {
        return {
          ngModule: e,
          providers: [
            w1,
            [],
            { provide: ei, multi: !0, useValue: n },
            { provide: pp, useFactory: I1, deps: [[_t, new _o(), new oc()]] },
            { provide: si, useValue: i || {} },
            i?.useHash ? M1() : E1(),
            b1(),
            i?.preloadingStrategy ? C1(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? x1(i) : [],
            i?.bindToComponentInputs ? _1().ɵproviders : [],
            i?.enableViewTransitions ? D1().ɵproviders : [],
            S1(),
          ],
        };
      }
      static forChild(n) {
        return {
          ngModule: e,
          providers: [{ provide: ei, multi: !0, useValue: n }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(pp, 8));
    }),
      (e.ɵmod = it({ type: e })),
      (e.ɵinj = rt({}));
    let t = e;
    return t;
  })();
function b1() {
  return {
    provide: Zp,
    useFactory: () => {
      let t = v(Bh),
        e = v(Q),
        r = v(si),
        n = v(el),
        i = v(ni);
      return (
        r.scrollOffset && t.setOffset(r.scrollOffset), new m1(i, n, t, e, r)
      );
    },
  };
}
function M1() {
  return { provide: Ct, useClass: Vh };
}
function E1() {
  return { provide: Ct, useClass: nu };
}
function I1(t) {
  return "guarded";
}
function x1(t) {
  return [
    t.initialNavigation === "disabled" ? y1().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? v1().ɵproviders : [],
  ];
}
var gp = new D("");
function S1() {
  return [
    { provide: gp, useFactory: Kp },
    { provide: Pr, multi: !0, useExisting: gp },
  ];
}
var T1 = (t) => ({ navbar__menu: !0, open: t });
function A1(t, e) {
  t & 1 && E(0, "img", 19);
}
function O1(t, e) {
  t & 1 && E(0, "img", 20);
}
var tg = (() => {
  let e = class e {
    constructor() {
      this.isMenuOpen = !1;
    }
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-navbar"]],
      standalone: !0,
      features: [q],
      decls: 31,
      vars: 5,
      consts: [
        [1, "navbar"],
        [
          "src",
          "../../../assets/c2silogo-dark.png",
          "alt",
          "C2SI Logo",
          1,
          "logo",
        ],
        ["id", "navbarMenu", 3, "ngClass"],
        ["routerLink", "/", 1, "navbar__menu__items"],
        ["src", "../../../assets/home.svg", "alt", "Home Icon"],
        ["routerLink", "/projects", 1, "navbar__menu__items"],
        ["src", "../../../assets/projects.svg", "alt", "Projects Icon"],
        ["routerLink", "/publications", 1, "navbar__menu__items"],
        ["src", "../../../assets/publications.svg", "alt", "Publications Icon"],
        ["routerLink", "/contributors", 1, "navbar__menu__items"],
        ["src", "../../../assets/contributors.svg", "alt", "Contributors Icon"],
        ["routerLink", "/community", 1, "navbar__menu__items"],
        ["src", "../../../assets/community.svg", "alt", "Community Icon"],
        ["routerLink", "/gsoc", 1, "navbar__menu__items"],
        ["src", "../../../assets/gsoc.svg", "alt", "GSoC Icon"],
        [1, "navigation__buttons", 3, "click"],
        [1, "nav-btn"],
        ["src", "../../../assets/ham-menu.svg", "alt", "ham menu", 4, "ngIf"],
        ["src", "../../../assets/cross.svg", "alt", "cross", 4, "ngIf"],
        ["src", "../../../assets/ham-menu.svg", "alt", "ham menu"],
        ["src", "../../../assets/cross.svg", "alt", "cross"],
      ],
      template: function (i, o) {
        i & 1 &&
          (h(0, "div", 0),
          E(1, "img", 1),
          h(2, "div", 2)(3, "div", 3),
          E(4, "img", 4),
          h(5, "p"),
          m(6, "Home"),
          p()(),
          h(7, "div", 5),
          E(8, "img", 6),
          h(9, "p"),
          m(10, "Projects"),
          p()(),
          h(11, "div", 7),
          E(12, "img", 8),
          h(13, "p"),
          m(14, "Publications"),
          p()(),
          h(15, "div", 9),
          E(16, "img", 10),
          h(17, "p"),
          m(18, "Contributors"),
          p()(),
          h(19, "div", 11),
          E(20, "img", 12),
          h(21, "p"),
          m(22, "Community"),
          p()(),
          h(23, "div", 13),
          E(24, "img", 14),
          h(25, "p"),
          m(26, "GSoC"),
          p()()(),
          h(27, "div", 15),
          Ee("click", function () {
            return o.toggleMenu();
          }),
          h(28, "div", 16),
          We(29, A1, 1, 0, "img", 17)(30, O1, 1, 0, "img", 18),
          p()()()),
          i & 2 &&
            (M(2),
            te("ngClass", bh(3, T1, o.isMenuOpen)),
            M(27),
            te("ngIf", !o.isMenuOpen),
            M(),
            te("ngIf", o.isMenuOpen));
      },
      dependencies: [Ne, Uh, Qo, Ms, qp],
      styles: [
        ".navbar[_ngcontent-%COMP%]{width:100%;display:flex;padding:10px 50px;justify-content:space-between;align-items:center;background:var(--primary-white, #fff);box-shadow:0 4px 20px #00000026}.navbar[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{width:118.182px;height:60px;flex-shrink:0}.navbar[_ngcontent-%COMP%]   .navbar__menu[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;gap:5px}.navbar[_ngcontent-%COMP%]   .navbar__menu.open[_ngcontent-%COMP%]{display:flex!important;flex-direction:column;position:absolute;top:60px;right:20px;align-items:flex-start;width:auto;background:var(--primary-white, #fff);box-shadow:0 4px 20px #00000026;padding:10px;border-radius:8px;border:1px solid #f5f5f5;box-shadow:0 4px 24px #00000026}.navbar[_ngcontent-%COMP%]   .navbar__menu[_ngcontent-%COMP%]   .navbar__menu__items[_ngcontent-%COMP%]{display:flex;padding:7px 14px;align-items:center;gap:12px;border-radius:7px;background:var(--primary-white, #fff);cursor:pointer;transition:all .2s}.navbar[_ngcontent-%COMP%]   .navbar__menu[_ngcontent-%COMP%]   .navbar__menu__items[_ngcontent-%COMP%]:hover{background:var(--blue, #2f80ed);color:#fff}.navbar[_ngcontent-%COMP%]   .navbar__menu[_ngcontent-%COMP%]   .navbar__menu__items[_ngcontent-%COMP%]:hover   img[_ngcontent-%COMP%]{filter:invert(1)}.navbar[_ngcontent-%COMP%]   .navigation__buttons[_ngcontent-%COMP%]{display:none}@media (max-width: 1100px){.navbar__menu[_ngcontent-%COMP%]{display:none!important}.navbar__menu.open[_ngcontent-%COMP%]{display:flex}.navigation__buttons[_ngcontent-%COMP%]{display:block!important}}",
      ],
    }));
  let t = e;
  return t;
})();
var ng = {
  title: "Welcome to C2SI",
  description:
    "Welcome to the Ceylon Computer Science Institute (C2SI): Pioneering the Future of Technology. Our dedicated research spans the cutting-edge realms of cybersecurity, privacy, artificial intelligence, internet innovations, digital forensics, mobile and cloud computing, and advanced software tools. Join us as we forge new paths in the digital world, ensuring a safer, smarter, and more connected future.",
  buttonname: "Explore Projects",
};
var rg = (() => {
  let e = class e {
    constructor() {
      this.homepageData = ng;
    }
    ngOnInit() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-homepage"]],
      standalone: !0,
      features: [q],
      decls: 7,
      vars: 2,
      consts: [
        [1, "homepage"],
        [1, "homepage-hero-content"],
        ["src", "../../../assets/homepage.png", "alt", "Homepage"],
      ],
      template: function (i, o) {
        i & 1 &&
          (h(0, "div", 0)(1, "div", 1)(2, "h1"),
          m(3),
          p(),
          h(4, "p"),
          m(5),
          p()(),
          E(6, "img", 2),
          p()),
          i & 2 &&
            (M(3),
            re(o.homepageData.title),
            M(2),
            re(o.homepageData.description));
      },
      styles: [
        ".homepage[_ngcontent-%COMP%]{max-width:1000px;margin:50px auto;display:flex;align-items:center;justify-content:center}.homepage[_ngcontent-%COMP%]   .homepage-hero-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:48px;font-weight:500;line-height:150%}.homepage[_ngcontent-%COMP%]   .homepage-hero-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:16px;font-weight:light;line-height:150%}@media screen and (max-width: 1100px){.homepage[_ngcontent-%COMP%]{flex-direction:column;justify-content:center;align-items:center;padding:20px}.homepage[_ngcontent-%COMP%]   .homepage-hero-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center}.homepage[_ngcontent-%COMP%]   .homepage-hero-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{max-width:600px;text-align:center}}@media screen and (max-width: 600px){.homepage[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:400px}}@media screen and (max-width: 450px){.homepage[_ngcontent-%COMP%]   .homepage-hero-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:32px;text-align:center}.homepage[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:300px}}",
      ],
    }));
  let t = e;
  return t;
})();
function P1(t, e) {
  if ((t & 1 && (h(0, "div", 24), m(1), p()), t & 2)) {
    let r = e.$implicit;
    M(), Pe(" ", r, " ");
  }
}
var ig = (() => {
  let e = class e {
    constructor() {
      (this.description = ""), (this.topics = []), (this.detailsVisible = !1);
    }
    toggleDetails() {
      this.detailsVisible = !this.detailsVisible;
    }
    get truncatedDescription() {
      return this.description
        ? this.description.length > 100
          ? `${this.description.slice(0, 100)}...`
          : this.description
        : "";
    }
    getLanguageColor() {
      let n = {
        Python: "#3572A5",
        JavaScript: "#F1E05A",
        TypeScript: "#2B7489",
        Java: "#B07219",
        HTML: "#E34C26",
        "C++": "#F34B7D",
        HCL: "#0298C3",
        Default: "#607466",
      };
      return n[this.language] || n.Default;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-projects-card"]],
      inputs: {
        name: "name",
        description: "description",
        issue: "issue",
        pullRequests: "pullRequests",
        link: "link",
        language: "language",
        topics: "topics",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
      standalone: !0,
      features: [q],
      decls: 52,
      vars: 21,
      consts: [
        [1, "projects__card"],
        [1, "projects__card__main"],
        [1, "projects__card__desc"],
        [1, "projects__card__details"],
        [1, "circle-box"],
        [1, "projects__card__details__info"],
        ["target", "_blank", 1, "issue-btn", 3, "href"],
        [
          "xmlns",
          "http://www.w3.org/2000/svg",
          "width",
          "28",
          "height",
          "29",
          "viewBox",
          "0 0 28 29",
          "fill",
          "none",
        ],
        [
          "d",
          "M14 16.5C14.5304 16.5 15.0391 16.2893 15.4142 15.9142C15.7893 15.5391 16 15.0304 16 14.5C16 13.9696 15.7893 13.4609 15.4142 13.0858C15.0391 12.7107 14.5304 12.5 14 12.5C13.4696 12.5 12.9609 12.7107 12.5858 13.0858C12.2107 13.4609 12 13.9696 12 14.5C12 15.0304 12.2107 15.5391 12.5858 15.9142C12.9609 16.2893 13.4696 16.5 14 16.5Z",
          "fill",
          "#0A0A15",
        ],
        [
          "d",
          "M14 2.5C17.1826 2.5 20.2348 3.76428 22.4853 6.01472C24.7357 8.26516 26 11.3174 26 14.5C26 17.6826 24.7357 20.7348 22.4853 22.9853C20.2348 25.2357 17.1826 26.5 14 26.5C10.8174 26.5 7.76516 25.2357 5.51472 22.9853C3.26428 20.7348 2 17.6826 2 14.5C2 11.3174 3.26428 8.26516 5.51472 6.01472C7.76516 3.76428 10.8174 2.5 14 2.5ZM4.25 14.5C4.25 17.0859 5.27723 19.5658 7.10571 21.3943C8.93419 23.2228 11.4141 24.25 14 24.25C16.5859 24.25 19.0658 23.2228 20.8943 21.3943C22.7228 19.5658 23.75 17.0859 23.75 14.5C23.75 11.9141 22.7228 9.43419 20.8943 7.60571C19.0658 5.77723 16.5859 4.75 14 4.75C11.4141 4.75 8.93419 5.77723 7.10571 7.60571C5.27723 9.43419 4.25 11.9141 4.25 14.5Z",
          "fill",
          "#0A0A15",
        ],
        ["target", "_blank", 1, "pr-btn", 3, "href"],
        [
          "d",
          "M11.375 7.50001C11.3747 6.84546 11.1908 6.20413 10.8443 5.64884C10.4978 5.09355 10.0025 4.64655 9.41467 4.35861C8.82686 4.07068 8.17009 3.95334 7.51894 4.01993C6.8678 4.08652 6.24837 4.33436 5.73101 4.73532C5.21365 5.13627 4.81909 5.67427 4.59214 6.28821C4.36518 6.90214 4.31494 7.56742 4.4471 8.20848C4.57926 8.84954 4.88854 9.4407 5.33981 9.91481C5.79108 10.3889 6.36625 10.727 7.00001 10.8906V18.1094C6.17518 18.3224 5.45634 18.8288 4.97823 19.5339C4.50012 20.2389 4.29556 21.0942 4.4029 21.9393C4.51024 22.7843 4.92211 23.5613 5.5613 24.1244C6.2005 24.6876 7.02313 24.9982 7.87501 24.9982C8.72689 24.9982 9.54952 24.6876 10.1887 24.1244C10.8279 23.5613 11.2398 22.7843 11.3471 21.9393C11.4545 21.0942 11.2499 20.2389 10.7718 19.5339C10.2937 18.8288 9.57483 18.3224 8.75001 18.1094V10.8906C9.50104 10.6956 10.1662 10.2569 10.6412 9.64332C11.1162 9.02975 11.3743 8.27596 11.375 7.50001ZM9.62501 21.5C9.62501 21.8461 9.52237 22.1845 9.33008 22.4723C9.13779 22.76 8.86447 22.9843 8.5447 23.1168C8.22493 23.2493 7.87307 23.2839 7.5336 23.2164C7.19413 23.1489 6.88231 22.9822 6.63757 22.7374C6.39283 22.4927 6.22616 22.1809 6.15863 21.8414C6.09111 21.5019 6.12577 21.1501 6.25822 20.8303C6.39067 20.5105 6.61497 20.2372 6.90276 20.0449C7.19055 19.8526 7.52889 19.75 7.87501 19.75C8.33914 19.75 8.78426 19.9344 9.11244 20.2626C9.44063 20.5908 9.62501 21.0359 9.62501 21.5ZM7.87501 9.25001C7.52889 9.25001 7.19055 9.14737 6.90276 8.95508C6.61497 8.76279 6.39067 8.48947 6.25822 8.1697C6.12577 7.84993 6.09111 7.49807 6.15863 7.1586C6.22616 6.81913 6.39283 6.50731 6.63757 6.26257C6.88231 6.01783 7.19413 5.85116 7.5336 5.78363C7.87307 5.71611 8.22493 5.75076 8.5447 5.88322C8.86447 6.01567 9.13779 6.23997 9.33008 6.52776C9.52237 6.81555 9.62501 7.15389 9.62501 7.50001C9.62501 7.96414 9.44063 8.40926 9.11244 8.73744C8.78426 9.06563 8.33914 9.25001 7.87501 9.25001ZM22.75 18.1094V14.0494C22.752 13.2447 22.5946 12.4476 22.2867 11.7042C21.9788 10.9608 21.5266 10.2857 20.9563 9.71813L17.862 6.62501H21C21.2321 6.62501 21.4546 6.53282 21.6187 6.36873C21.7828 6.20463 21.875 5.98207 21.875 5.75001C21.875 5.51794 21.7828 5.29538 21.6187 5.13129C21.4546 4.96719 21.2321 4.87501 21 4.87501H15.75C15.5179 4.87501 15.2954 4.96719 15.1313 5.13129C14.9672 5.29538 14.875 5.51794 14.875 5.75001V11C14.875 11.2321 14.9672 11.4546 15.1313 11.6187C15.2954 11.7828 15.5179 11.875 15.75 11.875C15.9821 11.875 16.2046 11.7828 16.3687 11.6187C16.5328 11.4546 16.625 11.2321 16.625 11V7.86204L19.7181 10.9563C20.1258 11.3614 20.4491 11.8434 20.6691 12.3743C20.8892 12.9053 21.0016 13.4746 21 14.0494V18.1094C20.1752 18.3224 19.4563 18.8288 18.9782 19.5339C18.5001 20.2389 18.2956 21.0942 18.4029 21.9393C18.5102 22.7843 18.9221 23.5613 19.5613 24.1244C20.2005 24.6876 21.0231 24.9982 21.875 24.9982C22.7269 24.9982 23.5495 24.6876 24.1887 24.1244C24.8279 23.5613 25.2398 22.7843 25.3471 21.9393C25.4545 21.0942 25.2499 20.2389 24.7718 19.5339C24.2937 18.8288 23.5748 18.3224 22.75 18.1094ZM21.875 23.25C21.5289 23.25 21.1905 23.1474 20.9028 22.9551C20.615 22.7628 20.3907 22.4895 20.2582 22.1697C20.1258 21.8499 20.0911 21.4981 20.1586 21.1586C20.2262 20.8191 20.3928 20.5073 20.6376 20.2626C20.8823 20.0178 21.1941 19.8512 21.5336 19.7836C21.8731 19.7161 22.2249 19.7508 22.5447 19.8832C22.8645 20.0157 23.1378 20.24 23.3301 20.5278C23.5224 20.8155 23.625 21.1539 23.625 21.5C23.625 21.9641 23.4406 22.4093 23.1124 22.7374C22.7843 23.0656 22.3391 23.25 21.875 23.25Z",
          "fill",
          "#0A0A15",
        ],
        ["target", "_blank", 1, "git-btn", 3, "href"],
        [
          "xmlns",
          "http://www.w3.org/2000/svg",
          "width",
          "24",
          "height",
          "25",
          "viewBox",
          "0 0 24 25",
          "fill",
          "none",
        ],
        ["clip-path", "url(#clip0_1_1403)"],
        [
          "fill-rule",
          "evenodd",
          "clip-rule",
          "evenodd",
          "d",
          "M11.964 0.5C8.79107 0.500398 5.74821 1.76101 3.50461 4.00461C1.26101 6.24821 0.000397735 9.29107 0 12.464C0 17.747 3.45 22.2245 8.1465 23.84C8.7345 23.9135 8.9535 23.546 8.9535 23.252V21.197C5.652 21.932 4.9185 19.583 4.9185 19.583C4.404 18.188 3.597 17.8205 3.597 17.8205C2.496 17.087 3.669 17.087 3.669 17.087C4.8435 17.1605 5.505 18.335 5.505 18.335C6.606 20.1695 8.2935 19.655 8.955 19.3625C9.027 18.5555 9.3945 18.0425 9.6885 17.7485C7.0455 17.4545 4.257 16.427 4.257 11.8025C4.257 10.4825 4.6965 9.4535 5.505 8.573C5.43 8.3525 4.9905 7.106 5.652 5.4905C5.652 5.4905 6.6795 5.1965 8.9535 6.7385C9.9075 6.4445 10.9365 6.371 11.964 6.371C12.9915 6.371 14.019 6.518 14.973 6.7385C17.2485 5.198 18.276 5.4905 18.276 5.4905C18.936 7.106 18.495 8.3525 18.4215 8.6465C19.2298 9.52712 19.6756 10.6806 19.6695 11.876C19.6695 16.5005 16.8795 17.4545 14.2395 17.7485C14.679 18.1145 15.0465 18.848 15.0465 19.949V23.252C15.0465 23.546 15.2655 23.912 15.8535 23.84C18.2325 23.0371 20.299 21.5068 21.7609 19.4654C23.2228 17.4241 24.006 14.9748 24 12.464C23.9265 5.858 18.57 0.5 11.964 0.5Z",
          "fill",
          "white",
        ],
        ["id", "clip0_1_1403"],
        [
          "width",
          "24",
          "height",
          "24",
          "fill",
          "white",
          "transform",
          "translate(0 0.5)",
        ],
        [1, "projects__card__open__btn", 3, "click"],
        [
          "xmlns",
          "http://www.w3.org/2000/svg",
          "width",
          "14",
          "height",
          "24",
          "viewBox",
          "0 0 14 24",
          "fill",
          "none",
        ],
        [
          "d",
          "M10.4714 12L1.1407 2.67149C0.929454 2.46025 0.810778 2.17374 0.810778 1.87499C0.810778 1.57625 0.929454 1.28974 1.1407 1.07849C1.35194 0.867249 1.63845 0.748573 1.9372 0.748573C2.23594 0.748573 2.52245 0.867249 2.7337 1.07849L12.8587 11.2035C12.9635 11.308 13.0466 11.4321 13.1033 11.5688C13.16 11.7055 13.1892 11.852 13.1892 12C13.1892 12.148 13.16 12.2945 13.1033 12.4312C13.0466 12.5678 12.9635 12.692 12.8587 12.7965L2.7337 22.9215C2.52245 23.1327 2.23594 23.2514 1.9372 23.2514C1.63845 23.2514 1.35194 23.1327 1.1407 22.9215C0.929454 22.7102 0.810778 22.4237 0.810778 22.125C0.810778 21.8262 0.929454 21.5397 1.1407 21.3285L10.4714 12Z",
          "fill",
          "#0A0A15",
        ],
        [1, "projects__card__hidden"],
        [1, "projects__card__hidden__tags"],
        ["class", "projects__card__tag", 4, "ngFor", "ngForOf"],
        [1, "projects__card__tag"],
      ],
      template: function (i, o) {
        i & 1 &&
          (h(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h3"),
          m(4),
          p(),
          h(5, "p"),
          m(6),
          p()(),
          h(7, "div", 3)(8, "span"),
          E(9, "div", 4),
          h(10, "h4"),
          m(11),
          p()(),
          h(12, "div", 5)(13, "a", 6),
          Te(),
          h(14, "svg", 7),
          E(15, "path", 8)(16, "path", 9),
          p(),
          Ae(),
          h(17, "p"),
          m(18, "Issues"),
          p(),
          h(19, "span"),
          m(20),
          p()(),
          h(21, "a", 10),
          Te(),
          h(22, "svg", 7),
          E(23, "path", 11),
          p(),
          Ae(),
          h(24, "p"),
          m(25, "Pull Requests"),
          p(),
          h(26, "span"),
          m(27),
          p()(),
          h(28, "a", 12),
          Te(),
          h(29, "svg", 13)(30, "g", 14),
          E(31, "path", 15),
          p(),
          h(32, "defs")(33, "clipPath", 16),
          E(34, "rect", 17),
          p()()(),
          Ae(),
          h(35, "p"),
          m(36, "Contribute"),
          p()()()(),
          h(37, "div", 18),
          Ee("click", function () {
            return o.toggleDetails();
          }),
          Te(),
          h(38, "svg", 19),
          E(39, "path", 20),
          p()()(),
          Ae(),
          h(40, "div", 21)(41, "div", 22),
          We(42, P1, 2, 1, "div", 23),
          p(),
          h(43, "div", 3)(44, "p")(45, "strong"),
          m(46, " Created at: "),
          p(),
          m(47),
          p(),
          h(48, "p")(49, "strong"),
          m(50, " Updated at: "),
          p(),
          m(51),
          p()()()()),
          i & 2 &&
            (M(4),
            re(o.name),
            M(2),
            re(o.detailsVisible ? o.description : o.truncatedDescription),
            M(3),
            Ar("background-color", o.getLanguageColor()),
            M(2),
            re(o.language),
            M(2),
            un("href", "https://github.com/c2siorg/", o.name, "/issues", Oe),
            M(7),
            re(o.issue),
            M(),
            un("href", "https://github.com/c2siorg/", o.name, "/pulls", Oe),
            M(6),
            re(o.pullRequests),
            M(),
            te("href", o.link, Oe),
            M(9),
            Gn("rotate-90", o.detailsVisible),
            M(),
            Ar(
              "transform",
              o.detailsVisible ? "rotate(90deg)" : "rotate(0deg)"
            ),
            M(2),
            Gn("visible", o.detailsVisible),
            M(2),
            te("ngForOf", o.topics),
            M(5),
            Pe(" ", o.createdAt, ""),
            M(4),
            Pe(" ", o.updatedAt, ""));
      },
      dependencies: [Ne, Yo],
      styles: [
        ".projects__card[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding:16px 28px;justify-content:space-between;gap:20px;border-radius:8px;border:2px solid var(--primary-white, #fff);background:var(--primary-white, #fff);box-shadow:0 4px 24px #0000001a}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]{width:850px;display:flex;justify-content:space-between;gap:7px}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__desc[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:16px;font-weight:600;line-height:150%}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__desc[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:14px;font-weight:400;line-height:150%;width:320px}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:flex-end;gap:10px}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:flex;gap:10px}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]   .circle-box[_ngcontent-%COMP%]{height:20px;width:20px;border-radius:50%}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{color:var(--card-dark-2, var(--card-dark-2, #1b1b28));font-size:14px;font-weight:500;line-height:150%}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   .projects__card__details__info[_ngcontent-%COMP%]{display:flex;gap:10px}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   .projects__card__details__info[_ngcontent-%COMP%]   .pr-btn[_ngcontent-%COMP%]{display:flex;padding:3px 6px;width:fit-content;align-items:center;gap:8px;color:var(--primary-dark, var(--primary-dark, #0a0a15));border-radius:4px;border:1px solid var(--Gray-5, #e0e0e0);background:var(--Gray-6, #f2f2f2)}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   .projects__card__details__info[_ngcontent-%COMP%]   .pr-btn[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{width:100px;font-size:14px;font-weight:500;line-height:150%}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   .projects__card__details__info[_ngcontent-%COMP%]   .pr-btn[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:14px;font-weight:400;border-radius:20px;background:var(--primary-white, #fff);padding:6px}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   .projects__card__details__info[_ngcontent-%COMP%]   .issue-btn[_ngcontent-%COMP%]{display:flex;padding:3px 6px;width:fit-content;align-items:center;gap:8px;border-radius:4px;color:var(--primary-dark, var(--primary-dark, #0a0a15));border:1px solid var(--Gray-5, #e0e0e0);background:var(--Gray-6, #f2f2f2)}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   .projects__card__details__info[_ngcontent-%COMP%]   .issue-btn[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:14px;font-weight:400;border-radius:20px;background:var(--primary-white, #fff);padding:6px}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   .projects__card__details__info[_ngcontent-%COMP%]   .issue-btn[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px;font-weight:500;line-height:150%}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   .projects__card__details__info[_ngcontent-%COMP%]   .git-btn[_ngcontent-%COMP%]{display:flex;padding:5px 8px;justify-content:center;align-items:center;gap:10px;border-radius:4px;background:var(--Green-1, #219653)}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   .projects__card__details__info[_ngcontent-%COMP%]   .git-btn[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--primary-white, #fff);font-size:14px;font-weight:400;line-height:150%;text-decoration:none}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__open__btn[_ngcontent-%COMP%]{cursor:pointer;display:flex;width:40px;height:40px;padding:6px;justify-content:center;align-items:center;gap:10px;border-radius:28px;border:1px solid var(--Gray-5, #e0e0e0);background:var(--primary-white, #fff);box-shadow:0 0 14px #0000001a;transition:transform .3s ease}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__open__btn.rotate-90[_ngcontent-%COMP%]{transform:rotate(5deg)}.projects__card[_ngcontent-%COMP%]   .projects__card__hidden[_ngcontent-%COMP%]{width:850px;display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:0;height:0;overflow:hidden;transition:opacity .3s ease,height .3s ease}.projects__card[_ngcontent-%COMP%]   .projects__card__hidden[_ngcontent-%COMP%]   .projects__card__hidden__tags[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;max-width:500px;align-items:center;gap:10px}.projects__card[_ngcontent-%COMP%]   .projects__card__hidden[_ngcontent-%COMP%]   .projects__card__hidden__tags[_ngcontent-%COMP%]   .projects__card__tag[_ngcontent-%COMP%]{font-size:12px;border:2px solid rgba(0,0,0,.1);background-color:#f6f6f6;padding:4px 6px;border-radius:20px}.projects__card[_ngcontent-%COMP%]   .projects__card__hidden[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:flex-end}.projects__card[_ngcontent-%COMP%]   .projects__card__hidden[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px}.projects__card[_ngcontent-%COMP%]   .projects__card__hidden.visible[_ngcontent-%COMP%]{opacity:1;height:auto}@media screen and (max-width: 1000px){.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]{width:550px;flex-direction:column;width:fit-content}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]{flex-direction:column}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   .projects__card__details__info[_ngcontent-%COMP%]{width:550px;justify-content:space-between}.projects__card[_ngcontent-%COMP%]   .projects__card__hidden[_ngcontent-%COMP%]{width:550px}}@media screen and (max-width: 700px){.projects__card[_ngcontent-%COMP%]{width:330px}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]{width:300px;flex-direction:column}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__desc[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{width:300px}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]{align-items:flex-start}.projects__card[_ngcontent-%COMP%]   .projects__card__main[_ngcontent-%COMP%]   .projects__card__details[_ngcontent-%COMP%]   .projects__card__details__info[_ngcontent-%COMP%]{width:270px;flex-direction:column;align-items:flex-start;justify-content:flex-start}.projects__card__hidden[_ngcontent-%COMP%]{max-width:260px;flex-direction:column}}",
      ],
    }));
  let t = e;
  return t;
})();
function N1(t, e) {
  t & 1 && Hc(0);
}
function R1(t, e) {
  t & 1 && E(0, "div", 8);
}
function F1(t, e) {
  if ((t & 1 && ($o(0), E(1, "app-projects-card", 10), Ho()), t & 2)) {
    let r = e.$implicit;
    M(),
      te("name", r.name)("description", r.description || "")(
        "issue",
        r.open_issues_count
      )("link", r.html_url)("language", r.language || "")("topics", r.topics)(
        "createdAt",
        r.created_at
      )("updatedAt", r.updated_at)("pullRequests", r.pull_requests);
  }
}
function k1(t, e) {
  if ((t & 1 && We(0, F1, 2, 9, "ng-container", 9), t & 2)) {
    let r = Dh();
    te("ngForOf", r.projectsData)("ngForTrackBy", r.trackByProjectName);
  }
}
var og = (() => {
  let e = class e {
    constructor(n) {
      (this.http = n), (this.projectsData = []), (this.isLoading = !0);
    }
    ngOnInit() {
      this.fetchProjects();
    }
    fetchProjects() {
      this.http
        .get("http://localhost:5000/api/v1/project/projects/")
        .subscribe({
          next: (n) => {
            (this.projectsData = n.repositories), (this.isLoading = !1);
          },
          error: (n) => {
            console.error("Error fetching projects:", n), (this.isLoading = !1);
          },
          complete: () => {
            console.log("Fetch projects request completed.");
          },
        });
    }
    trackByProjectName(n, i) {
      return i.name;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(L(cu));
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-projects"]],
      standalone: !0,
      features: [q],
      decls: 14,
      vars: 3,
      consts: [
        ["loading", ""],
        ["content", ""],
        [1, "projects"],
        [1, "projects-hero"],
        [1, "projects-hero-content"],
        ["src", "../../../assets/projects-img.png", "alt", "projects"],
        [1, "projects-cards-container"],
        [4, "ngIf", "ngIfThen", "ngIfElse"],
        [1, "loader"],
        [4, "ngFor", "ngForOf", "ngForTrackBy"],
        [
          3,
          "name",
          "description",
          "issue",
          "link",
          "language",
          "topics",
          "createdAt",
          "updatedAt",
          "pullRequests",
        ],
      ],
      template: function (i, o) {
        if (
          (i & 1 &&
            (h(0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "h1"),
            m(4, "Our Projects"),
            p(),
            h(5, "p"),
            m(
              6,
              " Discover a Spectrum of Innovative Projects done by the researchers at C2SI "
            ),
            p()(),
            E(7, "img", 5),
            p(),
            h(8, "div", 6),
            We(9, N1, 1, 0, "ng-container", 7),
            p()(),
            We(10, R1, 1, 0, "ng-template", null, 0, Gc)(
              12,
              k1,
              1,
              2,
              "ng-template",
              null,
              1,
              Gc
            )),
          i & 2)
        ) {
          let s = zc(11),
            a = zc(13);
          M(9), te("ngIf", o.isLoading)("ngIfThen", s)("ngIfElse", a);
        }
      },
      dependencies: [Ne, Yo, Qo, Jh, ig],
      styles: [
        ".projects[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:center;margin-bottom:30px}.projects[_ngcontent-%COMP%]   .projects-hero[_ngcontent-%COMP%]{max-width:1000px;margin:50px auto;display:flex;align-items:center;justify-content:center}.projects[_ngcontent-%COMP%]   .projects-hero[_ngcontent-%COMP%]   .projects-hero-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:48px;font-weight:500;line-height:150%}.projects[_ngcontent-%COMP%]   .projects-hero[_ngcontent-%COMP%]   .projects-hero-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:16px;font-weight:light;line-height:150%}.projects[_ngcontent-%COMP%]   .projects-cards-container[_ngcontent-%COMP%]{display:flex;padding:30px;flex-direction:column;gap:30px;border-radius:10px;background:var(--Gray-6, #f2f2f2);box-shadow:0 4px 20px #0000000d inset}@media screen and (max-width: 1100px){.projects[_ngcontent-%COMP%]   .projects-hero[_ngcontent-%COMP%]{flex-direction:column;justify-content:center;align-items:center;padding:20px}.projects[_ngcontent-%COMP%]   .projects-hero[_ngcontent-%COMP%]   .projects-hero-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center}.projects[_ngcontent-%COMP%]   .projects-hero[_ngcontent-%COMP%]   .projects-hero-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{max-width:600px;text-align:center}}@media screen and (max-width: 600px){.projects[_ngcontent-%COMP%]   .projects-hero[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:400px}}@media screen and (max-width: 450px){.projects[_ngcontent-%COMP%]   .projects-hero[_ngcontent-%COMP%]   .projects-hero-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:32px}.projects[_ngcontent-%COMP%]   .projects-hero[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:300px}}.loader[_ngcontent-%COMP%]{border:8px solid #f3f3f3;border-top:8px solid #3498db;border-radius:50%;width:50px;height:50px;animation:_ngcontent-%COMP%_spin 1s linear infinite;margin:0 auto;display:block}@keyframes _ngcontent-%COMP%_spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}",
      ],
    }));
  let t = e;
  return t;
})();
var sg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-publications-card"]],
      inputs: {
        heading: "heading",
        link: "link",
        issued_by: "issued_by",
        description: "description",
      },
      standalone: !0,
      features: [q],
      decls: 7,
      vars: 4,
      consts: [
        [1, "publications__card"],
        ["target", "_blank", 3, "href"],
        [1, "publications__card__issued__by"],
        [1, "publications__card__desc"],
      ],
      template: function (i, o) {
        i & 1 &&
          (h(0, "div", 0)(1, "a", 1),
          m(2),
          p(),
          h(3, "p", 2),
          m(4),
          p(),
          h(5, "p", 3),
          m(6),
          p()()),
          i & 2 &&
            (M(),
            te("href", o.link, Oe),
            M(),
            re(o.heading),
            M(2),
            re(o.issued_by),
            M(2),
            re(o.description));
      },
      styles: [
        ".publications__card[_ngcontent-%COMP%]{display:flex;padding:16px 28px;flex-direction:column;justify-content:center;align-items:flex-start;gap:20px;border-radius:8px;border:2px solid var(--primary-white, #fff);background:var(--primary-white, #fff);box-shadow:0 4px 24px #0000001a;width:500px}.publications__card[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:20px;font-weight:500;line-height:150%;text-decoration-line:underline;max-width:460px}.publications__card[_ngcontent-%COMP%]   .publications__card__issued__by[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:16px;font-weight:500;line-height:150%;max-width:460px}.publications__card[_ngcontent-%COMP%]   .publications__card__desc[_ngcontent-%COMP%]{color:var(--font-light, #898989);font-size:16px;font-weight:500;line-height:150%;max-width:460px}@media screen and (max-width: 600px){.publications__card[_ngcontent-%COMP%]{width:400px}}@media screen and (max-width: 450px){.publications__card[_ngcontent-%COMP%]{width:300px}}",
      ],
    }));
  let t = e;
  return t;
})();
var ag = [
  {
    heading:
      "Compromised or {Attacker-Owned}: A large scale classification and study of hosting domains of malicious {URLs}",
    link: "https://www.usenix.org/conference/usenixsecurity21/presentation/desilva",
    issued_by: "30th USENIX security symposium (USENIX security 21)",
    description:
      "Authors: Ravindu De Silva, Mohamed Nabeel, Charith Elvitigala, Issa Khalil, Ting Yu, Chamath Keppitiyagama",
  },
  {
    heading:
      "Malicious and low credibility urls on twitter during the astrazeneca covid-19 vaccine development",
    link: "https://link.springer.com/chapter/10.1007/978-3-030-80387-2_1",
    issued_by:
      "Social, Cultural, and Behavioral Modeling - 14th International Conference, SBP-BRiMS 2021, Virtual Event, July 6\u20139, 2021, Proceedings 14",
    description:
      "Authors: Sameera Horawalavithana, Ravindu De Silva, Mohamed Nabeel, Charitha Elvitigala, Primal Wijesekara, Adriana Iamnitchi",
  },
  {
    heading:
      "Malicious and low credibility urls on twitter during the astrazeneca covid-19 vaccine development",
    link: "https://link.springer.com/chapter/10.1007/978-3-030-80387-2_1",
    issued_by:
      "Social, Cultural, and Behavioral Modeling - 14th International Conference, SBP-BRiMS 2021, Virtual Event, July 6\u20139, 2021, Proceedings 14",
    description:
      "Authors: Sameera Horawalavithana, Ravindu De Silva, Mohamed Nabeel, Charitha Elvitigala, Primal Wijesekara, Adriana Iamnitchi",
  },
  {
    heading:
      "Compromised or {Attacker-Owned}: A large scale classification and study of hosting domains of malicious {URLs}",
    link: "https://www.usenix.org/conference/usenixsecurity21/presentation/desilva",
    issued_by: "30th USENIX security symposium (USENIX security 21)",
    description:
      "Authors: Ravindu De Silva, Mohamed Nabeel, Charith Elvitigala, Issa Khalil, Ting Yu, Chamath Keppitiyagama",
  },
  {
    heading:
      "Compromised or {Attacker-Owned}: A large scale classification and study of hosting domains of malicious {URLs}",
    link: "https://www.usenix.org/conference/usenixsecurity21/presentation/desilva",
    issued_by: "30th USENIX security symposium (USENIX security 21)",
    description:
      "Authors: Ravindu De Silva, Mohamed Nabeel, Charith Elvitigala, Issa Khalil, Ting Yu, Chamath Keppitiyagama",
  },
  {
    heading:
      "Malicious and low credibility urls on twitter during the astrazeneca covid-19 vaccine development",
    link: "https://link.springer.com/chapter/10.1007/978-3-030-80387-2_1",
    issued_by:
      "Social, Cultural, and Behavioral Modeling - 14th International Conference, SBP-BRiMS 2021, Virtual Event, July 6\u20139, 2021, Proceedings 14",
    description:
      "Authors: Sameera Horawalavithana, Ravindu De Silva, Mohamed Nabeel, Charitha Elvitigala, Primal Wijesekara, Adriana Iamnitchi",
  },
  {
    heading:
      "Malicious and low credibility urls on twitter during the astrazeneca covid-19 vaccine development",
    link: "https://link.springer.com/chapter/10.1007/978-3-030-80387-2_1",
    issued_by:
      "Social, Cultural, and Behavioral Modeling - 14th International Conference, SBP-BRiMS 2021, Virtual Event, July 6\u20139, 2021, Proceedings 14",
    description:
      "Authors: Sameera Horawalavithana, Ravindu De Silva, Mohamed Nabeel, Charitha Elvitigala, Primal Wijesekara, Adriana Iamnitchi",
  },
  {
    heading:
      "Compromised or {Attacker-Owned}: A large scale classification and study of hosting domains of malicious {URLs}",
    link: "https://www.usenix.org/conference/usenixsecurity21/presentation/desilva",
    issued_by: "30th USENIX security symposium (USENIX security 21)",
    description:
      "Authors: Ravindu De Silva, Mohamed Nabeel, Charith Elvitigala, Issa Khalil, Ting Yu, Chamath Keppitiyagama",
  },
];
function L1(t, e) {
  if ((t & 1 && E(0, "app-publications-card", 5), t & 2)) {
    let r = e.$implicit;
    te("heading", r.heading)("link", r.link)("issued_by", r.issued_by)(
      "description",
      r.description
    );
  }
}
var cg = (() => {
  let e = class e {
    constructor() {
      this.publicationsData = ag;
    }
    ngOnInit() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-publications"]],
      standalone: !0,
      features: [q],
      decls: 11,
      vars: 0,
      consts: [
        [1, "publications"],
        [1, "publications-hero"],
        [1, "publications-hero-content"],
        ["src", "../../../assets/publications-img.png", "alt", "publications"],
        [1, "publications-cards-container"],
        [3, "heading", "link", "issued_by", "description"],
      ],
      template: function (i, o) {
        i & 1 &&
          (h(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1"),
          m(4, "Our Publications"),
          p(),
          h(5, "p"),
          m(
            6,
            " Discover a Spectrum of Publications by the researchers at Ceylon Computer Science Institute "
          ),
          p()(),
          E(7, "img", 3),
          p(),
          h(8, "div", 4),
          kt(9, L1, 1, 4, "app-publications-card", 5, Ft),
          p()()),
          i & 2 && (M(9), Lt(o.publicationsData));
      },
      dependencies: [Ne, sg],
      styles: [
        ".publications[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:center}.publications[_ngcontent-%COMP%]   .publications-hero[_ngcontent-%COMP%]{max-width:1000px;margin:50px auto;display:flex;align-items:center;justify-content:center}.publications[_ngcontent-%COMP%]   .publications-hero[_ngcontent-%COMP%]   .publications-hero-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:48px;font-weight:500;line-height:150%}.publications[_ngcontent-%COMP%]   .publications-hero[_ngcontent-%COMP%]   .publications-hero-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:16px;font-weight:light;line-height:150%;max-width:450px}.publications[_ngcontent-%COMP%]   .publications-cards-container[_ngcontent-%COMP%]{display:grid;gap:25px;grid-template-columns:repeat(2,1fr);padding:20px}@media screen and (max-width: 1100px){.publications[_ngcontent-%COMP%]   .publications-hero[_ngcontent-%COMP%]{flex-direction:column;justify-content:center;align-items:center;padding:20px}.publications[_ngcontent-%COMP%]   .publications-hero[_ngcontent-%COMP%]   .publications-hero-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center}.publications[_ngcontent-%COMP%]   .publications-hero[_ngcontent-%COMP%]   .publications-hero-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{max-width:600px;text-align:center}.publications[_ngcontent-%COMP%]   .publications-cards-container[_ngcontent-%COMP%]{grid-template-columns:repeat(1,1fr)}}@media screen and (max-width: 600px){.publications[_ngcontent-%COMP%]   .publications-hero[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:400px}}@media screen and (max-width: 450px){.publications[_ngcontent-%COMP%]   .publications-hero[_ngcontent-%COMP%]   .publications-hero-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:32px}.publications[_ngcontent-%COMP%]   .publications-hero[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:300px}}",
      ],
    }));
  let t = e;
  return t;
})();
var mg = (() => {
    let e = class e {
      constructor(n, i) {
        (this._renderer = n),
          (this._elementRef = i),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {});
      }
      setProperty(n, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, i);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty("disabled", n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(st), L(Ye));
    }),
      (e.ɵdir = ae({ type: e }));
    let t = e;
    return t;
  })(),
  sl = (() => {
    let e = class e extends mg {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = an(e)))(o || e);
      };
    })()),
      (e.ɵdir = ae({ type: e, features: [Rt] }));
    let t = e;
    return t;
  })(),
  Ss = new D("");
var j1 = { provide: Ss, useExisting: nn(() => Ts), multi: !0 };
function V1() {
  let t = yt() ? yt().getUserAgent() : "";
  return /android (\d+)/.test(t.toLowerCase());
}
var U1 = new D(""),
  Ts = (() => {
    let e = class e extends mg {
      constructor(n, i, o) {
        super(n, i),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !V1());
      }
      writeValue(n) {
        let i = n ?? "";
        this.setProperty("value", i);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(st), L(Ye), L(U1, 8));
    }),
      (e.ɵdir = ae({
        type: e,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            Ee("input", function (a) {
              return o._handleInput(a.target.value);
            })("blur", function () {
              return o.onTouched();
            })("compositionstart", function () {
              return o._compositionStart();
            })("compositionend", function (a) {
              return o._compositionEnd(a.target.value);
            });
        },
        features: [Or([j1]), Rt],
      }));
    let t = e;
    return t;
  })();
var B1 = new D(""),
  $1 = new D("");
function vg(t) {
  return t != null;
}
function yg(t) {
  return ln(t) ? Z(t) : t;
}
function Cg(t) {
  let e = {};
  return (
    t.forEach((r) => {
      e = r != null ? y(y({}, e), r) : e;
    }),
    Object.keys(e).length === 0 ? null : e
  );
}
function _g(t, e) {
  return e.map((r) => r(t));
}
function H1(t) {
  return !t.validate;
}
function Dg(t) {
  return t.map((e) => (H1(e) ? e : (r) => e.validate(r)));
}
function z1(t) {
  if (!t) return null;
  let e = t.filter(vg);
  return e.length == 0
    ? null
    : function (r) {
        return Cg(_g(r, e));
      };
}
function wg(t) {
  return t != null ? z1(Dg(t)) : null;
}
function G1(t) {
  if (!t) return null;
  let e = t.filter(vg);
  return e.length == 0
    ? null
    : function (r) {
        let n = _g(r, e).map(yg);
        return Ws(n).pipe(P(Cg));
      };
}
function bg(t) {
  return t != null ? G1(Dg(t)) : null;
}
function ug(t, e) {
  return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
}
function Mg(t) {
  return t._rawValidators;
}
function Eg(t) {
  return t._rawAsyncValidators;
}
function nl(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function Is(t, e) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function lg(t, e) {
  let r = nl(e);
  return (
    nl(t).forEach((i) => {
      Is(r, i) || r.push(i);
    }),
    r
  );
}
function dg(t, e) {
  return nl(e).filter((r) => !Is(t, r));
}
var rl = class {
  constructor() {
    (this._rawValidators = []),
      (this._rawAsyncValidators = []),
      (this._onDestroyCallbacks = []);
  }
  get value() {
    return this.control ? this.control.value : null;
  }
  get valid() {
    return this.control ? this.control.valid : null;
  }
  get invalid() {
    return this.control ? this.control.invalid : null;
  }
  get pending() {
    return this.control ? this.control.pending : null;
  }
  get disabled() {
    return this.control ? this.control.disabled : null;
  }
  get enabled() {
    return this.control ? this.control.enabled : null;
  }
  get errors() {
    return this.control ? this.control.errors : null;
  }
  get pristine() {
    return this.control ? this.control.pristine : null;
  }
  get dirty() {
    return this.control ? this.control.dirty : null;
  }
  get touched() {
    return this.control ? this.control.touched : null;
  }
  get status() {
    return this.control ? this.control.status : null;
  }
  get untouched() {
    return this.control ? this.control.untouched : null;
  }
  get statusChanges() {
    return this.control ? this.control.statusChanges : null;
  }
  get valueChanges() {
    return this.control ? this.control.valueChanges : null;
  }
  get path() {
    return null;
  }
  _setValidators(e) {
    (this._rawValidators = e || []),
      (this._composedValidatorFn = wg(this._rawValidators));
  }
  _setAsyncValidators(e) {
    (this._rawAsyncValidators = e || []),
      (this._composedAsyncValidatorFn = bg(this._rawAsyncValidators));
  }
  get validator() {
    return this._composedValidatorFn || null;
  }
  get asyncValidator() {
    return this._composedAsyncValidatorFn || null;
  }
  _registerOnDestroy(e) {
    this._onDestroyCallbacks.push(e);
  }
  _invokeOnDestroyCallbacks() {
    this._onDestroyCallbacks.forEach((e) => e()),
      (this._onDestroyCallbacks = []);
  }
  reset(e = void 0) {
    this.control && this.control.reset(e);
  }
  hasError(e, r) {
    return this.control ? this.control.hasError(e, r) : !1;
  }
  getError(e, r) {
    return this.control ? this.control.getError(e, r) : null;
  }
};
var li = class extends rl {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  il = class {
    constructor(e) {
      this._cd = e;
    }
    get isTouched() {
      return !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return !!this._cd?.submitted;
    }
  },
  W1 = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  xO = G(y({}, W1), { "[class.ng-submitted]": "isSubmitted" }),
  Ig = (() => {
    let e = class e extends il {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(li, 2));
    }),
      (e.ɵdir = ae({
        type: e,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (i, o) {
          i & 2 &&
            Gn("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending);
        },
        features: [Rt],
      }));
    let t = e;
    return t;
  })();
var ci = "VALID",
  Es = "INVALID",
  cr = "PENDING",
  ui = "DISABLED";
function q1(t) {
  return (As(t) ? t.validators : t) || null;
}
function Z1(t) {
  return Array.isArray(t) ? wg(t) : t || null;
}
function Y1(t, e) {
  return (As(e) ? e.asyncValidators : t) || null;
}
function Q1(t) {
  return Array.isArray(t) ? bg(t) : t || null;
}
function As(t) {
  return t != null && !Array.isArray(t) && typeof t == "object";
}
var ol = class {
  constructor(e, r) {
    (this._pendingDirty = !1),
      (this._hasOwnPendingAsyncValidator = !1),
      (this._pendingTouched = !1),
      (this._onCollectionChange = () => {}),
      (this._parent = null),
      (this.pristine = !0),
      (this.touched = !1),
      (this._onDisabledChange = []),
      this._assignValidators(e),
      this._assignAsyncValidators(r);
  }
  get validator() {
    return this._composedValidatorFn;
  }
  set validator(e) {
    this._rawValidators = this._composedValidatorFn = e;
  }
  get asyncValidator() {
    return this._composedAsyncValidatorFn;
  }
  set asyncValidator(e) {
    this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
  }
  get parent() {
    return this._parent;
  }
  get valid() {
    return this.status === ci;
  }
  get invalid() {
    return this.status === Es;
  }
  get pending() {
    return this.status == cr;
  }
  get disabled() {
    return this.status === ui;
  }
  get enabled() {
    return this.status !== ui;
  }
  get dirty() {
    return !this.pristine;
  }
  get untouched() {
    return !this.touched;
  }
  get updateOn() {
    return this._updateOn
      ? this._updateOn
      : this.parent
      ? this.parent.updateOn
      : "change";
  }
  setValidators(e) {
    this._assignValidators(e);
  }
  setAsyncValidators(e) {
    this._assignAsyncValidators(e);
  }
  addValidators(e) {
    this.setValidators(lg(e, this._rawValidators));
  }
  addAsyncValidators(e) {
    this.setAsyncValidators(lg(e, this._rawAsyncValidators));
  }
  removeValidators(e) {
    this.setValidators(dg(e, this._rawValidators));
  }
  removeAsyncValidators(e) {
    this.setAsyncValidators(dg(e, this._rawAsyncValidators));
  }
  hasValidator(e) {
    return Is(this._rawValidators, e);
  }
  hasAsyncValidator(e) {
    return Is(this._rawAsyncValidators, e);
  }
  clearValidators() {
    this.validator = null;
  }
  clearAsyncValidators() {
    this.asyncValidator = null;
  }
  markAsTouched(e = {}) {
    (this.touched = !0),
      this._parent && !e.onlySelf && this._parent.markAsTouched(e);
  }
  markAllAsTouched() {
    this.markAsTouched({ onlySelf: !0 }),
      this._forEachChild((e) => e.markAllAsTouched());
  }
  markAsUntouched(e = {}) {
    (this.touched = !1),
      (this._pendingTouched = !1),
      this._forEachChild((r) => {
        r.markAsUntouched({ onlySelf: !0 });
      }),
      this._parent && !e.onlySelf && this._parent._updateTouched(e);
  }
  markAsDirty(e = {}) {
    (this.pristine = !1),
      this._parent && !e.onlySelf && this._parent.markAsDirty(e);
  }
  markAsPristine(e = {}) {
    (this.pristine = !0),
      (this._pendingDirty = !1),
      this._forEachChild((r) => {
        r.markAsPristine({ onlySelf: !0 });
      }),
      this._parent && !e.onlySelf && this._parent._updatePristine(e);
  }
  markAsPending(e = {}) {
    (this.status = cr),
      e.emitEvent !== !1 && this.statusChanges.emit(this.status),
      this._parent && !e.onlySelf && this._parent.markAsPending(e);
  }
  disable(e = {}) {
    let r = this._parentMarkedDirty(e.onlySelf);
    (this.status = ui),
      (this.errors = null),
      this._forEachChild((n) => {
        n.disable(G(y({}, e), { onlySelf: !0 }));
      }),
      this._updateValue(),
      e.emitEvent !== !1 &&
        (this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
      this._updateAncestors(G(y({}, e), { skipPristineCheck: r })),
      this._onDisabledChange.forEach((n) => n(!0));
  }
  enable(e = {}) {
    let r = this._parentMarkedDirty(e.onlySelf);
    (this.status = ci),
      this._forEachChild((n) => {
        n.enable(G(y({}, e), { onlySelf: !0 }));
      }),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent }),
      this._updateAncestors(G(y({}, e), { skipPristineCheck: r })),
      this._onDisabledChange.forEach((n) => n(!1));
  }
  _updateAncestors(e) {
    this._parent &&
      !e.onlySelf &&
      (this._parent.updateValueAndValidity(e),
      e.skipPristineCheck || this._parent._updatePristine(),
      this._parent._updateTouched());
  }
  setParent(e) {
    this._parent = e;
  }
  getRawValue() {
    return this.value;
  }
  updateValueAndValidity(e = {}) {
    this._setInitialStatus(),
      this._updateValue(),
      this.enabled &&
        (this._cancelExistingSubscription(),
        (this.errors = this._runValidator()),
        (this.status = this._calculateStatus()),
        (this.status === ci || this.status === cr) &&
          this._runAsyncValidator(e.emitEvent)),
      e.emitEvent !== !1 &&
        (this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
      this._parent && !e.onlySelf && this._parent.updateValueAndValidity(e);
  }
  _updateTreeValidity(e = { emitEvent: !0 }) {
    this._forEachChild((r) => r._updateTreeValidity(e)),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent });
  }
  _setInitialStatus() {
    this.status = this._allControlsDisabled() ? ui : ci;
  }
  _runValidator() {
    return this.validator ? this.validator(this) : null;
  }
  _runAsyncValidator(e) {
    if (this.asyncValidator) {
      (this.status = cr), (this._hasOwnPendingAsyncValidator = !0);
      let r = yg(this.asyncValidator(this));
      this._asyncValidationSubscription = r.subscribe((n) => {
        (this._hasOwnPendingAsyncValidator = !1),
          this.setErrors(n, { emitEvent: e });
      });
    }
  }
  _cancelExistingSubscription() {
    this._asyncValidationSubscription &&
      (this._asyncValidationSubscription.unsubscribe(),
      (this._hasOwnPendingAsyncValidator = !1));
  }
  setErrors(e, r = {}) {
    (this.errors = e), this._updateControlsErrors(r.emitEvent !== !1);
  }
  get(e) {
    let r = e;
    return r == null || (Array.isArray(r) || (r = r.split(".")), r.length === 0)
      ? null
      : r.reduce((n, i) => n && n._find(i), this);
  }
  getError(e, r) {
    let n = r ? this.get(r) : this;
    return n && n.errors ? n.errors[e] : null;
  }
  hasError(e, r) {
    return !!this.getError(e, r);
  }
  get root() {
    let e = this;
    for (; e._parent; ) e = e._parent;
    return e;
  }
  _updateControlsErrors(e) {
    (this.status = this._calculateStatus()),
      e && this.statusChanges.emit(this.status),
      this._parent && this._parent._updateControlsErrors(e);
  }
  _initObservables() {
    (this.valueChanges = new me()), (this.statusChanges = new me());
  }
  _calculateStatus() {
    return this._allControlsDisabled()
      ? ui
      : this.errors
      ? Es
      : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(cr)
      ? cr
      : this._anyControlsHaveStatus(Es)
      ? Es
      : ci;
  }
  _anyControlsHaveStatus(e) {
    return this._anyControls((r) => r.status === e);
  }
  _anyControlsDirty() {
    return this._anyControls((e) => e.dirty);
  }
  _anyControlsTouched() {
    return this._anyControls((e) => e.touched);
  }
  _updatePristine(e = {}) {
    (this.pristine = !this._anyControlsDirty()),
      this._parent && !e.onlySelf && this._parent._updatePristine(e);
  }
  _updateTouched(e = {}) {
    (this.touched = this._anyControlsTouched()),
      this._parent && !e.onlySelf && this._parent._updateTouched(e);
  }
  _registerOnCollectionChange(e) {
    this._onCollectionChange = e;
  }
  _setUpdateStrategy(e) {
    As(e) && e.updateOn != null && (this._updateOn = e.updateOn);
  }
  _parentMarkedDirty(e) {
    let r = this._parent && this._parent.dirty;
    return !e && !!r && !this._parent._anyControlsDirty();
  }
  _find(e) {
    return null;
  }
  _assignValidators(e) {
    (this._rawValidators = Array.isArray(e) ? e.slice() : e),
      (this._composedValidatorFn = Z1(this._rawValidators));
  }
  _assignAsyncValidators(e) {
    (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
      (this._composedAsyncValidatorFn = Q1(this._rawAsyncValidators));
  }
};
var xg = new D("CallSetDisabledState", {
    providedIn: "root",
    factory: () => al,
  }),
  al = "always";
function K1(t, e, r = al) {
  X1(t, e),
    e.valueAccessor.writeValue(t.value),
    (t.disabled || r === "always") &&
      e.valueAccessor.setDisabledState?.(t.disabled),
    tb(t, e),
    rb(t, e),
    nb(t, e),
    J1(t, e);
}
function fg(t, e, r = !0) {
  let n = () => {};
  e.valueAccessor &&
    (e.valueAccessor.registerOnChange(n), e.valueAccessor.registerOnTouched(n)),
    eb(t, e),
    t &&
      (e._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {}));
}
function xs(t, e) {
  t.forEach((r) => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(e);
  });
}
function J1(t, e) {
  if (e.valueAccessor.setDisabledState) {
    let r = (n) => {
      e.valueAccessor.setDisabledState(n);
    };
    t.registerOnDisabledChange(r),
      e._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(r);
      });
  }
}
function X1(t, e) {
  let r = Mg(t);
  e.validator !== null
    ? t.setValidators(ug(r, e.validator))
    : typeof r == "function" && t.setValidators([r]);
  let n = Eg(t);
  e.asyncValidator !== null
    ? t.setAsyncValidators(ug(n, e.asyncValidator))
    : typeof n == "function" && t.setAsyncValidators([n]);
  let i = () => t.updateValueAndValidity();
  xs(e._rawValidators, i), xs(e._rawAsyncValidators, i);
}
function eb(t, e) {
  let r = !1;
  if (t !== null) {
    if (e.validator !== null) {
      let i = Mg(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.validator);
        o.length !== i.length && ((r = !0), t.setValidators(o));
      }
    }
    if (e.asyncValidator !== null) {
      let i = Eg(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.asyncValidator);
        o.length !== i.length && ((r = !0), t.setAsyncValidators(o));
      }
    }
  }
  let n = () => {};
  return xs(e._rawValidators, n), xs(e._rawAsyncValidators, n), r;
}
function tb(t, e) {
  e.valueAccessor.registerOnChange((r) => {
    (t._pendingValue = r),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === "change" && Sg(t, e);
  });
}
function nb(t, e) {
  e.valueAccessor.registerOnTouched(() => {
    (t._pendingTouched = !0),
      t.updateOn === "blur" && t._pendingChange && Sg(t, e),
      t.updateOn !== "submit" && t.markAsTouched();
  });
}
function Sg(t, e) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    e.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1);
}
function rb(t, e) {
  let r = (n, i) => {
    e.valueAccessor.writeValue(n), i && e.viewToModelUpdate(n);
  };
  t.registerOnChange(r),
    e._registerOnDestroy(() => {
      t._unregisterOnChange(r);
    });
}
function ib(t, e) {
  if (!t.hasOwnProperty("model")) return !1;
  let r = t.model;
  return r.isFirstChange() ? !0 : !Object.is(e, r.currentValue);
}
function ob(t) {
  return Object.getPrototypeOf(t.constructor) === sl;
}
function sb(t, e) {
  if (!e) return null;
  Array.isArray(e);
  let r, n, i;
  return (
    e.forEach((o) => {
      o.constructor === Ts ? (r = o) : ob(o) ? (n = o) : (i = o);
    }),
    i || n || r || null
  );
}
function hg(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function pg(t) {
  return (
    typeof t == "object" &&
    t !== null &&
    Object.keys(t).length === 2 &&
    "value" in t &&
    "disabled" in t
  );
}
var Tg = class extends ol {
  constructor(e = null, r, n) {
    super(q1(r), Y1(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(e),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      As(r) &&
        (r.nonNullable || r.initialValueIsDefault) &&
        (pg(e) ? (this.defaultValue = e.value) : (this.defaultValue = e));
  }
  setValue(e, r = {}) {
    (this.value = this._pendingValue = e),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach((n) =>
          n(this.value, r.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(r);
  }
  patchValue(e, r = {}) {
    this.setValue(e, r);
  }
  reset(e = this.defaultValue, r = {}) {
    this._applyFormState(e),
      this.markAsPristine(r),
      this.markAsUntouched(r),
      this.setValue(this.value, r),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(e) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(e) {
    this._onChange.push(e);
  }
  _unregisterOnChange(e) {
    hg(this._onChange, e);
  }
  registerOnDisabledChange(e) {
    this._onDisabledChange.push(e);
  }
  _unregisterOnDisabledChange(e) {
    hg(this._onDisabledChange, e);
  }
  _forEachChild(e) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(e) {
    pg(e)
      ? ((this.value = this._pendingValue = e.value),
        e.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = e);
  }
};
var Ag = new D(""),
  ab = { provide: li, useExisting: nn(() => cl) },
  cl = (() => {
    let e = class e extends li {
      set isDisabled(n) {}
      constructor(n, i, o, s, a) {
        super(),
          (this._ngModelWarningConfig = s),
          (this.callSetDisabledState = a),
          (this.update = new me()),
          (this._ngModelWarningSent = !1),
          this._setValidators(n),
          this._setAsyncValidators(i),
          (this.valueAccessor = sb(this, o));
      }
      ngOnChanges(n) {
        if (this._isControlChanged(n)) {
          let i = n.form.previousValue;
          i && fg(i, this, !1),
            K1(this.form, this, this.callSetDisabledState),
            this.form.updateValueAndValidity({ emitEvent: !1 });
        }
        ib(n, this.viewModel) &&
          (this.form.setValue(this.model), (this.viewModel = this.model));
      }
      ngOnDestroy() {
        this.form && fg(this.form, this, !1);
      }
      get path() {
        return [];
      }
      get control() {
        return this.form;
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      _isControlChanged(n) {
        return n.hasOwnProperty("form");
      }
    };
    (e._ngModelWarningSentOnce = !1),
      (e.ɵfac = function (i) {
        return new (i || e)(
          L(B1, 10),
          L($1, 10),
          L(Ss, 10),
          L(Ag, 8),
          L(xg, 8)
        );
      }),
      (e.ɵdir = ae({
        type: e,
        selectors: [["", "formControl", ""]],
        inputs: {
          form: [de.None, "formControl", "form"],
          isDisabled: [de.None, "disabled", "isDisabled"],
          model: [de.None, "ngModel", "model"],
        },
        outputs: { update: "ngModelChange" },
        exportAs: ["ngForm"],
        features: [Or([ab]), Rt, rn],
      }));
    let t = e;
    return t;
  })();
var cb = { provide: Ss, useExisting: nn(() => Pg), multi: !0 };
function Og(t, e) {
  return t == null
    ? `${e}`
    : (e && typeof e == "object" && (e = "Object"), `${t}: ${e}`.slice(0, 50));
}
function ub(t) {
  return t.split(":")[0];
}
var Pg = (() => {
    let e = class e extends sl {
      constructor() {
        super(...arguments),
          (this._optionMap = new Map()),
          (this._idCounter = 0),
          (this._compareWith = Object.is);
      }
      set compareWith(n) {
        this._compareWith = n;
      }
      writeValue(n) {
        this.value = n;
        let i = this._getOptionId(n),
          o = Og(i, n);
        this.setProperty("value", o);
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          (this.value = this._getOptionValue(i)), n(this.value);
        };
      }
      _registerOption() {
        return (this._idCounter++).toString();
      }
      _getOptionId(n) {
        for (let i of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(i), n)) return i;
        return null;
      }
      _getOptionValue(n) {
        let i = ub(n);
        return this._optionMap.has(i) ? this._optionMap.get(i) : n;
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = an(e)))(o || e);
      };
    })()),
      (e.ɵdir = ae({
        type: e,
        selectors: [
          ["select", "formControlName", "", 3, "multiple", ""],
          ["select", "formControl", "", 3, "multiple", ""],
          ["select", "ngModel", "", 3, "multiple", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            Ee("change", function (a) {
              return o.onChange(a.target.value);
            })("blur", function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: "compareWith" },
        features: [Or([cb]), Rt],
      }));
    let t = e;
    return t;
  })(),
  Ng = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._element = n),
          (this._renderer = i),
          (this._select = o),
          this._select && (this.id = this._select._registerOption());
      }
      set ngValue(n) {
        this._select != null &&
          (this._select._optionMap.set(this.id, n),
          this._setElementValue(Og(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._setElementValue(n),
          this._select && this._select.writeValue(this._select.value);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, "value", n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select.writeValue(this._select.value));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(Ye), L(st), L(Pg, 9));
    }),
      (e.ɵdir = ae({
        type: e,
        selectors: [["option"]],
        inputs: { ngValue: "ngValue", value: "value" },
      }));
    let t = e;
    return t;
  })(),
  lb = { provide: Ss, useExisting: nn(() => Rg), multi: !0 };
function gg(t, e) {
  return t == null
    ? `${e}`
    : (typeof e == "string" && (e = `'${e}'`),
      e && typeof e == "object" && (e = "Object"),
      `${t}: ${e}`.slice(0, 50));
}
function db(t) {
  return t.split(":")[0];
}
var Rg = (() => {
    let e = class e extends sl {
      constructor() {
        super(...arguments),
          (this._optionMap = new Map()),
          (this._idCounter = 0),
          (this._compareWith = Object.is);
      }
      set compareWith(n) {
        this._compareWith = n;
      }
      writeValue(n) {
        this.value = n;
        let i;
        if (Array.isArray(n)) {
          let o = n.map((s) => this._getOptionId(s));
          i = (s, a) => {
            s._setSelected(o.indexOf(a.toString()) > -1);
          };
        } else
          i = (o, s) => {
            o._setSelected(!1);
          };
        this._optionMap.forEach(i);
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          let o = [],
            s = i.selectedOptions;
          if (s !== void 0) {
            let a = s;
            for (let c = 0; c < a.length; c++) {
              let u = a[c],
                l = this._getOptionValue(u.value);
              o.push(l);
            }
          } else {
            let a = i.options;
            for (let c = 0; c < a.length; c++) {
              let u = a[c];
              if (u.selected) {
                let l = this._getOptionValue(u.value);
                o.push(l);
              }
            }
          }
          (this.value = o), n(o);
        };
      }
      _registerOption(n) {
        let i = (this._idCounter++).toString();
        return this._optionMap.set(i, n), i;
      }
      _getOptionId(n) {
        for (let i of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(i)._value, n)) return i;
        return null;
      }
      _getOptionValue(n) {
        let i = db(n);
        return this._optionMap.has(i) ? this._optionMap.get(i)._value : n;
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = an(e)))(o || e);
      };
    })()),
      (e.ɵdir = ae({
        type: e,
        selectors: [
          ["select", "multiple", "", "formControlName", ""],
          ["select", "multiple", "", "formControl", ""],
          ["select", "multiple", "", "ngModel", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            Ee("change", function (a) {
              return o.onChange(a.target);
            })("blur", function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: "compareWith" },
        features: [Or([lb]), Rt],
      }));
    let t = e;
    return t;
  })(),
  Fg = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._element = n),
          (this._renderer = i),
          (this._select = o),
          this._select && (this.id = this._select._registerOption(this));
      }
      set ngValue(n) {
        this._select != null &&
          ((this._value = n),
          this._setElementValue(gg(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._select
          ? ((this._value = n),
            this._setElementValue(gg(this.id, n)),
            this._select.writeValue(this._select.value))
          : this._setElementValue(n);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, "value", n);
      }
      _setSelected(n) {
        this._renderer.setProperty(this._element.nativeElement, "selected", n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select.writeValue(this._select.value));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(Ye), L(st), L(Rg, 9));
    }),
      (e.ɵdir = ae({
        type: e,
        selectors: [["option"]],
        inputs: { ngValue: "ngValue", value: "value" },
      }));
    let t = e;
    return t;
  })();
var fb = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = it({ type: e })),
    (e.ɵinj = rt({}));
  let t = e;
  return t;
})();
var kg = (() => {
  let e = class e {
    static withConfig(n) {
      return {
        ngModule: e,
        providers: [
          { provide: Ag, useValue: n.warnOnNgModelWithFormControl ?? "always" },
          { provide: xg, useValue: n.callSetDisabledState ?? al },
        ],
      };
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = it({ type: e })),
    (e.ɵinj = rt({ imports: [fb] }));
  let t = e;
  return t;
})();
var di = [
  {
    contributor_name: "Maanas Talwar",
    github_username: "maanas-talwar",
    repos: ["Scan8"],
    avatar_url: "https://avatars.githubusercontent.com/u/54113320?v=4",
    contributions: "1",
    followers: "32",
    followings: "23",
  },
  {
    contributor_name: "Sarthak Singh",
    github_username: "SarthakSingh18",
    repos: ["Scan8"],
    avatar_url: "https://avatars.githubusercontent.com/u/46760104?v=4",
    contributions: "1",
    followers: "3",
    followings: "2",
  },
  {
    contributor_name: "Prerak Mathur",
    github_username: "PrerakMathur20",
    repos: ["Scan8"],
    avatar_url: "https://avatars.githubusercontent.com/u/76054330?v=4",
    contributions: "1",
    followers: "26",
    followings: "19",
  },
  {
    contributor_name: "Shelly Suthar",
    github_username: "Shelly011s",
    repos: ["Scan8"],
    avatar_url: "https://avatars.githubusercontent.com/u/84381373?v=4 ",
    contributions: "1",
    followers: "5",
    followings: "0",
  },
  {
    contributor_name: "Atharva Karambe",
    github_username: "Atharva-karambe",
    repos: ["Scan8"],
    avatar_url: "https://avatars.githubusercontent.com/u/58180297?v=4 ",
    contributions: "1",
    followers: "0",
    followings: "1",
  },
  {
    contributor_name: "Aju Tamang",
    github_username: "Aju100",
    repos: ["Scan8"],
    avatar_url: "https://avatars.githubusercontent.com/u/29862610?v=4",
    contributions: "1",
    followers: "326",
    followings: "293",
  },
  {
    contributor_name: "Charitha Madusanka",
    github_username: "charithccmc",
    repos: ["Scan8", "Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/700745?v=4",
    contributions: "2",
    followers: "102",
    followings: "24",
  },
  {
    contributor_name: "Wenuka Somarathne",
    github_username: "Wenuka19",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/89344987?v=4",
    contributions: "1",
    followers: "2",
    followings: "1",
  },
  {
    contributor_name: "Asela Dasanayaka",
    github_username: "aselarbd",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/13283885?v=4",
    contributions: "1",
    followers: "5",
    followings: "2",
  },
  {
    contributor_name: "Durgesh",
    github_username: "orionpax00",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/36275145?v=4",
    contributions: "1",
    followers: "14",
    followings: "4",
  },
  {
    contributor_name: "Suleka Helmini",
    github_username: "suleka96",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/30715489?v=4",
    contributions: "1",
    followers: "25",
    followings: "6",
  },
  {
    contributor_name: "Saatwik Vasishtha",
    github_username: "Teak-Rosewood",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/88363398?v=4",
    contributions: "1",
    followers: "9",
    followings: "1",
  },
  {
    contributor_name: "Aditya Srivastava",
    github_username: "srivastava9",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/45288400?v=4",
    contributions: "13",
    followers: "26",
    followings: "21",
  },
  {
    contributor_name: "Ivantha",
    github_username: "ivantha",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/14804283?v=4",
    contributions: "1",
    followers: "167",
    followings: "21",
  },
  {
    contributor_name: "Subramanyam Makam",
    github_username: "bruce-wayne99",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/25129274?v=4 ",
    contributions: "1",
    followers: "3",
    followings: "5",
  },
  {
    contributor_name: "Mahmoud M.Abdelwahab",
    github_username: "mahmoudmohamed22",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/47304558?v=4 ",
    contributions: "1",
    followers: "87",
    followings: "132",
  },
  {
    contributor_name: "Kd-Here",
    github_username: "Kd-Here",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/90677747?v=4 ",
    contributions: "1",
    followers: "9",
    followings: "44",
  },
  {
    contributor_name: "Sumedhe Dissanayake",
    github_username: "sumedhe",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/2020370?v=4 ",
    contributions: "1",
    followers: "102",
    followings: "84",
  },
  {
    contributor_name: "Joseph Semrai",
    github_username: "JosephSemrai",
    repos: ["Tensor Map"],
    avatar_url: "https://avatars.githubusercontent.com/u/29003194?v=4 ",
    contributions: "1",
    followers: "42",
    followings: "9",
  },
  {
    contributor_name: "John Dae",
    github_username: "GillaArun7",
    repos: ["rep4", "rep2"],
    avatar_url: "../../../assets/page/hompage/commuinty-image.png ",
    contributions: "21",
    followers: "77",
    followings: "88",
  },
  {
    contributor_name: "Jane Patrick",
    github_username: "GillaArun7",
    repos: ["rep1", "rep2"],
    avatar_url: "../../../assets/page/hompage/commuinty-image.png ",
    contributions: "12",
    followers: "11",
    followings: "11",
  },
];
var Lg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-profile-card"]],
      inputs: {
        contributor_name: "contributor_name",
        github_username: "github_username",
        repos: "repos",
        avatar_url: "avatar_url",
        contributions: "contributions",
        followers: "followers",
        followings: "followings",
      },
      standalone: !0,
      features: [q],
      decls: 22,
      vars: 8,
      consts: [
        [1, "profile-box"],
        [1, "profile-img", 3, "src"],
        [1, "profile-username"],
        [1, "profile-contributions"],
        [1, "profile-info"],
        [1, "profile-github"],
        [1, "github-icon"],
        [
          "xmlns",
          "http://www.w3.org/2000/svg",
          "width",
          "21",
          "height",
          "21",
          "viewBox",
          "0 0 21 21",
          "fill",
          "none",
        ],
        ["clip-path", "url(#clip0_1_285)"],
        [
          "d",
          "M10.5 0.5C4.975 0.5 0.5 4.975 0.5 10.5C0.5 14.925 3.3625 18.6625 7.3375 19.9875C7.8375 20.075 8.025 19.775 8.025 19.5125C8.025 19.275 8.0125 18.4875 8.0125 17.65C5.5 18.1125 4.85 17.0375 4.65 16.475C4.5375 16.1875 4.05 15.3 3.625 15.0625C3.275 14.875 2.775 14.4125 3.6125 14.4C4.4 14.3875 4.9625 15.125 5.15 15.425C6.05 16.9375 7.4875 16.5125 8.0625 16.25C8.15 15.6 8.4125 15.1625 8.7 14.9125C6.475 14.6625 4.15 13.8 4.15 9.975C4.15 8.8875 4.5375 7.9875 5.175 7.2875C5.075 7.0375 4.725 6.0125 5.275 4.6375C5.275 4.6375 6.1125 4.375 8.025 5.6625C8.825 5.4375 9.675 5.325 10.525 5.325C11.375 5.325 12.225 5.4375 13.025 5.6625C14.9375 4.3625 15.775 4.6375 15.775 4.6375C16.325 6.0125 15.975 7.0375 15.875 7.2875C16.5125 7.9875 16.9 8.875 16.9 9.975C16.9 13.8125 14.5625 14.6625 12.3375 14.9125C12.7 15.225 13.0125 15.825 13.0125 16.7625C13.0125 18.1 13 19.175 13 19.5125C13 19.775 13.1875 20.0875 13.6875 19.9875C15.673 19.3178 17.3983 18.0421 18.6205 16.34C19.8427 14.638 20.5 12.5954 20.5 10.5C20.5 4.975 16.025 0.5 10.5 0.5Z",
          "fill",
          "#0A0A15",
        ],
        ["id", "clip0_1_285"],
        [
          "width",
          "20",
          "height",
          "20",
          "fill",
          "white",
          "transform",
          "translate(0.5 0.5)",
        ],
        [1, "github-username", 3, "href"],
      ],
      template: function (i, o) {
        i & 1 &&
          (h(0, "div", 0),
          E(1, "img", 1),
          h(2, "p", 2),
          m(3),
          p(),
          h(4, "p", 3),
          m(5),
          p(),
          h(6, "div", 4)(7, "p"),
          m(8),
          p(),
          h(9, "p"),
          m(10),
          p()(),
          h(11, "div", 5)(12, "div", 6),
          Te(),
          h(13, "svg", 7)(14, "g", 8),
          E(15, "path", 9),
          p(),
          h(16, "defs")(17, "clipPath", 10),
          E(18, "rect", 11),
          p()()()(),
          Ae(),
          h(19, "div")(20, "a", 12),
          m(21),
          p()()()()),
          i & 2 &&
            (M(),
            Wn("src", o.avatar_url, Oe),
            M(2),
            re(o.contributor_name),
            M(2),
            Pe("", o.contributions, " contributions"),
            M(3),
            Pe("", o.followers, " followers"),
            M(2),
            Pe("", o.followings, " followings"),
            M(10),
            un("href", "https://github.com/", o.github_username, "", Oe),
            M(),
            Pe(" ", o.github_username, ""));
      },
      dependencies: [Ne],
      styles: [
        ".profile-box[_ngcontent-%COMP%]{display:flex;border:solid 1px #e0e0e0;box-shadow:10px 10px 30px 10px #0505051a;border-radius:10px;width:100%;max-width:350px;max-height:650px;min-height:300px;align-items:center;justify-content:center;flex-direction:column;text-align:center}.profile-img[_ngcontent-%COMP%]{width:40%;height:40%;border-radius:50%;border:solid .2px}.profile-info[_ngcontent-%COMP%]{display:flex;width:100%;gap:10%;justify-content:center;margin-top:10px}.profile-github[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;border-radius:5px;background:var(--Gray-6, #eeecec);padding:8px 12px;justify-content:center;margin-top:5%}.github-icon[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center}.github-username[_ngcontent-%COMP%]{display:flex;align-items:center;color:#000}@media (max-width: 1200px){.contributers-context[_ngcontent-%COMP%]{grid-template-columns:repeat(3,1fr)}.contributors-main[_ngcontent-%COMP%]{margin-left:15%}.box[_ngcontent-%COMP%]{width:100%;height:100%}}@media (max-width: 992px){.box[_ngcontent-%COMP%]{width:80%;height:80%}}@media (max-width: 500px){.box[_ngcontent-%COMP%]{width:70%;height:70%}}",
      ],
    }));
  let t = e;
  return t;
})();
function pb(t, e) {
  if ((t & 1 && (h(0, "option"), m(1), p()), t & 2)) {
    let r = e.$implicit;
    M(), re(r);
  }
}
function gb(t, e) {
  if ((t & 1 && E(0, "app-profile-card", 10), t & 2)) {
    let r = e.$implicit;
    te("contributor_name", r.contributor_name)(
      "contributions",
      r.contributions
    )("avatar_url", r.avatar_url)("followers", r.followers)(
      "followings",
      r.followings
    )("github_username", r.github_username);
  }
}
var jg = (() => {
  let e = class e {
    constructor() {
      (this.profiles = di),
        (this.searchText = new Tg("")),
        (this.selectedRepo = ""),
        (this.allRepos = []),
        (this.allRepos = this.getUniqueRepos());
    }
    getUniqueRepos() {
      let n = this.profiles.flatMap((i) => i.repos);
      return Array.from(new Set(n));
    }
    onRepoChange(n) {
      let i = n.target;
      (this.selectedRepo = i.value), this.filterProfiles();
    }
    filterProfiles() {
      let n = this.searchText.value?.toLocaleLowerCase().trim() || "";
      this.profiles = di.filter(
        (i) =>
          (n?.length
            ? [i.contributor_name, i.github_username].some((o) =>
                o.toLocaleLowerCase().includes(n)
              )
            : !0) &&
          (this.selectedRepo?.length ? i.repos.includes(this.selectedRepo) : !0)
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-contributors"]],
      standalone: !0,
      features: [q],
      decls: 19,
      vars: 1,
      consts: [
        [1, "main"],
        [1, "search-components"],
        [
          "type",
          "text",
          "placeholder",
          "Search..",
          1,
          "search-bar",
          3,
          "formControl",
        ],
        [1, "search-button", 3, "click"],
        [1, "search-font"],
        [1, "repo-filter"],
        [1, "repo-dropdown"],
        [1, "repo-selection", 3, "change"],
        ["value", ""],
        [1, "contributers-context"],
        [
          3,
          "contributor_name",
          "contributions",
          "avatar_url",
          "followers",
          "followings",
          "github_username",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (h(0, "div", 0)(1, "div", 1),
          E(2, "input", 2),
          h(3, "div", 3),
          Ee("click", function () {
            return o.filterProfiles();
          }),
          h(4, "p", 4),
          m(5, "Search"),
          p()()(),
          h(6, "div", 5)(7, "h3"),
          m(8, "Filter by Repository"),
          p(),
          h(9, "div", 6)(10, "select", 7),
          Ee("change", function (a) {
            return o.onRepoChange(a);
          }),
          h(11, "option", 8),
          m(12, "All repos"),
          p(),
          kt(13, pb, 2, 1, "option", null, Ft),
          m(15, "; "),
          p()()(),
          h(16, "div", 9),
          kt(17, gb, 1, 6, "app-profile-card", 10, Ft),
          p()()),
          i & 2 &&
            (M(2),
            te("formControl", o.searchText),
            M(11),
            Lt(o.allRepos),
            M(4),
            Lt(o.profiles));
      },
      dependencies: [kg, Ng, Fg, Ts, Ig, cl, Ne, Lg],
      styles: [
        ".main[_ngcontent-%COMP%]{margin-top:5%}.search-components[_ngcontent-%COMP%]{display:flex;justify-content:center}.search-bar[_ngcontent-%COMP%]{border-radius:5px;border:2px solid var(--Gray-5, #E0E0E0);background:var(--Gray-6, #F2F2F2);justify-self:center;width:50%;cursor:pointer;padding:1% 2%;font-weight:700}.search-button[_ngcontent-%COMP%]{background-color:#2f80ed;color:#fff;align-content:center;display:flex;cursor:pointer;justify-content:center;border-radius:5px;padding:1% 2%;margin-left:2%;font-weight:700}.repo-filter[_ngcontent-%COMP%]{display:flex;align-items:center;margin:3%}.contributers-context[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:2%;margin-top:1%}.repo-selection[_ngcontent-%COMP%]{border-radius:10px;padding:10px 20px;margin:2% 5%;align-items:center}.search-button[_ngcontent-%COMP%]{margin-top:.1%}@media (max-width: 1200px){.contributers-context[_ngcontent-%COMP%]{grid-template-columns:repeat(3,1fr)}.box[_ngcontent-%COMP%]{width:100%;height:100%}}@media (max-width: 992px){.search-font[_ngcontent-%COMP%]{display:none}.contributers-context[_ngcontent-%COMP%]{grid-template-columns:repeat(2,1fr)}.search-text[_ngcontent-%COMP%]{display:none}}@media (max-width: 500px){.contributers-context[_ngcontent-%COMP%]{grid-template-columns:repeat(1,1fr)}.search-components[_ngcontent-%COMP%]{margin-left:10%}}",
      ],
    }));
  let t = e;
  return t;
})();
var Vg = [
  {
    media_icon: "../../../assets/community/discord.png",
    link: "https://github.com/c2siorg",
  },
  {
    media_icon: "../../../assets/community/instagram.png",
    link: "https://github.com/c2siorg",
  },
  {
    media_icon: "../../../assets/community/facebook.png",
    link: "https://github.com/c2siorg",
  },
  {
    media_icon: "../../../assets/community/slack.png",
    link: "https://github.com/c2siorg",
  },
  {
    media_icon: "../../../assets/community/linkedIn.png",
    link: "https://github.com/c2siorg",
  },
];
function mb(t, e) {
  if ((t & 1 && (h(0, "a", 4), E(1, "img", 12), p()), t & 2)) {
    let r = e.$implicit;
    Wn("href", r.link, Oe), M(), Wn("src", r.media_icon, Oe);
  }
}
function vb(t, e) {
  if (
    (t & 1 &&
      (h(0, "div", 11)(1, "div", 13)(2, "p", 14),
      m(3),
      p(),
      h(4, "p", 15),
      m(5, "C2SI Contributor"),
      p()()()),
    t & 2)
  ) {
    let r = e.$implicit;
    M(3), Pe(" ", r.contributor_name, " ");
  }
}
var Ug = (() => {
  let e = class e {
    constructor() {
      (this.icons = Vg), (this.users = this.shuffleArray(di));
    }
    shuffleArray(n) {
      let i = n.length,
        o;
      for (; i !== 0; )
        (o = Math.floor(Math.random() * i)), i--, ([n[i], n[o]] = [n[o], n[i]]);
      return n;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-community"]],
      standalone: !0,
      features: [q],
      decls: 18,
      vars: 0,
      consts: [
        [1, "community"],
        [1, "community-hero"],
        [1, "community-hero-content"],
        [1, "media-icons"],
        [1, "icon-link", 3, "href"],
        ["src", "../../../assets/projects-img.png", "alt", "community"],
        [1, "team-details"],
        [1, "team-caption"],
        [1, "team-description"],
        [1, "team"],
        [1, "team-align"],
        [1, "card"],
        [1, "icon", 3, "src"],
        [1, "card-data"],
        [1, "user-name"],
        [1, "user-designation"],
      ],
      template: function (i, o) {
        i & 1 &&
          (h(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1"),
          m(4, "Join our community"),
          p(),
          h(5, "div", 3),
          kt(6, mb, 2, 2, "a", 4, Ft),
          p()(),
          E(8, "img", 5),
          p(),
          h(9, "div", 6)(10, "p", 7),
          m(11, "Meet the team"),
          p(),
          h(12, "p", 8),
          m(
            13,
            " Dedicated individuals who are pushing the boundaries of technology "
          ),
          p(),
          h(14, "div", 9)(15, "div", 10),
          kt(16, vb, 6, 1, "div", 11, Ft),
          p()()()()),
          i & 2 && (M(6), Lt(o.icons), M(10), Lt(o.users));
      },
      styles: [
        ".community[_ngcontent-%COMP%]{margin-top:5%;display:flex;flex-direction:column;align-items:center}.community[_ngcontent-%COMP%]   .community-hero[_ngcontent-%COMP%]{max-width:1000px;margin:50px auto;display:flex;align-items:center;justify-content:center}.community[_ngcontent-%COMP%]   .community-hero[_ngcontent-%COMP%]   .community-hero-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:40px;margin-bottom:10px;font-weight:500;line-height:150%}.community[_ngcontent-%COMP%]   .community-hero[_ngcontent-%COMP%]   .community-hero-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:16px;font-weight:light;line-height:150%}.community[_ngcontent-%COMP%]   .community-hero[_ngcontent-%COMP%]   .community-hero-content[_ngcontent-%COMP%]   .media-icons[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:50px;width:50px;margin-right:20px}.community[_ngcontent-%COMP%]   .team-details[_ngcontent-%COMP%]{margin-top:2%;width:80%;display:flex;flex-direction:column;align-items:center}.community[_ngcontent-%COMP%]   .team-details[_ngcontent-%COMP%]   .team-caption[_ngcontent-%COMP%]{font-size:48px;font-weight:500;text-align:center}.community[_ngcontent-%COMP%]   .team-details[_ngcontent-%COMP%]   .team-description[_ngcontent-%COMP%]{text-align:center}.community[_ngcontent-%COMP%]   .team-details[_ngcontent-%COMP%]   .team[_ngcontent-%COMP%]{width:80%;display:flex}.community[_ngcontent-%COMP%]   .team-details[_ngcontent-%COMP%]   .team[_ngcontent-%COMP%]   .team-align[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;flex-direction:row;gap:10px;margin:2%;justify-content:center}.community[_ngcontent-%COMP%]   .team-details[_ngcontent-%COMP%]   .team[_ngcontent-%COMP%]   .team-align[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]{width:fit-content;display:flex;padding:10px 20px;flex-direction:column;align-items:flex-start;gap:5px;border-radius:10px;border:1px solid var(--Gray-5, #e0e0e0);background:var(--primary-white, #fff);box-shadow:0 4px 15px #0000001a}.community[_ngcontent-%COMP%]   .team-details[_ngcontent-%COMP%]   .team[_ngcontent-%COMP%]   .team-align[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .card-data[_ngcontent-%COMP%]{padding:8px 22px}.community[_ngcontent-%COMP%]   .team-details[_ngcontent-%COMP%]   .team[_ngcontent-%COMP%]   .team-align[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .card-data[_ngcontent-%COMP%]   .user-name[_ngcontent-%COMP%]{text-align:center;font-size:larger}.community[_ngcontent-%COMP%]   .team-details[_ngcontent-%COMP%]   .team[_ngcontent-%COMP%]   .team-align[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .card-data[_ngcontent-%COMP%]   .user-designation[_ngcontent-%COMP%]{text-align:center;font-size:medium}@media screen and (max-width: 1100px){.community[_ngcontent-%COMP%]   .community-hero[_ngcontent-%COMP%]{flex-direction:column;justify-content:center;align-items:center;padding:20px}.community[_ngcontent-%COMP%]   .community-hero[_ngcontent-%COMP%]   .community-hero-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center}.community[_ngcontent-%COMP%]   .community-hero[_ngcontent-%COMP%]   .community-hero-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{max-width:600px;text-align:center}}@media screen and (max-width: 600px){.community[_ngcontent-%COMP%]   .community-hero[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:400px}}@media screen and (max-width: 450px){.community[_ngcontent-%COMP%]   .community-hero[_ngcontent-%COMP%]   .community-hero-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:32px}.community[_ngcontent-%COMP%]   .community-hero[_ngcontent-%COMP%]   .community-hero-content[_ngcontent-%COMP%]   .media-icons[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:30px;width:30px}.community[_ngcontent-%COMP%]   .community-hero[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:300px}}",
      ],
    }));
  let t = e;
  return t;
})();
var Bg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-gsoc"]],
      standalone: !0,
      features: [q],
      decls: 47,
      vars: 0,
      consts: [
        [1, "gsoc__page"],
        [1, "gsoc-hero"],
        [1, "gsoc-hero-content"],
        ["src", "../../../assets/gsoc.png", "alt", "GSOC"],
        [1, "gsoc__details"],
        [1, "gsoc__idea__details"],
        [1, "gsoc__projects__list"],
        [1, "gsoc__project"],
      ],
      template: function (i, o) {
        i & 1 &&
          (h(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1"),
          m(4, "C2SI GSOC 2024"),
          p(),
          h(5, "p"),
          m(
            6,
            " Welcome to the C2SI Google Summer of Code (GSoC) 2024 project ideas page. "
          ),
          p()(),
          E(7, "img", 3),
          p(),
          h(8, "div", 4)(9, "p"),
          m(
            10,
            " This is the 7th time that we are participating in the GSoC, we will use this page to develop possible project ideas that have on the above mentioned areas. Please note that anyone who is interested can participate in this process. You do not have to be a GSoC student or mentor to suggest possible project ideas. "
          ),
          p(),
          h(11, "p"),
          m(
            12,
            " You can also talk to us about possible project ideas and we are happy to improve or heip you with them. Please keep in mind that projects need to be realistically something that is able to be functionally completed by a student working full time for about eight weeks. Thanks! "
          ),
          p()(),
          h(13, "div", 5)(14, "h3"),
          m(15, "Important Guidelines on Submitting Ideas"),
          p(),
          h(16, "p"),
          m(
            17,
            " There are some important guidelines to submit ideas, please read these carefully before adding your ideas! "
          ),
          p(),
          h(18, "ol")(19, "li"),
          m(
            20,
            " There is a fixed time period for implementing and coding your ideas "
          ),
          p(),
          h(21, "li"),
          m(
            22,
            " Come up with attainable goals and you will be able to complete what you set out to do. You can always contact our mentors and community and get an idea about the workload and whether you might be able to complete them. "
          ),
          p(),
          h(23, "li"),
          m(
            24,
            " You are free to come up with your own ideas. The ideas should be about Internet of Things (IOT), Computer Security and Software Tools. Also if you love to work on any of these subjects but do not have an idea you can always contact us. "
          ),
          p(),
          h(25, "li"),
          m(
            26,
            " Lets Talk! The best way to solve problems that you might have is to contact our mentors and also our community. "
          ),
          p(),
          h(27, "li"),
          m(
            28,
            " We encourage you to do documentation so that we can keep track of your progress and also help you if things are not going according to plan. Although not compulsory we have a strong belief that this method can cut down your time to code and also the workload of the mentors drastically. "
          ),
          p(),
          h(29, "li"),
          m(30, "Please send your new project ideas to gsoc[at]c2si.com"),
          p()()(),
          h(31, "div", 6)(32, "div", 7)(33, "p"),
          m(
            34,
            " ProjectExplainer - Add knowledge graph based retrieval and explanation APIs for code and text modalities in documentation. "
          ),
          p()(),
          h(35, "div", 7)(36, "p"),
          m(37, "WebiU 2.0 :- c2siorg/SCoRe Lab website"),
          p()(),
          h(38, "div", 7)(39, "p"),
          m(40, "Rust Cloud"),
          p()(),
          h(41, "div", 7)(42, "p"),
          m(43, "Bug Connector"),
          p()(),
          h(44, "div", 7)(45, "p"),
          m(46, "GDB UI"),
          p()()()());
      },
      styles: [
        ".gsoc__page[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:center}.gsoc__page[_ngcontent-%COMP%]   .gsoc-hero[_ngcontent-%COMP%]{max-width:1000px;margin:50px auto;display:flex;align-items:center;justify-content:center}.gsoc__page[_ngcontent-%COMP%]   .gsoc-hero[_ngcontent-%COMP%]   .gsoc-hero-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:48px;font-weight:500;line-height:150%}.gsoc__page[_ngcontent-%COMP%]   .gsoc-hero[_ngcontent-%COMP%]   .gsoc-hero-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:16px;font-weight:light;line-height:150%;max-width:450px}.gsoc__page[_ngcontent-%COMP%]   .gsoc__details[_ngcontent-%COMP%]{max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:20px;padding:20px}.gsoc__page[_ngcontent-%COMP%]   .gsoc__idea__details[_ngcontent-%COMP%]{max-width:900px;margin:30px auto;padding:20px}.gsoc__page[_ngcontent-%COMP%]   .gsoc__idea__details[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:20px;font-weight:500;line-height:150%}.gsoc__page[_ngcontent-%COMP%]   .gsoc__idea__details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;font-style:italic;font-weight:400;line-height:150%}.gsoc__page[_ngcontent-%COMP%]   .gsoc__idea__details[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{font-family:Poppins;font-size:16px;font-style:italic;font-weight:400;line-height:150%}.gsoc__page[_ngcontent-%COMP%]   .gsoc__projects__list[_ngcontent-%COMP%]{display:flex;padding:20px;flex-direction:column;gap:20px;border-radius:10px;background:var(--Gray-6, #f2f2f2);box-shadow:0 4px 20px #0000000d inset;margin:30px 16px}.gsoc__page[_ngcontent-%COMP%]   .gsoc__projects__list[_ngcontent-%COMP%]   .gsoc__project[_ngcontent-%COMP%]{display:flex;padding:16px;align-items:center;border-radius:8px;border:2px solid var(--primary-white, #fff);background:var(--primary-white, #fff);box-shadow:0 4px 24px #0000001a}.gsoc__page[_ngcontent-%COMP%]   .gsoc__projects__list[_ngcontent-%COMP%]   .gsoc__project[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;max-width:800px;font-weight:500;line-height:150%}@media screen and (max-width: 1100px){.gsoc__page[_ngcontent-%COMP%]   .gsoc-hero[_ngcontent-%COMP%]{flex-direction:column;justify-content:center;align-items:center;padding:20px}.gsoc__page[_ngcontent-%COMP%]   .gsoc-hero[_ngcontent-%COMP%]   .gsoc-hero-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center}.gsoc__page[_ngcontent-%COMP%]   .gsoc-hero[_ngcontent-%COMP%]   .gsoc-hero-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{max-width:600px;text-align:center}}@media screen and (max-width: 600px){.gsoc__page[_ngcontent-%COMP%]   .gsoc-hero[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:400px}}@media screen and (max-width: 450px){.gsoc__page[_ngcontent-%COMP%]   .gsoc-hero[_ngcontent-%COMP%]   .gsoc-hero-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:32px}.gsoc__page[_ngcontent-%COMP%]   .gsoc-hero[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:300px}}",
      ],
    }));
  let t = e;
  return t;
})();
var $g = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-gsoc-project-idea"]],
      standalone: !0,
      features: [q],
      decls: 77,
      vars: 0,
      consts: [
        [1, "project__idea"],
        ["src", "../../../assets/gsoclogo.png", "alt", "GSOC"],
        [1, "project_idea_title"],
        ["href", "#", "target", "_blank", 1, "git-btn"],
        [
          "xmlns",
          "http://www.w3.org/2000/svg",
          "width",
          "24",
          "height",
          "25",
          "viewBox",
          "0 0 24 25",
          "fill",
          "none",
        ],
        ["clip-path", "url(#clip0_1_1403)"],
        [
          "fill-rule",
          "evenodd",
          "clip-rule",
          "evenodd",
          "d",
          "M11.964 0.5C8.79107 0.500398 5.74821 1.76101 3.50461 4.00461C1.26101 6.24821 0.000397735 9.29107 0 12.464C0 17.747 3.45 22.2245 8.1465 23.84C8.7345 23.9135 8.9535 23.546 8.9535 23.252V21.197C5.652 21.932 4.9185 19.583 4.9185 19.583C4.404 18.188 3.597 17.8205 3.597 17.8205C2.496 17.087 3.669 17.087 3.669 17.087C4.8435 17.1605 5.505 18.335 5.505 18.335C6.606 20.1695 8.2935 19.655 8.955 19.3625C9.027 18.5555 9.3945 18.0425 9.6885 17.7485C7.0455 17.4545 4.257 16.427 4.257 11.8025C4.257 10.4825 4.6965 9.4535 5.505 8.573C5.43 8.3525 4.9905 7.106 5.652 5.4905C5.652 5.4905 6.6795 5.1965 8.9535 6.7385C9.9075 6.4445 10.9365 6.371 11.964 6.371C12.9915 6.371 14.019 6.518 14.973 6.7385C17.2485 5.198 18.276 5.4905 18.276 5.4905C18.936 7.106 18.495 8.3525 18.4215 8.6465C19.2298 9.52712 19.6756 10.6806 19.6695 11.876C19.6695 16.5005 16.8795 17.4545 14.2395 17.7485C14.679 18.1145 15.0465 18.848 15.0465 19.949V23.252C15.0465 23.546 15.2655 23.912 15.8535 23.84C18.2325 23.0371 20.299 21.5068 21.7609 19.4654C23.2228 17.4241 24.006 14.9748 24 12.464C23.9265 5.858 18.57 0.5 11.964 0.5Z",
          "fill",
          "white",
        ],
        ["id", "clip0_1_1403"],
        [
          "width",
          "24",
          "height",
          "24",
          "fill",
          "white",
          "transform",
          "translate(0 0.5)",
        ],
        [1, "project_idea_details"],
        [1, "project_idea_details_box"],
        [
          "xmlns",
          "http://www.w3.org/2000/svg",
          "width",
          "40",
          "height",
          "40",
          "viewBox",
          "0 0 40 40",
          "fill",
          "none",
        ],
        [
          "d",
          "M26.1833 21.1833C27.8173 19.8978 29.01 18.1349 29.5954 16.1399C30.1808 14.1449 30.1299 12.0171 29.4496 10.0524C28.7694 8.08777 27.4938 6.38397 25.8001 5.17808C24.1065 3.97218 22.0791 3.32416 20 3.32416C17.9209 3.32416 15.8935 3.97218 14.1999 5.17808C12.5062 6.38397 11.2306 8.08777 10.5503 10.0524C9.87013 12.0171 9.81918 14.1449 10.4046 16.1399C10.99 18.1349 12.1827 19.8978 13.8167 21.1833C11.0168 22.3051 8.57381 24.1656 6.74815 26.5665C4.92249 28.9675 3.7826 31.8188 3.44999 34.8167C3.42592 35.0355 3.44519 35.257 3.5067 35.4684C3.56822 35.6798 3.67077 35.8771 3.80851 36.0489C4.08669 36.3958 4.4913 36.618 4.93333 36.6667C5.37536 36.7153 5.81859 36.5863 6.16554 36.3081C6.51248 36.03 6.73471 35.6253 6.78333 35.1833C7.1493 31.9253 8.70281 28.9163 11.147 26.7313C13.5912 24.5463 16.7548 23.3384 20.0333 23.3384C23.3118 23.3384 26.4754 24.5463 28.9196 26.7313C31.3638 28.9163 32.9174 31.9253 33.2833 35.1833C33.3286 35.5929 33.5241 35.9711 33.8318 36.245C34.1396 36.5189 34.538 36.6692 34.95 36.6667H35.1333C35.5702 36.6164 35.9695 36.3955 36.2443 36.0521C36.519 35.7087 36.6469 35.2706 36.6 34.8333C36.2658 31.827 35.1198 28.9683 33.2847 26.5637C31.4497 24.159 28.9949 22.2991 26.1833 21.1833ZM20 20C18.6815 20 17.3925 19.609 16.2962 18.8764C15.1999 18.1439 14.3454 17.1027 13.8408 15.8845C13.3362 14.6664 13.2042 13.3259 13.4614 12.0327C13.7187 10.7395 14.3536 9.55162 15.2859 8.61927C16.2183 7.68692 17.4062 7.05198 18.6994 6.79475C19.9926 6.53751 21.333 6.66954 22.5512 7.17412C23.7694 7.67871 24.8106 8.53319 25.5431 9.62952C26.2757 10.7258 26.6667 12.0148 26.6667 13.3333C26.6667 15.1014 25.9643 16.7971 24.714 18.0474C23.4638 19.2976 21.7681 20 20 20Z",
          "fill",
          "black",
        ],
        [1, "project_idea_details_box_main"],
        [
          "d",
          "M20 37.5C16.5388 37.5 13.1554 36.4737 10.2775 34.5507C7.39967 32.6278 5.15665 29.8947 3.83212 26.697C2.50758 23.4993 2.16102 19.9806 2.83627 16.5859C3.51151 13.1913 5.17822 10.0731 7.62564 7.62564C10.0731 5.17822 13.1913 3.51151 16.5859 2.83627C19.9806 2.16102 23.4993 2.50758 26.697 3.83212C29.8947 5.15665 32.6278 7.39967 34.5507 10.2775C36.4737 13.1554 37.5 16.5388 37.5 20C37.5 24.6413 35.6563 29.0925 32.3744 32.3744C29.0925 35.6563 24.6413 37.5 20 37.5ZM20 5.00001C17.0333 5.00001 14.1332 5.87974 11.6665 7.52796C9.19972 9.17618 7.27713 11.5189 6.14181 14.2598C5.0065 17.0006 4.70945 20.0166 5.28823 22.9264C5.86701 25.8361 7.29562 28.5088 9.39341 30.6066C11.4912 32.7044 14.1639 34.133 17.0737 34.7118C19.9834 35.2906 22.9994 34.9935 25.7403 33.8582C28.4811 32.7229 30.8238 30.8003 32.472 28.3336C34.1203 25.8668 35 22.9667 35 20C35 16.0218 33.4197 12.2065 30.6066 9.39341C27.7936 6.58036 23.9783 5.00001 20 5.00001Z",
          "fill",
          "black",
        ],
        [
          "d",
          "M25.7375 27.5L18.75 20.5125V8.75H21.25V19.475L27.5 25.7375L25.7375 27.5Z",
          "fill",
          "black",
        ],
        [
          "xmlns",
          "http://www.w3.org/2000/svg",
          "width",
          "30",
          "height",
          "30",
          "viewBox",
          "0 0 30 30",
          "fill",
          "none",
        ],
        [
          "d",
          "M5.35718 28.9286V1.07141L24.6429 10.7143L5.35718 20.3571",
          "stroke",
          "black",
          "stroke-width",
          "2",
          "stroke-linecap",
          "round",
          "stroke-linejoin",
          "round",
        ],
        ["clip-path", "url(#clip0_7_1006)"],
        [
          "d",
          "M21 15V12C21 11.4067 21.1759 10.8266 21.5056 10.3333C21.8352 9.83994 22.3038 9.45542 22.8519 9.22836C23.4001 9.0013 24.0033 8.94189 24.5853 9.05764C25.1672 9.1734 25.7018 9.45912 26.1213 9.87868C26.5409 10.2982 26.8266 10.8328 26.9424 11.4147C27.0581 11.9967 26.9987 12.5999 26.7716 13.148C26.5446 13.6962 26.1601 14.1648 25.6667 14.4944C25.1734 14.8241 24.5933 15 24 15H21ZM21 15H15M21 15V4C21 3.20435 20.6839 2.44129 20.1213 1.87868C19.5587 1.31607 18.7956 1 18 1C17.2043 1 16.4413 1.31607 15.8787 1.87868C15.3161 2.44129 15 3.20435 15 4V15M15 15V9M15 15H4C3.20435 15 2.44129 14.6839 1.87868 14.1213C1.31607 13.5587 1 12.7956 1 12C1 11.2043 1.31607 10.4413 1.87868 9.87868C2.44129 9.31607 3.20435 9 4 9H15M15 15H26C26.7956 15 27.5587 15.3161 28.1213 15.8787C28.6839 16.4413 29 17.2043 29 18C29 18.7956 28.6839 19.5587 28.1213 20.1213C27.5587 20.6839 26.7956 21 26 21H15M15 15V21M15 15H9M15 15V26C15 26.7956 14.6839 27.5587 14.1213 28.1213C13.5587 28.6839 12.7956 29 12 29C11.2043 29 10.4413 28.6839 9.87868 28.1213C9.31607 27.5587 9 26.7956 9 26V15M15 9V6C15 5.40666 14.8241 4.82664 14.4944 4.33329C14.1648 3.83994 13.6962 3.45542 13.148 3.22836C12.5999 3.0013 11.9967 2.94189 11.4147 3.05764C10.8328 3.1734 10.2982 3.45912 9.87868 3.87868C9.45912 4.29824 9.1734 4.83279 9.05764 5.41473C8.94189 5.99667 9.0013 6.59987 9.22836 7.14805C9.45542 7.69623 9.83994 8.16476 10.3333 8.49441C10.8266 8.82405 11.4067 9 12 9H15ZM15 21H18C18.5933 21 19.1734 21.1759 19.6667 21.5056C20.1601 21.8352 20.5446 22.3038 20.7716 22.8519C20.9987 23.4001 21.0581 24.0033 20.9424 24.5853C20.8266 25.1672 20.5409 25.7018 20.1213 26.1213C19.7018 26.5409 19.1672 26.8266 18.5853 26.9424C18.0033 27.0581 17.4001 26.9987 16.8519 26.7716C16.3038 26.5446 15.8352 26.1601 15.5056 25.6667C15.1759 25.1734 15 24.5933 15 24V21ZM9 15V18C9 18.5933 8.82405 19.1734 8.49441 19.6667C8.16476 20.1601 7.69623 20.5446 7.14805 20.7716C6.59987 20.9987 5.99667 21.0581 5.41473 20.9424C4.83279 20.8266 4.29824 20.5409 3.87868 20.1213C3.45912 19.7018 3.1734 19.1672 3.05764 18.5853C2.94189 18.0033 3.0013 17.4001 3.22836 16.8519C3.45542 16.3038 3.83994 15.8352 4.33329 15.5056C4.82664 15.1759 5.40666 15 6 15H9Z",
          "stroke",
          "black",
          "stroke-width",
          "2",
        ],
        ["id", "clip0_7_1006"],
        ["width", "30", "height", "30", "fill", "white"],
        [1, "project_idea_main"],
      ],
      template: function (i, o) {
        i & 1 &&
          (h(0, "div", 0)(1, "header"),
          E(2, "img", 1),
          h(3, "h1"),
          m(4, "GSOC 2024"),
          p()(),
          h(5, "div", 2)(6, "h3"),
          m(7, "WebiU 2.0 :- c2siorg/SCoRe Lab website"),
          p(),
          h(8, "a", 3),
          Te(),
          h(9, "svg", 4)(10, "g", 5),
          E(11, "path", 6),
          p(),
          h(12, "defs")(13, "clipPath", 7),
          E(14, "rect", 8),
          p()()(),
          Ae(),
          h(15, "p"),
          m(16, "Contribute"),
          p()()(),
          h(17, "div", 9)(18, "div", 10),
          Te(),
          h(19, "svg", 11),
          E(20, "path", 12),
          p(),
          Ae(),
          h(21, "div", 13)(22, "h3"),
          m(23, "Mentor"),
          p(),
          h(24, "p"),
          m(25, "Mahender Goud Thanda (Maahi10001)"),
          p()()(),
          h(26, "div", 10),
          Te(),
          h(27, "svg", 11),
          E(28, "path", 14)(29, "path", 15),
          p(),
          Ae(),
          h(30, "div", 13)(31, "h3"),
          m(32, "Estimate Project Length"),
          p(),
          h(33, "p"),
          m(34, "350hr"),
          p()()(),
          h(35, "div", 10),
          Te(),
          h(36, "svg", 16),
          E(37, "path", 17),
          p(),
          Ae(),
          h(38, "div", 13)(39, "h3"),
          m(40, "Difficulty"),
          p(),
          h(41, "p"),
          m(42, "Medium"),
          p()()(),
          h(43, "div", 10),
          Te(),
          h(44, "svg", 16)(45, "g", 18),
          E(46, "path", 19),
          p(),
          h(47, "defs")(48, "clipPath", 20),
          E(49, "rect", 21),
          p()()(),
          Ae(),
          h(50, "div", 13)(51, "h3"),
          m(52, "Slack channel"),
          p(),
          h(53, "p"),
          m(54, "Webiu"),
          p()()()(),
          h(55, "div", 22)(56, "h4"),
          m(57, "Brief explanation"),
          p(),
          h(58, "p"),
          m(
            59,
            " The proposed project aims to create a dynamic organization website that automatically fetches project information from GitHub repositories. This eliminates the need for manual data entry, ensuring real-time updates on the organization's website whenever a new repository is created or existing is updated. The website will also feature a configurable project template that provides essential details such as project title, description, technology stack, live demo availability, and more. "
          ),
          p(),
          h(60, "ul")(61, "li"),
          m(
            62,
            " Admin Controls: Create an admin control panel to manage the display of projects on the website. This includes the ability to show/hide specific projects and modify their display settings. "
          ),
          p(),
          h(63, "li"),
          m(
            64,
            " Backend Integration: Choose a backend solution (e.g., AWS, MongoDB) to store and manage additional data, such as admin configurations and website settings. "
          ),
          p(),
          h(65, "li"),
          m(
            66,
            " Documentation: Improve and maintain documentation related to the development areas, ensuring clarity for future contributors. "
          ),
          p()()(),
          h(67, "div", 22)(68, "h4"),
          m(69, "Expected Results"),
          p(),
          h(70, "p"),
          m(
            71,
            " By the end of the project, the dynamic organization website should seamlessly integrate with GitHub repositories, displaying accurate and up-to-date information. The website's configurable project template will allow administrators to control which projects are showcased on the site, providing flexibility and customization options "
          ),
          p()(),
          h(72, "div", 22)(73, "h4"),
          m(74, "Knowledge Prerequisites"),
          p(),
          h(75, "p"),
          m(
            76,
            " Proficiency in Angular, TypeScript, and JavaScript is essential for this project. Familiarity with backend technologies like AWS or MongoDB is beneficial. Additionally, understanding GitHub API and web development concepts will be advantageous. "
          ),
          p()()());
      },
      styles: [
        ".project__idea[_ngcontent-%COMP%]{max-width:1000px;margin:50px auto;padding:0 20px}.project__idea[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]{display:flex;gap:20px;align-items:center}.project__idea[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100px;height:100px}.project__idea[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:48px;font-weight:500;line-height:150%}.project__idea[_ngcontent-%COMP%]   .project_idea_title[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.project__idea[_ngcontent-%COMP%]   .project_idea_title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:18px;font-weight:500;line-height:150%}.project__idea[_ngcontent-%COMP%]   .project_idea_title[_ngcontent-%COMP%]   .git-btn[_ngcontent-%COMP%]{display:flex;padding:5px 8px;justify-content:center;align-items:center;gap:10px;border-radius:4px;background:var(--Green-1, #219653)}.project__idea[_ngcontent-%COMP%]   .project_idea_title[_ngcontent-%COMP%]   .git-btn[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--primary-white, #fff);font-size:14px;font-weight:400;line-height:150%;text-decoration:none}.project__idea[_ngcontent-%COMP%]   .project_idea_details[_ngcontent-%COMP%]{margin:30px 0;display:flex;flex-wrap:wrap;gap:20px;justify-content:space-between;align-items:center}.project__idea[_ngcontent-%COMP%]   .project_idea_details[_ngcontent-%COMP%]   .project_idea_details_box[_ngcontent-%COMP%]{display:flex;padding:10px 14px;justify-content:center;align-items:center;gap:15px;max-width:280px;border-radius:5px;background:#fff;box-shadow:0 4px 24px #0000001a}.project__idea[_ngcontent-%COMP%]   .project_idea_details[_ngcontent-%COMP%]   .project_idea_details_box[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{color:var(--primary-dark, var(--primary-dark, #0a0a15));font-size:16px;font-weight:500;line-height:150%}.project__idea[_ngcontent-%COMP%]   .project_idea_details[_ngcontent-%COMP%]   .project_idea_details_box[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;font-weight:400;line-height:150%}.project__idea[_ngcontent-%COMP%]   .project_idea_main[_ngcontent-%COMP%]{display:flex;padding:10px 14px;flex-direction:column;align-items:flex-start;gap:5px;border-radius:5px;background:#fff;box-shadow:0 4px 24px #0000001a;margin-bottom:30px}.project__idea[_ngcontent-%COMP%]   .project_idea_main[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-weight:500}.project__idea[_ngcontent-%COMP%]   .project_idea_main[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;font-weight:400;line-height:150%}.project__idea[_ngcontent-%COMP%]   .project_idea_main[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin-left:30px}",
      ],
    }));
  let t = e;
  return t;
})();
var Hg = [
  { path: "", component: rg },
  { path: "projects", component: og },
  { path: "publications", component: cg },
  { path: "contributors", component: jg },
  { path: "community", component: Ug },
  { path: "gsoc", component: Bg },
  { path: "idea", component: $g },
];
var zg = { providers: [Yp(Hg)] };
var Gg = (() => {
  let e = class e {
    constructor() {
      this.title = "webiu";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = W({
      type: e,
      selectors: [["app-root"]],
      standalone: !0,
      features: [q],
      decls: 2,
      vars: 0,
      template: function (i, o) {
        i & 1 && E(0, "app-navbar")(1, "router-outlet");
      },
      dependencies: [Ms, Yu, tg],
      styles: [".main[_ngcontent-%COMP%]{width:80%;margin:0 auto}"],
    }));
  let t = e;
  return t;
})();
sp(Gg, zg).catch((t) => console.error(t));
