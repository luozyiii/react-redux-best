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

let dispatch = store.dispatch;
let prevDispatch = dispatch;
dispatch = (action) => {
  if (action instanceof Function) {
    action(dispatch);
  } else {
    prevDispatch(action);
  }
};

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
