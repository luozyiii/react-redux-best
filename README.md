# react-redux-best
从0开始学习redux

## 使用上下文读写state
```js
import React, {useState, useContext} from 'react';
import './App.css';

const appContext = React.createContext(null);
const App = () => {
  const [appState, setAppState] = useState({
    user: {
      name: '小明',
      age: 18
    }
  })
  const contextValue = {appState, setAppState}
  return (
    <appContext.Provider value={contextValue}>
      <A/>
      <B/>
      <C/>
    </appContext.Provider>
  )
}

const A = () => <section>大儿子<User/></section>;
const B = () => <section>二儿子<UserModifier/></section>;
const C = () => <section>三儿子</section>;

const User = () => {
  const contextValue = useContext(appContext);
  return <div>User: {contextValue.appState.user.name}</div>
};
const UserModifier = () => {
  const { appState, setAppState } = useContext(appContext);
  const onChange = (e) => {
    appState.user.name = e.target.value;
    setAppState({...appState})
  }

  return <div>
    <input value={appState.user.name} onChange={onChange}/>
  </div>
};

export default App
``` 

## reducer - 规范state创建流程的函数
```js
import React, {useState, useContext} from 'react';
import './App.css';

const reducer = (state, {type, payload}) => {
  if(type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  }else {
    return state
  }
}

const appContext = React.createContext(null);
const App = () => {
  const [appState, setAppState] = useState({
    user: {
      name: '小明',
      age: 18
    }
  })
  const contextValue = {appState, setAppState}
  return (
    <appContext.Provider value={contextValue}>
      <A/>
      <B/>
      <C/>
    </appContext.Provider>
  )
}

const A = () => <section>大儿子<User/></section>;
const B = () => <section>二儿子<UserModifier/></section>;
const C = () => <section>三儿子</section>;

const User = () => {
  const contextValue = useContext(appContext);
  return <div>User: {contextValue.appState.user.name}</div>
};
const UserModifier = () => {
  const { appState, setAppState } = useContext(appContext);
  const onChange = (e) => {
    const newState = reducer(appState, {type: 'updateUser', payload:{name: e.target.value}})
    setAppState(newState)
  }

  return <div>
    <input value={appState.user.name} onChange={onChange}/>
  </div>
};

export default App
```

## dispatch - 规范setState的流程
```js
import React, {useState, useContext} from 'react';
import './App.css';

const reducer = (state, {type, payload}) => {
  if(type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  }else {
    return state
  }
}



const Wraper = () => {
  const { appState, setAppState } = useContext(appContext);
  const dispatch = (action) => {
    setAppState(reducer(appState, action))
  }
  return <UserModifier dispatch={dispatch} state={appState}/>
}

const appContext = React.createContext(null);
const App = () => {
  const [appState, setAppState] = useState({
    user: {
      name: '小明',
      age: 18
    }
  })
  const contextValue = {appState, setAppState}
  return (
    <appContext.Provider value={contextValue}>
      <A/>
      <B/>
      <C/>
    </appContext.Provider>
  )
}

const A = () => <section>大儿子<User/></section>;
const B = () => <section>二儿子<Wraper/></section>;
const C = () => <section>三儿子</section>;

const User = () => {
  const contextValue = useContext(appContext);
  return <div>User: {contextValue.appState.user.name}</div>
};
const UserModifier = ({dispatch, state}) => {
  const onChange = (e) => {
    dispatch({type: 'updateUser', payload:{name: e.target.value}})
  }

  return <div>
    <input value={state.user.name} onChange={onChange}/>
  </div>
};

export default App
```

## connect 高阶组件 - 让组件与全局状态连接起来
```js
import React, {useState, useContext} from 'react';
import './App.css';

const reducer = (state, {type, payload}) => {
  if(type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  }else {
    return state
  }
}

// react-redux 库提供的connect
const connect = (Component) => {
  return (props) => {
    const { appState, setAppState } = useContext(appContext);
    const dispatch = (action) => {
      setAppState(reducer(appState, action))
    }
    return <Component {...props} dispatch={dispatch} state={appState}/>
  }
}

const appContext = React.createContext(null);
const App = () => {
  const [appState, setAppState] = useState({
    user: {
      name: '小明',
      age: 18
    }
  })
  const contextValue = {appState, setAppState}
  return (
    <appContext.Provider value={contextValue}>
      <A/>
      <B/>
      <C/>
    </appContext.Provider>
  )
}

const A = () => <section>大儿子<User/></section>;
const B = () => <section>二儿子<UserModifier x={'x'}>内容:</UserModifier></section>;
const C = () => <section>三儿子</section>;

const User = () => {
  const contextValue = useContext(appContext);
  return <div>User: {contextValue.appState.user.name}</div>
};

const UserModifier = connect(({dispatch, state, children}) => {
  const onChange = (e) => {
    dispatch({type: 'updateUser', payload:{name: e.target.value}})
  }
  return <div>
    {children}
    <input value={state.user.name} onChange={onChange}/>
  </div>
})

export default App
```

## 利用 connect 减少render
```js
import React, {useState, useContext, useEffect} from 'react';
import './App.css';

const appContext = React.createContext(null);
const store = {
  state: {
    user: {
      name: '小明',
      age: 18
    }
  },
  setState(newState) {
    store.state = newState
    store.listeners.map(fn => fn(store.state))
  },
  listeners: [], // 监听者
  subscribe(fn){ // 订阅
    store.listeners.push(fn);
    return () => {
      let index = store.listeners.indexOf(fn);
      store.listeners.splice(index, 1);
    }
  }
}

const reducer = (state, {type, payload}) => {
  if(type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  }else {
    return state
  }
}

// react-redux 库提供的connect
const connect = (Component) => {
  return (props) => {
    const { state, setState } = useContext(appContext);
    const [, update] = useState({});
    // 只订阅一次
    useEffect(()=>{
      store.subscribe(()=>{
        update({});
      })
    }, [])
    const dispatch = (action) => {
      setState(reducer(state, action))
    }
    return <Component {...props} dispatch={dispatch} state={state}/>
  }
}


const App = () => {
  return (
    <appContext.Provider value={store}>
      <A/>
      <B/>
      <C/>
    </appContext.Provider>
  )
}
 
const A = () => {
  console.log('大儿子执行了：' + Math.random())
  return <section>大儿子<User/></section>;
};
const B = () => {
  console.log('二儿子执行了：' + Math.random())
  return <section>二儿子<UserModifier x={'x'}>内容:</UserModifier></section>;
};
const C = () => {
  console.log('三儿子执行了：' + Math.random())
  return <section>三儿子</section>;
}
const User = connect(({state}) => {
  console.log('User执行了：' + Math.random())
  return <div>User: {state.user.name}</div>
});

const UserModifier = connect(({dispatch, state, children}) => {
  console.log('UserModifier执行了：' + Math.random())
  const onChange = (e) => {
    dispatch({type: 'updateUser', payload:{name: e.target.value}})
  }
  return <div>
    {children}
    <input value={state.user.name} onChange={onChange}/>
  </div>
})

export default App
```

## 目录调整，将redux封装起来
```
src/redux
src/App.js
```