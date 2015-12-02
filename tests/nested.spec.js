/* eslint react/no-multi-comp:0 */

import {createContainer, createRootContainer} from 'react-data-binding';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator';
import expect from 'expect.js';
import TestUtils, {Simulate} from 'react-addons-test-utils';
const container = createContainer;
const rootContainer = createRootContainer;

describe('nested', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('will avoid redundant render under nested component condition', () => {
    let userRender = 0;
    let user2Render = 0;
    let appRender = 0;
    @container({
      user: 'user',
    })
    class User extends Component {
      static propTypes = {
        setStoreState: PropTypes.func,
        user: PropTypes.object,
      }

      @autobind
      change() {
        this.props.setStoreState({
          user: {
            name: 'b',
          },
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
      user2: 'user2',
    })
    class User2 extends Component {
      static propTypes = {
        user2: PropTypes.object,
      }

      render() {
        user2Render++;
        return <div className="user2">{this.props.user2.name}</div>;
      }
    }

    @rootContainer({
      user: {
        name: 'a',
      },
      user2: {
        name: 'c',
      },
    })
    class App extends Component {
      render() {
        appRender++;
        return <User/>;
      }
    }

    const app = ReactDOM.render(<App />, div);
    const userDom = TestUtils.scryRenderedDOMComponentsWithClass(app, 'user')[0];
    const user2Dom = TestUtils.scryRenderedDOMComponentsWithClass(app, 'user2')[0];
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

  it('allow nested root container', () => {
    let index = 0;
    let user1Render = 0;
    let user2Render = 0;

    let User = React.createClass({
      propTypes: {
        setStoreState: PropTypes.func,
        myUser: PropTypes.object,
      },

      onClick(e) {
        e.preventDefault();
        // trigger re render
        this.props.setStoreState({
          // or use immutable.js
          user: {
            ...this.props.myUser,
            name: 'updated:' + (++index),
          },
        });
      },
      render() {
        user1Render++;
        return (<a href="#" onClick={this.onClick} className="user1">{this.props.myUser.name}</a>);
      },
    });

    User = createContainer({
      // specify data need to be concerned
      myUser: 'user',
    })(User);

    let User2 = React.createClass({
      propTypes: {
        setStoreState: PropTypes.func,
        myUser: PropTypes.object,
      },

      onClick(e) {
        e.preventDefault();
        // trigger re render
        this.props.setStoreState({
          // or use immutable.js
          user: {
            ...this.props.myUser,
            name: 'updated2:' + (++index),
          },
        });
      },
      render() {
        user2Render++;
        return (<div>
          <a href="#" onClick={this.onClick} className="user2">{this.props.myUser.name}</a>
          <User />
        </div>);
      },
    });

    User2 = createContainer({
      // specify data needed to be concerned
      myUser: 'user',
    }, {
      storeName: 'store2',
    })(User2);

    let App2 = React.createClass({
      render() {
        return <User2 />;
      },
    });

    App2 = createRootContainer({
      // initial app data
      user: {
        name: 'initial2',
      },
    }, {
      storeName: 'store2',
    })(App2);

    let App = React.createClass({
      render() {
        return <App2 />;
      },
    });

    App = createRootContainer({
      // initial app data
      user: {
        name: 'initial',
      },
    })(App);

    const app = ReactDOM.render(<App />, div);

    const a1 = TestUtils.scryRenderedDOMComponentsWithClass(app, 'user1')[0];

    expect(a1.innerHTML).to.be('initial');

    const a2 = TestUtils.scryRenderedDOMComponentsWithClass(app, 'user2')[0];

    expect(a2.innerHTML).to.be('initial2');

    expect(user1Render).to.be(1);

    expect(user2Render).to.be(1);

    Simulate.click(a1);

    expect(a1.innerHTML).to.be('updated:1');

    expect(user1Render).to.be(2);

    expect(user2Render).to.be(1);

    Simulate.click(a2);

    expect(a2.innerHTML).to.be('updated2:2');

    expect(user1Render).to.be(2);

    expect(user2Render).to.be(2);
  });
});
