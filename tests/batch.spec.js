/* eslint react/no-multi-comp:0 */

import {createContainer, createRootContainer} from 'react-data-binding';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect.js';
import TestUtils, {Simulate} from 'react-addons-test-utils';

describe('batch', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('reduce rendering', (done) => {
    let index = 0;
    let rendered = 0;

    let User = React.createClass({
      propTypes: {
        setStoreState: PropTypes.func,
        batchStore: PropTypes.func,
        myUser: PropTypes.object,
      },

      onClick(e) {
        e.preventDefault();
        const {setStoreState, myUser, batchStore} = this.props;
        setTimeout(batchStore(() => {
          // trigger re render
          setStoreState({
            // or use immutable.js
            user: {
              ...myUser,
              name: 'updated:' + (++index),
            },
          });

          setStoreState({
            // or use immutable.js
            user: {
              ...myUser,
              name: 'updated:' + (++index),
            },
          });
        }), 0);
      },
      render() {
        rendered++;
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

    Simulate.click(a);

    setTimeout(() => {
      expect(rendered).to.be(2);
      done();
    }, 100);
  });
});
