

## Structural Patterns

- Adapter
- Bridge
- Composite
- Decorator
- Facade
- Flyweight
- Private Class Data
- Proxy


## Adapter

![adapter](https://sourcemaking.com/files/v2/content/patterns/Adapter_example1.svg)

```js
class Line {
    draw(x1, y1, x2, y2) {
        console.log(`line from point A(${x1};${y1}), to point B(${x2};${y2})` )
    }
}

class Rectangle {
    draw(x1, y1, width, height) {
        console.log(`Rectangle with coordinate left-down point A(${x1};${y1}), width: ${width} height: ${height}` )
    }
}

class LineAdapter {
    constructor(line) {
        this.adaptee = line
    }

    draw(x1, y1, x2, y2) {
        this.adaptee.draw(x1, y1, x2, y2)
    }
}

class RectangleAdapter {
    constructor(rectangle) {
        this.adaptee = rectangle
    }

    draw(x1, y1, x2, y2) {
        const width =x2 + 10
        const height = y2 + 20
        this.adaptee.draw(x1, y1, width, height)
    }
}

class NormalAdapter {
    drawing() {
       const shapes = [new Line(), new Rectangle()]
       const [x1, y1, x2, y2] = [10, 20, 30, 40]
       const [width, height] = [50, 60]
       shapes.forEach(shape => {
           if (shape.constructor.name === 'Line')
             shape.draw(x1, y1, x2, y2)
           else if (shape.constructor.name === 'Rectangle')
             shape.draw(x1, y1, width, height)
           else
             throw new Error('unexpected')
       })
    }
}

class IndirectionAdapter {
    drawing() {
        const shapes = [
            new LineAdapter(new Line()),
            new RectangleAdapter(new Rectangle()),
            ]
        const [x1, y1, x2, y2] = [10, 20, 30, 40]
        shapes.forEach(shape => shape.draw(x1, y1, x2, y2))
    }
}
```

NormalAdapter는 Line 과 Rectangle 간에 인터페이스가 호환되지 않기 때문에 인자를 올바르게 넘겨야 했다.
IndirectionAdapter 는 간접 레벨로 우회 할 수 있는 방법을 보여준다.

어댑터는 이전 구성 요소를 새 시스템으로 변환하거나 매핑하는 중간 추상화를 작성하는 것에 관한 것입니다. 클라이언트는 Adapter 객체에서 메서드를 호출하여 레거시 구성 요소에 대한 호출로 리디렉션합니다. 이 전략은 상속 또는 집계로 구현할 수 있습니다.

어댑터는 "래퍼 (wrapper)"로 생각할 수도 있습니다.
래퍼란 필요한 데이터를 받거나 쓰기 위해 데이터 형태를 세팅해 제공하는 서비스 이다.

어댑터는 설계된 후에 일을 처리합니다. 다리는 그들이 일하기 전에 일하게 만든다.

브리지는 추상화와 구현을 독립적으로 수행 할 수 있도록 설계되었습니다. 관련이없는 클래스가 함께 작동하도록 어댑터가 개조되었습니다.

어댑터는 주제와 다른 인터페이스를 제공합니다. 프록시는 동일한 인터페이스를 제공합니다. Decorator는 향상된 인터페이스를 제공합니다.

어댑터는 기존 개체의 인터페이스를 변경하기위한 것입니다. Decorator는 인터페이스를 변경하지 않고도 다른 객체를 향상시킵니다. 따라서 Decorator는 어댑터보다 애플리케이션에 더 투명합니다. 

결과적으로 Decorator는 재귀 컴포지션을 지원하며 순수 어댑터에서는 불가능합니다.

Facade는 새 인터페이스를 정의하지만 Adapter는 이전 인터페이스를 재사용합니다. 

어댑터는 완전히 새로운 인터페이스를 정의하는 것과는 반대로 두 개의 기존 인터페이스를 함께 사용한다는 것을 기억하십시오.

## Bridge

```js

class OldGods {
    prayTo(sacrifice) {
        console.log('oldGods')
    }
}

class OldGodsAdapter {
    constructor() {
        this._oldGods = new OldGods()
    }

    prayTo(sacrifice) {
        const sacrifice = new Sacrifice()
        this._oldGods.prayTo(sacrifice)
    }
}

class DrownedGods {
    prayTo(sacrifice) {
        console.log('DrownedGods')
    }
}

class DrownedGodsAdapter {
    constructor() {
        this._drownedGods = new DrownedGods()
    }

    prayTo(sacrifice) {
        const sacrifice = new HumanSacrifice()
        this._drownedGods.prayTo(sacrifice)
    }
}

class SevenGods {
    prayTo(sacrifice) {
        console.log('SevenGods')
    }
}

class SevenGodsAdapter {
    constructor() {
        this._prayerPurposeProvider = new PrayerPurposeProvider()
        this._sevenGods = new SevenGods()
    }

    prayTo(sacrifice) {
        const sacrifice = new PrayerPurposeProvider()
        this._sevenGods.prayTo(this._prayerPurposeProvider.getPerpose())
    }
}

```