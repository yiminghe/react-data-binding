import {createContainer, createRootContainer} from 'react-data-binding';
import React from 'react';
import ReactDOM from 'react-dom';
import assign from 'object-assign';

let User = React.createClass({
  onClick(e) {
    e.preventDefault();
    // trigger re render
    this.props.updateStore({
      // or use immutable.js
      user: assign({}, this.props.myUser, {
        name: 'updated: ' + Date.now()
      })
    });
  },
  render() {
    return (<a href="#" onClick={this.onClick}>{this.props.myUser.name}</a>);
  }
});

User = createContainer({
  // specify data need to be concerned
  myUser: 'user'
})(User);

let App = React.createClass({
  render() {
    return <User />;
  }
});

App = createRootContainer({
  // initial app data
  user: {
    name: 'initial'
  }
})(App);

/*
 or use decorators

 @createRootContainer({
   // initial app data
   user: {
    name: 'initial'
   }
 })
 class App extends React.Component {}
 */

ReactDOM.render(<App />, document.getElementById('__react-content'));
