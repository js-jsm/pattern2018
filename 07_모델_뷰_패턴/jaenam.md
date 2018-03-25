# CH7. MV* Patterns

## 1. MVC

```js
class Model {
  constructor (name = '없음', number = 0) {
    this.name = name;
    this.number = number;
  }
}
class View {
  printDetails (model) {
    console.log(`name: ${model.name}, number: ${model.number}`);
  }
}
class Controller {
  constructor (view, model) {
    this.view = view;
    this.model = model;
  }
  get name () {
    return this.model.name;
  }
  set name (name) {
    this.model.name = name;
  }
  get number () {
    return this.model.number;
  }
  set number (number) {
    this.model.number = number;
  }
  updateView () {
    this.view.printDetails(this.model);
  }
}
const view = new View();
const model = new Model();
const ctrl = new Controller(view, model);
ctrl.updateView();

ctrl.name = '재남';
ctrl.number = 5;
ctrl.updateView();
```

## 2. MVP


## 3. MVVM

