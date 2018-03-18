## Chain of Responsibility
객체 지향 디자인에서 chain-of-responsibility pattern은 명령 객체와 일련의 처리 객체를 포함하는 디자인 패턴이다. 
각각의 처리 객체는 명령 객체를 처리할 수 있는 연산의 집합이고, 체인 안의 처리 객체가 핸들할 수 없는 명령은 다음 처리 객체로 넘겨진다. 이 작동방식은 새로운 처리 객체부터 체인의 끝까지 다시 반복된다.
```javascript
var Complaint = (function () {
    function Complaint() {
        this.ComplainingParty = "";
        this.ComplaintAbout = "";
        this.Complaint = "";
    }
    return Complaint;
})();

var ClerkOfTheCourt = (function () {
    function ClerkOfTheCourt() {
    }
    ClerkOfTheCourt.prototype.IsAbleToResolveComplaint = function (complaint) {
        //decide if this is a complaint which can be solved by the clerk
        return false;
    };

    ClerkOfTheCourt.prototype.ListenToComplaint = function (complaint) {
        //perform some operation
        //return solution to the complaint
        return "clerk resolved ";
    };
    return ClerkOfTheCourt;
})();

var King = (function () {
    function King() {
    }
    King.prototype.IsAbleToResolveComplaint = function (complaint) {
        return true;
    };

    King.prototype.ListenToComplaint = function (complaint) {
        //perform some operation
        //return solution to the complaint
        return "King resolved";
    };
    return King;
})();

var ComplaintResolver = (function () {
    function ComplaintResolver() {
        this.complaintListeners = new Array();
        this.complaintListeners.push(new ClerkOfTheCourt());
        this.complaintListeners.push(new King());
    }
    ComplaintResolver.prototype.ResolveComplaint = function (complaint) {
        for (var i = 0; i < this.complaintListeners.length; i++) {
            if (this.complaintListeners[i].IsAbleToResolveComplaint(complaint)) {
                return this.complaintListeners[i].ListenToComplaint(complaint);
            }
        }
    };
    return ComplaintResolver;
})();

var resolver = new ComplaintResolver();
resolver.ResolveComplaint(new Complaint()); // King resolved
```

## Command Pattern
Command 패턴은 메소드의 매개변수와 객체의 현재 상태 모두를 캡슐화하고, 메소드를 호출하는 방법이다.(메소드 호출 캡슐화)
메소드를 나중에 호출할 때 필요한 것들을 작은 패키지로 포장한다.

```javascript
var Vitellius = (function() {
  function Vitellius() {}
  Vitellius.prototype.approve = function(commander) {
    commander.execute();
  };
  return Vitellius;
})();

var Commander = (function() {
  function Commander() {
    this.commands = [];
  }
  Commander.prototype.execute = function() {
    this.commands.forEach(function(command) {
      command();
    });
  };
  Commander.prototype.do = function(command, args) {
    this.commands.push(function() {
      command.call(null, args);
    });
  };
  Commander.prototype.undo = function() {
    this.commands.pop();
  };
  return Commander;
})();

var strategy = {
  climbAlps: function() {
    console.log('알프스를 오릅니다');
  },
  prepareSupply: function(number) {
    console.log('보급품을 ' + number + '만큼 준비합니다');
  },
  attackRome: function() {
    console.log('로마를 공격합니다');
  },
};

var vitellius = new Vitellius();
var caecina = new Commander();
caecina.do(strategy.prepareSupply, 5000);
caecina.undo(); // prepareSupply 취소
caecina.do(strategy.prepareSupply, 10000);
caecina.do(strategy.climbAlps);
caecina.do(strategy.attackRome);
vitellius.approve(caecina); // 보급품을 10000만큼 준비합니다. 알프스를 오릅니다. 로마를 공격합니다.
```

## Interpreter Pattern
해석자(Interpreter) 패턴은 자신만의 고유한 언어를 생성할 수 있게 해주는 패턴이다.
```javascript
var Battle = (function () {
    function Battle(battleGround, agressor, defender, victor) {
        this.battleGround = battleGround;
        this.agressor = agressor;
        this.defender = defender;
        this.victor = victor;
    }
    return Battle;
})();
History.Battle = Battle;

var Parser = (function () {
    function Parser(battleText) {
        this.battleText = battleText;
        this.currentIndex = 0;
        this.battleList = battleText.split("\n");
    }
    Parser.prototype.nextBattle = function () {
        if (!this.battleList[0])
            return null;
        var segments = this.battleList[0].match(/\((.+?)\s?->\s?(.+?)\s?<-\s?(.+?)\s?->\s?(.+)/);
        return new Battle(segments[2], segments[1], segments[3], segments[4]);
    };
    return Parser;
})();
History.Parser = Parser;
```
## Iterator Pattern
반복자 패턴은 객체 들의 집합 내 이동은 매우 일반적인 문제여서 많은 언어들이 이 집합들 내에서 이동하는 특별한 생성자를 제공한다. 
```javascript
var KingSuccession = (function () {
    function KingSuccession(inLineForThrone) {
        this.inLineForThrone = inLineForThrone;
        this.pointer = 0;
    }
    KingSuccession.prototype.next = function () {
        return this.inLineForThrone[this.pointer++];
    };
    return KingSuccession;
})();
Succession.KingSuccession = KingSuccession;

var FibonacciIterator = (function () {
    function FibonacciIterator() {
        this.previous = 1;
        this.beforePrevious = 1;
    }
    FibonacciIterator.prototype.next = function () {
        var current = this.previous + this.beforePrevious;
        this.beforePrevious = this.previous;
        this.previous = current;
        return current;
    };
    return FibonacciIterator;
})();
```

## Mediator Pattern(중재자 패턴)
여러개의 객체들을 관리하는 패턴
다양한 컴포넌트의 중간에 위치하여 메세지의 경로 변경이 이루어지는 유일한 장소로써의 동작

```javascript
var Josephus = (function() {
  function Josephus() {
    this.participants = [];
  }
  Josephus.prototype.register = function(participant) {
    this.participants.push(participant);
  };
  Josephus.prototype.deliver = function(sender, message) {
    this.participants.forEach(function(participant) {
      if (participant !== sender) {
        console.log(sender + '님이 ' + participant + '님에게 "' + message + '"라고 말합니다.');
      }
    });
  };
  return Josephus;
})();
var josephus = new Josephus();
josephus.register('Jew');
josephus.register('Roman');
josephus.deliver('Jew', '우리 땅에서 물러가라!');
```

## 메멘토 패턴

## 옵저버 패턴

## 상태패턴

## 템플릿 메소드 패턴

## 비지터 패턴