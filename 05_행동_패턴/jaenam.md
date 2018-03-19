# CH5. 행동패턴

## 1. Chain of responsibility

// https://ko.wikipedia.org/wiki/%EC%B1%85%EC%9E%84_%EC%97%B0%EC%87%84_%ED%8C%A8%ED%84%B4

```js
const Allowable = Symbol('Allowable')
const BASE = 500

class PurchasePower {
  setSuccessor(successor) {
    this.successor = successor
  }
  processRequest (request, ClassName) {
    if(request.amount < this[Allowable]) {
      console.log(`${ClassName} will approve $${request.amount}`)
    } else if(!!this.successor) {
      this.successor.processRequest(request)
    }
  }
}

class ManagerPower extends PurchasePower {
  constructor () {
    super()
    this[Allowable] = 10 * BASE
  }
  processRequest (request) {
    super.processRequest(request, 'Manager')
  }
}

class DirectorPower extends PurchasePower {
  constructor () {
    super()
    this[Allowable] = 20 * BASE
  }
  processRequest (request) {
    super.processRequest(request, 'Director')
  }
}

class VicePresidentPower extends PurchasePower {
  constructor () {
    super()
    this[Allowable] = 40 * BASE
  }
  processRequest (request) {
    super.processRequest(request, 'Vice President')
  }
}

class PresidentPower extends PurchasePower {
  constructor () {
    super()
    this[Allowable] = 60 * BASE
  }
  processRequest (request) {
    if(request.amount < this[Allowable]) {
      console.log(`President will approve $${request.amount}`)
    } else {
      console.log(`Your request for $${rquest.amount} needs a board meeting!`)
    }
  }
}

const PurchaseRequest = (() => {
  const Amount = Symbol('Amount')
  return class {
    constructor (amount) {
      this[Amount] = amount
    }
    get amount () {
      return this[Amount]
    }
    set amount (amount) {
      this[Amount] = amount
    }
  }
})()

const manager = new ManagerPower()
const director = new DirectorPower()
const vp = new VicePresidentPower()
const president = new PresidentPower()
manager.setSuccessor(director)
director.setSuccessor(vp)
vp.setSuccessor(president)

let n = 1
while(n) {
  n = prompt('Enter the amount to check who should approve your expenditure.')
  manager.processRequest(new PurchaseRequest(n))
}
```

## 2. Command

https://ko.wikipedia.org/wiki/%EC%BB%A4%EB%A7%A8%EB%93%9C_%ED%8C%A8%ED%84%B4

```js
class Switch {
  constructor (up, dn) {
    this.up = up
    this.dn = dn
  }
  flipUp () {
    this.up.execute()
  }
  flipDown () {
    this.dn.execute()
  }
}
class Light {
  turnOn () {
    console.log('The light is on')
  }
  turnOff () {
    console.log('The light is off')
  }
}
class TurnOnLightCommand {
  constructor (light) {
    this.theLight = light
  }
  execute () {
    this.theLight.turnOn()
  }
}
class TurnOffLightCommand {
  constructor (light) {
    this.theLight = light
  }
  execute () {
    this.theLight.turnOff()
  }
}

const light = new Light()
const switchUp = new TurnOnLightCommand(light)
const switchDown = new TurnOffLightCommand(light)
const s = new Switch(switchUp, switchDown)

s.flipUp()
s.flipDown()
```

## 3. Interpreter

## 4. Iterator

## 5. Mediator

http://egloos.zum.com/iilii/v/4850510

