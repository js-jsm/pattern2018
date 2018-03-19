# 5장 - 행동 패턴

- Gist - [Mastering Javascript Design Pattern Chapter 05 · GitHub](https://gist.github.com/emaren84/cbc09144a236270e5bd5c1d076aa9d63)
- 공부 중 찾은 참고 사이트(안타깝게도 JS로 된 코드는 없다) - [Design Patterns](https://sourcemaking.com/design_patterns)

## Command

- 현재 상태와 호출되어야 하는 메서드를 캡슐화하는 패턴
- 명령을 내리면서 Undo, Logging을 위해 다른 큐에 담아두는 등의 동작이 가능하다.
- 자바스크립트의 함수는 일급 객체이기 때문에 패러매터로 전달이 가능해서 비교적 쉽게 구현할 수 있다.
- 보통은 적확한 패러매터를 받을 수 있도록 클래스를 구성한다. 그리고 그 생성자에서 필요한 인자를 받는다. 인자가 제대로 들어왔는지 확인하고 제대로 들어오지 않았을 시 바로 실패했다고 알려주는 것이 나중에 실행할 때 문제가 생기는 것 보다 낫다.
- 이 패턴을 이용하여 사용할 명령을 미리 담아두고 호출자가 언제든지 미뤄진 시간에 호출하게 만들 수 있다.

```typescript
interface ICommand {
  execute(): void;
}

class ConcreteCommander1 implements ICommand {
  constructor(private receiver: Receiver) {}

  execute(): void {
    console.log("`execute` method of ConcreteCommand1 is being called!");
    this.receiver.action();
  }
}

class ConcreteCommander2 implements ICommand {
  constructor(private receiver: Receiver) {}

  execute(): void {
    console.log("`execute` method of ConcreteCommand2 is being called!");
    this.receiver.action();
  }
}

class Invoker {
  private commands: ICommand[] = [];

  storeAndExecute(cmd: ICommand) {
    this.commands.push(cmd);
    cmd.execute();
  }
}

class Receiver {
  action(): void {
    console.log("action is being called!");
  }
}

const receiver: Receiver = new Receiver(),
      command1: ICommand = new ConcreteCommander1(receiver),
      command2: ICommand = new ConcreteCommander2(receiver),
      invoker: Invoker = new Invoker();

invoker.storeAndExecute(command1);
invoker.storeAndExecute(command2);
```

## Interpreter

- DSL(Domain Specific Language)를 만드는 패턴
- 상대적으로 중요도가 떨어져서 건너뜀

## Iterator

- 단순히 배열이나 객체를 제외한 인스턴스에도 내부 요소를 반복 가능하도록 인터페이스를 구현하는 패턴.
- 보통은 `next` 메서드를 만들어 다음 요소를 꺼내는 동작을 실행하고, 더 꺼낼 요소가 없을 시 별도의 에러를 일으키기도 하고, `isDone` 등의 getter로 모든 요소를 꺼냈는지도 구현할 수 있다.
- ES6에서 이터레이터가 구현되어있기 때문에 실제 코드는 건너뜀

## Mediator

- 여러 객체를 한 곳에서 통제하고자 할때 사용하는 패턴. 각각의 객체를 통제하는 것보다 유지보수하기 용이하다.
- 보통 Observer(옵저버) 패턴과 비슷하게 여겨지는데, 옵저버 패턴은 데이터의 변경, 업데이트 시 여러 객체에게 한번에 상태를 알리는데 초점이 맞추어져 있다면 중재자 패턴은 ‘생성’ 시 행위에 초점이 맞추어져 있다.
- [The Mediator Pattern in JavaScript](http://jarrettmeyer.com/2016/04/21/mediator-pattern-in-javascript)

```typescript
interface ITempHandler {
  canHandle(msg: ITemperature): boolean;
  handle(msg: ITemperature): ITempMessage;
}

interface ITemperature {
  city: string;
  temp: number;
}

interface ITempMessage {
  temp: number;
  message: string;
}

class TempMediator {
  private handlers: ITempHandler[] = [];

  addHandler(handler: ITempHandler) {
    this.handlers.push(handler);
  }

  request(message: ITemperature) {
    return this.handlers
      .filter(handler => handler.canHandle(message))
      .map(handler => handler.handle(message));
  }
}

const tooColdHandler: ITempHandler = {
  canHandle(message) {
    return message.temp < 10;
  },
  handle(message) {
    return {
      temp: message.temp,
      message: `In ${message.city}, It is too cold!`
    };
  }
};

const tooHotHandler: ITempHandler = {
  canHandle(message) {
    return 30 <= message.temp;
  },
  handle(message) {
    return {
      temp: message.temp,
      message: `In ${message.city}, It is too hot!`
    };
  }
};

const niceDayHandler: ITempHandler = {
  canHandle(message) {
    return 15 <= message.temp && message.temp < 25;
  },
  handle(message) {
    return {
      temp: message.temp,
      message: `In ${message.city}, It should be a pleasant day today!`
    };
  }
};

const mediator = new TempMediator();
mediator.addHandler(tooColdHandler);
mediator.addHandler(tooHotHandler);
mediator.addHandler(niceDayHandler);

console.log(mediator.request({ city: 'Seoul', temp: 9 }));
console.log(mediator.request({ city: 'Busan', temp: 20 }));
console.log(mediator.request({ city: 'Daegu', temp: 35 }));
```

## Memento

- 객체의 상태를 변경 전 상태로 돌릴 수 있는 인터페이스를 구현하는 패턴
- Memento(상태 저장) <-> Originator(Memento 생성) <-> Caretaker(Originator 에게 상태 복원을 요청)
- Copy on Write 로 알려져 있음
- 현재 클라이언트 사이드(브라우저)에서는 Undo 기능이 그렇게 요구되지 않으나, 데스크탑에서는 충분히 많이 요구되고 있다. -> 그리고 현재는 브라우저에서도 기능이 복잡한 앱의 경우 충분히 Undo 기능을 이런 방식을 활용하여 구현할 수 있을 것이다.

```typescript
interface WorldState {
  numberOfKings: number;
  currentKingInKingsLanding: string;
  season: string;
}

class WorldStateProvider {
  private numberOfKings: number;
  private currentKingInKingsLanding: string;
  private season: string;

  setState(newState: {
    numberOfKings?: number;
    currentKingInKingsLanding?: string;
    season?: string;
  }) {
    if (Object.keys(newState).length <= 0) {
      throw new Error('There is no information to set the state');
    }

    for (const prop in newState) {
      this[prop] = newState[prop];
    }
  }

  saveMemento(): WorldState {
    return {
      numberOfKings: this.numberOfKings,
      currentKingInKingsLanding: this.currentKingInKingsLanding,
      season: this.season
    };
  }

  restoreMemento(memento: WorldState) {
    this.setState(memento);
  }
}

class SoothSayer {
  private startingPoints: WorldState[] = [];
  private currentState: WorldStateProvider = new WorldStateProvider();

  setInitialConditions(state: WorldState) {
    this.currentState.setState(state);
  }

  storeMemento() {
    const currentMemento = this.currentState.saveMemento();
    this.startingPoints.push(currentMemento);
  }

  alterNumberOfKingsAndForetell(numberOfKings: number) {
    this.storeMemento();
    this.currentState.setState({ numberOfKings });
    // run some sort of prediction
  }

  alterSeasonAndForetell(season: string) {
    this.storeMemento();
    this.currentState.setState({ season });
  }

  alterCurrentKingInKingsLandingAndForeTell(currentKingInKingsLanding: string) {
    this.storeMemento();
    this.currentState.setState({ currentKingInKingsLanding });
  }

  tryADifferentChange() {
    const previousState = this.startingPoints.pop();
    this.currentState.restoreMemento(previousState);
  }
}
```

## Observer

- 굉장히 유명한 패턴 중 하나이며, MVVM(Model-View-ViewModel) 구조에서 큰 역할을 맡고 있다.
- 프로티를 Getter와 Setter 인스턴스로 나누어 구분한다고 치고, Setter에서 이벤트가 일어날 때 다른 객체에게 ‘값이 변했다’ 라고 알려준다면?
- 이벤트를 수신하는 객체가 반드시 이전 값을 추적할 필요는 없다.
- 보통은 수신자 하나만 호출하기보다 `subscribe` 라는 개념으로 여러 객체에게 변경 사항을 알릴 수 있다.
- 참고로 책에서 jQuery와 함께 제시된 예시 중 하나인 `document.getElementsByTagName` + `for` 루프는 변수 스코프때문에 원하는대로 동작하지 않는다. -> `buttons` 루프를 돌 때 `forEach` 를 사용해야한다. [JSFiddle](https://jsfiddle.net/gswkm6gv/4/)

```typescript
interface Player {
  id: number;
  name: string;
  onKingPainKillerChange(painKillers: number): void;
}

class Spy {
  private painKillers: number;
  private partiesToNotify: Player[] = [];

  subscribe(subscriber: Player) {
    this.partiesToNotify.push(subscriber);
  }

  unsubscribe(subscriber: Player) {
    this.partiesToNotify =
      this.partiesToNotify.filter(player => player.id !== subscriber.id);

    console.log('Subscribers has changed');
    console.log('Current Subscribers: ' +
      this.partiesToNotify.map(p => p.name).join(', '));
  }

  setPainKillers(painKillers: number) {
    this.painKillers = painKillers;

    for (const player of this.partiesToNotify) {
      player.onKingPainKillerChange(painKillers);
    }
  }
}

function createPlayer(id: number, name: string): Player {
  return {
    id,
    name,
    onKingPainKillerChange(painKillers) {
      console.log(`Player ${name} - We need ${painKillers} more painKillers!`);
    }
  }
}

const spy = new Spy();
const p1 = createPlayer(1, 'John');
const p2 = createPlayer(2, 'Susan');
const p3 = createPlayer(3, 'Pheobe');

spy.subscribe(p1);
spy.subscribe(p2);
spy.subscribe(p3);

spy.setPainKillers(12);

spy.unsubscribe(p2);
```

## State

- 상태 기계(State machine)은 굉장히 유용한 편이나 각 상태를 구분하는데 다량의 `if` 문이 들어가는 문제가 있다. 이 문제를 걷어내기 위해 거대한 `if` 블록을 만들기 보다 State 패턴을 활용한다.
- State 패턴은 하나의 관리자 클래스가 추상회된 형태로 내부 상태를 관리하고 적절한 상태에 메세지를 전달해주도록 만드는 패턴이다.
- 각각 상태 변화에 일종의 훅을 걸어 조금 다채로운 구현을 끌어낼 수도 있을 것 같고, 각각의 상태 조건이 별도로 관리되고 있다는 점이 중요한 포인트로 보인다.

```typescript
interface Actionable<T> {
  cancel(): T;
  verify(): T;
  ship(): T;
}

interface State extends Actionable<State> {}

class Order implements Actionable<Order> {
  private state: State;

  constructor(state: State = new Placed()) {
    this.state = state;
  }

  cancel(): Order {
    return new Order(this.state.cancel());
  }

  verify(): Order {
    return new Order(this.state.verify());
  }

  ship(): Order {
    return new Order(this.state.ship());
  }
}

class Placed implements State {
  cancel(): State {
    console.log("Cancelling the order");
    return new Cancelled();
  }

  verify(): State {
    console.log("Verifying the payment");
    return new Verified();
  }

  ship(): State {
    console.log("Cannot ship. Payment verification is required");
    return this;
  }
}

class Cancelled implements State {
  cancel(): State {
    console.log("Cannot cancel. Order has already been cancelled");
    return this;
  }

  verify(): State {
    console.log("Cannot verify. Order has been cancelled");
    return this;
  }

  ship(): State {
    console.log("Cannot ship. Order has been cancelled");
    return this;
  }
}

class Verified implements State {
  cancel(): State {
    console.log("Cancelling the order");
    return new Cancelled();
  }

  verify(): State {
    console.log("Will not verify. Order has already been verified");
    return this;
  }

  ship(): State {
    console.log("Shipping");
    return new Shipped();
  }
}

class Shipped implements State {
  cancel(): State {
    console.log("Cannot cancel. Order has already been shipped");
    return this;
  }

  verify(): State {
    console.log("Will not verify. Order has already been shipped");
    return this;
  }

  ship(): State {
    console.log("Will not ship. Order has already been shipped");
    return this;
  }
}

let order = new Order();
console.log(order);

order = order
  .verify()
  .ship()
  .cancel();
console.log(order);
```

## Strategy

- 특정 객체가 필요에 따라 다른 인터페이스를 치환하여 쓸 수 있는 패턴
- 스마트폰이 GPS로 위치를 잡는 것을 예로 들어 표현하고 있는데, 예를 들어 GPS 칩을 직접 이용하여 현재 위치를 잡는 것이 가장 정확도는 높지만 배터리를 많이 소모하고, 주변 Wifi AP를 사용하는 경우 배터리를 적게 먹고 빠르지만 정확도가 매우 떨어지게 된다.
- 알맞은 Strategy(전략)을 선택하는 방법은 몇 가지가 있다.
  - 먼저 환경 변수나 하드코딩으로 직접 써넣는 방법이 있다. 전략의 변경이 잦지 않거나 특정한 사용자에 적용되는 전략을 사용할 때 가능하다.
  - 제공된 데이터를 기반으로 어느 전략이 적절한지 선택되도록 할 수 있다.
  - 특정 알고리즘이 데이터 타입에 따라 실패하는 경우에도 전략을 어떻게 선택할지 고르게 할 수 있다. 웹 애플리케이션의 경우 데이터 유형에 따라 다른 엔드포인트로 요청을 하게 만들 수 있다.
  - 빠르고 부정확한 알고리즘과 느리지만 정확한 알고리즘이 동시에 실행되도록 한 뒤에 순차적으로 끼워넣는 방법을 선택할 수도 있다.
  - 완전히 랜덤으로 선택하는 방법도 있는데, 서로 다른 전략을 비교하는데 사용될 수 있으며 이 아이디어가 A/B 테스팅의 근간이 된다.
  - 어떤 전략을 사용할지 고르는 것은 Factory pattern과 잘 맞아떨어진다.

```typescript
interface ITravelMethod {
  travel(source: string, destination: string): ITravelResult;
}

interface ITravelResult { 
  source: string;
  destination: string;
  durationInDays: number;
  probabilityOfDeath: number;
  cost: number;
}

class SeaGoingVessel implements ITravelMethod {
  travel(source, destination) {
    return {
      source,
      destination,
      durationInDays: 15,
      probabilityOfDeath: 0.25,
      cost: 500
    };
  }
}

class Horse implements ITravelMethod {
  travel(source, destination) {
    return {
      source,
      destination,
      durationInDays: 30,
      probabilityOfDeath: 0.25,
      cost: 50
    };
  }
}

class Walk implements ITravelMethod {
  travel(source, destination) {
    return {
      source,
      destination,
      durationInDays: 150,
      probabilityOfDeath: 0.55,
      cost: 0
    };
  }
}

function getCurrentMoney(): number {
  return Math.floor(Math.random() * 100);
}

const currentMoney = getCurrentMoney();
let strat: ITravelMethod;

if (currentMoney > 500) {
  strat = new SeaGoingVessel();
} else if (currentMoney > 50) {
  strat = new Horse();
} else {
  strat = new Walk();
}

console.log(strat.travel('Seoul', 'Jeju'));
```

## Template Method

- Strategy 패턴처럼 자주 전체 알고리즘을 바꾸는 일은 과한 작업이다. 보통은 대부분의 로직은 변하지 않지만 작은 부분만 변하기 때문이다. 
- 템플릿 메서드는 일부분은 공통의 알고리즘을 사용하고 다른 부분은 각기 다른 접근방식으로 구현되도록 하는 패턴이다.
- 이를 적극적으로 활용한 예가 추상 클래스 제작 및 추상클래스의 단계별 상속이다.

## Visitor

- 알고리즘과 그 알고리즘이 작동하는 객체의 분리를 위한 메서드를 만드는 패턴
- 특정 타입에 따라 Visitor가 행위를 수행할지 말지 결정하게 만든다. 다만 자바스크립트에서는 명확하게 타입 체킹을 하기 어렵기 때문에 인스턴스 변수에 `type` 같은 속성을 두어 구분하게 만들 수는 있다.
- 구현할 때 어려운 점이 있는데, 방문자가 방문한 객체에 따라 실행할 메서드를 고르는 방식으로 구현하게 된다면 로직이 복잡해지고, 일관된 인터페이스를 사용하도록 만들면 ‘타겟 객체는 방문자의 존재를 알면 안된다’ 는 개념에 반하게 된다.
- 저자는 Visitor 패턴을 자바스크립트로 구현하는 것은 요구사항이 복잡하고 분명하지 않기 때문에 잘 쓰지 않는 경향이 있다고 한다.

```typescript
namespace Visitor {
  interface IElementVisitor {
    visitElement(element: Element): void;
    visitElementNode(elementNode: ElementNode): void;
  }

  export class Element {
    private _name: string;
    private _parent: ElementNode;

    constructor(name: string, parent?: ElementNode) {
      if (!name) {
        throw new Error("Argument null exception!");
      }

      this._name = name;
      this._parent = parent;
    }

    get name(): string {
      return this._name;
    }

    get parent(): ElementNode {
      return this._parent;
    }

    set parent(value: ElementNode) {
      this._parent = value;
    }

    get depth(): number {
      if (this._parent) {
        return this._parent.depth + 1;
      }

      return 0;
    }

    accept(visitor: IElementVisitor) {
      visitor.visitElement(this);
    }
  }

  export class ElementNode extends Element {
    private _children: Element[] = [];

    constructor(name: string, parent?: ElementNode) {
      super(name, parent);
    }

    get length(): number {
      return this._children.length;
    }

    appendChild(child: Element): ElementNode {
      child.parent = this;
      this._children.push(child);
      return this;
    }

    accept(visitor: IElementVisitor) {
      visitor.visitElementNode(this);
      this._children.forEach(function(child) {
        child.accept(visitor);
      });
    }
  }

  export class LogWriter implements IElementVisitor {
    visitElement(element: Element) {
      console.log("LogWriter is visiting the element: '" + element.name + "'");
    }

    visitElementNode(elementNode: ElementNode) {
      console.log(
        "LogWrite is visiting the element node: '" +
          elementNode.name +
          "'. Which has: " +
          elementNode.length +
          " child nodes."
      );
    }
  }

  export class ConsoleWriter implements IElementVisitor {
    visitElement(element: Element) {
      console.log(
        "ConsoleWriter is visiting the element: '" + element.name + "'"
      );
    }

    visitElementNode(elementNode: ElementNode) {
      console.log(
        "ConsoleWriter is visiting the element node: '" +
          elementNode.name +
          "'. Which has: " +
          elementNode.length +
          " child nodes."
      );
    }
  }
}

const constructedTree = new Visitor.ElementNode("first")
  .appendChild(new Visitor.Element("firstChild"))
  .appendChild(
    new Visitor.ElementNode("secondChild").appendChild(
      new Visitor.Element("furtherDown")
    )
  );
const logwriter = new Visitor.LogWriter();
constructedTree.accept(logwriter);

const consolewriter = new Visitor.ConsoleWriter();
constructedTree.accept(consolewriter);
```
