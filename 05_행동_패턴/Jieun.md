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

var parser = new Parser('aa->bb->at');
console.dir(parser.nextBattle())
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

var fibo = new FibonacciIterator();
console.log(fibo.next())//2
console.log(fibo.next())//3
console.log(fibo.next())//5 
// ...

```

## Mediator Pattern(중재자 패턴)
여러개의 객체들을 관리하는 패턴
다양한 컴포넌트의 중간에 위치하여 메세지의 경로 변경이 이루어지는 유일한 장소로써의 동작

```javascript
var BroadCast = (function() {
  function BroadCast() {
    this.participants = [];
  }
  BroadCast.prototype.register = function(participant) {
    this.participants.push(participant);
  };
  BroadCast.prototype.deliver = function(sender, message) {
    this.participants.forEach(function(participant) {
      if (participant !== sender) {
        console.log(sender + '님이 ' + participant + '님에게 "' + message + '"라고 말합니다.');
      }
    });
  };
  return BroadCast;
})();
var broadcast = new BroadCast();
broadcast.register('MBC');
broadcast.register('JTBC');
broadcast.register('SBS');
broadcast.register('KBS');
broadcast.deliver('JTBC', ' 방송 방송');
```

## 메멘토 패턴
이전 상태로 객체의 상태를 복원할 수 있는 방법을 제공한다.
메멘토는 변수의 이전값에 대한 기록을 유지하고 복원하는 기능을 제공한다.
명령에 대한 메멘토를 유지하면 복구가 힘든 명령을 쉽게 복원할 수 있다. 

```javascript
var SquareCommand = (function () {
    function SquareCommand(numberToSquare) {
        this.numberToSquare = numberToSquare;
    }
    SquareCommand.prototype.Execute = function () {
        this.numberToSquare *= this.numberToSquare;
    };
    return SquareCommand;
})();

var WorldState = (function () {
    function WorldState(numberOfKings, currentKingInKingsLanding, season) {
        this.numberOfKings = numberOfKings;
        this.currentKingInKingsLanding = currentKingInKingsLanding;
        this.season = season;
    }
    return WorldState;
})();

var Soothsayer = (function () {
    function Soothsayer() {
        this.startingPoints = [];
        this.currentState = new WorldStateProvider();
    }
    Soothsayer.prototype.setInitialConditions = function (numberOfKings, currentKingInKingsLanding, season) {
        this.currentState.numberOfKings = numberOfKings;
        this.currentState.currentKingInKingsLanding = currentKingInKingsLanding;
        this.currentState.season = season;
    };
    Soothsayer.prototype.alterNumberOfKingsAndForetell = function (numberOfKings) {
        this.startingPoints.push(this.currentState.saveMemento());
        this.currentState.numberOfKings = numberOfKings;
    };
    Soothsayer.prototype.alterSeasonAndForetell = function (season) {
        this.startingPoints.push(this.currentState.saveMemento());
        this.currentState.season = season;
    };
    Soothsayer.prototype.alterCurrentKingInKingsLandingAndForetell = function (currentKingInKingsLanding) {
        this.startingPoints.push(this.currentState.saveMemento());
        this.currentState.currentKingInKingsLanding = currentKingInKingsLanding;
    };
    Soothsayer.prototype.tryADifferentChange = function () {
        this.currentState.restoreMemento(this.startingPoints.pop());
    };
    return Soothsayer;
})();

var WorldStateProvider = (function () {
    function WorldStateProvider() {
    }
    WorldStateProvider.prototype.saveMemento = function () {
        return new WorldState(this.numberOfKings, this.currentKingInKingsLanding, this.season);
    };
    WorldStateProvider.prototype.restoreMemento = function (memento) {
        this.numberOfKings = memento.numberOfKings;
        this.currentKingInKingsLanding = memento.currentKingInKingsLanding;
        this.season = memento.season;
    };
    return WorldStateProvider;
})();


```
## 옵저버 패턴
객체의 값이 변할 때 그 변화를 알고 싶을 때 유용하게 사용한다.
브라우저에서 DOM의 모든 다양한 이벤트 리스너는 감시자 패턴으로 구현된다.
예를 들어 제이쿼리 라이브러리를 사용할 때, 다음 라인과 같이 페이지에 있는 모든 버튼의 클릭 에빈트를 구독할 수 있다. 

```javascript
var GetterSetter = (function () {
    function GetterSetter() {
    }
    GetterSetter.prototype.GetProperty = function () {
        return this._property;
    };
    GetterSetter.prototype.SetProperty = function (value) {
        var temp = this._property;
        this._property = value;
        this._listener.Event(value, temp);
    };
    return GetterSetter;
})();

