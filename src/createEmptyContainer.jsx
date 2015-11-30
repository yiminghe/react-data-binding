import React, { Component } from 'react';
import { argumentContainer } from './utils';

export function createEmptyContainer(mapStoreProps, storeName) {
  return function create(WrappedComponent) {
    class Container extends Component {
      render() {
        return (
          <WrappedComponent
            {...mapStoreProps(this.context[storeName])}
            {...this.props}
            ref="wrappedInstance"/>
        );
      }
    }
    return argumentContainer(Container, WrappedComponent, storeName);
  };
}
