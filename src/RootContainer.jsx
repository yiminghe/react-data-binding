import { Component, PropTypes, Children } from 'react';
import { storeShape } from './constants';

export class RootContainer extends Component {
  getChildContext() {
    return {store: this.props.store};
  }

  render() {
    const { children } = this.props;
    return Children.only(children);
  }
}

RootContainer.propTypes = {
  store: storeShape,
  children: PropTypes.element.isRequired,
};

RootContainer.childContextTypes = {
  store: storeShape,
};