var Listener = (function () {
    function Listener() {
    }
    Listener.prototype.Event = function (newValue, oldValue) {
        //do something
        console.log('event is invoked');
    };
    return Listener;
})();

var Spy = (function () {
    function Spy() {
        this._partiesToNotify = [];
    }
    Spy.prototype.Subscribe = function (subscriber) {
        this._partiesToNotify.push(subscriber);
    };

    Spy.prototype.Unsubscribe = function (subscriber) {
        this._partiesToNotify.remove(subscriber);
    };

    Spy.prototype.SetPainKillers = function (painKillers) {
        this._painKillers = painKillers;
        for (var i = 0; i < this._partiesToNotify.length; i++) {
            this._partiesToNotify[i](painKillers);
        }
    };
    return Spy;
})();

var Player = (function () {
    function Player() {
    }
    Player.prototype.OnKingPainKillerChange = function (newPainKillerAmount) {
        //perform some action
        console.log(newPainKillerAmount + ' is pain point of the king');
    };
    return Player;
})();

var s = new Spy();
var p = new Player();
s.Subscribe(p.OnKingPainKillerChange);//p is subscriber
s.SetPainKillers(12);
```
## State Machine 상태패턴
상태 패턴은 내부 상태를 추상화 하고 클래스로 구현된 상태들 사이의 메세지를 프록시로 전달 하는 상태 관리자(State Manager)를 가지는 것을 특징으로 한다.

```javascript
var NaiveBanking = (function () {
    function NaiveBanking() {
        this.state = "";
        this.balance = 0;
    }
    NaiveBanking.prototype.NextState = function (action, amount) {
        if (this.state == "overdrawn" && action == "withdraw") {
            this.state = "on hold";
        }
        if (this.state == "on hold" && action != "deposit") {
            this.state = "on hold";
        }
        if (this.state == "good standing" && action == "withdraw" && amount <= this.balance) {
            this.balance -= amount;
        }
        if (this.state == "good standing" && action == "withdraw" && amount > this.balance) {
            this.balance -= amount;
            this.state = "overdrawn";
        }
    };
    return NaiveBanking;
})();

var BankAccountManager = (function () {
    function BankAccountManager() {
        this.currentState = new GoodStandingState(this);
    }
    BankAccountManager.prototype.Deposit = function (amount) {
        this.currentState.Deposit(amount);
    };

    BankAccountManager.prototype.Withdraw = function (amount) {
        this.currentState.Withdraw(amount);
    };
    BankAccountManager.prototype.addToBalance = function (amount) {
        this.balance += amount;
    };
    BankAccountManager.prototype.getBalance = function () {
        return this.balance;
    };
    BankAccountManager.prototype.moveToState = function (newState) {
        this.currentState = newState;
    };
    return BankAccountManager;
})();

var GoodStandingState = (function () {
    function GoodStandingState(manager) {
        this.manager = manager;
    }
    GoodStandingState.prototype.Deposit = function (amount) {
        this.manager.addToBalance(amount);
    };
    GoodStandingState.prototype.Withdraw = function (amount) {
        if (this.manager.getBalance() < amount) {
            this.manager.moveToState(new OverdrawnState(this.manager));
        }

        this.manager.addToBalance(-1 * amount);
    };
    return GoodStandingState;
})();

var OverdrawnState = (function () {
    function OverdrawnState(manager) {
        this.manager = manager;
    }
    OverdrawnState.prototype.Deposit = function (amount) {
        this.manager.addToBalance(amount);
        if (this.manager.getBalance() > 0) {
            this.manager.moveToState(new GoodStandingState(this.manager));
        }
    };
    OverdrawnState.prototype.Withdraw = function (amount) {
        this.manager.moveToState(new OnHold(this.manager));
        throw "Cannot withdraw money from an already overdrawn bank account";
    };
    return OverdrawnState;
})();

var OnHold = (function () {
    function OnHold(manager) {
        this.manager = manager;
    }
    OnHold.prototype.Deposit = function (amount) {
        this.manager.addToBalance(amount);
        throw "Your account is on hold and you must attend the bank to resolve the issue";
    };
    OnHold.prototype.Withdraw = function (amount) {
        throw "Your account is on hold and you must attend the bank to resolve the issue";
    };
    return OnHold;
})();
var goodStandingState = new GoodStandingState(new BankAccountManager());


```
## 템플릿 메소드 패턴

## 비지터 패턴
