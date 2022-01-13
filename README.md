# react-redux-best

从 0 开始学习 redux

```
redux解决的问题就是组件和data的连接
```

## 使用上下文读写 state

```js
import React, { useState, useContext } from "react";
import "./App.css";

const appContext = React.createContext(null);
const App = () => {
  const [appState, setAppState] = useState({
    user: {
      name: "小明",
      age: 18,
    },
  });
  const contextValue = { appState, setAppState };
  return (
    <appContext.Provider value={contextValue}>
      <A />
      <B />
      <C />
    </appContext.Provider>
  );
};

const A = () => (
  <section>
    大儿子
    <User />
  </section>
);
const B = () => (
  <section>
    二儿子
    <UserModifier />
  </section>
);
const C = () => <section>三儿子</section>;

const User = () => {
  const contextValue = useContext(appContext);
  return <div>User: {contextValue.appState.user.name}</div>;
};
const UserModifier = () => {
  const { appState, setAppState } = useContext(appContext);
  const onChange = (e) => {
    appState.user.name = e.target.value;
    setAppState({ ...appState });
  };

  return (
    <div>
      <input value={appState.user.name} onChange={onChange} />
    </div>
  );
};

export default App;
```

## reducer - 规范 state 创建流程的函数

```js
import React, { useState, useContext } from "react";
import "./App.css";

const reducer = (state, { type, payload }) => {
  if (type === "updateUser") {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
    };
  } else {
    return state;
  }
};

const appContext = React.createContext(null);
const App = () => {
  const [appState, setAppState] = useState({
    user: {
      name: "小明",
      age: 18,
    },
  });
  const contextValue = { appState, setAppState };
  return (
    <appContext.Provider value={contextValue}>
      <A />
      <B />
      <C />
    </appContext.Provider>
  );
};

const A = () => (
  <section>
    大儿子
    <User />
  </section>
);
const B = () => (
  <section>
    二儿子
    <UserModifier />
  </section>
);
const C = () => <section>三儿子</section>;

const User = () => {
  const contextValue = useContext(appContext);
  return <div>User: {contextValue.appState.user.name}</div>;
};
const UserModifier = () => {
  const { appState, setAppState } = useContext(appContext);
  const onChange = (e) => {
    const newState = reducer(appState, {
      type: "updateUser",
      payload: { name: e.target.value },
    });
    setAppState(newState);
  };

  return (
    <div>
      <input value={appState.user.name} onChange={onChange} />
    </div>
  );
};

export default App;
```

## dispatch - 规范 setState 的流程

```
reducer(state, action)
initState => newState
Action => 变动的描述
```

```js
import React, { useState, useContext } from "react";
import "./App.css";

const reducer = (state, { type, payload }) => {
  if (type === "updateUser") {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
    };
  } else {
    return state;
  }
};

const Wraper = () => {
  const { appState, setAppState } = useContext(appContext);
  const dispatch = (action) => {
    setAppState(reducer(appState, action));
  };
  return <UserModifier dispatch={dispatch} state={appState} />;
};

const appContext = React.createContext(null);
const App = () => {
  const [appState, setAppState] = useState({
    user: {
      name: "小明",
      age: 18,
    },
  });
  const contextValue = { appState, setAppState };
  return (
    <appContext.Provider value={contextValue}>
      <A />
      <B />
      <C />
    </appContext.Provider>
  );
};

const A = () => (
  <section>
    大儿子
    <User />
  </section>
);
const B = () => (
  <section>
    二儿子
    <Wraper />
  </section>
);
const C = () => <section>三儿子</section>;

const User = () => {
  const contextValue = useContext(appContext);
  return <div>User: {contextValue.appState.user.name}</div>;
};
const UserModifier = ({ dispatch, state }) => {
  const onChange = (e) => {
    dispatch({ type: "updateUser", payload: { name: e.target.value } });
  };

  return (
    <div>
      <input value={state.user.name} onChange={onChange} />
    </div>
  );
};

export default App;
```

## connect 高阶组件 - 让组件与全局状态连接起来

