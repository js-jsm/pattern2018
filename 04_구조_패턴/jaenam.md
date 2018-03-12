## Adapter pattern

[es6 design patterns](http://loredanacirstea.github.io/es6-design-patterns)

```js
class Duck {
  quack () {
    console.log('꽥')
  }
  fly () {
    console.log("나는듯 안나는듯 날고있어!")
  }
}
class Sparrow {
  twitter () {
    console.log('짹짹')
  }
  fly () {
    console.log('누구보다 가볍게 남들보다 빠르게 날아가는 바람위의 나그네!')
  }
}

class SparrowDuckAdapter {
  constructor (sparrow) {
    this.sparrow = sparrow
  }
  quack () {
    return this.sparrow.twitter()
  }
  fly () {
    return this.sparrow.fly()
  }
}

const duck = new Duck()
const sparrow = new SparrowDuckAdapter(new Sparrow())

duck.quack()
duck.fly()
sparrow.quack()
sparrow.fly()
```

## Bridge pattern

```js
class AbstractDrawingAPI {
  drawCircle (x, y, r) { }
}
class DrawingAPI1 extends AbstractDrawingAPI {
  drawCircle (x, y, r) {
    console.log(`API1.circle at ${x}:${y} radius ${r}`);
  }
}
class DrawingAPI2 extends AbstractDrawingAPI {
  drawCircle (x, y, r) {
    console.log(`API2.circle at ${x}:${y} radius ${r}`);
  }
}

class Shape {
  draw () { }
  resizeByPercentage (pct) { }
}
class CircleShape extends Shape {
  constructor (x, y, r, drawingAPI) {
    super();
    this.x = x
    this.y = y
    this.radius = r
    this.drawingAPI = drawingAPI
  }
  draw () {
    this.drawingAPI.drawCircle(this.x, this.y, this.radius)
  }
  resizeByPercentage (pct) {
    this.radius *= pct
  }
}
const shapes = [
  new CircleShape(1, 2, 3, new DrawingAPI1()),
  new CircleShape(5, 7, 11, new DrawingAPI2()),
]
shapes.forEach(shape => {
  shape.draw()
})
shapes.forEach(shape => {
  shape.resizeByPercentage(2.5)
  shape.draw()
})
```

## Composite pattern

```js
class Graphic {
  print () { }
}
class CompositeGraphic extends Graphic {
  constructor () {
    super()
    this.childGraphics = new Set()
  }
  print () {
    this.childGraphics.forEach(graphic => { graphic.print() })
  }
  add (graphic) {
    this.childGraphics.add(graphic)
  }
  remove (graphic) {
    this.childGraphics.delete(graphic)
  }
}
class Ellipse extends Graphic {
  print () {
    console.log('Ellipse')
  }
}
const ellipse1 = new Ellipse()
const ellipse2 = new Ellipse()
const ellipse3 = new Ellipse()
const ellipse4 = new Ellipse()
const graphic1 = new CompositeGraphic()
const graphic2 = new CompositeGraphic()
const graphic3 = new CompositeGraphic()

graphic2.add(ellipse1)
graphic2.add(ellipse2)
graphic2.add(ellipse3)
graphic3.add(ellipse4)

graphic1.add(graphic2)
graphic1.add(graphic3)

graphic1.print()
```

## Decorator pattern

```js
class Component {
  Operation () {}
}
class ConcreteComponent extends Component {
  constructor () {
    super()
    console.log('ConcreteComponent created')
  }
  Operation () {
    console.log('component operation')
  }
}
class Decorator extends Component {
  constructor (component) {
    super()
    this.component = component
    console.log('Decorator created')
  }
  Operation () {
    this.component.Operation()
  }
}

class ConcreteDecoratorA extends Decorator {
  constructor (component, sign) {
    super(component)
    this.addedState = sign
    console.log('ConcreteDecoratorA created')
  }
  Operation () {
    super.Operation()
    console.log(this.addedState)
  }
}
class ConcreteDecoratorB extends Decorator {
  constructor (component, sign) {
    super(component)
    this.addedState = sign
    console.log('ConcreteDecoratorB created')
  }
  Operation () {
    super.Operation()
    console.log(this.addedState)
  }
  AddedBehavior () {
    this.Operation()
    console.log('decoratorB addedBehavior')
  }
}

const component = new ConcreteComponent()
const decoratorA = new ConcreteDecoratorA(component, 'decoratorA added sign')
const decoratorB = new ConcreteDecoratorB(component, 'decoratorB added sign')
component.Operation()
decoratorA.Operation()
decoratorB.AddedBehavior()
```

## Facade pattern

```js
class CPU {
  freeze () {}
  jump (position) {}
  execute () {}
}
class Memory {
  load (position, data) {}
}
class HardDrive {
  read (lba, size) {}
}

class FacadeComputer {
  startComputer () {
    const cpu = new CPU()
    const memory = new Memory()
    const hard = new HardDrive()
    cpu.freeze()
    memory.load(BOOT_ADDRESS, hard.read(BOOT_SECTOR, SECTOR_SIZE))
    cpu.jump(BOOT_ADDRESS)
    cpu.execute()
  }
}

const computer = new FacadeComputer()
computer.startComputer()
```

```js
class PatternTest {
  constructor () {
    this.htmlid = null
    this.log("PatternTest class created")
  }
  log (text) {
    if(this.htmlid === null){
      console.log(text)
    } else{
      document.getElementById(this.htmlid).innerHTML += text+'</br>'
    }
  }
  init (id) {
    this.htmlid = id
    document.body.innerHTML += `<div id="${id}"></div>`
  }
  test (dp) {
    if(this[dp]) {
      this[dp]()
    } else {
      this.log('nothing to test')
    }
  }

  Facade () {
    this.init('test_Facade')
    this.log("This is the Facade")
  }
  AbstractFactory () {
    this.init('test_AbstractFactory')
    this.log("This is the Abstact Factory")
  }
  Builder () {
    this.init('test_Builder')
    this.log("This is the Builder")
  }
  Factory () {
    this.init('test_Factory')
    this.log("This is the Factory")
  }
}
const test = new PatternTest()
test.test('Facade')
test.test('AbstractFactory')
```


## Flyweight

```js
const FontData = (() => {
  const KEY = Symbol('key')
  const flyweightData = new Map()

  class Font {
    constructor (key) {
      this[KEY] = key
    }
    getData () {
      return flyweightData.get(this[KEY])
    }
  }
  return class {
    constructor (pointSize, fontFace, color) {
      this.pointSize = pointSize
      this.fontFace = fontFace
      this.color = color
    }
    buildKey () {
      return `${this.pointSize}_${this.fontFace}_${this.color}`
    }
    static create (pointSize, fontFace, color) {
      const fontData = new FontData(pointSize, fontFace, color)
      const key = fontData.buildKey()
      if(flyweightData.has(key)) {
        flyweightData.get(key)
      } else {
        flyweightData.set(key, fontData)
      }
      return new Font(key)
    }
    static getFontList () {
      return [...flyweightData]
    }
  }
})()

const fontA = FontData.create(15, 'Nanum Gothic', 'black')
const fontB = FontData.create(13, 'Nanum Gothic', 'black')
const fontC = FontData.create(12, 'Nanum Myungjo', 'white')
const fontD = FontData.create(13, 'Nanum Gothic', 'black')
const fontE = FontData.create(12, 'Nanum Myungjo', 'red')
const fontF = FontData.create(15, 'Nanum Gothic', 'black')

console.log(fontA, fontB, fontC, fontD, fontE, fontF)
console.log(FontData.getFontList())
console.log(fontA.getData())
console.log(fontB.getData())
```

## Proxy pattern

```js
class RealImage {
  constructor (filename) {
    this.filename = filename
    this.loadImageFromDisk()
  }
  loadImageFromDisk () {
    console.log(`Loading ${this.filename}`)
  }
  displayImage () {
    console.log(`Displaying ${this.filename}`)
  }
}

class ProxyImage {
  constructor (filename) {
    this.filename = filename
  }
  displayImage () {
    const image = new RealImage(this.filename)
    image.displayImage()
  }
}
const img1 = new ProxyImage('HiRes_10MB_Photo1.png')
const img2 = new ProxyImage('HiRes_30MB_Photo2.png')
img1.displayImage()
img2.displayImage()
```
