# 4장 - Structural Pattern

구조적 패턴 소개

Gist - [Mastering Javascript Design Pattern Chapter 04 · GitHub](https://gist.github.com/emaren84/39c53a112f6f6ab21c0dd56c107da384)

## Adapter

- 주어진 인터페이스를 만족하는 추상화된 클래스를 만드는 것. 본래 객체를 숨긴 클래스를 생성한 뒤 숨겨진 객체의 메서드를 대신 호출해준다.
- 예를 들어 서드파티 라이브러리등의 외부 객체를 사용할 때 그 객체의 인터페이스를 바로 사용하기에는 복잡하고 절차가 많을 수 있다
- 이를 포장한 객체를 만들어서 더 단순화된 메서드를 제공한다 -> 메서드 하나가 라이브러리의 메서드 여러개를 같이 수행해주는 등
- 라이브러리를 직접 작성할 때도 내부 메서드를 감추고 제한된 기능만 제공하는 용도로 사용할 수 있다.
- 유의해야할 점은 **Adapter** 라는 이름을 래핑 클래스에 함부로 사용해서 클라이언트가 자신이 어댑터를 호출하고 있다는 사실을 노출하는 일을 피하는 것이다.
- 어댑의 규모가 너무 커지면 ‘단일 책임 원칙’ 을 잘 따르는 클래스를 만들고 있는지 다시 한번 생각해봐야 한다.

```ts
interface Ship {
  SetRudderAngleTo(angle: number);
  SetSailConfiguration(configuration: SailConfiguration);
  SetSailAngle(SailId: number, sailAngle: number);
  GetCurrentBearing(): number;
  GetCurrentSpeedEstimate(): number;
  ShiftCrewWeightTo(weightToShift: number, locationId: number);
}

interface SailConfiguration {
  crews: number;
  foods: number;
}

interface SimpleShip {
  TurnLeft();
  TurnRight();
  GoFoward();
}

// 예제 코드의 구현방법이 잘못되었다고 느끼는 부분이 있는데,
// Apater에 사용할 Ship을 주입받지 않고 외부에 글로벌 변수에서 참고한다는 점이다.
class ShipAdater implements SimpleShip {
  private ship: Ship;
  constructor(ship: Ship) {
    this.ship = ship;
  }

  TurnLeft() {
    this.ship.SetRudderAngleTo(-30);
    this.ship.SetSailAngle(3, 12);
  }

  TurnRight() {
    this.ship.SetRudderAngleTo(30);
    this.ship.SetSailAngle(5, -9);
  }

  GoFoward() {
    this.ship.SetRudderAngleTo(0);
    this.ship.SetSailAngle(0, 0);
    this.ship.GetCurrentSpeedEstimate();
  }
}

// 메서드의 구현부는 생략
class Boat implements Ship {
  SetRudderAngleTo(angle: number) {
    throw new Error("Method not implemented.");
  }
  SetSailConfiguration(configuration: SailConfiguration) {
    throw new Error("Method not implemented.");
  }
  SetSailAngle(SailId: number, sailAngle: number) {
    throw new Error("Method not implemented.");
  }
  GetCurrentBearing(): number {
    throw new Error("Method not implemented.");
  }
  GetCurrentSpeedEstimate(): number {
    throw new Error("Method not implemented.");
  }
  ShiftCrewWeightTo(weightToShift: number, locationId: number) {
    throw new Error("Method not implemented.");
  }
}

const ship = new ShipAdater(new Boat);
ship.GoFoward();
ship.TurnLeft();
```

## Bridge

- 서로 다른 두 객체가 같은 인터페이스를 사용할 수 있도록 추상화된 인터페이스를 만드는 패턴인가?
- 실질적으로 자바스크립트에서는 `interface` 가 없기 때문에 Adapter, Bridge 가 거의 유사한 패턴으로 동작한다.
- 이렇게 객체를 프록시화하는 패턴은 특히 팩토리 메서드 패턴과 잘 어울린다.

```ts
namespace Religion {
  export interface God {
    prayTo(withSomething?: Sacrifice | HumanSacrifice | PrayerPurpose): void;
  }

  export class OldGods implements God {
    prayTo(sacrifice: Sacrifice) {
      console.log('We Old Gods hear your prayer');
    }
  }

  export class DrownedGod {
    prayTo(humanSacrifice: HumanSacrifice) {
      console.log('*BUBBLE* GURGLE');
    }
  }

  export class SevenGods {
    prayTo(prayerPurpose: PrayerPurpose) {
      console.log(
        'Sorry there are a lot of us, it gets confusing here. Did you pray for something?'
      );
    }
  }

  class Sacrifice {}
  class HumanSacrifice {}
  class PrayerPurpose {}

  export class PrayerPurposeProvider {
    GetPurpose() {
      return new PrayerPurpose();
    }
  }

  export class OldGodsAdapter {
    constructor(private oldGoods: OldGods) {}

    prayTo() {
      const sacrifice = new Sacrifice();
      this.oldGoods.prayTo(sacrifice);
    }
  }

  export class DrownedGodAdapter {
    constructor(private drownedGod: DrownedGod) {}

    prayTo() {
      const sacrifice = new HumanSacrifice();
      this.drownedGod.prayTo(sacrifice);
    }
  }

  export class SevenGodsAdapter {
    constructor(
      private sevenGods: SevenGods,
      private prayerPurposeProvider: PrayerPurposeProvider
    ) {}

    prayTo() {
      this.sevenGods.prayTo(this.prayerPurposeProvider.GetPurpose());
    }
  }
}

const god1 = new Religion.SevenGodsAdapter(
  new Religion.SevenGods(),
  new Religion.PrayerPurposeProvider()
);
const god2 = new Religion.DrownedGodAdapter(new Religion.DrownedGod());
const god3 = new Religion.OldGodsAdapter(new Religion.OldGods());

const gods: Religion.God[] = [god1, god2, god3];

for (const god of gods) {
  god.prayTo();
}
```

## Composite

- 상속을 사용하게 되면 아주 강한 결속이 발생하고 재사용이 어렵게 된다.
- 이럴 때 Composite(조합) 을 사용하여 클래스 사이에 조합을 하는 방식을 사용한다.
- 중요한 점은 각 컴포넌트의 자손을 인터페이스만 맞다면 교체 가능하다는 점이다.

```ts
namespace Composite {
  interface IMenuComponent {
    render(parentElement: HTMLElement): void;
  }

  interface IMenuItem extends IMenuComponent {}

  interface IMenu extends IMenuComponent {
    children: IMenuComponent[];
  }

  class MenuItemLink implements IMenuItem {
    constructor(public displayName: string, public url: string) {}

    render(parentElement: HTMLElement) {
      const link: HTMLAnchorElement = document.createElement('a');
      link.textContent = this.displayName;
      link.href = this.url;
      parentElement.appendChild(link);
    }
  }

  class MenuItemImageLink implements IMenuItem {
    constructor(
      public displayName: string,
      public url: string,
      public imageUrl: string
    ) {}

    render(parentElement: HTMLElement) {
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = this.url;
      const img: HTMLImageElement = document.createElement('img');
      img.src = this.imageUrl;
      link.appendChild(img);

      const text = document.createTextNode(this.displayName);
      link.appendChild(text);

      parentElement.appendChild(link);
    }
  }

  class Menu implements IMenu {
    public children: IMenuComponent[] = [];

    constructor(public displayName?: string) {}

    render(parentElement: HTMLElement) {
      if (this.displayName) {
        parentElement.appendChild(document.createTextNode(this.displayName));
      }

      const ul: HTMLUListElement = document.createElement('ul');

      this.children.forEach(child => {
        const li: HTMLLIElement = document.createElement('li');
        child.render(li);
        ul.appendChild(li);
      });

      parentElement.appendChild(ul);
    }
  }

  window.addEventListener('load', function() {
    const menu: IMenu = new Menu();
    for (var i = 1; i <= 3; i++) {
      menu.children.push(new MenuItemLink('Link ' + i, '?id=' + i));
    }

    menu.children.push(
      new MenuItemImageLink(
        'Contact',
        'mailto:info@sample.com',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAITSURBVBgZpcHLThNhGIDh9/vn7/RApwc5VCmFWBPi1mvwAlx7BW69Afeu3bozcSE7E02ILjCRhRrds8AEbKVS2gIdSjvTmf+TYqLu+zyiqszDMCf75PnnnVwhuNcLpwsXk8Q4BYeSOsWpkqrinJI6JXVK6lSRdDq9PO+19vb37XK13Hj0YLMUTVVyWY//Cf8IVwQEGEeJN47S1YdPo4npDpNmnDh5udOh1YsZRcph39EaONpnjs65oxsqvZEyTaHdj3n2psPpKDLBcuOOGUWpZDOG+q0S7751ObuYUisJGQ98T/Ct4Fuo5IX+MGZr95jKjRKLlSxXxFxOEmaaN4us1Upsf+1yGk5ZKhp8C74H5ZwwCGO2drssLZZo1ouIcs2MJikz1oPmapHlaoFXH1oMwphyTghyQj+MefG+RblcoLlaJG/5y4zGCTMikEwTctaxXq/w9kuXdm9Cuzfh9acujXqFwE8xmuBb/hCwl1GKAnGccDwIadQCfD9DZ5Dj494QA2w2qtQW84wmMZ1eyFI1QBVQwV5GiaZOpdsPaSwH5HMZULi9UmB9pYAAouBQbMHHrgQcnQwZV/KgTu1o8PMgipONu2t5KeaNiEkxgAiICDMCCFeEK5aNauAOfoXx8KR9ZOOLk8P7j7er2WBhwWY9sdbDeIJnwBjBWBBAhGsCmiZxPD4/7Z98b/0QVWUehjkZ5vQb/Un5e/DIsVsAAAAASUVORK5CYII='
      )
    );

    const subMenu: IMenu = new Menu('Sub Menu');
    for (var i = 1; i <= 2; i++) {
      subMenu.children.push(new MenuItemLink('Sub Link ' + i, '?id=' + i));
    }

    menu.children.push(subMenu);

    const contentDiv = document.getElementById('output');
    menu.render(contentDiv);
  });
}
```

## Decorator

- 해당 컴포넌트의 하위 클래스를 만드는 방법을 대체할 수 있다. 보통 하위 클래스 생성은 컴파일 타임에 작동하고 강한 결합을 보이지만, 데코레이터는 런타임에서 작동하기 때문에 이런 문제가 없다.
- Adapter, Bridge 패턴과 유사하게 보일 수 있으나 데코레이터는 타겟 객체의 메서드를 프록시만 해주는 것이 아니라 직접 변형을 가하면서 동작한다.
- 기존의 코드를 이 패턴으로 많이 대체하고자 하는 유혹에 빠질 수 있으나 유지보수성을 잘 고려해야 한다.
- 특히 상속이 제한된 환경에서 유용하게 사용될 수 있다.

```ts
interface IArmor {
  calculateDamageFromHit(hit: IHit);
  getArmorIntegrity(): number;
}

interface IHit {
  location: string;
  weapon: string;
  strength: number;
}

class BasicArmor implements IArmor {
  constructor(private baseArmorPoint: number = 1) {}

  calculateDamageFromHit(hit: IHit) {
    console.log(`You got damage in ${hit.location} by ${hit.weapon}`);
    return this.baseArmorPoint * hit.strength;
  }

  getArmorIntegrity() {
    return this.baseArmorPoint;
  }
}

class ChainMail implements IArmor {
  constructor(private decoratedArmor: IArmor) {}

  calculateDamageFromHit(hit: IHit) {
    const reducedHit = {
      ...hit,
      strength: hit.strength * 0.8,
    };

    return this.decoratedArmor.calculateDamageFromHit(reducedHit);
  }

  getArmorIntegrity() {
    return 0.9 * this.decoratedArmor.getArmorIntegrity();
  }
}

const armor = new ChainMail(new BasicArmor());
console.log(
  armor.calculateDamageFromHit({
    location: 'head',
    weapon: 'Long Sword',
    strength: 12,
  })
);
```

## Facade(퍼사드)

- 여러 클래스의 인터페이스를 감싸는 추상화된 클래스를 제공한다.
- 여러 API 요청을 한번에 다루는 데 유용하게 사용할 수 있다.

```ts
class BlurayPlayer {
  on() {
    console.log('Bluray player turning on...');
  }

  turnOff() {
    console.log('Bluray player turning off...');
  }

  play() {
    console.log('Playing bluray disc...');
  }
}

class Amplifier {
  on() {
    console.log('Amplifier is turning on...');
  }

  turnOff() {
    console.log('Amplifier turning off...');
  }

  setSource(source: string) {
    console.log(`Setting source to ${source}`);
  }

  setVolume(volumeLevel: number) {
    console.log(`Setting volume to ${volumeLevel}`);
  }
}

class Lights {
  dim() {
    console.log('Lights are dimming...');
  }
}

class TV {
  turnOn() {
    console.log('TV is turning on...');
  }

  turnOff() {
    console.log('TV is turning off...');
  }
}

class PopcornMaker {
  turnOn() {
    console.log('Popcorn maker is turning on...');
  }

  turnOff() {
    console.log('Popcorn maker is turning off...');
  }

  pop() {
    console.log('Popping corn!');
  }
}

class HomeTheaterFacade {
  private amp: Amplifier;
  private bluray: BlurayPlayer;
  private lights: Lights;
  private tv: TV;
  private popcornMaker: PopcornMaker;

  constructor({
    amp,
    bluray,
    lights,
    tv,
    popcornMaker,
  }: {
    amp: Amplifier;
    bluray: BlurayPlayer;
    lights: Lights;
    tv: TV;
    popcornMaker: PopcornMaker;
  }) {
    this.amp = amp;
    this.bluray = bluray;
    this.lights = lights;
    this.tv = tv;
    this.popcornMaker = popcornMaker;
  }

  watchMovie() {
    this.popcornMaker.turnOn();
    this.popcornMaker.pop();

    this.lights.dim();

    this.tv.turnOn();

    this.amp.on();
    this.amp.setSource('bluray');
    this.amp.setVolume(11);

    this.bluray.on();
    this.bluray.play();
  }

  endMovie() {
    this.popcornMaker.turnOff();
    this.amp.turnOff();
    this.tv.turnOff();
    this.bluray.turnOff();
  }
}

// ========================================================

const homeTheater = new HomeTheaterFacade({
  amp: new Amplifier(),
  bluray: new BlurayPlayer(),
  lights: new Lights(),
  tv: new TV(),
  popcornMaker: new PopcornMaker(),
});

homeTheater.watchMovie();
```

## Flyweight

- 많은 양의 인스턴스를 다루는 일은 많은 메모리를 소모한다. 만약 공통된 값을 공유해야 한다면 프로토타입을 이용하여 인스턴스 간의 값을 공유하도록 만들면 된다.
- 보통 특정 객체의 속성을 지정할 때 생성자 안에 `this` 바인딩을 하는 일이 많겠지만, 이 패턴을 이용하고자 하면 `Prototype.Property` 방식으로 직접 프로토타입에 속성을 지정한다. 그러면 생성되는 객체는 모두 같은 속성을 공유하게 된다.
- 일시적으로 특정 인스턴스에 프로토타입 값을 오버라이드 하였다가 원상복구 하고 싶다면 단순히 `delete` 를 사용하면 된다.

**(코드는 단순하기 때문에 생략)**

## Proxy

- 앞서 설명했던 여타 패턴과 유사하게 실제 인스턴스의 대리인 역할을 해준다.
- 일반적으로 사용되는 예
  - 비밀 데이터의 보호
  - 외부 메서드 호출을 담아두기
  - 실제 인스턴스의 호출 전후에 추가적인 액션 삽입하기
  - 무거운(값나가는) 객체의 실행을 최대한 미루기
- 다양한 웹 소켓 라이브러리에서 활용됨

```ts
interface IResource {
  fetch(): void;
}

class ResourceProxy implements IResource {
  constructor(private resource: Resource) {}

  fetch() {
    console.log('invoke resource fetch method');
    this.resource.fetch();
  }
}

class Resource implements IResource {
  fetch() {
    console.log('fetching resource');
  }
}

const proxy = new ResourceProxy(new Resource());
proxy.fetch();
```