```js
import React, { useState, useContext } from "react";
import "./App.css";

const reducer = (state, { type, payload }) => {
  if (type === "updateUser") {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
    };
  } else {
    return state;
  }
};

// react-redux 库提供的connect
const connect = (Component) => {
  return (props) => {
    const { appState, setAppState } = useContext(appContext);
    const dispatch = (action) => {
      setAppState(reducer(appState, action));
    };
    return <Component {...props} dispatch={dispatch} state={appState} />;
  };
};

const appContext = React.createContext(null);
const App = () => {
  const [appState, setAppState] = useState({
    user: {
      name: "小明",
      age: 18,
    },
  });
  const contextValue = { appState, setAppState };
  return (
    <appContext.Provider value={contextValue}>
      <A />
      <B />
      <C />
    </appContext.Provider>
  );
};

const A = () => (
  <section>
    大儿子
    <User />
  </section>
);
const B = () => (
  <section>
    二儿子<UserModifier x={"x"}>内容:</UserModifier>
  </section>
);
const C = () => <section>三儿子</section>;

const User = () => {
  const contextValue = useContext(appContext);
  return <div>User: {contextValue.appState.user.name}</div>;
};

const UserModifier = connect(({ dispatch, state, children }) => {
  const onChange = (e) => {
    dispatch({ type: "updateUser", payload: { name: e.target.value } });
  };
  return (
    <div>
      {children}
      <input value={state.user.name} onChange={onChange} />
    </div>
  );
});

export default App;
```

## 利用 connect 减少 render

```js
import React, { useState, useContext, useEffect } from "react";
import "./App.css";

const appContext = React.createContext(null);
const store = {
  state: {
    user: {
      name: "小明",
      age: 18,
    },
  },
  setState(newState) {
    store.state = newState;
    store.listeners.map((fn) => fn(store.state));
  },
  listeners: [], // 监听者
  subscribe(fn) {
    // 订阅
    store.listeners.push(fn);
    return () => {
      let index = store.listeners.indexOf(fn);
      store.listeners.splice(index, 1);
    };
  },
};

const reducer = (state, { type, payload }) => {
  if (type === "updateUser") {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
    };
  } else {
    return state;
  }
};

// react-redux 库提供的connect
const connect = (Component) => {
  return (props) => {
    const { state, setState } = useContext(appContext);
    const [, update] = useState({});
    // 只订阅一次
    useEffect(() => {
      store.subscribe(() => {
        update({});
      });
    }, []);
    const dispatch = (action) => {
      setState(reducer(state, action));
    };
    return <Component {...props} dispatch={dispatch} state={state} />;
  };
};

const App = () => {
  return (
    <appContext.Provider value={store}>
      <A />
      <B />
      <C />
    </appContext.Provider>
  );
};

const A = () => {
  console.log("大儿子执行了：" + Math.random());
  return (
    <section>
      大儿子
      <User />
    </section>
  );
};
const B = () => {
  console.log("二儿子执行了：" + Math.random());
  return (
    <section>
      二儿子<UserModifier x={"x"}>内容:</UserModifier>
    </section>
  );
};
const C = () => {
  console.log("三儿子执行了：" + Math.random());
  return <section>三儿子</section>;
};
const User = connect(({ state }) => {
  console.log("User执行了：" + Math.random());
  return <div>User: {state.user.name}</div>;
});

const UserModifier = connect(({ dispatch, state, children }) => {
  console.log("UserModifier执行了：" + Math.random());
  const onChange = (e) => {
    dispatch({ type: "updateUser", payload: { name: e.target.value } });
  };
  return (
    <div>
      {children}
      <input value={state.user.name} onChange={onChange} />
    </div>
  );
});

export default App;
```

## 目录调整，将 redux 封装起来

```
src/redux
src/App.js
```

## Selector - 来自 React-Redux 库

```js
// src/App.js
const User = connect((state) => {
  return { user: state.user };
})(({ user }) => {
  console.log("User执行了：" + Math.random());
  return <div>User: {user.name}</div>;
});

// src/redux
export const connect = (selector) => (Component) => {
  return (props) => {
    const { state, setState } = useContext(appContext);
    const [, update] = useState({});
    const data = selector ? selector(state) : { state };
    // 只订阅一次
    useEffect(() => {
      store.subscribe(() => {
        update({});
      });
    }, []);
    const dispatch = (action) => {
      setState(reducer(state, action));
    };
    return <Component {...props} {...data} dispatch={dispatch} />;
  };
};
```

