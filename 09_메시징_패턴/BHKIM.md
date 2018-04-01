# 9. 메시징 패턴

1. 메시지란 무엇인가  
1-1. 명령
1-2. 이벤트
2. 요청-응답 (Request-reply)
3. 발행-구독 (Publish-subscribe)  
3-1. 팬아웃과 팬인 (Fan out and fan in)
4. 데드-레터 큐 (Dead-letter queues)
5. 메시지 재생
6. 파이프와 필터

### 요청-응답 (Request-reply)
```js
class CrowMailRequestor {
    Request() {
        var message = { __messageDate: new Date(),
            __from: "requestor",
            __corrolationId: Math.random(),
            body: "Invade Most Cailin" };
        var bus = new CrowMailBus(this);
        bus.Send(message);
        console.log("Message sent!");
    }
    processMessage(message) {
        console.dir(message);
    }
}
class CrowMailResponder {
   constructor(bus) {
       this.bus = bus;
   }
   processMessage(message) {
       var response = { __messageDate: new Date(),
           __from: "responder",
           __corrolationId: message.__corrolationId,
           body: "Okay invaded." };
       this.bus.Send(response);
       console.log("Reply sent");
   }
}
class CrowMailBus {
    constructor(requestor) {
        this.requestor = requestor;
        this.responder = new CrowMailResponder(this);
    }
    Send(message) {
        if (message.__from == "requestor") {
            this.responder.processMessage(message);
        }
        else {
            this.requestor.processMessage(message);
        }
    }
}
var requestor = new CrowMailRequestor();
requestor.Request();
```

### 발행-구독 (Publish-subscribe)
```js
class CrowMailRequestor {
    constructor(bus) {
        this.bus = bus;
    }
    Request() {
        var message = { __messageDate: new Date(),
            __from: "requestor",
            __corrolationId: Math.random(),
            __messageName: "FindSquareRoot",
            body: "Hello there. What is the square root of 9?" };
        this.bus.Subscribe("SquareRootFound", this);
        this.bus.Send(message);
        console.log("message sent!");
    }
    processMessage(message) {
        console.log("I got");
        console.dir(message);
    }
}
class CrowMailResponder {
    constructor(bus) {
        this.bus = bus;
    }
    processMessage(message) {
        var response = { __messageDate: new Date(),
            __from: "responder",
            __corrolationId: message.__corrolationId,
            __messageName: "SquareRootFound",
            body: "Pretty sure it is 3." };
        this.bus.Publish(response);
        console.log("Reply published");
    }
}
class CrowMailBus {
    constructor() {
        this.responder = new CrowMailResponder(this);
        this.responders = [];
    }
    Send(message) {
        if (message.__from == "requestor") {
            this.responder.processMessage(message);
        }
    }
    Publish(message) {
        for (var i = 0; i < this.responders.length; i++) {
            if (this.responders[i].messageName == message.__messageName) {
                (function (b) {
                    b.subscriber.processMessage(message);
                })(this.responders[i]);
            }
        }
    }
    Subscribe(messageName, subscriber) {
        this.responders.push({ messageName: messageName, subscriber: subscriber });
    }
}
class TestResponder1 {
    processMessage(message) {
        console.log("Test responder 1: got a message");
    }
}
class TestResponder2 {
    processMessage(message) {
        console.log("Test responder 2: got a message");
    }
}
var bus = new CrowMailBus();
bus.Subscribe("SquareRootFound", new TestResponder1());
bus.Subscribe("SquareRootFound", new TestResponder2());
var requestor = new CrowMailRequestor(bus);
requestor.Request();
```

### 팬아웃과 팬인 (Fan out and fan in)
```js
class Combiner {
    constructor() {
        this.waitingForChunks = 0;
    }
    combine(ingredients) {
        console.log("Starting combination");
        if (ingredients.length > 10) {
            for (var i = 0; i < Math.ceil(ingredients.length / 2); i++) {
                this.waitingForChunks++;
                console.log("Dispatched chunks count at: " + this.waitingForChunks);
                var worker = new Worker("FanOutInWebWorker.js");
                worker.addEventListener('message', (message) => this.complete(message));
                worker.postMessage({ ingredients: ingredients.slice(i, i * 2) });
            }
        }
    }
    complete(message) {
        this.waitingForChunks--;
        console.log("Outstanding chunks count at: " + this.waitingForChunks);
        if (this.waitingForChunks == 0)
            console.log("All chunks received");
    }
}

// FanOutInWebWorker.js
self.addEventListener('message', function (e) {
    var data = e.data;
    var ingredients = data.ingredients;
    combinedIngredient = new CombinedIngredient();
    for (var i = 0; i < ingredients.length; i++) {
        combinedIngredient.Add(ingredients[i]);
    }
    console.log("calculating combination");
    setTimeout(combinationComplete, 2000);
}, false);
function combinationComplete() {
    console.log("combination complete");
    self.postMessage({ event: 'combinationComplete', result: combinedIngredient });
}
```
eg. [fanoutin.html](./bhkim_/fanoutin.html)

### 메시지 버전 관리
```js
module Login{
  export class CreateUserv1Message implements IMessage{
      __messageName: string
      UserName: string;
      FirstName: string;
      LastName: string;
      EMail: string;
  }

  export class CreateUserv2Message implements IMessage{
    __messageName: string;
    UserTitle: string;
  }

  export class CreateUserv1tov2Upgrader{
    constructor(public bus: IBus){}
    public processMessage(message: CreateUserv2Message){
      message.__messageName = "CreateUserv1Message";
      delete message.UserTitle;
      this.bus.publish(message);
    }
  }

  export interface IBus{
    publish(IMessage);
  }
  export interface IMessage{
    __messageName: string;
  }
}
```
