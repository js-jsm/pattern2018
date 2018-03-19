# 5. 행동 패턴 - 현진호

- 객체 간 상호작용을 용이하게 구성해줌
### 책임연쇄 Chain of Responsibility
### 명령 Command
### 해석자 Interpreter
### 반복자 Iterator
### 중재자 Mediator
### 메멘토 Memento
### 감시자 Observer
### 상태 State
### 전략 Strategy
### 템플릿 메소드 Template method
### 방문자 Visitor

### 책임연쇄 Chain of Responsibility
- 메시지가 클래스에서 다른 클래스로 전달되는 접근 방식을 기술
  - 메시지를 처리허가나
  - 체인에 있는 다음 멤버에게 전달
- 브라우저 기반 자바스크립트에서, 이벤트는 책임의 연쇄를 통해 전달
	- 링크에 복수의 클릭 이벤트 리스너 연결 시, 각각은 마지막으로 기본 탐색 리스너가 발생할 때까지 계속

```js
class Complaint {
  constructor() {
    this.ComplainingParty = '';
    this.ComplainAbout = '';
    this.Complaint = '';  
  }
}

class ClekOfTheCourt {
  IsAbleToResolveComplaint(complaint) {
    return false;
  }

  ListenToComplaint(complaint) {
    // 몇 가지 작업을 수행
    // 불만에 대한 해결책을 반환
    return '';
  }
}

class King {
  IsAbleToResolveComplaint(complaint) {
    return true;
  }

  ListenToComplaint(complaint) {
    // 몇 가지 작업을 수행
    // 불만에 대한 해결책을 반환
    return '';    
  }
}

class ComplaintResolver {
  constructor() {
    complaintListeners = new Array();
    complaintListeners.push(new ClekOfTheCourt());
    complaintListeners.push(new King());
  }

  ResolveComplaint(complaint) {
    for (var i = 0; i < this.complaintListeners.length; i++) {
      if (this.complaintListeners[i].IsAbleToResolveComplaint(complaint)) {
        return this.complaintListeners[i].ListenToComplaint(complaint);
      }
    }
  }
}
```

### 명령 Command
- 메소드의 매개변수, 객체의 현재 상태 모두를 캡슐화하고 메소드를 호출
- 메소드를 나중에 호출할 때 필요한 것들을 패키지로 포장
- 먼저 명령을 실행하고, 어떤 코드가 명령을 실행할 지 나중에 결정할 때까지 대기

- 구성 요소
	- 명령 메시지: 명령 그 자체
		- 함수를 객체로 저장. 함수와 매개변수들을 추적.
		- 명령이 실행 시에 실패하지 않고 생성 시에 실패하도록 보장하여 디버깅 용이
```js
class BringTroopsCommand {
  constructor(location, numberOfTroops, when) {
    this._location = location;
    this._numberOfTroops = numberOfTroops;
    this._when = when;
  }

  Execute() {
    var receiver = new LordInstructions();
    receiver.BringTroops(this._location, this._numberOfTroops, this._when);
  }
}
```

	- 호출자: 명령의 실행을 지시
```js
var bringTroopsCommand = new BringTroopsCommand("King's Landing", 500, new Date());
bringTroopsCommand.Execute();

```

	- 수신자: 명령 실행의 대상
		- 지연된 명령을 어떻게 수행할 지 정의
```js
class LordInstructions {
  constructor() {}
  BringTroops(location, numberOfTroops, when) {
    console.log(`Bring ${numberOfTroops} troops to ${location} at ${when}`)
  }
}
```

### 해석자 Interpreter
- 자신만의 고유한 언어를 생성할 수 있게 하는 패턴
  - 예: (agressor -> battle ground <- defender) -> victor

```js
class Battle {
  constructor(battleGround, agressor, defender, victor) {
    this.battleGround = battleGround;
    this.agressor = agressor;
    this.defender = defender;
    this.victor = victor;
  }
}

class Parser {
  constructor(battleText) {
    this.battleText = battleText;
    this.currentIndex = 0;
    this.battleList = battleText.split('\n')
  }

  nextBattle() {
    if (!this.battleList[0]) {
      return null;
    }
    var segments = this.battleList[0].match(/\((.+?)\s?->\s?(.+?)\s?<-\s?(.+?)\)\s?->\s?(.+)/);
    return new Battle(segments[2], segments[1], segments[3], segments[4]);
  }
}

var text = "(Robert Baratheon -> River Trident <- RhaegarTargaryen) -> Robert Baratheon";
var p = new Parser(text);
p.nextBattle();
/*
Battle {
  battleGround: "River Trident", 
  agressor: "Robert Baratheon", 
  defender: "RhaegarTargaryen", 
  victor: "Robert Baratheon"
}
*/
```