## 精准渲染 - 组件只在自己数据变化时 render

我只更新 user,D 组件不应该被渲染

```js
// src/redux
state: {
  user: {
    name: "小明",
    age: 18,
  },
  group: { name: "前端组" }, // +
},

// 对象浅比较
const changed = (oldState, newState) => {
  let changeed = false;
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      changeed = true;
    }
  }
  return changeed;
};

// react-redux 库提供的connect
export const connect = (selector) => (Component) => {
  return (props) => {
    const { state, setState } = useContext(appContext);
    const [, update] = useState({});
    const data = selector ? selector(state) : { state };
    // 只订阅一次
    useEffect(
      () =>
        store.subscribe(() => {
          const newData = selector
            ? selector(store.state)
            : { state: store.state };
          if (changed(data, newData)) {
            console.log("update");
            update({});
          }
        }),
      // 注意：这里最好取消订阅，否则在 selector 变化时会出现重复订阅
      [selector]
    );
    const dispatch = (action) => {
      setState(reducer(state, action));
    };
    return <Component {...props} {...data} dispatch={dispatch} />;
  };
};

// src/App.js
const D = connect((state) => {
  return { group: state.group };
})(({ group }) => {
  console.log("四儿子执行了：" + Math.random());
  return (
    <section>
      四儿子<div>{group.name}</div>
    </section>
  );
});
```

## mapDispatchToProps - connect(selector, \_)(组件)

\_ ==> mapDispatchToProps: connect 的第二个参数

```js
// src/App.js
const UserModifier = connect(null, (dispatch) => {
  return {
    updateUser: (attrs) => dispatch({ type: "updateUser", payload: attrs }),
  };
})(({ updateUser, state, children }) => {
  console.log("UserModifier执行了：" + Math.random());
  const onChange = (e) => {
    updateUser({ name: e.target.value });
  };
  return (
    <div>
      {children}
      <input value={state.user.name} onChange={onChange} />
    </div>
  );
});

// src/redux
export const connect = (selector, mapDispatchToProps) => (Component) => {
  return (props) => {
    const { state, setState } = useContext(appContext);
    const dispatch = (action) => {
      setState(reducer(state, action));
    };
    const [, update] = useState({});
    const data = selector ? selector(state) : { state };
    const dispatcher = mapDispatchToProps
      ? mapDispatchToProps(dispatch)
      : { dispatch };
    // 只订阅一次
    useEffect(
      () =>
        store.subscribe(() => {
          const newData = selector
            ? selector(store.state)
            : { state: store.state };
          if (changed(data, newData)) {
            console.log("update");
            update({});
          }
        }),
      // 注意：这里最好取消订阅，否则在 selector 变化时会出现重复订阅
      [selector]
    );
    return <Component {...props} {...data} {...dispatcher} />;
  };
};
```

## connect 的意义

connect(MapStateToProps, MapDispatchToProps)(组件)

- MapStateToProps: 封装读
- MapDispatchToProps： 封装写
- connect: 封装读写

```js
// src/App.js
const User = connectToUser(({ user }) => {
  console.log("User执行了：" + Math.random());
  return <div>User: {user.name}</div>;
});

const UserModifier = connectToUser(({ updateUser, user, children }) => {
  console.log("UserModifier执行了：" + Math.random());
  const onChange = (e) => {
    updateUser({ name: e.target.value });
  };
  return (
    <div>
      {children}
      <input value={user.name} onChange={onChange} />
    </div>
  );
});

// src/connecters/connectToUser
import { connect } from "../redux";

const userSelector = (state) => {
  return { user: state.user };
};

const userDispatcher = (dispatch) => {
  return {
    updateUser: (attrs) => dispatch({ type: "updateUser", payload: attrs }),
  };
};

export const connectToUser = connect(userSelector, userDispatcher);
```

## CreateStore(reducer, initState) - 创建 Store

