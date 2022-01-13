import React from "react";
import { Provider, createStore, connect } from "./redux";
import { connectToUser } from "./connecters/connectToUser";
import "./App.css";

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

const User = connectToUser(({ user }) => {
  console.log("User执行了：" + Math.random());
  return <div>User: {user.name}</div>;
});

// Redux 支持函数 action
const fetchUser = (dispatch) => {
  setTimeout(() => {
    dispatch({ type: "updateUser", payload: { name: "function明" } });
  }, 2000);
};

// Redux 支持 promise action
const fetchPromise = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: "promise明" });
    }, 2000);
  });
};

const UserModifier = connectToUser(
  ({ updateUser, user, children, dispatch }) => {
    console.log("UserModifier执行了：" + Math.random());
    const onChange = (e) => {
      updateUser({ name: e.target.value });
    };
    const handleClick = (e) => {
      dispatch(fetchUser);
      // dispatch({ type: "updateUser", payload: fetchPromise() });
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

export default App;
