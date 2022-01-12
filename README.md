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
  const contextValue = useContext(appContext);
  const onChange = (e) => {
    contextValue.appState.user.name = e.target.value;
    contextValue.setAppState({...contextValue.appState})
  }

  return <div>
    <input value={contextValue.appState.user.name} onChange={onChange}/>
  </div>
};

export default App
``` 