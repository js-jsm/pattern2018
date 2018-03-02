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

### 추상 팩토리

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

### 빌더

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

### 팩토리 메소드

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

### 단일체 (Singleton)

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

### 프로토타입

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