### 반복자 Iterator
- 객체들의 집합 내 이동을 위한 특별한 생성자
- 집합에서 다음 항목을 순차적으로 선택하는 간단한 메소드를 제공해주는 패턴

```js
class KingSuccession {
  constructor(inLineForThrone) {
    this.inLineForThrone = inLineForThrone;
    this.pointer = 0;
  }

  next() {
    return this.inLineForThrone[this.pointer++];
  }
}

var king = new KingSuccession(['Robert Baratheon', 'Joffery Baratheon', 'Tommen Baratheon']);
console.log(king.next()); // Robert Baratheon
console.log(king.next()); // Joffery Baratheon
console.log(king.next()); // Tommen Baratheon
```

- 고정돼 있지 않은 집합을 반복하는 경우도 있음
```js
class FibonacciIterator {
  constructor() {
    this.previous = 1;
    this.beforePrevious = 1;
  }

  next() {
    var current = this.previous + this.beforePrevious;
    this.beforePrevious = this.previous;
    this.previous = current;
    return current;
  }
}

var fib = new FibonacciIterator();
console.log(fib.next()); // 2
console.log(fib.next()); // 3
console.log(fib.next()); // 5
console.log(fib.next()); // 8
console.log(fib.next()); // 13
console.log(fib.next()); // 21
```

### 중재자 Mediator
- 다양한 컴포넌트의 중간에 위치, 메시지의 경로 변경이 이루어지는 유일한 장소로 기능
- 코드 유지히 필요한 복잡한 작업을 단순화
- 참여자들 사이의 정보 교환을 명확히 하고 중계함

```js
class Karstark {
  constructor(greatLord) {
    this.greatLord = greatLord;
  }

  receiveMessage(message) {}

  sendMessage(message) {
    this.greatLord.routeMessage(message);
  }
}

class HouseStark {
  constructor() {
    this.karstark = new Karstark(this);
    this.bolton = new Bolton(this);
    this.frey = new Frey(this);
    this.umber = new Umber(this);
  }

  routeMessage(message) {}
}
```

### 메멘토 Memento
- 이전 상태로 객체의 상태를 복원할 수 있는 방법을 제공
- 변수의 이전 값에 대한 기록 유지, 복원 기능 제공

- 메멘토 구성을 위해서 필요한 구성원
  - 발신자: 상태정보 유지, 새로운 메멘토 생성 인터페이스 제공
  - 관리자: 패턴의 클라이언트. 새로운 메멘토 요청, 복원 시 이를 관리
  - 메멘토: 발신자의 저장된 상태의 표현. 롤백을 위해 저장해야 하는 값

```js
class WorldState {
  constructor(numberOfKings, currentKingInKingsLanding, season) {
    this.numberOfKings = numberOfKings;
    this.currentKingInKingsLanding = currentKingInKingsLanding;
    this.season = season;
  }
}

class WorldStateProvider {
  constructor() {

  }

  saveMemento() {
    return new WorldState(this.numberOfKings, this.currentKingInKingsLanding, this.season);
  }

  restoreMemento(memento) {
    this.numberOfKings = memento.numberOfKings;
    this.currentKingInKingsLanding = memento.currentKingInKingsLanding;
    this.season = memento.season;
  }
}

class Soothsayer {
  constructor() {
    this.startingPoints = [];
    this.currentState = new WorldStateProvider();
  }

  setInitialConditions(numberOfKings, currentKingInKingsLanding, season) {
    this.currentState.numberOfKings = numberOfKings;
    this.currentState.currentKingInKingsLanding = currentKingInKingsLanding;
    this.currentState.season = season;
  }

  alterNumberOfKingsAndForetell(numberOfKings) {
    this.startingPoints.push(this.currentState.saveMemento());
    this.currentState.numberOfKings = numberOfKings;
  }

  alertSeasonAndForetell(season) {
    this.startingPoints.push(this.currentState.saveMemento());
    this.currentState.season = season;  
  }

  alertCurrentKingInKingsLandingAndForetell(currentKingInKingsLanding) {
    this.startingPoints.push(this.currentState.saveMemento());
    this.currentState.currentKingInKingsLanding = currentKingInKingsLanding;  
  }

  tryADifferentChange() {
    this.currentState.restoreMemento(this.startingPoints.pop());
  }
}

var soothsayer = new Soothsayer();
soothsayer.setInitialConditions(3, 'Jinho', 'Spring');
soothsayer.alterNumberOfKingsAndForetell(5);
soothsayer.tryADifferentChange();
```

