
function createFactory (createName) {
  const fnName = createName()
  const fn = this[fnName]
  if (typeof fn === 'function') return fn.bind(this)
  else throw new Error(`${fnName} not defined`)
}

class NodeTypes {
  constructor () {
    return ['default', 'start', 'special', 'light', 'danger', 'deleted']
  }
}

class LinkTypes {
  constructor () {
    return ['default', 'danger']
  }
}

class Options {
  constructor ({
    outerWidth = 900,
    paddingTop = 20,
    paddingLeft = 20,
    paddingRight = 20,
    paddingBottom = 20,
    nodeWidth = 70,
    nodeHeight = 70,
    nodeSep = 20,
    rowSep = 50,
    layoutDirection = 'LR-RL'
  }) {
    const innerWidth = outerWidth - paddingLeft - paddingRight
    const nodeNumInRow = Math.floor((innerWidth - nodeSep) / (nodeWidth + nodeSep))
    this.options = {
      outerWidth,
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom,
      nodeWidth,
      nodeHeight,
      nodeSep,
      rowSep,
      innerWidth,
      nodeNumInRow,
      layoutDirection
    }
    this.nodeTypes = new NodeTypes()
    this.linkTypes = new LinkTypes()
  }
}

class BoundingBox {
  constructor ({ x = 0, y = 0, w = 0, h = 0 }) {
    this._x = x
    this._y = y
    this._w = w
    this._h = h
    this._xListeners = []
    this._yListeners = []
    this._wListeners = []
    this._hListeners = []
    this._xListener = v => this._xListeners.forEach(fn => fn(v))
    this._yListener = v => this._yListeners.forEach(fn => fn(v))
    this._wListener = v => this._wListeners.forEach(fn => fn(v))
    this._hListener = v => this._hListeners.forEach(fn => fn(v))
  }

  get x () {
    return this._x
  }

  set x (v) {
    this._x = v
    this._xListener(v)
  }

  get y () {
    return this._y
  }

  set y (v) {
    this._y = v
    this._yListener(v)
  }

  get w () {
    return this._w
  }

  set w (v) {
    this._w = v
    this._wListener(v)
  }

  get h () {
    return this._h
  }
  set h (v) {
    this._h = v
    this._hListener(v)
  }

  addXListner (...args) {
    args.forEach(listener => this._xListeners.push(listener))
  }
  addYListner (...args) {
    args.forEach(listener => this._yListeners.push(listener))
  }
  addWListner (...args) {
    args.forEach(listener => this._wListeners.push(listener))
  }
  addHListner (...args) {
    args.forEach(listener => this._hListeners.push(listener))
  }
}

class Point {
  constructor (...args) {
    if (args.length === 1) this.setPointBy1Arg(...args)
    else this.setPointByAry(args)
  }
  setPointBy1Arg (arg) {
    if (typeof arg === 'string') this.setPointByAry(arg.split(','))
    else if (Array.isArray(arg)) this.setPointByAry(arg)
    else if (typeof arg === 'object') this.setPointByObj(arg)
    else this.setPointByAry([0, 0])
  }
  setPointByAry ([x = 0, y = 0]) {
    this._x = x * 1
    this._y = y * 1
  }
  setPointByObj ({ x = 0, y = 0 }) {
    this._x = x * 1
    this._y = y * 1
  }
  get x () {
    return this._x
  }

  get y () {
    return this._y
  }

  toString (sep = ',') {
    return `${this.x}${sep}${this.y}`
  }

  panning (x = 0, y = 0) {
    this._x += x * 1
    this._y += y * 1
    return this
  }

  translate (x = 1, y = 1) {
    this._x *= x
    this._y *= y
    return this
  }

  call (fn) {
    this._x = fn(this._x)
    this._y = fn(this._y)
    return this
  }

  round () {
    return this.call(Math.round)
  }

  panningRound (...args) {
    return this.panning(...args).call(Math.round)
  }

  translateRound (...args) {
    return this.translate(...args).call(Math.round)
  }
}

