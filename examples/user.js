import {createContainer as container, createRootContainer as rootContainer} from 'react-data-binding';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import assign from 'object-assign';
import autobind from 'autobind-decorator';

@container({
  // specify data need to be concerned
  myUser: 'user'
})
class User extends Component {

  @autobind
  onClick(e) {
    e.preventDefault();
    // trigger re render
    this.props.setStoreState({
      // better use immutable.js
      user: {
        name: 'updated: ' + Date.now()
      }
    });
  }

  render() {
    return (<a href="#" onClick={this.onClick}>{this.props.myUser.name}</a>);
  }
}


@rootContainer({
  // initial app data
  user: {
    name: 'initial'
  }
})
class App extends React.Component {
  render() {
    return <User/>;
  }
}

ReactDOM.render(<App />, document.getElementById('__react-content'));
