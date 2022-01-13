import React, { useState, useEffect } from "react";

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
    const { state, setState, reducer } = store;
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

const appContext = React.createContext(null);

export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>;
};
