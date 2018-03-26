# 6. 함수형 프로그래밍

1. 함수 전달
2. 필터와 파이프
3. 어큐뮬레이터
4. 메모이제이션
5. 불변성
6. 지연 인스턴스 생성

### 함수 전달 (Function passing)
```js
class HamiltonianTour {
    constructor(options) {
        this.options = options;
    }
    StartTour() {
        if (this.options.onTourStart && typeof (this.options.onTourStart) === "function")
            this.options.onTourStart();
        this.VisitAttraction("King's Landing");
        this.VisitAttraction("Winterfell");
        this.VisitAttraction("Mountains of Dorne");
        this.VisitAttraction("Eyrie");
        if (this.options.onTourCompletion && typeof (this.options.onTourCompletion) === "function")
            this.options.onTourCompletion();
    }
    VisitAttraction(AttractionName) {
        if (this.options.onEntryToAttraction && typeof (this.options.onEntryToAttraction) === "function")
            this.options.onEntryToAttraction(AttractionName);
        //do whatever one does in a Attraction
        if (this.options.onExitFromAttraction && typeof (this.options.onExitFromAttraction) === "function")
            this.options.onExitFromAttraction(AttractionName);
    }
}
class HamiltonianTourOptions {
}
var tour = new HamiltonianTour({
    onEntryToAttraction: function(cityname) {
        console.log("I'm delighted to be in " + cityname);
    }
});
tour.StartTour();
```

### 필터와 파이프 (Filters and pipes)
```js
Array.prototype.where = function (inclusionTest) {
    var results = [];
    for (var i = 0; i < this.length; i++) {
        if (inclusionTest(this[i]))
            results.push(this[i]);
    }
    return results;
};
Array.prototype.select = function (projection) {
    var results = [];
    for (var i = 0; i < this.length; i++) {
        results.push(projection(this[i]));
    }
    return results;
};
const children = [{ id: 1, Name: "Rob" },
    { id: 2, Name: "Sansa" },
    { id: 3, Name: "Arya" },
    { id: 4, Name: "Brandon" },
    { id: 5, Name: "Rickon" }];
var filteredChildren = children.where(function (x) {
    return x.id % 2 == 0;
 }).select(function (x) {
     return x.Name;
 });
console.dir(children);
console.dir(filteredChildren);
```

### 어큐뮬레이터 (Accumulators)
```js
class TaxCollector {
    collect(items, value, projection) {
        if (items.length > 1)
            return projection(items[0]) + this.collect(items.slice(1), value, projection);
        return projection(items[0]);
    }
}
var peasants = [{ name: "Jory Cassel", moneyOwed: 11, bankBalance: 50 },
    { name: "Vardis Egen", moneyOwed: 15, bankBalance: 20 }];
var collector = new TaxCollector();
console.log(collector.collect(peasants, 0, (item) => Math.min(item.moneyOwed, item.bankBalance)));
```

### 메모이제이션 (Memoization)
```js
class Fibonacci {
    constructor() {
        this.memorizedValues = [];
    }
    NaieveFib(n) {
        if (n == 0)
            return 0;
        if (n <= 2)
            return 1;
        return this.NaieveFib(n - 1) + this.NaieveFib(n - 2);
    }
    MemetoFib(n) {
        if (n == 0)
            return 0;
        if (n <= 2)
            return 1;
        if (!this.memorizedValues[n])
            this.memorizedValues[n] = this.MemetoFib(n - 1) + this.MemetoFib(n - 2);
        return this.memorizedValues[n];
    }
}
var fib = new Fibonacci();
console.log(fib.MemetoFib(50));
```

### 불변성 (Immutability)
```js
var numberOfQueens = 1;
const numberOfKings = 1;
numberOfQueens++;
numberOfKings++;
console.log(numberOfQueens);
console.log(numberOfKings);

var consts = Object.freeze({ pi: 3.141 });
consts.pi = 7;

var t = Object.create(Object.prototype, { value: { writabe: false, value: 10} });
t.value = 7;
console.log(t.value);
```

### 지연 인스턴스 생성 (Lazy instantiation)
```js
class Bakery {
    constructor() {
        this.requiredBreads = [];
    }
    orderBreadType(breadType) {
        this.requiredBreads.push(breadType);
    }
    pickUpBread(breadType) {
        console.log("Picup of bread " + breadType + " requested");
        if (!this.breads) {
            this.createBreads();
        }
        for (var i = 0; i < this.breads.length; i++) {
            if (this.breads[i].breadType == breadType)
                return this.breads[i];
        }
    }
    createBreads() {
        this.breads = [];
        for (var i = 0; i < this.requiredBreads.length; i++) {
            this.breads.push(new Bread(this.requiredBreads[i]));
        }
    }
}
class Bread {
    constructor(breadType) {
        this.breadType = breadType;
        //some complex, time consuming operation
        console.log("Bread " + breadType + " created.");
    }
}
var bakery = new Bakery();
bakery.orderBreadType("Brioche");
bakery.orderBreadType("Anadama bread");
bakery.orderBreadType("Chapati");
bakery.orderBreadType("Focaccia");
console.log(bakery.pickUpBread("Brioche").breadType);
```

