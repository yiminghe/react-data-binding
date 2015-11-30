import { Store } from './Store';
import React, { Component } from 'react';
import { storeShape } from './constants';

function createRootContainerWrapper(WrappedComponent, store, storeName) {
  class RootContainer extends Component {
    getChildContext() {
      return {
        [storeName]: store,
      };
    }

    render() {
      return <WrappedComponent {...this.props}/>;
    }
  }

  RootContainer.childContextTypes = {
    [storeName]: storeShape,
  };
  return RootContainer;
}

export function createRootContainer(initialStore = {}, option = {}) {
  const store = typeof initialStore.getState === 'function' ? initialStore : new Store(initialStore);
  const { storeName = 'store' } = option;
  return (WrappedComponent) => {
    return createRootContainerWrapper(WrappedComponent, store, storeName);
  };
}