### 감시자 Observer
- 객체의 값 변화를 알고 싶을 때 사용
- 이를 위해 getter, setter를 사용해 원하는 속성 래핑

```js
class Spy {
  constructor() {
    this._partiesToNotify = [];
  }

  Subscribe(subscriber) {
    this._partiesToNotify.push(subscriber);
  }

  Unsubscribe(subscriber) {
    this._partiesToNotify.remove(subscriber);
  }

  SetPainKillers(painKillers) {
    for (var i = 0; i < this._partiesToNotify.length; i++) {
      this._partiesToNotify[i](painKillers);
    }
  }
}

class Player {
  constructor() {

  }

  OnKingPainKillerChange(newPainKillerAmount) {
    console.log(newPainKillerAmount);
  }
}

var s = new Spy();
var p = new Player();

s.Subscribe(p.OnKingPainKillerChange);
s.SetPainKillers(12);
```

### 상태 State
- 복잡하고 거대한 if 문 블록 대신, 내부 상태를 추상화.
- 클래스로 구현된 상태들 사이의 메시지를 프록시로 전달하는 상태 관리자를 가짐
  - 상태 관리자의 인터페이스는 간단, 개별 상태와 통신하는 데 필요한 메소드만 제공
- 코드 디버깅 용이, 작은 코드 블록 형성으로 테스트 용이

```js
class BankAccountManager {
  constructor() {
    this.currentState = new GoodStandingState(this);
    this.balance = 0;
  }

  Deposit(amount) {
    this.currentState.Deposit(amount);
  }

  Withdraw(amount) {
    this.currentState.Withdraw(amount);
  }

  addToBalance(amount) {
    this.balance += amount;
  }

  getBalance() {
    return this.balance;
  }

  moveToState(newState) {
    this.currentState = newState;
  }
}

class GoodStandingState {
  constructor(manager) {
    this.manager = manager;
  }

  Deposit(amount) {
    this.manager.addToBalance(amount);
  }

  Withdraw(amount) {
    if (this.manager.getBalance() < amount) {
      this.manager.moveToState(new OverdrawnState(this.manager));
    }

    this.manager.addToBalance(-1 * amount);
  }
}

class OverdrawnState {
  constructor(manager) {
    this.manager = manager;
  }

  Deposit(amount) {
    this.manager.addToBalance(amount);
    if (this.manager.getBalance() > 0) {
      this.manager.moveToState(new GoodStandingState(this.manager));
    }
  }

  Withdraw(amount) {
    this.manager.moveToState(new Onhold(this.manager));
    throw 'Cannot withdraw money from an already overdrawn bank account';
  }
}

class Onhold {
  constructor(manager) {
    this.manager = manager;
  }

  Deposit(amount) {
    this.manager.addToBalance(amount);
    throw 'Your account is on hold and you must go to the bank to resolve the issue';
  }

  Withdraw(amount) {
    throw 'Your account is on hold and you must go to the bank to resolve the issue';
  }
}

var bankAccountManager = new BankAccountManager();
bankAccountManager.Deposit(10000);

bankAccountManager.Withdraw(12000);

bankAccountManager.Deposit(1999);
bankAccountManager.Withdraw(1); // Cannot withdraw money from an already overdrawn bank account
```


### 전략 Strategy
- 전략 패턴을 전략들을 투명하게 교체하는 방법을 제공. 알고리즘 전체를 다른 알고리즘으로 대체
- 올바른 전략 선택에는 여러 다양한 방법이 있다
  - 정적으로 전략을 선택 : 전략이 자주 변경되지 않거나, 단일 고객을 위한 특정 전략일 경우 
  - 데이터 세트 분석 후 가장 적합한 전략 선택
  - 점진적 향상
    - 사용자들에게 신속한 피드백 제공을 위해 가장 빠르지만 부정확한 알고리즘 실행
    - 동시에 가장 느린 알고리즘 실행. 완료 후 더 정확한 결과로 기존의 결과 대체
  - 무작위 선택 : 서로 다른 두 개의 전략의 성능을 비교하는 경우

