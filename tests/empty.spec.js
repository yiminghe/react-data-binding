import {createContainer, createRootContainer} from 'react-data-binding';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect.js';
import TestUtils from 'react-addons-test-utils';
const container = createContainer;
const rootContainer = createRootContainer;

describe('react-data-binding', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('allow empty selector', () => {
    let app;
    @container()
    class User extends Component {
      static propTypes = {
        getStoreState: PropTypes.func,
      }

      render() {
        return <div className="data">{this.props.getStoreState().user.name}</div>;
      }
    }

    @rootContainer({
      user: {
        name: 'a',
      },
    })
    class App extends Component {
      render() {
        return <User/>;
      }
    }

    app = ReactDOM.render(<App />, div);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(app, 'data')[0].innerHTML).to.be('a');
  });
});
