# 4. 구조 패턴 - 현진호
## 구조 패턴 : 객체들이 상호작용할 수 있는 간단한 방법을 기술
- 적응자 Adapter
- 가교 Bridge
- 복합체 Composite
- 장식자 Decorator
- 퍼사드 Facade
- 플라이급 Flyweight
- 프록시 Proxy

### 적응자
#### 인터페이스에 완벽히 맞지 않는 클래스를 사용할 경우
  - 클래스에 필요한 메소드가 없는 경우
  - 클래스가 불필요한 메소드를 가지고 있는 경우

사용시 장점
  - 코드 인터페이스 단순화
  - 요구 사항에 맞게 인터페이스 조작

```js
class Ship {
  SetRudderAngleTo(angle: number);
  SetSailConfiguration(configuration: SailConfiguration);
  SetSailAngle(saidId: number, sailAngle: number);
  GetCurrentBearing(): number;
  getCurrentSpeedEstimate(): number;
  ShiftCrewWeightTo(weightToShift: number, location: number);
}

class SimpleShip {
  TurnLeft();
  TurnRight();
  GoForward();
}

class ShipAdapter {
  constructor() {
    this._ship = new Ship();
  }

  TurnLeft() {
    this._ship.SetRudderAngleTo(-30);
    this._ship.SetSailAngle(3, 12);
  }

  TurnRight() {
    this._ship.SetRudderAngleTo(30);
    this._ship.SetSailAngle(5, -9);
  }

  GoForward() {
    // _ship에 대한 또 다른 일을 수행
  }
}

var ship = new ShipAdapter();
ship.GoForward();
ship.TurnLeft();
```

### 가교
#### 추상과 구현의 분리
하나의 인터페이스와 다른 구현들 사이의 중간자 역할을 하는 여러 적응자를 생성

사용시 장점
  - 여러 다른 API들을 일관된 방식으로 다룸

```js
class OldGods {
  prayTo(sacrifice) { console.log('We old Gods hear your prayer'); }
}

class DrownedGod {
  prayTo(humanSacrifice) { console.log('*BUBBLE* GURGLE'); }
}

class SevenGods {
  prayTo(prayerPurpose) { console.log('Sorry there are a lot of us, it gets confusing here. Did you pray for something?'); }
}

class OldGodsAdapter {
  constructor() {
    this._oldsGods = new OldGods();
  }

  prayTo() {
    var sacrifice = new Sacrifice();
    this._oldsGods.prayTo(sacrifice);
  }
}

class DrownedGodAdapter {
  constructor() {
    this._drownedGod = new DrownedGod();
  }

  prayTo() {
    var sacrifice = new HumanSacrifice();
    this._drownedGod.prayTo(sacrifice);
  }
}

class SevenGodsAdapter {
  constructor() {
    this.prayerPurposeProvider = new PrayerPurposeProvider();
    this._sevenGods = new SevenGods();
  }

  prayTo() {
    this._sevenGods.prayTo(this.prayerPurposeProvider.GetPurpose());
  }
}

var god1 = new SevenGodsAdapter();
var god2 = new DrownedGodAdapter();
var god3 = new OldGodsAdapter();

var gods = [god1, god2, god3];
for (var i = 0; i < gods.length; i++) {
  gods[i].prayTo();
}
```

### 복합체
#### 객체들 간의 강한 결합(상속 같은)을 회피

바로 jQuery가 복합체 패턴을 따릅니다. jQuery는 하나의 태그를 선택하든, 여러 개의 태그를 동시에 선택하든 모두 같은 메소드를 쓸 수 있습니다. 예를 들면, $('#zero')로 하나의 태그를 선택할 수도 있고, $('p')로 모든 p 태그를 선택할 수도 있습니다. 하지만 개수와 상관 없이 모두 attr이나 css같은 메소드를 사용할 수 있습니다. 

복합체 구성 방법
  - 복합체 컴포넌트가 고정된 개수의 다양한 컴포넌트로 구성
  - 정해지지 않은 개수의 컴포넌트로 구축

