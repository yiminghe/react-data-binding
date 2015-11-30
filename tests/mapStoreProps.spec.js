import {createContainer, createRootContainer} from 'react-data-binding';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect.js';
import TestUtils, {Simulate} from 'react-addons-test-utils';

describe('mapStoreProps', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('can add props to container child', () => {
    let index = 0;

    let User = React.createClass({
      propTypes: {
        dispatch: PropTypes.func,
        myUser: PropTypes.object,
      },

      onClick(e) {
        e.preventDefault();
        // trigger re render
        this.props.dispatch({
          type: 'update_user',
          // or use immutable.js
          payload: {
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
    }, {
      mapStoreProps(store) {
        return {
          dispatch(action) {
            if (action.type === 'update_user') {
              // call store
              store.setState({
                user: action.payload,
              });
            }
          },
        };
      },
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
