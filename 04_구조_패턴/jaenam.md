## Adapter pattern

```js
class Duck {
    quack () {
        console.log('꽥')
    }
    fly () {
        console.log("나는듯 안나는듯 날고있어!")
    }
}
class Sparrow {
    twitter () {
        console.log('짹짹')
    }
    fly () {
        console.log('누구보다 가볍게 남들보다 빠르게 날아가는 바람위의 나그네!')
    }
}

class SparrowDuckAdapter {
    constructor (sparrow) {
        this.sparrow = sparrow
    }
    quack () {
        return this.sparrow.twitter()
    }
    fly () {
        return this.sparrow.fly()
    }
}

const duck = new Duck()
const sparrow = new SparrowDuckAdapter(new Sparrow())

duck.quack()
duck.fly()
sparrow.quack()
sparrow.fly()
```