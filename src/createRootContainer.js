import { RootContainer } from './RootContainer';
import { Store } from './Store';
import React from 'react';

function createRootContainerWrapper(WrappedComponent, store) {
  class RootContainerWrapper extends React.Component {
    render() {
      return (<RootContainer store={store}>
        <WrappedComponent {...this.props}/>
      </RootContainer>);
    }
  }
  return RootContainerWrapper;
}

export function createRootContainer(initialStore = {}) {
  const store = new Store(initialStore);
  return (WrappedComponent) => {
    return createRootContainerWrapper(WrappedComponent, store);
  };
}
