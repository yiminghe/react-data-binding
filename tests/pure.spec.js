/* eslint react/no-multi-comp:0 */

import {createContainer, createRootContainer} from 'react-data-binding';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect.js';
import TestUtils, {Simulate} from 'react-addons-test-utils';

describe('pure', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('works', () => {
    let index = 0;

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
        return (<a href="#" onClick={this.onClick}>{this.props.myUser.name}</a>);
      },
    });

    User = createContainer({
      // specify data need to be concerned
      myUser: 'user',
    })(User);

    let App = React.createClass({
      render() {
        return <User />;
      },
    });

    App = createRootContainer({
      // initial app data
      user: {
        name: 'initial',
      },
    })(App);

    const app = ReactDOM.render(<App />, div);

    const a = TestUtils.scryRenderedDOMComponentsWithTag(app, 'a')[0];

    expect(a.innerHTML).to.be('initial');

    Simulate.click(a);

    expect(a.innerHTML).to.be('updated:1');

    Simulate.click(a);

    expect(a.innerHTML).to.be('updated:2');
  });
});
