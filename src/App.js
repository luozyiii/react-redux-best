import React from 'react';
import {appContext, store, connect} from './redux'
import './App.css';

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