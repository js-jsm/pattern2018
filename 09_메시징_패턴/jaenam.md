# CH 9. 메시징 패턴

## 3. 발행-구독 (Publish-subscribe)  

```js
class Publisher {
    constructor (name) {
        this.subscribers = new Set()
        this.name = name
    }
    subscribe (subscriber) {
        this.subscribers.add(subscriber);
    }
    unsubscribe (subscriber) {
        this.subscribers.delete(subscriber);
    }
    publish (item) {
        for(let sub of this.subscribers) {
            sub.receive(this.name, item);
        }
    }
}
class Newsletter extends Publisher {
    constructor () {
        super('뉴스레터')
    }
}
class Magazine extends Publisher {
    constructor () {
        super('잡지')
    }
}

class Subscriber {
    constructor (name) {
        this.name = name
    }
    subscribe (target) {
        target.subscribe(this)
    }
    unsubscribe (target) {
        target.unsubscribe(this)
    }
    receive (target, item) {
        if(this.constructor.name === 'Subscriber') {
            throw new Error('this method should be invoked by an instance of sub class');
        }
    }
}
class Student extends Subscriber {
    receive (target, item) {
        console.log(`${this.name}이(가) ${target}의 ${item}을(를) 스크랩했지만 읽을 생각은 없다.`)
    }
}
class Teacher extends Subscriber {
    receive (target, item) {
        console.log(`${this.name}이(가) ${target}의 ${item}을(를) 읽기는 했으나 이해하진 못했다.`);
    }
}
const sportsSeoul = new Newsletter()
const bigissue = new Magazine()
const jn = new Student('젠남')
const wj = new Teacher('웡쥰')
const dh = new Teacher('두형')
jn.subscribe(sportsSeoul)
jn.subscribe(bigissue)
wj.subscribe(sportsSeoul)
sportsSeoul.publish('4월 1일 조간신문')
bigissue.publish('맥심 3월호')

dh.subscribe(sportsSeoul)
dh.subscribe(bigissue)
sportsSeoul.publish('4월 1일 석간신문')
bigissue.publish('맥심 3월호 2쇄')

jn.unsubscribe(sportsSeoul)
sportsSeoul.publish('4월 2일 조간신문')
bigissue.publish('맥심 4월호')
```