import { createStore, combineReducers } from 'redux';
import {createContainer, createRootContainer as rootContainer} from 'react-data-binding';
import autobind from 'autobind-decorator';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

function user(state = {}, action) {
  switch (action.type) {
  case 'update_user':
    return action.payload;
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  user,
});

const store = createStore(rootReducer, {
  user: {
    name: 'initial',
  },
});

function mapDispatch(contextStore) {
  return {
    dispatch: contextStore.dispatch,
  };
}

function container(selector, option = {}) {
  option.mapStoreProps = mapDispatch;
  return createContainer(selector, option);
}

@container({
  // specify data need to be concerned
  myUser: 'user',
})
class User extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    myUser: PropTypes.object,
  }

  @autobind
  onClick(e) {
    e.preventDefault();
    // trigger re render
    this.props.dispatch({
      // or use immutable.js
      type: 'update_user',
      payload: {
        name: 'updated: ' + Date.now(),
      },
    });
  }

  render() {
    return (<a href="#" onClick={this.onClick}>{this.props.myUser.name}</a>);
  }
}


@rootContainer(store)
class App extends React.Component {
  render() {
    return <User/>;
  }
}

ReactDOM.render(<App />, document.getElementById('__react-content'));
