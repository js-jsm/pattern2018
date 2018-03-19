# 5. Behavioral Patterns
## Chain of Responsibility Pattern
명령 객체와 일련의 처리 객체를 포함하는 디자인 패턴이다. 각각의 처리 객체는 명령 객체를 처리할 수 있는 연산의 집합이고, 체인 안의 처리 객체가 핸들할 수 없는 명령은 다음 처리 객체로 넘겨진다. 이 작동방식은 새로운 처리 객체부터 체인의 끝까지 다시 반복된다.
```js
class AbstractLogger {
  constructor() {
    if (this.constructor === AbstractLogger) {
      // Abstract class can not be constructed.
      throw new TypeError("Can not construct abstract class.");
    }
  }

  setNextLogger(nextLogger) {
    this.nextLogger = nextLogger;
  }

  logMessage(level, message) {
    if (this.level <= level) {
      this.write(message);
    }
    if (this.nextLogger != null) {
      this.nextLogger.logMessage(level, message);
    }
  }

  // abstarct method
  write(message) {
    // The child has implemented this method but also called `super.foo()`.
    throw new TypeError("Do not call abstract method foo from child.");
  }

  static get INFO() {
    return 1;
  }

  static get DEBUG() {
    return 2;
  }

  static get ERROR() {
    return 3;
  }
}

class ConsoleLogger extends AbstractLogger {
  constructor(level) {
    super();
    this.level = level;
  }

  write(message) {
    console.log("Standard Console::Logger: " + message);
  }
}

class ErrorLogger extends AbstractLogger {
  constructor(level) {
    super();
    this.level = level;
  }

  write(message) {
    console.log("Error Console::Logger: " + message);
  }
}

class FileLogger extends AbstractLogger {
  constructor(level) {
    super();
    this.level = level;
  }

  write(message) {
    console.log("FileLogger::Logger: " + message);
  }
}

// Main
(function () {
  function getChainOfLoggers() {
    // create, instance
    const errorLogger = new ErrorLogger(AbstractLogger.ERROR);
    const fileLogger = new FileLogger(AbstractLogger.DEBUG);
    const consoleLogger = new ConsoleLogger(AbstractLogger.INFO);

    // apply, chain
    errorLogger.setNextLogger(fileLogger);
    fileLogger.setNextLogger(consoleLogger);

    return errorLogger
  }

  const loggerChain = getChainOfLoggers();

  loggerChain.logMessage(AbstractLogger.INFO, "This is an information.");
  loggerChain.logMessage(AbstractLogger.DEBUG, "This is an debug level information.");
  loggerChain.logMessage(AbstractLogger.ERROR, "This is an error information.");
})()
```

## Command Pattern
요청을 객체의 형태로 캡슐화하여 사용자가 보낸 요청을 나중에 이용할 수 있도록 매서드 이름, 매개변수 등 요청에 필요한 정보를 저장 또는 로깅, 취소할 수 있게 하는 패턴이다.

```js
// request
class Stock {
  constructor(name, quantity) {
    this.name = name;
    this.quantity = quantity;
  }

  buy() {
    console.log("Stock [ Name: " + this.name + ", Quantity: " + this.quantity + " ]bought");
  }

  sell() {
    console.log("Stock [ Name: " + this.name + ", Quantity: " + this.quantity + " ]sold");
  }
}

// concrete command classes
class BuyStock {
  constructor(stock) {
    this.stock = stock;
  }

  execute() {
    this.stock.buy();
  }
}

class SellStock {
  constructor(stock) {
    this.stock = stock;
  }

  execute() {
    this.stock.sell();
  }
}

// invoker class
class Broker {
  constructor() {
    this.orderList = [];
  }

  takeOrder(order) {
    this.orderList.push(order);
  }

  placeOrders() {
    this.orderList.forEach((o) => {
      o.execute();
    })
    this.orderList = [];
  }
}

// Main
(function () {
  const stock = new Stock('A', 10);

  const buyStockOrder = new BuyStock(stock);
  const sellStockOrder = new SellStock(stock);

  const broker = new Broker();
  broker.takeOrder(buyStockOrder);
  broker.takeOrder(sellStockOrder);

  broker.placeOrders();
})()
```

## Interpreter Pattern
새로운 표현 및 문법 적용, like SQL.

## Iterator Pattern
기본 표현을 알 필요없이 순차적 요소를 접근하는 패턴.

