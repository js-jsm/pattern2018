# 7장 (Model View Patterns)

- 애플리케이션의 계층를 나누는 것(Layering)과 모듈화를 유지하는 것은 변화에 의한 충격을 줄일 수 있다. 각 계층은 서로를 모를 수록 좋다. 계층 사이에 간단한 인터페이스를 유지하여 한 레이어가 변할 때 다른 레이어로 문제가 침투하는 것을 막을 수 있다.

- MVC(Model View Controller)
  - 이상적으로 모델이 이 패턴에서 유일하게 변화가 가능한 부분이다. 뷰나 컨트롤러는 상태에 직접적으로 상태를 가지고 있어서는 안된다. 또한 모델은 뷰와 컨트롤러의 존재를 모르게 만든다.
  - [Naked Object pattern](https://en.wikipedia.org/wiki/Naked_objects) - 모델이 비지니스 로직을 들고 있고, 뷰와 컨트롤러는 그 모델에 의해 자동으로 생성된 계층이 되도록 하는 패턴
  - 컨트롤러는 보통 뷰와 모델의 존재를 알고 있고 그 둘을 가운데서 조작하는 역할을 한다. 필요한 상황에 따라 알맞은 뷰를 선택하고 그 뷰와 모델 사이에 통신을 담당한다.
  - PAC(Presentation-Abstraction-Control) - Abstraction 부분이 모델의 역할을 일부 담당하는데, 전체 모델을 보이기 보다 일부 필드만 담당하는 방식으로 되어있다. 이를 활용하면 컴포넌트의 병렬 처리가 가능하다고는 하는데...?
  - Naked Object pattern같이 모델에 따라 동적으로 뷰와 컨트롤러를 생성하는 구조가 아니라면 특정 데이터 필드가 모든 계층에 걸쳐 있는 것이 그리 신경 쓸 일은 아니다. 종단 관심사는 보통 데이터 접속 및 로깅 등을 일컫기 때문이다.
  - 구현 예 - [MVC Pattern Example - JSFiddle](https://jsfiddle.net/rinae/thxf6o06/20/)

  ```javascript
  function LoginController(model) {
    return Object.freeze({
      login,
      checkPassword
    });

    function login({ userName, password, rememberMe }) {
      if (checkPassword(userName, password)) {
        model.LoginSuccessful = false;
        model.LoginErrorMessage = "Incorrect username or password";
      } else {
        model.UserName = userName;
        model.Password = password;
        model.RememberMe = rememberMe;
        model.LoginSuccessful = true;
      }

      return model;
    }

    function checkPassword(userName, password) {
      return userName === password;
    }
  }

  var userModel = {
    UserName: '',
    Password: '',
    RememberMe: false,
    LoginSuccessful: false,
    LoginErrorMessage: ''
  };

  var lct = LoginController(userModel);

  lct.login({
    userName: 'John',
    password: 'Wick',
    rememberMe: true
  });
  console.info(userModel);
  ```


- MVP
  - Presenter 는 하나의 뷰와 연결되어있다. 컨트롤러가 어떤 뷰를 선택할지를 고르는 로직이 없어진다. 아니면 이 패턴의 범주를 벗어나는 상위 개념으로 존재하게 된다. 적절한 프레젠터를 고르는 일은 라우터에 따라 결정될 수도 있다.
  - 프레젠터는 뷰와 모델을 알지만, 뷰와 모델은 서로를 모른다. 모든 작업은 프레젠터를 통해 관리된다.
  - 뷰와 모델이 분리될 수록 중간에서 둘을 관리하는 엄격한 API를 만들어서 변화를 잘 받아들이게 할 수 있다. 하지만 더 많은 코드가 발생할 수 있는데, 이는 더 많은 버그가 생길 가능성을 의미한다.
  - [MVP Pattern Example - JSFiddle](https://jsfiddle.net/rinae/8kbtx8cm/4/)
- MVVM
  - Presetner 대신에 ViewModel이 자리잡게 되는데, 이 뷰 모델은 Presenter처럼 메서드 호출로 값을 변경하는게 아니라 직접적인 값 변경에 즉각적, 혹은 약간 지연하여 모델에 변경 상태를 저장한다. 보통은 `save` 같은 동작으로 모델에 변경 데이터를 새로 전달할 수 있다.
  - 이 패턴에서 모델은 단순한 데이터 저장 객체이다. 또한 뷰의 변경을 바로 뷰 모델로 반영하는 것 뿐 아니라 뷰 모델의 변경도 뷰에 반영된다.
  - 한 뷰는 여러 개의 뷰 모델을 가질 수 있다. 따라서 서로 다른 뷰 모델이 영향을 주고 받으면서 그에 연결되어 있는 뷰도 바뀔 수 있다.
  - [MVVM Pattern Example - JSFiddle](https://jsfiddle.net/rinae/jk4cvm44/6/)