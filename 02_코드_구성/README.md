# 2. 코드 구성

코드 모듈화의 필요성과 자바스크립트에서 모듈을 생성 하는 방법을 알아본다.

- 전역 범위
- 객체 
- 프로토타입
- 프로토타입 상속
- 모듈
- ES6 Class 에서 모듈

구조적 프로그래밍은 뵘-야코피니 이론에 기반한다.
- 서브 프로그램의 **순차** 실행
- 두개의 서브 프로그램의 **조건부** 실행
- 조건이 참이 될 때까지 하나의 서브 프로그램을 **반복** 실행

모듈은 정적인 메소드만 포함하는 클래스와 같다.

## 전역 범위 (Global Scope)
***
```js
var hello = "hello"
world = "world"

console.log (window.hello + " " + window.world) // "hello world"
```
전역 변수는 선언 함으로서 최상위 컨테이너인 window 에 할당 되고

Node.js 에서는 global 객체에 할당 된다.

전역 변수는 다른 코드에 의해 쉽게 영향을 받을 수 있기 때문에 지양 하는 것이 좋다.

## 객체 (Object)
***
 - Undefined
 - Null
 - Boolean
 - String
 - Number

Boolean, String, Number만이 원시 데이터 타입 래퍼를 가진다.

이는 객체와 원시 데이터를 혼합 해서 사용하는 자바와 동일한 모델 이다.

필요한경우 박싱과 언박싱을 지원한다.

```js
/* 박싱과 언박싱 */
var numberOne = new Number(1)
var numberTwo = 2
typeof numberOne // 객체
typeof numberTwo // 숫자
var numberThree = numberOne + numberTwo
typeof numberThree // 숫자

/* 객체 생성 */
var objectOne = {}
typeof objectOne // 객체
var objectTwo = new Object()
typeof objectTwo // 객체

/* 객체 속성 추가 */
var objectOne = { value: 7 }
var objectTwo = { }
objectTwo.value = 7

/* 객체에 함수 추가 & 구문 혼합 */
var functionObject = {
    greeting: "hello world",
    doThings: function() {
        console.log(this.greeting)
        this.doOtherThings()
    },
    doOtherThings: function() {
        console.log(this.greeting.split("").reverse().join(""))
    }
}
functionObject.doThings() // "hello world"
```

this 키워드는 함수의 소유자에 바인딩되어 있지만, 종종 우리가 기대하는 바와 다를수 있다.

## 프로토 타입 구축
***
구조체를 사용해 객체를 생성할 경우 복수의 객체를 생성하는데 **시간**이 많이 걸리고 많은 **메모리**를 필요로 한다.

생성 방식이 동일하더라도 각각의 객체는 완전히 다른 객체이다.

이는 함수를 정의하는 데 사용된 메모리가 인스턴스 간에 공유되지 않음을 의미한다.

흥미로운 점은 인스턴스를 변경하지 않고도 각각 독립적인 클래스의 인스턴스를 다시 정의할수 있다.

이와 같은 방식으로 단일 인스턴스의 함수나 이미 정의된 객체를 변경하는 방법을 몽키 패치라 한다.

**몽키 패치는** **라이브러리 코드를 처리할때 유용**할수 있지만, **대체로 혼란**을 초례 할수 있다.
```js
var Castle = function(name) {
    this.name = name
    this.build = function() {
        console.log(this.name)
    }
}

var instance1 = new Castle("Winterfell")
var instance2 = new Castle("Harrenhall")

instance1.build = function() { console.log("Moat Cailin"); } // monkey patching
instance1.build() // "Moat Cailin"
instance2.build() // "Harrenhall"
```

프로토타입에 함수를 할당하는 **장점**은 단 **하나의 함수 사본만이 생성**된다는 점이다.

나중에 객체의 프로토타입을 변경한 경우 프로토타입을 공유하는 모든 객체는 새로운 기능으로 업데이트 된다.

```js
var Castle = function(name) {
    this.name = name
}

Castle.prototype.build = function() { console.log(this.name); }

var instance1 = new Castle("Winterfell")

Castle.prototype.build = function() { console.log(this.name.replce("Winterfell", "Moat Cailln"))}

instance1.build() // "Moat Cailln"
```

