# CH 11. 고급 패턴

## 의존성 주입

```js
const Util = function () {}
const Ajax = function () {}
const Event = function () {}

const Foo = define([
    'Util',
    'Ajax',
    'Event'
], function (util, ajax, event) {
    var i = 0;
    function increase() {
        i++;
    }
    function get() {
      return i;
    }
    return {
        increase: increase,
        get: get
    };
});

/* js/first.js */
const First = define([
    'Foo'
], function (foo) {
    foo.increase();
    return {
        getFooValue: function () {
            return foo.get();
        }
    };
});

const Second = define([  
    'Foo'
], function (foo) {
    return {
        getFooValue: function () {
            return foo.get();
        }
    };
});

require([  
    'First',
    'Second'
], function (first, second) {
    console.log(first.getFooValue()); // 1
    console.log(second.getFooValue()); // 1
});
```