```js
class TravelResult {
  constructor(durationInDays, probabilityOfDeath, cost) {
    this.durationInDays = durationInDays;
    this.probabilityOfDeath = probabilityOfDeath;
    this.cost = cost;
  }
}

class SeaGoingVessel {
  Travel(source, destination) {
    return new TravelResult(15, .25, 500);
  }
}

class Horse {
  Travel(source, destination) {
    return new TravelResult(30, .25, 50);
  }
}

class Walk {
  Travel(source, destination) {
    return new TravelResult(150, .55, 0);
  }
}

var currentMoney = getCurrentMoney();
var strat;
if (currentMoney > 500) {
  start = new SeaGoingVessel();
} else if (currentMoney > 50) {
  strat = new Horse(); 
} else {
  strat = new Walk;
}

var travelResult = strat.Travel();
console.log(travelResult);
```

### 템플릿 메소드 Template method
- 모든 전략에서 알고리즘의 대부분이 동일하고 아주 조금만 다를 경우, 전체 알고리즘을 대체하는 것은 부담
- 템플릿 메서드는 알고리즘의 일부분은 공유, 일부분만 다른 방법으로 구현
	- 점진적 향상의 원칙을 적용하여, 점점 더 완벽한 알고리즘을 구현하며 동시에 상속 트리 구조를 구축

```js
class BasicBeer {
  Create() {
    this.AddIngredients();
    this.Stir();
    this.Ferment();
    this.Test();
    if (this.TestingPassed()) {
      this.Distribute();
    }
  }

  AddIngredients() {}
  Stir() {}
  Ferment() {}
  Test() {}
  TestingPassed() {}
  Distribute() {}
}

class RaspberryBeer extends BasicBeer {
  AddIngredients() {
    console.log('Add Ingredients');
  }
  TestingPassed() {
    console.log('Testing Passed');
  }
}

const raspberryBeer = new RaspberryBeer();
raspberryBeer.Create();

```

### 방문자 Visitor
- 알고리즘을 객체의 구조와 분리
- 유형이 다른 객체의 집합들 사이에서 유형에 따라 다른 동작을 수행

```js
class Knight {
  printName() { console.log('Knight'); }
}

class FootSoldier {
  printName() { console.log('FootSoldier'); }
}

class Lord {
  printName() { console.log('Lord'); }
}

class Archer {
  printName() { console.log('Archer'); }
}

var collection = [];
collection.push(new Knight());
collection.push(new FootSoldier());
collection.push(new Lord());
collection.push(new Archer());

for (const soldier of collection) {
  if (typeof (soldier) === 'Knight') {
    soldier.printName();
  } else {
    console.log('Not a knight')
  }
}

/*
Not a knight
Not a knight
Not a knight
Not a knight
*/

console.log('----');
for (const soldier of collection) {
  if (soldier instanceof Knight) {
    soldier.printName();
  } else {
    console.log('Not a knight')
  }
}

/*
Knight
Not a knight
Not a knight
Not a knight
*/

class Knight2 {
  constructor() {
    this._type = 'Knight';
  }

  printName() { 
    console.log('Knight'); 
  }
}


var collection = [];
collection.push(new Knight2());
collection.push(new FootSoldier());
collection.push(new Lord());
collection.push(new Archer());

console.log('----');
for (const soldier of collection) {
  if (soldier._type === 'Knight') {
    soldier.printName();
  } else {
    console.log('Not a knight')
  }
}

/*
Knight
Not a knight
Not a knight
Not a knight
*/

Knight2.prototype.visit = function (visitor) {
  visitor.Visit(this);
}

FootSoldier.prototype.visit = function (visitor) {
  visitor.Visit(this);
}

Lord.prototype.visit = function (visitor) {
  visitor.Visit(this);
}

Archer.prototype.visit = function (visitor) {
  visitor.Visit(this);
}

class SelectiveNamePrinterVisitor {
  Visit(memberOfArmy) {
    if (memberOfArmy._type === 'Knight') {
      this.VisitKnight(memberOfArmy);
    } else {
      console.log('Not a knight');
    }
  }

  VisitKnight(memberOfArmy) {
    memberOfArmy.printName();
  }
}

console.log('----');
var visitor = new SelectiveNamePrinterVisitor();
for (const soldier of collection) {
  soldier.visit(visitor);
}

```
