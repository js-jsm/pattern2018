모델뷰 패턴들은 애플리케이션 레벨에서 적용할수 있는 큰 규모의 패턴들 이다.

먼저 소프트웨어 에서 디자인 패턴이란 무엇일까? 위키에서 정의를 찾아 보았다.

>소프트웨어 개발 방법에서 사용되는 디자인 패턴은, 프로그램 개발에서 자주 나타나는 과제를 해결하기 위한 방법 중 하나로, 과거의 소프트웨어 개발 과정에서 발견된 설계의 노하우를 축적하여 이름을 붙여, 이후에 재이용하기 좋은 형태로 특정의 규약을 묶어서 정리한 것이다. 알고리즘과 같이 프로그램 코드로 바로 변환될 수 있는 형태는 아니지만, 특정한 상황에서 구조적인 문제를 해결하는 방식을 설명해 준다.

패턴은 전체 어플리케이션이 어떻게 조합 되는지 가이드를 제공해 줄수 있다.

그렇다면, 디자인 패턴은 왜 중요한것일까?

애플리케이션에서 문제의 분리는 매우 중요하다.

애플리케이션의 계층을 나누고 모듈화를 유지하면 변화의 영향을 최소화 시킬수 있다.

변화의 영향을 최소화 한다는것은 작업량이 줄어듦을 의미하면서, 문제가 발생 되었을때 그 확산을 최소화 할수 있다는 점에서 매우 유용하다고 볼수 있을것이다.

## MVC 패턴

MVC 패턴의 특징은 컨트롤러가 중심이라는 점이다.
컨트롤러는 애플리케이션의 실제 기능을 포함하며, 뷰를 정확하게 선택하고 모델과 뷰사이의 통신을 연결하는 책임을 가진다.
MVC 패턴의은 모든 입력이 컨트롤러에서 처리 된다.
처리 과정에서 컨트롤러는 모델을 업데이트 하고 뷰를 선택 한다.
MVC 패턴의 문제점은 뷰는 모델을 이용해 업데이트 하기 때문에 의존성이 높다는점이다.
