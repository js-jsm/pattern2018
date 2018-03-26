MVVM 패턴의 예제라고 생각함

```jsx
### Store
import { observable, action } from 'mobx';

class Store {
  @observable number = 0;
  
  @action('Store :: setStore')
  setStore(key, val) {
    this[key] = val;
  }
  
  @action('Store :: setNum')
  setNum(num) {
    this.number = num;
  }
}

### provider Store
import Base from './Store';

import { Provider as MobxProvider } from 'mobx-react';
export default {
  return (
      <MobxProvider {...stores}>
        <App history={history} />
      </MobxProvider>
  );
}

### 
import * as React from 'react';
import { observer, inject } from 'mobx-react';

@inject
@observer
export default class View extends React.Component {
  render() {
    return (
        <h3>
          <p>{this.props.store.number}</p>
          <input onClick=((e) => this.props.store.setNum(e.target.value)) />
        </h3>
    );
  }
}

```
