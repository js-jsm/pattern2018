# 7. 모델 뷰 패턴 - 현진호

### MVC, MVP, MVVP 패턴의 도입 이유
- **화면에 보여주는 로직과 실제 데이터가 처리 되는 로직을 분리**
- 각 계층을 분리시킴으로써 코드의 재활용성을 높이고 불필요한 중복을 막을 수 있다.
- Model과 VIew의 의존성을 어떻게 제어하느냐에 따라 각 패턴을 분류할 수 있다.

### Model
- 프로그램에서 사용되는 실제 데이터 및 데이터 조작 로직을 처리하는 부분
- 비즈니스 규칙, 유효성 검사 논리, 그 밖의 다양한 기능을 포함할 수도 있다.

### View
- 사용자에게 제공되어 보여지는 UI 부분
- 다수의 뷰는 같은 모델 데이터를 다양하게 표시할 수 있다

<img src='./img/MVC-MVP-MVVM.png'>


### MVC Model-View-Controller
- Controller
  - 사용자의 입력을 받고 처리하는 부분
  - 애플리케이션의 이벤트를 리스닝해 모델과 뷰 사이의 명령을 위임
- 처리 과정
  1. Controller로 사용자의 입력이 들어옴
  2. Controller는 Model을 이용해 데이터 업데이트 / 로드, Model을 표시할 View를 선택
    - 하나의 Controller가 여러개의 View를 선택하여 Model을 나타내어 줄 수 있다
    - 이때 Controller는 View를 선택만하고 업데이트를 시켜주지 않기 때문에 View는 Model을 이용하여 업데이트 
    - Model을 직접 사용하거나 Model에서 View에게 Notify해주는 방법, View에서 Polling을 통해 Model의 변화를 알아채는 방법 등이 있다
  3. Model은 해당 데이터를 보여줄 View를 선택해서 화면에 표시

- 단점
  - View와 Model이 서로 의존적
  - View는 Model을 이용하기 때문에 서로간의 의존성을 완벽히 피할 수 없다
    - 컨트롤러가 다수의 뷰에 걸친 이벤트를 리스닝해서 종속성이 강함
      - 단위 테스트 어려움
    - 좋은 MVC 패턴은 View와 Model간의 의존성을 최대한 적게 한 패턴

### MVP Model-View-Presenter
- Presenter
  - View에서 요청한 정보를 Model로 부터 가공해서 View로 전달하는 부분
  - Presenter는 View의 인스턴스를 갖고 있으며 View와 1대1 관계. 그에 해당하는 Model의 인스턴스 또한 갖고 있기때문에 View와 Model 사이에서 다리와 같은 역할을 함

- 절차
  1. View로 사용자의 입력이 들어옴
  2. View는 Presenter에 작업 요청
  3. Presenter에서 필요한 데이터를 Model에 요청
  4. Model은 Presenter에 필요한 데이터를 응답
  5. Presenter는 View에 데이터를 전달
  6. View는 Presenter로부터 받은 데이터로 화면에 표시

- MVC와의 차이점
  - MVC에서 컨트롤러가 Presenter로 교체된 형태이고 프리젠터는 뷰와 같은 레벨에 있음
  - Model과 View는 MVC와 동일하지만 사용자 입력을 View에서 받음
  - Model과 View는 각각 Presenter와 상호 동작
    - 항상 Presenter을 거쳐서 동작
    - MVC의 단점인 Model과 View의 의존성 문제 해결
    - View와 Model은 서로를 알필요가 전혀 없고, Presenter만 알면 됨
      - MVC 패턴과는 다르게 Presenter를 통해 Model과 View를 완벽히 분리해 줌

- 단점
  - View와 Presenter가 1:1로 강한 의존성을 가짐

### MVVM 
- ViewModel
  - View를 표현하기 위해 만들어진, View를 위한 Model
  - 모델의 데이터와 뷰의 데이터 표시 사이의 변화(예: 데이터 바인딩)를 관리
    - 뷰를 직접 조작하는 애플리케이션 논리가 최소화되거나 아예 사라져 모델과 프레임워크가 최대한 많은 작업이 가능
  - 여러 View들은 하나의 ViewModel을 선택하여 바인딩하고 업데이트를 받음
  -  뷰모델은 뷰가 필요로 하든 데이터와 커맨드 객체를 노출해 주기 때문에 뷰가 필요로하는 데이터와 액션은 담고 있는 컨테이너 객체로 볼 수도 있음

- 디자인 패턴을 사용
  - Command 패턴, Data Binding 패턴(Observer 패턴)
    - View와 ViewModel은 의존성이 완전히 사라짐

- 절차
  - View에 입력이 들어오면 Command 패턴으로 ViewModel에 명령
  - ViewModel은 필요한 데이터를 Model에 요청
  - Model은 ViewModel에 필요한 데이터를 응답
  - ViewModel은 응답 받은 데이터를 가공해서 저장
  - View는 ViewModel과의 Data Binding으로 인해 자동으로 갱


### Reference
- [hashcode - MVC, MVP, MVVM의 차이를 자세하게 알고 싶습니다.](http://hashcode.co.kr/questions/3764/mvc-mvp-mvvm의-차이를-자세하게-알고-싶습니다)
- [Outsider's Dev Story - MVVM 패턴에 대해서...](https://blog.outsider.ne.kr/672)
- [공대인들이 직접쓰는 컴퓨터공부방 - [WPF] MVC, MVP, MVVM 차이점](http://hackersstudy.tistory.com/71)
- [마기의 개발 블로그 - MVC, MVP, MVVM 비교](https://magi82.github.io/android-mvc-mvp-mvvm/)
- [프론트엔드 웹애플리케이션 아키텍쳐 비교분석 : MVC와 MVVM](https://medium.com/@manyoung/프론트엔드-웹애플리케이션-아키텍쳐-비교분석-mvc와-mvvm-e446a0f46d8c)