```js
function makeIterator(array) {
  let nextIndex = 0;

  return {
    next: () => {
      return nextIndex < array.length ?
        { value: array[nextIndex++], done: false } :
        { done: true };
    }
  };
}

let it = makeIterator(['yo', 'ya']);
console.log(it.next().value); // 'yo'
console.log(it.next().value); // 'ya'
console.log(it.next().done);  // true
```

## Mediator Pattern
여러 객체 또는 클래스 사이의 통신의 복잡성을 줄이는 패턴.
객체간의 통신은 중재자 객체를 통해 진행된다.
```js
// mediator class
class ChatRoom {
  static showMessage(user, message) {
    console.log(new Date().toString() + " [" + user.name + "] : " + message);
  }
}

class User {
  constructor(name) {
    this._name = name;
  }

  sendMessage(message) {
    ChatRoom.showMessage(this, message);
  }

  get name() {
    return this._name;
  }
}

(function () {
  const robert = new User("Robert");
  const john = new User("John");

  robert.sendMessage("Hi! John!");
  john.sendMessage("Hello! Robert!");
})()
```

## Memento Pattern
객체를 이전 상태로 되돌릴 수 있는 기능을 제공하는 패턴.
오리지네이터(originator), 케어테이커(caretaker), 메멘토(memento).
originator - 객체 상태 저장 및 생성.
caretaker - 객체 상태를 되돌리기 위한 책임을 가짐.
memento - 되돌리기 위한 객체의 상태.
```js
class Memento {
  constructor(state) {
    this._state = state;
  }

  get state() {
    return this._state;
  }
}

class Originator {
  saveStateToMemento() {
    return new Memento(this._state);
  }

  restoreStateFromMemento(memento) {
    this._state = memento.state;
  }

  set state(state) {
    this._state = state;
  }

  get state() {
    return this._state;
  }
}

class CareTaker {
  constructor() {
    this._mementoList = [];
  }

  add(state) {
    this.mementoList.push(state);
  }

  get(index) {
    return this._mementoList[index];
  }

  set mementoList(state) {
    this._mementoList = state;
  }

  get mementoList() {
    return this._mementoList;
  }
}

(function () {
  const originator = new Originator();
  const careTaker = new CareTaker();

  originator.state = "State #1";
  originator.state = "State #2";
  careTaker.add(originator.saveStateToMemento());

  originator.state = "State #3";
  careTaker.add(originator.saveStateToMemento());

  originator.state = "State #4";
  console.log("Current State: " + originator.state);

  originator.restoreStateFromMemento(careTaker.get(0));
  console.log("First saved State: " + originator.state);
  originator.restoreStateFromMemento(careTaker.get(1));
  console.log("Second saved State: " + originator.state);
})()
```

## Obsever Pattern
일대다 관계의 객체들 중 하나의 객체가 수정되었을 때, 자동으로 모든 객체한테 변화를 알려준다.

```js
class Subject {
  constructor() {
    this._observers = [];
  }

  attach(observer) {
    this._observers.push(observer);
  }

  notifyAllObservers() {
    this._observers.forEach((ob) => {
      ob.update();
    })
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;
    this.notifyAllObservers();
  }
}

class Observer {
  constructor() {
    if (this.constructor === Observer) {
      // Abstract class can not be constructed.
      throw new TypeError("Can not construct abstract class.");
    }
  }

  update() {
    throw new TypeError("Do not call abstract method foo from child.");
  }
}

class HexaObserver extends Observer {
  constructor(subject) {
    super();
    this.subject = subject;
    this.subject.attach(this);
  }

  update() {
    console.log("Hexa String: " + this.subject.state.toString(16));
  }
}

class OctalObserver extends Observer {
  constructor(subject) {
    super();
    this.subject = subject;
    this.subject.attach(this);
  }

  update() {
    console.log("Octal String: " + this.subject.state.toString(8));
  }
}

class BinaryObserver extends Observer {
  constructor(subject) {
    super();
    this.subject = subject;
    this.subject.attach(this);
  }

  update() {
    console.log("Binary String: " + this.subject.state.toString(2));
  }
}

(function () {
  const subject = new Subject();

  new HexaObserver(subject);
  new OctalObserver(subject);
  new BinaryObserver(subject);

  console.log("First state change: 15");
  subject.state = 15;
  console.log("Second state change: 10");
  subject.state = 10;
})()
```

