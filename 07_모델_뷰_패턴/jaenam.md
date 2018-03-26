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

```js
class Presenter {
  constructor (view) {
    this.view = view
    view.setPresenter(this)
  }
  getWeather (latitude, longitude) {
    const model = new Model(this);
    model.getWeather(latitude, longitude)
  }
  callback (weather) {
    this.view.showWeather(weather)
  }
}
class Model {
  constructor (cb) {
    this.weatherCallback = cb
  }
  getWeather (latitude, longitude) {
    this.weatherCallback.callback(`위도 ${latitude}, 경도 ${longitude}의 날씨는 모릅니다.`)
  }
}
class View {
  setPresenter (pres) {
    this.presenter = pres
  }
  showWeather (weather) {
    console.log(weather)
  }
}
const pres = new Presenter(new View())
pres.getWeather(10, 20)
```


## 3. MVVM

