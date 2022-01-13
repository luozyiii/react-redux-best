import React, { useState, useContext, useEffect } from "react";
export const appContext = React.createContext(null);
export const store = {
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
export const connect = (Component) => {
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
