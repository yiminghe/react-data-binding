import {createContainer, createRootContainer} from 'react-data-binding';
import React from 'react';
import ReactDOM from 'react-dom';
import assign from 'object-assign';
import expect from 'expect.js';
import TestUtils, {Simulate} from 'react-addons-test-utils';

describe('react-data-binding', function () {
  var div;

  beforeEach(function () {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('works for pure', function () {
    var index = 0;

    let User = React.createClass({
      onClick(e) {
        e.preventDefault();
        // trigger re render
        this.props.setStoreState({
          // or use immutable.js
          user: assign({}, this.props.myUser, {
            name: 'updated:' + (++index)
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

    var app = ReactDOM.render(<App />, div);

    var a = TestUtils.scryRenderedDOMComponentsWithTag(app, 'a')[0];

    expect(a.innerHTML).to.be('initial');

    Simulate.click(a);

    expect(a.innerHTML).to.be('updated:1');

    Simulate.click(a);

    expect(a.innerHTML).to.be('updated:2');
  });

  it('can add props to container child', function () {
    var index = 0;

    let User = React.createClass({
      onClick(e) {
        e.preventDefault();
        // trigger re render
        this.props.dispatch({
          type: 'update_user',
          // or use immutable.js
          payload: assign({}, this.props.myUser, {
            name: 'updated:' + (++index)
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
    }, {
      mapStoreProps(store){
        return {
          dispatch: function (action) {
            if (action.type === 'update_user') {
              // call store
              store.setState({
                user: action.payload,
              });
            }
          }
        };
      }
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

    var app = ReactDOM.render(<App />, div);

    var a = TestUtils.scryRenderedDOMComponentsWithTag(app, 'a')[0];

    expect(a.innerHTML).to.be('initial');

    Simulate.click(a);

    expect(a.innerHTML).to.be('updated:1');

    Simulate.click(a);

    expect(a.innerHTML).to.be('updated:2');
  });
});