class Line {
  constructor ({ x1 = 0, y1 = 0, x2 = 0, y2 = 0, strokeDasharray = '' }) {
    this.name = 'line'
    this._x1 = x1
    this._y1 = y1
    this._x2 = x2
    this._y2 = y2
    this._strokeDasharray = strokeDasharray

    this._x1Listeners = []
    this._y1Listeners = []
    this._x2Listeners = []
    this._y2Listeners = []
    this._x1Listener = v => this._x1Listeners.forEach(fn => fn(v))
    this._y1Listener = v => this._y1Listeners.forEach(fn => fn(v))
    this._x2Listener = v => this._x2Listeners.forEach(fn => fn(v))
    this._y2Listener = v => this._y2Listeners.forEach(fn => fn(v))
  }

  get x1 () {
    return this._x1
  }

  set x1 (v) {
    this._x1 = v
    this._x1Listener(v)
  }

  get y1 () {
    return this._y1
  }

  set y1 (v) {
    this._y1 = v
    this._y1Listener(v)
  }

  get x2 () {
    return this._x2
  }

  set x2 (v) {
    this._x2 = v
    this._x2Listener(v)
  }

  get y2 () {
    return this._y2
  }
  set y2 (v) {
    this._y2 = v
    this._y2Listener(v)
  }

  get strokeDasharray () {
    return this._strokeDasharray
  }

  addX1Listner (...args) {
    args.forEach(listener => this._x1Listeners.push(listener))
  }
  addY1Listner (...args) {
    args.forEach(listener => this._y1Listeners.push(listener))
  }
  addX2Listner (...args) {
    args.forEach(listener => this._x2Listeners.push(listener))
  }
  addy2Listner (...args) {
    args.forEach(listener => this._y2Listeners.push(listener))
  }
}

class Path {
  constructor ({ d = '', strokeDasharray = '' }) {
    this.name = 'path'
    this._d = d
    this._strokeDasharray = strokeDasharray

    this._dListeners = []
    this._dListener = v => this._dListeners.forEach(fn => fn(v))
  }

  get d () {
    return this._d
  }

  get strokeDasharray () {
    return this._strokeDasharray
  }

  set d (v) {
    this._d = v
    this._dListener(v)
  }

  addDListner (...args) {
    args.forEach(listener => this._dListeners.push(listener))
  }
}

class Rectangle extends BoundingBox {
  constructor ({ ...args } = {}) {
    super({ ...args })
    this.name = 'rectangle'
  }
}

class Square extends Rectangle {
  constructor ({ l = 0, ...args } = {}) {
    super({ ...args, w: l, h: l })
    this.name = 'square'
  }
}

class Circle extends BoundingBox {
  constructor ({ r = 0, ...args } = {}) {
    super({ ...args })
    this.name = 'circle'
    this._cx = this.computeCx()
    this._cy = this.computeCy()

    this.addXListner(this.computeCx.bind(this))
    this.addYListner(this.computeCy.bind(this))
    this.addWListner(this.computeCx.bind(this))
    this.addHListner(this.computeCy.bind(this))

    this._r = r
    this.rListeners = []
    this._rListener = v => this._rListeners.forEach(fn => fn(v))
  }
  computeCx () {
    this._cx = this.x + this.w / 2
    return this._cx
  }
  computeCy () {
    this._cy = this.y + this.h / 2
    return this._cy
  }
  get cx () {
    return this._cx
  }
  get cy () {
    return this._cy
  }
  get r () {
    return this._r
  }
  set r (v) {
    this._r = v
    this.rListener(v)
  }
  addRListner (...args) {
    args.forEach(listener => this._rListeners.push(listener))
  }
}

class Polygon extends BoundingBox {
  constructor ({ p = '', ...args } = {}) {
    super({ ...args })
    this.name = 'polygon'
    this._p = p
    this.computeP()

    this.addXListner(this.computeP.bind(this))
    this.addYListner(this.computeP.bind(this))
    this.addWListner(this.computeP.bind(this))
    this.addHListner(this.computeP.bind(this))
  }