```js
class ControlTower {
  constructor () {
    this.timer = null
    this.queue = []
    this.isOnSleep = false
  }
  _next () {
    this.isOnSleep = false
    const next = this.queue.shift()
    if(!next) {
      return
    }
    next()
    this._execute()
  }
  _sleep (ms) {
    this._execute(() => {
      clearTimeout(this.timer)
      this.isOnSleep = true
      this.timer = setTimeout(() => this._next(), ms)
    })
  }
  _execute (func) {
    if(func) {
      this.queue.push(func)
    }
    if(!this.isOnSleep) {
      this._next()
    }
  }
  land (airplane) {
    this._execute(() => {
      console.log(`${airplane.name} 비행기 - 착륙허가`)
    })
    this._sleep(600)
    this._execute(() => {
      console.log(`${airplane.name} 비행기 - 착륙완료`)
    })
    this._sleep(300)
  }
}

class Airplane {
  constructor (tower, name) {
    this.tower = tower
    this.name = name
  }
  requestToLand () {
    console.log(`${this.name} 비행기 - 착륙요청!!`)
    this.tower.land(this)
  }
}

const tower = new ControlTower()
const airplanes = new Array(10).fill(0).map((v, i)=> new Airplane(tower, i+1))
airplanes.forEach((v, i) => setTimeout(() => v.requestToLand(), 500 * i))
```


## 6. Memento

```js
class Originator {
  constructor (memento) {
    this.memento = memento
  }
  set (state) {
    this.state = state
    this.memento.save(state)
  }
  undo () {
    this.state = this.memento.undo()
  }
  redo () {
    this.state = this.memento.redo()
  }
  getState () {
    return this.state
  }
}
class Memento {
  constructor () {
    this.store = ['']
    this.currentIndex = 0
  }
  save (state) {
    this.store.length = this.currentIndex + 1
    this.store.push(state)
    if(this.store.length > 5) {
      this.store = this.store.slice(-5)
    }
    this.currentIndex = this.store.length - 1

  }
  undo () {
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : 0
    return this.store[this.currentIndex]
  }
  redo () {
    this.currentIndex = this.currentIndex < this.store.length - 2 ? this.currentIndex + 1 : this.store.length - 1
    return this.store[this.currentIndex]
  }
}

const savedStates = []
const originator = new Originator(new Memento())
originator.set('State1')
console.log(originator.getState())
originator.set('State2')
originator.set('State3')
originator.set('State4')
originator.set('State5')
console.log(originator.getState())
originator.undo()
originator.undo()
originator.set('State6')
originator.set('State7')
originator.set('State8')
console.log(originator.getState())
originator.undo()
originator.undo()
originator.undo()
originator.redo()
console.log(originator.getState())
```

## 7. Observer

http://flowarc.tistory.com/entry/%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4-%EC%98%B5%EC%A0%80%EB%B2%84-%ED%8C%A8%ED%84%B4Observer-Pattern

```js
class NewsMachine {
  constructor () {
    this.observers = new Set()
    this.title = null
    this.news = null
  }
  add (observer) {
    this.observers.add(observer)
  }
  delete (observer) {
    this.observers.delete(observer)
  }
  notifyObservers () {
    for(let o of this.observers) {
      o.update(this.title, this.news)
    }
  }
  setNewsInfo (title, news) {
    this.title = title
    this.news = news
    this.notifyObservers()
  }
  getTitle () {
    return this.title
  }
  getNews () {
    return this.news
  }
}

class Subscriber {
  subscribe (publisher) {
    publisher.add(this)
    this.publisher = publisher
  }
  unsubscribe () {
    this.publisher.delete(this)
    this.publisher = null
  }
}

class AnnualSubscriber extends Subscriber {
  constructor (publisher) {
    super()
    super.subscribe(publisher)
  }
  update (title, news) {
    console.log(`\n\n오늘의 뉴스\n======================\n\n${title}\n-----------\n${news}`)
  }
}
class EventSubscriber extends Subscriber {
  constructor (publisher) {
    super()
    super.subscribe(publisher)
  }
  update (title, news) {
    console.log(`\n\n이벤트 유저\n=========\n\n${title}\n-----\n${news}`)
  }
}

const news = new NewsMachine()
const as = new AnnualSubscriber(news)
const es = new EventSubscriber(news)
news.setNewsInfo('오늘 한파', '전국 영하 18도 입니다.')
es.unsubscribe()
news.setNewsInfo('벚꽃 축제합니다', '벚꽃 보러 가즈아~')
```

## 8. State

## 9. Strategy

## 10. Template Method

## 11. Visitor
