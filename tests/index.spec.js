import {createContainer, createRootContainer} from 'react-data-binding';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import assign from 'object-assign';
import autobind from 'autobind-decorator';
import expect from 'expect.js';
import TestUtils, {Simulate} from 'react-addons-test-utils';
const container = createContainer;
const rootContainer = createRootContainer;

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

  it('allow empty selector', function () {
    @container()
    class User extends Component {
      render() {
        return <div className="data">{this.props.getStoreState().user.name}</div>;
      }
    }

    @rootContainer({
      user: {
        name: 'a'
      }
    })
    class App extends Component {
      render() {
        return <User/>
      }
    }

    var app = ReactDOM.render(<App />, div);

    expect(TestUtils.scryRenderedDOMComponentsWithClass(app, 'data')[0].innerHTML).to.be('a');
  });

  it('will avoid redundant render under nested component condition', function () {
    let userRender = 0;
    let user2Render = 0;
    let appRender = 0;
    @container({
      user: 'user'
    })
    class User extends Component {
      @autobind
      change() {
        this.props.setStoreState({
          user:{
            name:'b'
          }
        });
      }

      render() {
        userRender++;
        return (<div>
          <div className="user" onClick={this.change}>{this.props.user.name}</div>
          <User2 />
        </div>);
      }
    }

    @container({
      user2: 'user2'
    })
    class User2 extends Component {
      render() {
        user2Render++;
        return <div className="user2">{this.props.user2.name}</div>;
      }
    }

    @rootContainer({
      user: {
        name: 'a'
      },
      user2:{
        name:'c'
      }
    })
    class App extends Component {
      render() {
        appRender++;
        return <User/>
      }
    }

    var app = ReactDOM.render(<App />, div);
    var userDom = TestUtils.scryRenderedDOMComponentsWithClass(app, 'user')[0];
    var user2Dom = TestUtils.scryRenderedDOMComponentsWithClass(app, 'user2')[0];
    expect(userDom.innerHTML).to.be('a');
    expect(user2Dom.innerHTML).to.be('c');
    expect(userRender).to.be(1);
    expect(user2Render).to.be(1);
    expect(appRender).to.be(1);
    Simulate.click(userDom);
    expect(userRender).to.be(2);
    expect(user2Render).to.be(1);
    expect(appRender).to.be(1);
    expect(userDom.innerHTML).to.be('b');
  });
});