  computeP () {
    const points = this._p.split(' ').map(p => new Point(p))
    const xMax = Math.max.apply(Math, points.map(p => p._x))
    const xMin = Math.min.apply(Math, points.map(p => p._x))
    const yMax = Math.max.apply(Math, points.map(p => p._y))
    const yMin = Math.min.apply(Math, points.map(p => p._y))
    const xLength = xMax - xMin
    const yLength = yMax - yMin
    const max = (xLength > yLength) ? xLength : yLength
    const scaleX = this._w / max
    const scaleY = this._h / max
    points.forEach(p => {
      p.panning(-xMin, -yMin)
        .translateRound(scaleX, scaleY)
        .panning(this._w / 2 - xLength * scaleX / 2, 0)
        .panning(this._x, this._y)
        .round()
    })
    this._p = points.map(p => p.toString()).join(' ')
    return this._p
  }

  get p () {
    return this._p
  }

  set p (v) {
    this._p = v
  }
}

class Diamond extends Polygon {
  constructor ({ ...args }) {
    super({ ...args })
    this.name = 'diamond'
    this.p = this.computeP()
    this.addXListner(this.computeP.bind(this))
    this.addYListner(this.computeP.bind(this))
    this.addWListner(this.computeP.bind(this))
    this.addHListner(this.computeP.bind(this))
  }
  computeP () {
    const p1 = new Point(0, this.w / 2).panning(this.x, this.y)
    const p2 = new Point(this.h / 2, 0).panning(this.x, this.y)
    const p3 = new Point(this.h, this.w / 2).panning(this.x, this.y)
    const p4 = new Point(this.w / 2, this.h).panning(this.x, this.y)
    this._p = `${p1.toString()} ${p2.toString()} ${p3.toString()} ${p4.toString()}`
    return this._p
  }
}
class Tspan {
  constructor ({ t = '', x = 0, dy = 12 }) {
    this._t = t
    this._x = x
    this._dy = dy
  }

  get t () {
    return this._t
  }

  get x () {
    return this._x
  }

  get dy () {
    return this._dy
  }
}

class Text {
  constructor (shape, {
    t = '',
    verticalAlign = 'middle',
    horizontalAlign = 'middle',
    textAnchor = 'middle',
    alignmentBaseline = 'middle',
    fontSize = 12,
    dy = 15,
    paddingTop = 4,
    paddingLeft = 4,
    paddingRight = 4,
    paddingBottom = 4
  }) {
    this._shape = shape
    this._t = t
    this._verticalAlign = verticalAlign // start, middle, end
    this._horizontalAlign = horizontalAlign // start, middle, end
    this._textAnchor = textAnchor // start, middle, end
    this._alignmentBaseline = alignmentBaseline // hanging, middle, baseline, ...
    this._fontSize = fontSize
    this._dy = dy
    this._paddingTop = paddingTop
    this._paddingLeft = paddingLeft
    this._paddingRight = paddingRight
    this._paddingBottom = paddingBottom
    this._tspans = []
    this._splitText = []
    this._x = 0
    this._y = 0
    this._innerWidth = 0
    this._innerHeight = 0
    this.reset()

    this._shape.addXListner(this.reset.bind(this))
    this._shape.addYListner(this.reset.bind(this))
    this._shape.addWListner(this.reset.bind(this))
    this._shape.addHListner(this.reset.bind(this))
  }

  reset () {
    return this
      .computePosition()
      .setSplitText()
      .setTspans()
  }
  setTspans () {
    const x = this._x
    const dy = this._dy
    this._tspans = this._splitText.map(t => new Tspan({ t, x, dy }))
    return this
  }

  setSplitText () {
    this._splitText = this.splitText(this._t)
    return this
  }

  splitText (t) {
    const max = Math.floor(this._innerWidth / (this._fontSize + 1))
    const re = new RegExp(`.{1,${max}}`, 'g')
    return t.match(re)
  }

  computePosition () {
    this._innerWidth = this.computeInnerWidth()
    this._innerHeight = this.computeInnerHeight()
    this._x = this.computeX()
    this._y = this.computeY()
    return this
  }

  computeInnerWidth () {
    return this._shape.w - this._paddingLeft - this._paddingRight
  }

