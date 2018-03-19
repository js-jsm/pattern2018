



# Behavioral Pattern -행동 패턴
>  클래스와 객체들이 상호작용하는 방법 및 역할을 분담하는 방법과 관련된 패턴
## 1. Strategy Pattern
> 상속을 위한 패턴 사용시 자식객체의 변화가 자주 발생시, <br>종류가 다양해지고 자식 객체마다 오버라이딩 해주어야 하기 때문에 유지보수 측면에서 좋지 않다.
> 교환 가능한 행동을 캡슐화하고 위임을 통해 어떤 행동을 사용할 지  결정한다.
> 즉 변하는 부분 캡슐화하여 변화하는 전략에 대응한다.
> <img src="http://www.dofactory.com/images/diagrams/javascript/javascript-strategy.jpg">
```js
var Shipping = function() {
    this.company = "";
};
 
Shipping.prototype = {
    setStrategy: function(company) {
        this.company = company;
    },
 
    calculate: function(package) {
        return this.company.calculate(package);
    }
};
 
var UPS = function() {
    this.calculate = function(package) {
        // calculations...
        return "$45.95";
    }
};
 
var USPS = function() {
    this.calculate = function(package) {
        // calculations...
        return "$39.40";
    }
};
 
var Fedex = function() {
    this.calculate = function(package) {
        // calculations...
        return "$43.20";
    }
};
 
// log helper
 
var log = (function() {
    var log = "";
 
    return {
        add: function(msg) { log += msg + "\n"; },
        show: function() { alert(log); log = ""; }
    }
})();
 
function run() {
    var package = { from: "76712", to: "10012", weigth: "lkg" };
 
    // the 3 strategies
 
    var ups = new UPS();
    var usps = new USPS();
    var fedex = new Fedex();
 
    var shipping = new Shipping();
 
    shipping.setStrategy(ups);
    log.add("UPS Strategy: " + shipping.calculate(package));
    shipping.setStrategy(usps);
    log.add("USPS Strategy: " + shipping.calculate(package));
    shipping.setStrategy(fedex);
    log.add("Fedex Strategy: " + shipping.calculate(package));
 
    log.show();
}

```

## 2. Mediator Pattern : 중재자 패턴
> 다대다 관계의 클래스에서 객체가 상호작용하는 방식을 캡슐화하여 
> 객체 그룹에 대해 유일한 변경장소로 동작하도록 한다.
> 
> <img src="http://www.dofactory.com/images/diagrams/javascript/javascript-mediator.jpg">
```js
var Participant = function(name) {
    this.name = name;
    this.chatroom = null;
};
 
Participant.prototype = {
    send: function(message, to) {
        this.chatroom.send(message, this, to);
    },
    receive: function(message, from) {
        log.add(from.name + " to " + this.name + ": " + message);
    }
};
 
var Chatroom = function() {
    var participants = {};
 
    return {
 
        register: function(participant) {
            participants[participant.name] = participant;
            participant.chatroom = this;
        },
 
        send: function(message, from, to) {
            if (to) {                      // single message
                to.receive(message, from);    
            } else {                       // broadcast message
                for (key in participants) {   
                    if (participants[key] !== from) {
                        participants[key].receive(message, from);
                    }
                }
            }
        }
    };
};
 
// log helper
 
var log = (function() {
    var log = "";
 
    return {
        add: function(msg) { log += msg + "\n"; },
        show: function() { alert(log); log = ""; }
    }
})();
 
function run() {
    var yoko = new Participant("Yoko");
    var john = new Participant("John");
    var paul = new Participant("Paul");
    var ringo = new Participant("Ringo");
 
    var chatroom = new Chatroom();
    chatroom.register(yoko);
    chatroom.register(john);
    chatroom.register(paul);
    chatroom.register(ringo);
 
    yoko.send("All you need is love.");
    yoko.send("I love you John.");
    john.send("Hey, no need to broadcast", yoko);
    paul.send("Ha, I heard that!");
    ringo.send("Paul, what do you think?", paul);
 
    log.show();
}
```

## 3. Command Pattern : 명령패턴
> 동작을 객체로 캡슐화한 명령 그자체.<br>
><img src="http://www.dofactory.com/images/diagrams/javascript/javascript-command.jpg">

```js
function add(x, y) { return x + y; }
function sub(x, y) { return x - y; }
function mul(x, y) { return x * y; }
function div(x, y) { return x / y; }
 
var Command = function (execute, undo, value) {
    this.execute = execute;
    this.undo = undo;
    this.value = value;
}
 
var AddCommand = function (value) {
    return new Command(add, sub, value);
};
 
var SubCommand = function (value) {
    return new Command(sub, add, value);
};
 
var MulCommand = function (value) {
    return new Command(mul, div, value );
};
 
var DivCommand = function (value) {
    return new Command(div, mul, value);
};
 
var Calculator = function () {
    var current = 0;
    var commands = [];
 
    function action(command) {
        var name = command.execute.toString().substr(9, 3);
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
 
    return {
        execute: function (command) {
            current = command.execute(current, command.value);
            commands.push(command);
            log.add(action(command) + ": " + command.value);
        },
 
        undo: function () {
            var command = commands.pop();
            current = command.undo(current, command.value);
            log.add("Undo " + action(command) + ": " + command.value);
        },
 
        getCurrentValue: function () {
            return current;
        }
    }
}
 
// log helper
 
var log = (function () {
    var log = "";
 
    return {
        add: function (msg) { log += msg + "\n"; },
        show: function () { alert(log); log = ""; }
    }
})();
 
function run() {
    var calculator = new Calculator();
 
    // issue commands
 
    calculator.execute(new AddCommand(100));
    calculator.execute(new SubCommand(24));
    calculator.execute(new MulCommand(6));
    calculator.execute(new DivCommand(2));
 
    // reverse last two commands
 
    calculator.undo();
    calculator.undo();
 
    log.add("\nValue: " + calculator.getCurrentValue());
    log.show();
}

```

## 4. State Pattern -  상태 패턴
> 상태패턴은 각 개체가 특정 상태를 나타내는 제한된 객체 집합에 상태 별 논리를 제공. 상태별 객체 자체 송성 집합과 메서드를 갖는다. 전환이 발생될때 상태 객체가 다른 상태 객체로 바뀌는 것. <br>
> <img src="http://www.dofactory.com/images/diagrams/javascript/javascript-state.jpg">
> 
```js
var TrafficLight = function () {
    var count = 0;
    var currentState = new Red(this);
 
    this.change = function (state) {
        // limits number of changes
        if (count++ >= 10) return;
        currentState = state;
        currentState.go();
    };
 
    this.start = function () {
        currentState.go();
    };
}
 
var Red = function (light) {
    this.light = light;
 
    this.go = function () {
        log.add("Red --> for 1 minute");
        light.change(new Green(light));
    }
};
 
var Yellow = function (light) {
    this.light = light;
 
    this.go = function () {
        log.add("Yellow --> for 10 seconds");
        light.change(new Red(light));
    }
};
 
var Green = function (light) {
    this.light = light;
 
    this.go = function () {
        log.add("Green --> for 1 minute");
        light.change(new Yellow(light));
    }
};
 
// log helper
 
var log = (function () {
    var log = "";
 
    return {
        add: function (msg) { log += msg + "\n"; },
        show: function () { alert(log); log = ""; }
    }
})();
 
function run() {
    var light = new TrafficLight();
    light.start();
 
    log.show();
}
```