## State Pattren
각 상태를 클래스로 분할하여 단순화한다.

```js
class StartState {
  doAction(context) {
    console.log("Player is in start state");
    context.state = this;
  }

  toString() {
    return "Start State";
  }
}

class StopState {
  doAction(context) {
    console.log("Player is in stop state");
    context.state = this;
  }

  toString() {
    return "Stop State";
  }
}

class Context {
  constructor() {
    this._state = null;
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;
  }
}

(function () {
  const context = new Context();

  const startState = new StartState();
  startState.doAction(context);

  console.log(context.state.toString());

  const stopState = new StopState();
  stopState.doAction(context);

  console.log(context.state.toString());
})()
```

## Strategy Pattern
런타임 환경에서 알고리즘을 변경할 수 있다.
```js
class Context {
  constructor(strategy) {
    this._strategy = strategy;
  }

  executeStrategy(a, b) {
    return this.strategy.doOperation(a, b);
  }

  get strategy() {
    return this._strategy;
  }

  set strategy(strategy) {
    this._strategy = strategy;
  }
}

class OperationAdd {
  doOperation(a, b) {
    return a + b;
  }
}

class OperationSubstract {
  doOperation(a, b) {
    return a - b;
  }
}

class OperationMultiply {
  doOperation(a, b) {
    return a * b;
  }
} 

(function () {
  let context = new Context(new OperationAdd());
  console.log("10 + 5 = " + context.executeStrategy(10, 5));

  context = new Context(new OperationSubstract());
  console.log("10 - 5 = " + context.executeStrategy(10, 5));

  context = new Context(new OperationMultiply());
  console.log("10 * 5 = " + context.executeStrategy(10, 5));
})()
```

## Template Pattern
알고리즘의 일부분만 공유하고, 일부분만 다른 방법으로 구현하는 방식.
알고리즘의 일부만 구현하고 다른 부분은 나중에 다른 클래스에서 이 부분을 재정의하여 확장함(추상화)
```js
class Game {
  constructor() {
    if (this.constructor === Game) {
      return TypeError("Can not construct abstract class");
    }
  }

  initialize() {
    throw new TypeError("Do not call abstract method from child.");
  }

  startPlay() {
    throw new TypeError("Do not call abstract method from child.");
  }

  endPlay() {
    throw new TypeError("Do not call abstract method from child.");
  }

  play() {
    //initialize the game
    this.initialize();

    //start game
    this.startPlay();

    //end game
    this.endPlay();
  }
}

class Cricket extends Game {
  initialize() {
    console.log("Cricket Game Initialized! Start playing.");
  }

  startPlay() {
    console.log("Cricket Game Started. Enjoy the game!");
  }

  endPlay() {
    console.log("Cricket Game Finished!");
  }
}

class Football extends Game {
  initialize() {
    console.log("Football Game Initialized! Start playing.");
  }

  startPlay() {
    console.log("Football Game Started. Enjoy the game!");
  }

  endPlay() {
    console.log("Football Game Finished!");
  }
}

(function () {
  let game = new Cricket();
  game.play();

  game = new Football();
  game.play();
})()
```

## Visitor Pattern
알고리즘을 객체 구조에서 분리시키는 디자인 패턴이다. 이렇게 분리를 하면 구조를 수정하지 않고도 실질적으로 새로운 동작을 기존의 객체 구조에 추가할 수 있게 된다.
```js
class ComputerPartDisplayVisitor {
  visit(part) {
    switch (part.constructor) {
      case Computer:
        console.log("Displaying Computer.")
        break;
      case Mouse:
        console.log("Displaying Mouse.")
        break;
      case Keyboard:
        console.log("Displaying Keyboard.")
        break;
      case Monitor:
        console.log("Displaying Monitor.")
        break;
    }
  }
}

class Computer {
  constructor(parts) {
    this.parts = parts;
  }

  accept(visitor) {
    this.parts.forEach((p) => {
      p.accept(visitor);
    })
    visitor.visit(this);
  }
}

class Mouse {
  accept(visitor) {
    visitor.visit(this);
  }
}

class Keyboard {
  accept(visitor) {
    visitor.visit(this);
  }
}

class Monitor {
  accept(visitor) {
    visitor.visit(this);
  }
}

(function () {
  const computer = new Computer([new Mouse(), new Keyboard(), new Monitor()]);
  computer.accept(new ComputerPartDisplayVisitor());
})()
```