  computeInnerHeight () {
    return this._shape.h - this._paddingTop - this._paddingBottom
  }

  computeX (...args) {
    return this.factoryComputeX(this.verticalAlign)(...args)
  }

  factoryComputeX (type) {
    return createFactory.call(this, () => 'productComputeXAlign' + type.replace(/( |^)[a-z]/, L => L.toUpperCase()))
  }

  productComputeXAlignMiddle () {
    return this._shape.x + (this._innerWidth / 2) + this._paddingLeft
  }

  computeY (...args) {
    return this.factoryComputeY(this.horizontalAlign)(...args)
  }

  factoryComputeY (type) {
    return createFactory.call(this, () => 'productComputeYAlign' + type.replace(/( |^)[a-z]/, L => L.toUpperCase()))
  }

  productComputeYAlignMiddle () {
    return this._shape.y + (this._innerHeight / 2) - this._splitText.length * this._dy / 2 + this._paddingTop
  }

  get t () {
    return this._t
  }

  get tspans () {
    return this._tspans
  }

  get x () {
    return this._x
  }

  get y () {
    return this._y
  }

  get textAnchor () {
    return this._textAnchor
  }

  get alignmentBaseline () {
    return this._alignmentBaseline
  }

  get verticalAlign () {
    return this._verticalAlign
  }

  get horizontalAlign () {
    return this._horizontalAlign
  }

  get fontSize () {
    return this._fontSize
  }

  get dy () {
    return this._dy
  }
}

const textMixin = Base => class extends Base {
  createText (shape, t) {
    return new Text(shape, { t })
  }
}

class Contactor {
  constructor (shape) {
    this._shape = shape
    this._splitNum = 1
    this._shape.addXListner(this.computePoints.bind(this))
    this._shape.addYListner(this.computePoints.bind(this))
    this._shape.addWListner(this.computePoints.bind(this))
    this._shape.addHListner(this.computePoints.bind(this))
    this._data = this.computePoints()
  }

  get data () {
    return this._data
  }

  computePoints () {
    const shape = this._shape
    const calcPoints = this.fnCalcPoints()
    const vertices = [
      new Point(shape.x, shape.y),
      new Point(shape.x + shape.w, shape.y),
      new Point(shape.x, shape.y + shape.h),
      new Point(shape.x + shape.w, shape.y + shape.h)
    ]
    const points = vertices.reduce((accu, curr, index, ary) => {
      if (!index) return accu
      const a = ary[index - 1]
      const c = ary.slice(index, ary.length)

      const res = c.reduce((accumulator, current) => {
        const points = calcPoints(a, current)
        return accumulator.concat(points)
      }, [])
      return accu.concat(res)
    }, [])
    const pointsSet = Array.from(points.reduce((m, t) => m.set(t.toString(), t), new Map()).values())
    this._data = pointsSet
    return pointsSet
  }

  fnCalcPoints () {
    const splitNum = this._splitNum
    return (a, b) => {
      return [...Array(splitNum)].map((n, i) => {
        const denominator = i + 2
        return new Point([
          a.x + (b.x - a.x) / denominator,
          a.y + (b.y - a.y) / denominator
        ])
      })
    }
  }
}

const contactorMixin = Base => class extends Base {
  createContactor (shape) {
    return new Contactor(shape)
  }
}
const shapeMixin = Base => class extends Base {
  createShape (type = undefined, props = {}) {
    return this.factoryCreateShape(type)(props)
  }

  factoryCreateShape (type) {
    return createFactory.call(this, () => 'productCreateShape' + type.replace(/( |^)[a-z]/, L => L.toUpperCase()))
  }

  productCreateShapeSquare ({ l = this.options.nodeWidth, ...props }) {
    return new Square({ l, ...props })
  }

  productCreateShapeRectangle ({ w = this.options.nodeWidth, h = this.options.nodeHeight, ...props }) {
    return new Rectangle({ w, h, ...props })
  }

  productCreateShapeCircle ({ r = this.options.nodeWidth / 2, ...props }) {
    return new Circle({ r, w: this.options.nodeWidth, h: this.options.nodeHeight, ...props })
  }

  productCreateShapePolygon ({ p = '', ...props }) {
    return new Polygon({ p, w: this.options.nodeWidth, h: this.options.nodeHeight, ...props })
  }

  productCreateShapeDiamond ({ p = '', ...props }) {
    return new Diamond({ p, w: this.options.nodeWidth, h: this.options.nodeHeight, ...props })
  }

  productCreateShapeLine ({ x1 = 0, y1 = 0, x2 = 0, y2 = 0, ...props }) {
    return new Line({ x1, y1, x2, y2, ...props })
  }

  productCreateShapePath ({ d = '', ...props }) {
    return new Path({ d, ...props })
  }

  productCreateShapeDashedPath ({ d = '', strokeDasharray = '4,4', ...props }) {
    return new Path({ d, strokeDasharray, ...props })
  }
}