```js
class SimpleIngredient {
  constructor(name, calories, ironContent, vitaminCContent) {
    this.name = name;
    this.calories = calories;
    this.ironContent = ironContent;
    this.vitaminCContent = vitaminCContent;
  }

  GetName() { return this.name; }
  GetCalories() { return this.calories; }
  GetIronContent() { return this.ironContent; }
  GetVitaminCContent() { return this.vitaminCContent; }
}

class CompoundIngredient {
  constructor(name) {
    this.name = name;
    this.ingredients = new Array();
  }

  AddIngredient(ingredient) {
    this.ingredients.push(ingredient);
  }

  GetName() { return this.name; }

  GetCalories() {
    var total = 0;
    for (var i = 0 ; i < this.ingredients.length; i++) {
      total += this.ingredients[i].GetCalories();
    }
    return total;
  }

  GetIronContent() {
    var total = 0;
    for (var i = 0 ; i < this.ingredients.length; i++) {
      total += this.ingredients[i].GetIronContent();
    }
    return total;
  }

  GetVitaminCContent() {
    var total = 0;
    for (var i = 0 ; i < this.ingredients.length; i++) {
      total += this.ingredients[i].GetVitaminCContent();
    }
    return total;
  }
}

var egg = new SimpleIngredient('Egg', 155, 6, 0);
var milk = new SimpleIngredient('Milk', 42, 0, 0);
var sugar = new SimpleIngredient('Sugar', 387, 0, 0);
var rice = new SimpleIngredient('Rice', 370, 8, 0);

var ricePudding = new CompoundIngredient('Rice Pudding');
ricePudding.AddIngredient(egg);
ricePudding.AddIngredient(milk);
ricePudding.AddIngredient(sugar);
ricePudding.AddIngredient(rice);

console.log(ricePudding.GetCalories() + ' calories');

```
<img src='http://cfile23.uf.tistory.com/image/256FC25052D219CC0809E6'>

### 장식자
#### 적은 클래스를 정의하면서 여러 기능을 무한대로 혼합하여 사용할 수 있게 함

```js
class BasicArmor {
  CalculateDamageFromHit(hit) { return 1; }

  GetArmorIntegrity() { return 1; }
}

class ChainMail {
  constructor(decoratedArmor) {
    this.decoratedArmor = decoratedArmor;
  }

  CalculateDamageFromHit(hit) {
    hit.strength = hit.strength * .8;
    return this.decoratedArmor.CalculateDamageFromHit(hit);
  }

  GetArmorIntegrity() {
    return .9 * this.decoratedArmor.GetArmorIntegrity();
  }
}

var basicArmor = new BasicArmor();
var chainMail = new ChainMail(new BasicArmor());

console.log(chainMail.CalculateDamageFromHit({strength: 5})); // 4
console.log(chainMail.GetArmorIntegrity()); // 0.9

```

### 퍼사드
#### 복잡하고 세부적인 것들은 감추고 간단한 것만 보여줌
다수의 서브 시스템을 사용하기 쉽게 서비스를 제공

```js
class Legion {
  supply() {}
  makeFormation() {}
  goForward() {}
  pullOutSword() {}
  runToEnemy() {}
  retreat() {}
}

class Galba {
  constructor() {
    this.legions = [];
    this.legions.push(new Legion(1));
    this.legions.push(new Legion(2));
    this.legions.push(new Legion(3));
  }

  march() {
    this.legions.forEach(function(legion) {
      legion.supply();
      legion.makeFormation();
      legion.goForward();
    });
  }

  attach() {
    this.legions.forEach(function(legion) {
      legion.makeFormation();
      legion.pullOutSword();
      legion.runToEnemy();
    });
  }

  halt() {
    this.legions.forEach(function(legion) {
      legion.halt();
    });
  }

  retreat() {
    this.legions.forEach(function(legion) {
      legion.retreat();
    });
  }
}

```

### 플라이급
#### 객체의 인스턴스 개수는 많지만 인스턴스의 변화는 아주 작은 경우
대부분의 인스턴스가 동일한 값을 가지고 있어, 프로토타입의 다른 값들만 관리

```js
/*
class Soldier {
  constructor() {
    this.Health = 10;
    this.FightingAbility = 5;
    this.Hunger = 0;
  }
}
*/

class Soldier {}

Soldier.prototype.Health = 10;
Soldier.prototype.FightingAbility = 5;
Soldier.prototype.Hunger = 0;

var soldier1 = new Soldier();
var soldier2 = new Soldier();
console.log(soldier1.Health); // 10
soldier1.Health = 7;
console.log(soldier1.Health); // 7
console.log(soldier2.Health); // 10
delete soldier1.Health;
console.log(soldier1.Health); // 10
```

### 프록시
#### 사용자가 원하는 행동을 하기 전에 한번 거쳐가는 단계

실제 인스턴스의 인터페이스를 미러링하여 값비싼 객체의 생성,사용을 제어

사용 목적
- 내부 인스턴스 확인, 생성되지 않은 경우 메소드 호출 시 이를 생성하여 전달
- 보안을 염두에 두지 않고 설계된 클랫의 보안이 필요한 경우
- 메소드 호출에 추가 기능 삽입 시

```js
class BarrelCalculator {
  calculateNumberNeeded(volume) {
    return Math.ceil(volume / 357);
  }
}

class DragonBarrelCalculator {
  calculateNumberNeeded(volume) {
    if (this._barrelCalculator == null) {
      this._barrelCalculator = new BarrelCalculator();
      return this._barrelCalculator.calculateNumberNeeded(volume * .77);
    }
  }
}
```