```js
// src/App.js
import { Provider, createStore, connect } from "./redux";

const initState = {
  user: { name: "小明", age: 18 },
  group: { name: "前端组" },
};

const reducer = (state, { type, payload }) => {
  if (type === "updateUser") {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
    };
  } else {
    return state;
  }
};

const store = createStore(reducer, initState);

const App = () => {
  return (
    <Provider store={store}>
      <A />
      <B />
      <C />
      <D />
    </Provider>
  );
};

// src/redux
const store = {
  state: undefined,
  reducer: undefined,
  setState(newState) {
    store.state = newState;
    store.listeners.map((fn) => fn(store.state));
  },
  listeners: [], // 监听者
  subscribe(fn) {
    // 订阅
    store.listeners.push(fn);
    return () => {
      let index = store.listeners.indexOf(fn);
      store.listeners.splice(index, 1);
    };
  },
};

export const createStore = (reducer, initState) => {
  store.state = initState;
  store.reducer = reducer;
  return store;
};

export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>;
};
```

## 重构 redux，与官方文档输出保持一致

```js
import React, { useState, useEffect } from "react";
let state = undefined;
let reducer = undefined;
let listeners = []; // 监听者

const setState = (newState) => {
  state = newState;
  listeners.map((fn) => fn(state));
};

const store = {
  getState() {
    return state;
  },
  dispatch: (action) => {
    setState(reducer(state, action));
  },
  subscribe(fn) {
    // 订阅
    listeners.push(fn);
    return () => {
      let index = listeners.indexOf(fn);
      listeners.splice(index, 1);
    };
  },
};

const dispatch = store.dispatch;

export const createStore = (_reducer, initState) => {
  state = initState;
  reducer = _reducer;
  return store;
};

// 对象浅比较
const changed = (oldState, newState) => {
  let changeed = false;
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      changeed = true;
    }
  }
  return changeed;
};

// react-redux 库提供的connect
export const connect = (selector, mapDispatchToProps) => (Component) => {
  return (props) => {
    const [, update] = useState({});
    const data = selector ? selector(state) : { state };
    const dispatcher = mapDispatchToProps
      ? mapDispatchToProps(dispatch)
      : { dispatch };
    // 只订阅一次
    useEffect(
      () =>
        store.subscribe(() => {
          const newData = selector ? selector(state) : { state };
          if (changed(data, newData)) {
            console.log("update");
            update({});
          }
        }),
      // 注意：这里最好取消订阅，否则在 selector 变化时会出现重复订阅
      [selector]
    );
    return <Component {...props} {...data} {...dispatcher} />;
  };
};

const appContext = React.createContext(null);

export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>;
};
```

## 让 Redux 支持函数 action

```js
// src/redux.js
let dispatch = store.dispatch;
let prevDispatch = dispatch;
dispatch = (action) => {
  if (action instanceof Function) {
    action(dispatch);
  } else {
    prevDispatch(action);
  }
};

//App.js
const fetchUser = (dispatch) => {
  setTimeout(() => {
    dispatch({ type: "updateUser", payload: { name: "function明" } });
  }, 2000);
};

const UserModifier = connectToUser(
  ({ updateUser, user, children, dispatch }) => {
    console.log("UserModifier执行了：" + Math.random());
    const onChange = (e) => {
      updateUser({ name: e.target.value });
    };
    const handleClick = (e) => {
      dispatch(fetchUser);
    };
    return (
      <div>
        {children}
        <input value={user.name} onChange={onChange} />
        <button onClick={handleClick}>异步获取user</button>
      </div>
    );
  }
);

// connecters/connectToUser.js
// 把 dispatch 返回出去
const userDispatcher = (dispatch) => {
  return {
    updateUser: (attrs) => dispatch({ type: "updateUser", payload: attrs }),
    dispatch,
  };
};
```

## 让 Redux 支持 promise action

```js
// src/redux
// 支持 payload 是promise
let prevDispatch2 = dispatch;
dispatch = (action) => {
  if (action.payload instanceof Promise) {
    action.payload.then((data) => {
      dispatch({ ...action, payload: data });
    });
  } else {
    prevDispatch2(action);
  }
};

// src/App.js
const fetchPromise = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: "promise明" });
    }, 2000);
  });
};

dispatch({ type: "updateUser", payload: fetchPromise() });
```

## 中间件

阅读 redux-thunk 和 redux-promise 源码； 你会发现和前面两种写法基本一致