const layoutMixin = Base => class extends Base {
  computePositionX (index) {
    const colIndex = this.computeColIndex(index)
    return colIndex * (this.options.nodeWidth + this.options.nodeSep) + this.options.nodeSep
  }

  computePositionY (index) {
    const rowIndex = this.computeRowIndex(index)
    return rowIndex * (this.options.nodeHeight + this.options.rowSep)
  }

  computeColIndex (index) {
    return this.factoryComputeColIndex(this.options.layoutDirection)(index)
  }

  computeRowIndex (index) {
    return Math.floor(index / this.options.nodeNumInRow)
  }

  factoryComputeColIndex (layoutDirection) {
    return createFactory.call(this, () => 'productComputeColIndexBy' + layoutDirection.replace(/-/, ''))
  }

  productComputeColIndexByLR (index) {
    return index % this.options.nodeNumInRow
  }

  productComputeColIndexByLRRL (index) {
    const rowIndex = this.computeRowIndex(index)
    if (!(rowIndex % 2)) return index % this.options.nodeNumInRow
    else return this.options.nodeNumInRow - index % this.options.nodeNumInRow - 1
  }
}

class Node {
  constructor (props) {
    Object.keys(props).forEach(key => (this[key] = props[key]))
    this._colIndex = null
    this._rowIndex = null
  }

  get colIndex () {
    return this._colIndex
  }

  set colIndex (v) {
    this._colIndex = v
  }

  get rowIndex () {
    return this._rowIndex
  }

  set rowIndex (v) {
    this._rowIndex = v
  }
}

class Nodes extends layoutMixin(contactorMixin(textMixin(shapeMixin(Options)))) {
  constructor (options = {}) {
    super(options)
    this._data = []
  }

  get data () {
    return this._data
  }

  addNode (n) {
    const id = this._data.length
    const shape = this.createShape(n.shape)
    const contactor = this.createContactor(shape)
    const text = this.createText(shape, n.label)
    const node = new Node(Object.assign({}, n, { id, shape, contactor, text }))
    this._data.push(node)
    return this
  }

  addNodes (nodes) {
    nodes.forEach(node => {
      this.addNode(node)
    })
    return this
  }

  setPosition () {
    this._data.forEach((node, index) => {
      node.colIndex = this.computeColIndex(index)
      node.rowIndex = this.computeRowIndex(index)
      node.shape.x = this.computePositionX(index)
      node.shape.y = this.computePositionY(index)
      return node
    })
    return this
  }
}

class Link {
  constructor (props) {
    Object.keys(props).forEach(key => (this[key] = props[key]))
  }
}

class Links extends shapeMixin(Options) {
  constructor (options = {}) {
    super(options)
    this._data = []
  }

  get data () {
    return this._data
  }

  addLink (link) {
    const id = this._data.length
    const shape = this.createShape(link.shape)
    this._data.push(new Link(Object.assign({}, link, { id, shape })))
    return this
  }

  addLinks (links) {
    links.forEach(link => {
      this.addLink(link)
    })
    return this
  }

