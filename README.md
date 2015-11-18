# react-data-binding
---

do react data binding in an easy way. inspired by redux.


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/react-data-binding.svg?style=flat-square
[npm-url]: http://npmjs.org/package/react-data-binding
[travis-image]: https://img.shields.io/travis/yiminghe/react-data-binding.svg?style=flat-square
[travis-url]: https://travis-ci.org/yiminghe/react-data-binding
[coveralls-image]: https://img.shields.io/coveralls/yiminghe/react-data-binding.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yiminghe/react-data-binding?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/yiminghe/react-data-binding.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/yiminghe/react-data-binding
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/react-data-binding.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-data-binding

## examples

http://yiminghe.github.io/react-data-binding

```js
import {createContainer, createRootContainer} from 'react-data-binding';
import React from 'react';
import ReactDOM from 'react-dom';
import assign from 'object-assign';

let User = React.createClass({
  onClick(e) {
    e.preventDefault();
    // trigger re render
    this.props.setStoreState({
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
```

## api

### Store

build in Store class, you can extend it to create your own store(such as redux store with reducer/dispatch).

### createRootContainer(initialAppData: Object|Store): (Function(WrappedComponent:ReactComponent):ReactComponent)

bind the initial global store state to react root component and generate a high order React Component.

### createContainer(selector: Object|Function, option: {pure=true, mapStoreProps:Function():Object}): (Function(WrappedComponent:ReactComponent):ReactComponent)

bind the subset of store state to react child component and generate a high order React Component.

WrappedComponent will receive the specified subset of store state and return value of option.mapStoreProps(store) as props.

default mapStoreProps will generate the following props:

#### setStoreState(state: Object)

update the global store state and re render react child components which bind to the specified subset of store state.

#### getStoreState()

get the global store state. use with caution.

## Test Case

http://localhost:8111/tests/runner.html?coverage

## Coverage

http://localhost:8111/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8001/tests/runner.html?coverage

## License

react-data-binding is released under the MIT license.