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