객체를 상속할때 프로토타입의 장점을 이용하는것이 좋다.

ES5 에 추가된 Object.create 함수를 사용하는것인데 필드를 설명하는 옵션 객체를 전달 할수있고 다음과 같은 선택 필드로 구성된다.

- writable: 쓰기 가능 여부 
- configurable: 파일이 객체로 부터 제거 가능한지, 생성후 추가적 구성을 지원하는지 여부
- enumerable: 객체의 속성을 열거하는 동안 속성이 나열될수 있는지 확인
- value: 필드의 기본값

```js
var instance3 = Object.create(Castle.prototype, {
    name: {
        value: "Winterfell",
        writable: false,
    }
})

instance3.bulid() // "Winterfell"
instance3.name = "Highgarden"
instance3.build() // "Winterfell"
```
## 상속
***
#### 고통스러운 방법
```js
var Castle = function() {}
Castle.prototype.build = function() { console.log("Castle built"); }

var Winterfell = function() {}
Winterfell.prototype.build = Castle.prototype.build
Winterfell.prototype.addGodsWood = function() {}

var winterfell = new Winterfell()
winterfell.build() // "Castle built"
```

#### 조금덜 고통스러운 추상화
```js
function clone(source, destination) {
    for (var attr in source.prototype) {
        destination.prototype[attr] = source.prototype[attr]
    }
}

var Castle = function() {}
Castle.prototype.build = function() { console.log("Castle built"); }

var Winterfell = function() {}
clone(Castle, Winterfell);

var winterfell = new Winterfell()
winterfell.build() // "Castle built"
```

## 모듈
***
```js
var Westeros = Westeros || {}
Westeros.Castle = function(name) { this.name = name; }
Westeros.Castle.prototype.Build = function() { console.log("Castle built: " + this.name); }

// 단일 계층 구조
var Westeros = Westeros || {}
Westeros.Structures.Castle = function(name) { this.name = name; }
Westeros.Structures.Castle.prototype.Build = function() { console.log("Castle built: " + this.name); }
var winterfell = new Westeros.Structures.Castle("Winmterfell")
winterfell.Build()

//계층적으로 변환
var Castle = (function() {
  function Castle(name) {
      this.name = name
  }
  Castle.prototype.build = function() { console.log("Castle built: " + this.name); }
  return Castle
})()

Westeros.Structures.Castle = Caslte

//비교적 쉬운 상속
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
    function __() { this.constructor = d; }
    __.prototype = b.prototype
    d.prototype = new __()
}

var BaseStructure = (function() {
  function BaseStructure() { }
  return BaseStructure
})()

Structures.BaseStructure = BaseStructure

var Castle = (function(_super) {
    __extends(Castle, _super)

    function Castle(name) {
        this.name = name
        _super.call(this)
    }
    Castle.prototype.Build = function() { console.log("Castle built: " + this.name); }
    return Castle
})(BaseStructure)

// 클로저 구문으로 구현한 전체 모듈
var Westeros;
(function(Westeros) {
  (function(Structures) {
      var Castle = (function() {
          function Castle(name) {
              this.name = name
          }
          Castle.prototype.Build = function() { console.log("Castle built: " + this.name); }
          return Castle
      })()
      Structures.Castle = Castle
      // 추가된 클래스
      var Wall = (function() {
          function Wall() {
              console.log("Wall constructed")
          }
          return Wall
      })()
      Structures.Wall = Wall
  })(Westeros.Structures || (Westeros.Structures = {}))
  var Structures = Westeros.Structures
})(Westeros || (Westeros = {}))
```


## ES6 Class 와 모듈
***
```js
class Castle extends Westeros.Structures.BaseStructure {
    constructor(name, allegience) {
        super(name)
    }

    Build() {
        super.Build()
    }
}
```

```js
// ts module -> namespace
namespace Westros {
  export function Rule(rulerName, house) {
    return "Long live " + rulerName + " of house " + house;
  }
}

Westros.Rule("Rob Stark", "Stark");
```

https://basarat.gitbooks.io/typescript/content/docs/project/namespaces.html
https://stackoverflow.com/questions/38582352/module-vs-namespace-import-vs-require-typescript


