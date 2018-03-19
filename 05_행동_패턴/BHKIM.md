# Chapter5. 행동 패턴 (Behavioral)

### 책임 연쇄 (Chain of Responsibility)
객체 지향 디자인에서 chain-of-responsibility pattern은 명령 객체와 일련의 처리 객체를 포함하는 디자인 패턴이다. 각각의 처리 객체는 명령 객체를 처리할 수 있는 연산의 집합이고, 체인 안의 처리 객체가 핸들할 수 없는 명령은 다음 처리 객체로 넘겨진다. 이 작동방식은 새로운 처리 객체부터 체인의 끝까지 다시 반복된다.
이 패턴은 결합을 느슨하게 하기 위해 고안되었으며 가장 좋은 프로그래밍 사례로 꼽힌다.  

### 명령 (Command)
커맨드 패턴(Command pattern)이란 요청을 객체의 형태로 캡슐화하여 사용자가 보낸 요청을 나중에 이용할 수 있도록 매서드 이름, 매개변수 등 요청에 필요한 정보를 저장 또는 로깅, 취소할 수 있게 하는 패턴이다.
```js
// wiki
class Switch {
  constructor() {
    this._commands = [];
  }
  storeAndExecute(command) {
    this._commands.push(command);
    command.execute();
  }
}
class Light {
  turnOn() { console.log('turn on') }
  turnOff() { console.log('turn off') }
}
class FlipDownCommand {
  constructor(light) {
    this._light = light;
  }

  execute() {
    this._light.turnOff();
  }
}
class FlipUpCommand {
  constructor(light) {
    this._light = light;
  }
  execute() {
    this._light.turnOn();
  }
}
var light = new Light();
var switchUp = new FlipUpCommand(light);
var switchDown = new FlipDownCommand(light);
var s = new Switch();
s.storeAndExecute(switchUp);
s.storeAndExecute(switchDown);
```

### 해석자 (Interpreter)
컴퓨터 프로그래밍에서 인터프리터 패턴(interpreter pattern)은 한 언어에서 문들을 평가하는 방법을 규정하는 디자인 패턴이다. 기본 개념은 특화된 컴퓨터 언어에서 각 기호(종단 또는 비종단)마다 클래스를 갖는 것이다. 언어 내 한 문의 구문 트리는 컴포지트 패턴의 인스턴스이며 클라이언트의 문을 평가(해석)하기 위해 사용된다.
```js
// sample code
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
        this.battleList = battleText.split("\n");
    }
    nextBattle() {
        if (!this.battleList[0])
            return null;
        var segments = this.battleList[0].match(/\((.+?)\s?->\s?(.+?)\s?<-\s?(.+?)\s?->\s?(.+)/);
        return new Battle(segments[2], segments[1], segments[3], segments[4]);
    }
}
const text = "(Robert Baratheon -> Revier Trident <- RhaegarTargaryen) -> Robert Baratheon";
const p = new Parser(text);
console.log(p.nextBattle());
```

### 반복자 (Iterator)
반복자 패턴(iterator pattern)은 객체 지향 프로그래밍에서 반복자를 사용하여 컨테이너를 가로지르며 컨테이너의 요소들에 접근하는 디자인 패턴이다. 반복자 패턴은 컨테이너로부터 알고리즘을 분리시키며, 일부의 경우 알고리즘들은 필수적으로 컨테이너에 특화되어 있기 때문에 분리가 불가능하다.
```js
// sample code
// Fibonacci number
// 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144,...
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
const fib = new FibonacciIterator();
console.log(fib.next());
console.log(fib.next());
console.log(fib.next());
console.log(fib.next());
console.log(fib.next());
```

### 중재자 (Mediator)
중자재 패턴(mediator pattern), 조정자 패턴은 소프트웨어 공학에서 어떻게 객체들의 집합이 상호작용하는지를 함축해놓은 객체를 정의한다. 이 패턴은 프로그램의 실행 행위를 변경할 수 있기 때문에 행위 패턴으로 간주된다.
중재자 패턴을 사용하면 객체 간 통신은 중자재 객체 안에 함축된다. 객체들은 더 이상 다른 객체와 서로 직접 통신하지 않으며 대신 중재자를 통해 통신한다. 이를 통해 통신 객체 간 의존성을 줄일 수 있으므로 결합도를 감소시킨다.

### 메멘토 (Memento)
메멘토 패턴(memento pattern)은 객체를 이전 상태로 되돌릴 수 있는 기능을 제공하는 소프트웨어 디자인 패턴이다. (롤백을 통한 실행 취소)

### 감시자 (Observer)
옵서버 패턴(observer pattern)은 객체의 상태 변화를 관찰하는 관찰자들, 즉 옵저버들의 목록을 객체에 등록하여 상태 변화가 있을 때마다 메서드 등을 통해 객체가 직접 목록의 각 옵저버에게 통지하도록 하는 디자인 패턴이다. 주로 분산 이벤트 핸들링 시스템을 구현하는 데 사용된다. 발행/구독 모델로 알려져 있기도 하다.  
```js
// sample code
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
        this._painKillers = painKillers;
        for (var i = 0; i < this._partiesToNotify.length; i++) {
            this._partiesToNotify[i](painKillers);
        }
    }
}
class Player {
    OnKingPainKillerChange(newPainKillerAmount) {
        //perform some action
        console.log(newPainKillerAmount);
    }
}
const s = new Spy();
const p = new Player();
s.Subscribe(p.OnKingPainKillerChange);
s.SetPainKillers(12);
```

### 상태 (State)
상태 패턴(state pattern)은 객체 지향 방식으로 상태 기계를 구현하는 행위 소프트웨어 디자인 패턴이다. 상태 패턴을 이용하면 상태 패턴 인터페이스의 파생 클래스로서 각각의 상태를 구현함으로써, 또 패턴의 슈퍼클래스에 의해 정의되는 메소드를 호출하여 상태 변화를 구현함으로써 상태 기계를 구현한다.
상태 패턴은 패턴의 인터페이스에 정의된 메소드들의 호출을 통해 현재의 전략을 전환할 수 있는 전략 패턴으로 해석할 수 있다.

### 전략 (Strategy)
전략 패턴(strategy pattern) 또는 정책 패턴(policy pattern)은 실행 중에 알고리즘을 선택할 수 있게 하는 행위 소프트웨어 디자인 패턴이다. 전략 패턴은 특정한 계열의 알고리즘들을 정의하고 각 알고리즘을 캡슐화하며 이 알고리즘들을 해당 계열 안에서 상호 교체가 가능하게 만든다.
```js
// sample code
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
const currentMoney = 70;
let strat;
if (currentMoney > 500)
    strat = new SeaGoingVessel();
else if (currentMoney > 50)
    strat = new Horse();
else
    strat = new Walk();
const travelResult = strat.Travel();
console.log(travelResult);
```

### 템플릿 메소드 (Template method)

### 방문자 (Visitor)
객체 지향 프로그래밍과 소프트웨어 공학에서 비지터 패턴(visitor pattern; 방문자 패턴)은 알고리즘을 객체 구조에서 분리시키는 디자인 패턴이다. 이렇게 분리를 하면 구조를 수정하지 않고도 실질적으로 새로운 동작을 기존의 객체 구조에 추가할 수 있게 된다. 개방-폐쇄 원칙을 적용하는 방법의 하나이다.
