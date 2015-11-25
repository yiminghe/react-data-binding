import {createContainer, createRootContainer} from 'react-data-binding';
import React from 'react';
import ReactDOM from 'react-dom';

const User = createContainer({
  // specify data need to be concerned
  myUser: 'user'
}, {
  mapStoreProps(store) {
    return {
      // actions
      changeUser(){
        store.setState({
          user: {
            ... store.getState().user,
            name: 'updated: ' + Date.now()
          }
        })
      }
    }
  }
})(({myUser, changeUser}) => {
  return (<a href="#" onClick={changeUser}>{myUser.name} at {myUser.location}</a>);
});

const App = createRootContainer({
  // initial app data
  user: {
    name: 'initial',
    location: 'china'
  }
})(()=> {
  return <User/>;
});

ReactDOM.render(<App />, document.getElementById('__react-content'));
