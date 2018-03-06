# 3. 생성 패턴

> Westeros 라는 전역 네임스페이스는 생략하였다.

```js
// 결합상황 p72
class Ruler {
  constructor () {
    this.house = new Houses.Targaryen()
  }
}
```

## 3-1. 추상 팩토리

```js
// p78
class KingJoffery {
  makeDecision () {}
  marry () {}
}

class LordTywin {
  makeDecision () {}
}

class LannisterFactory {
  getKing () {
    return new KingJoffery()
  }
  getHandOfTheKing () {
    return new LordTywin()
  }
}

class TargaryenFactory {
  getKing () {
    return new KingAerys()
  }
  getHandOfTheKing () {
    return new LordConnington()
  }
}
```

-> 지배가문을 필요로 하는 클래스
```js
// p79
class CourtSession {
  constructor (abstractFactory) {
    this.abstractFactory = abstractFactory
    this.COMPLAINT_THRESHOLD = 10
  }
  complaintPresented (complaint) {
    if (complaint.severity < this.COMPLAINT_THRESHOLD) {
      this.abstractFactory.getHandOfTheKing().makeDecision()
    } else {
      this.abstractFactory.getKing().makeDecision()
    }
  }
}

const targaryenCourtSession = new CourtSession(new TargaryenFactory())
targaryenCourtSession.complaintPresented({ severity: 8 })
targaryenCourtSession.complaintPresented({ severity: 12 })

const lannisterCourtSession = new CourtSession(new LannisterFactory())
lannisterCourtSession.complaintPresented({ severity: 8 })
lannisterCourtSession.complaintPresented({ severity: 12 })
```

## 3-2. 빌더

```js
// p81
class Event {
  constructor (name) {
    this.name = name
  }
}
class Prize {
  constructor (name) {
    this.name = name
  }
}
class Attendee {
  constructor (name) {
    this.name = name
  }
}
class Tournament {
  constructor () {
    this.events = []
    this.attendees = []
    this.prizes = []
  }
}
class LannisterTournamentBuilder {
  build () {
    const tournament = new Tournament()
    tournament.events.push(new Event('Jourst'), new Event('Melee'))
    tournament.attendees.push(new Attendee('Jamie'))
    tournament.prizes.push(new Prize('Gold'), new Prize('More Gold'))
    return tournament
  }
}
class BaratheonTournamentBuilder {
  build () {
    const tournament = new Tournament()
    tournament.events.push(new Event('Jourst'), new Event('Melee'))
    tournament.attendees.push(new Attendee('Stannis'), new Attendee('Robert'))
    return tournament
  }
}
class TournamentBuilder {
  build (builder) {
    return builder.build()
  }
}
```

>> Builder Pattern example
```js
class Pizza {
    setDough (dough) {
        this.dough = dough
    }
    setSauce (sauce) {
        this.sauce = sauce
    }
    setTopping (topping) {
        this.topping = topping
    }
}

class PizzaBuilder {
    createPizza () {
        this.pizza = new Pizza()
    }
    getPizza () {
        return this.pizza
    }
    buildDough () {
        if(new.target === PizzaBuilder) {
            throw new Error('should overide this method!')
        }
    }
    buildSauce () {
        if(new.target === PizzaBuilder) {
            throw new Error('should overide this method!')
        }
    }
    buildTopping () {
        if(new.target === PizzaBuilder) {
            throw new Error('should overide this method!')
        }
    }
}

class HawaiianPizzaBuilder extends PizzaBuilder {
    buildDough () {
        this.pizza.setDough('cross')
    }
    buildSauce () {
        this.pizza.setSauce('mild')
    }
    buildTopping () {
        this.pizza.setTopping('ham & pineapple')
    }
}
class SpicyPizza extends PizzaBuilder {
    buildDough () {
        this.pizza.setDough('pan baked')
    }
    buildSauce () {
        this.pizza.setSauce('hot')
    }
    buildTopping () {
        this.pizza.setTopping('pepperoni & salami')
    }
}

class Cook {
    setPizzaBuilder (builder) {
        this.pizzaBuilder = builder
    }
    getPizza () {
        return this.pizzaBuilder.getPizza()
    }
    cookPizza () {
        this.pizzaBuilder.createPizza()
        this.pizzaBuilder.buildDough()
        this.pizzaBuilder.buildSauce()
        this.pizzaBuilder.buildTopping()
    }
}

const cook = new Cook()
cook.setPizzaBuilder(new HawaiianPizzaBuilder())
cook.cookPizza()
console.log(cook.getPizza())
```

## 3-3. 팩토리 메소드

```js
// p86
class WateryGod {
  prayTo () {}
}
class AncientGods {
  paryTo () {}
}
class DefaultGod {
  prayTo () {}
}

class GodFactory {
  static Build (godName) {
    switch(godName) {
      case 'watery': return new WateryGod()
      case 'ancient': return new AncientGods()
      default: return new DefaultGod()
    }
  }
}

class GodDeterminant {
  constructor (religionName, prayerPurpose) {
    this.religionName = religionName
    this.prayerPurpose = prayerPurpose
  }
}

class Prayer {
  pray (godName) {
    GodFactory.Build(godName).prayTo()
  }
}
```

>> Factory Method Pattern examples
```js
class Car {
  constructor (type, color) {
    this.type = type
    this.color = color
  }
}
class CarFactoryMethod {
  produce (carName, color) {
    return new Car(carName, color)
  }
}
const cf = new CarFactoryMethod()
const bmw = cf.produce('Bmw', 'White')
const ss = cf.produce('Audi', 'Black')
```

```js
class Pizza {
    constructor () {
        this.price = 0
    }
    getPrice () {
        return this.price
    }
}
class HamAndMushroomPizza extends Pizza{
    constructor () {
		super()
        this.price = 8.50
    }
}
class DeluxePizza extends Pizza {
    constructor () {
		super()
        this.price = 10.50
    }
}
class DefaultPizza extends Pizza {
    constructor () {
		super()
        this.price = 6.50
    }
}
class PizzaFactoryMethod {
    createPizza (type) {
        switch(type) {
            case 'Ham and Mushroom': return new HamAndMushroomPizza()
            case 'Deluxe': return new DeluxePizza()
            default: return new DefaultPizza()
        }
    }
}
const pfm = new PizzaFactoryMethod()
const hnm = pfm.createPizza('Ham and Mushroom')
const dlx = pfm.createPizza('Deluxe')
console.log(hnm.getPrice(), dlx.getPrice())
```


## 3-4. 단일체 (Singleton)

```js
// p89
const Wall = (() => {
  class Wall {
    constructor () {
      this.height = 0
      if(Wall._instance) {
        return Wall._instance
      }
      Wall._instance = this
    }
    setHeight (height) {
      this.height = height
    }
    getStatus () {
      console.log(`Wall is ${this.height} meters tall.`)
    }
    static getInstance () {
      if(!Wall._instance) {
        Wall._instance = new Wall()
      }
      return Wall._instance
    }
  }
  Wall._instance = null
  return Wall
})()
```

## 3-5. 프로토타입

```js
// p92
class Lannister {
  clone () {
    return Object.assign(new Lannister(), this)
  }
}
const jamie = new Lannister()
jamie.swordSkills = 9
jamie.charm = 6
jamie.wealth = 10
const tyrion = jamie.clone()
tyrion.charm = 10
console.log(tyrion)
```