import hoistStatics from 'hoist-non-react-statics';
import { storeShape } from './constants';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'WrappedComponent';
}

export function argumentContainer(Container, WrappedComponent, storeName) {
  Container.displayName = `Container(${getDisplayName(WrappedComponent)})`;
  Container.WrappedComponent = WrappedComponent;
  Container.contextTypes = {
    [storeName]: storeShape,
  };

  return hoistStatics(Container, WrappedComponent);
}
