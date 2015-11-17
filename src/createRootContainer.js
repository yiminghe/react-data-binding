import { RootContainer } from './RootContainer';
import { Store } from './Store';
import React, {Component} from 'react';

function createRootContainerWrapper(WrappedComponent, store) {
  const RootContainerWrapper = React.createClass({
    render() {
      return (<RootContainer store={store}>
        <WrappedComponent {...this.props}/>
      </RootContainer>);
    }
  });
  return RootContainerWrapper;
}

export function createRootContainer(initialStore = {}) {
  const store = new Store(initialStore);
  return (WrappedComponent) => {
    return createRootContainerWrapper(WrappedComponent, store);
  };
}
