import { Store } from './Store';
import React, { Component } from 'react';
import { storeShape } from './constants';

function createRootContainerWrapper(WrappedComponent, store) {
  class RootContainer extends Component {
    getChildContext() {
      return {
        store,
      };
    }

    render() {
      return <WrappedComponent {...this.props}/>;
    }
  }

  RootContainer.childContextTypes = {
    store: storeShape,
  };
  return RootContainer;
}

export function createRootContainer(initialStore = {}) {
  const store = typeof initialStore.getState === 'function' ? initialStore : new Store(initialStore);
  return (WrappedComponent) => {
    return createRootContainerWrapper(WrappedComponent, store);
  };
}