  setPosition (nodes) {
    this._data.forEach((link, index) => {
      const from = link.from
      const to = link.to
      const shortcut = this.findShortcut(nodes[from].contactor.data, nodes[to].contactor.data)

      if (link.arrow === 'end') {
        // hot code to move for arrow
        const size = 6
        const directionX = Math.sign(shortcut[0].x - shortcut[1].x)
        const directionY = Math.sign(shortcut[0].y - shortcut[1].y)
        const panningX = directionX * size
        const panningY = directionY * size
        shortcut[1].panning(panningX, panningY)
      }
      if (link.arrow === 'start') {
        // hot code to move for arrow
        const size = 6
        const directionX = Math.sign(shortcut[0].x - shortcut[1].x) * -1
        const directionY = Math.sign(shortcut[0].y - shortcut[1].y)
        const panningX = directionX * size
        const panningY = directionY * size
        shortcut[0].panning(panningX, panningY)
      }

      if (link.shape.name === 'line') {
        link.shape.x1 = shortcut[0].x
        link.shape.y1 = shortcut[0].y
        link.shape.x2 = shortcut[1].x
        link.shape.y2 = shortcut[1].y
      }

      if (link.shape.name === 'path') {
        const mid = new Point([
          shortcut[0].x + (shortcut[1].x - shortcut[0].x) / 2,
          shortcut[0].y + (shortcut[1].y - shortcut[0].y) / 2
        ])
        link.shape.p = `M${shortcut[0].toString()} L${mid.toString()} L${shortcut[1].toString()}`
      }
    })
    return this
  }

  findShortcut (c1, c2) {
    const res = c1.reduce((accu1, curr1) => {
      return c2.reduce((accu2, curr2) => {
        if (!accu2) return [curr1, curr2]
        const left = this.calcVectorDistance(accu2[0], accu2[1])
        const right = this.calcVectorDistance(curr1, curr2)
        return (left < right) ? accu2 : [curr1, curr2]
      }, accu1)
    }, null)
    return res.map(point => new Point(point.x, point.y))
  }

  calcVectorDistance (p1, p2) {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2))
  }
}

class Marker {
  constructor (props) {
    Object.keys(props).forEach(key => (this[key] = props[key]))
  }
}

class Markers extends Options {
  constructor (...args) {
    super(...args)
    this._data = new Map()
    this._defaultMarkers = [
      {
        name: 'triangle',
        refX: 3,
        refY: 3,
        markerWidth: 15,
        markerHeight: 15,
        orient: 'auto',
        tag: {
          name: 'path',
          d: 'M0 0 6 3 0 6'
        }
      }
    ]
    let markers = []
    markers = markers.concat(this.multiplyWithTypes(this._defaultMarkers, this.nodeTypes, 'node'))
    markers = markers.concat(this.multiplyWithTypes(this._defaultMarkers, this.linkTypes, 'link'))
    markers.forEach(obj => {
      this.add(obj.id, Object.assign({}, obj))
    })
  }

  get data () {
    return [...this._data.values()]
  }

  add (id, obj) {
    this._data.set(obj.id, new Marker(obj))
    return this
  }

  multiplyWithTypes (markers, types, prefix) {
    return markers.reduce((accu, { name, ...props }) => {
      return accu.concat(types.map(type => {
        return {
          id: `${prefix}-${name}-${type}`,
          classList: `${prefix} ${name} ${type}`,
          type,
          prefix,
          name,
          ...props
        }
      }))
    }, [])
  }
}

class Dagre extends Options {
  constructor (options = {}) {
    super(options)
    this._nodes = new Nodes(options)
    this._links = new Links(options)
    this._markers = new Markers(options)
  }

  get nodes () {
    return this._nodes
  }

  get links () {
    return this._links
  }

  get markers () {
    return this._markers
  }

  getSize () {
    const rowNum = this._nodes.data[this._nodes.data.length - 1].rowIndex + 1
    const w = this.options.outerWidth
    const h = this.options.paddingTop + this.options.paddingBottom + (this.options.nodeHeight * rowNum) + (this.options.rowSep * (rowNum - 1))
    return [w, h]
  }
}

export {
  Dagre,
  Line,
  Path,
  Rectangle,
  Square,
  Circle,
  Polygon,
  Point
}
