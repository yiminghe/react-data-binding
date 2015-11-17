import shallowEqual from 'shallowequal';
import React, {Component} from 'react';
import { storeShape } from './constants';
import { createStructuredSelector } from 'reselect';
import hoistStatics from 'hoist-non-react-statics';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'WrappedComponent';
}

function createSelectGetter(s) {
  return state => state[s];
}

export function createContainer(selector_, option = {}) {
  const {pure = true} = option;
  let selector = selector_;

  if (typeof selector === 'object') {
    const selectMap = {};
    for (const s in selector) {
      if (selector.hasOwnProperty(s)) {
        selectMap[s] = createSelectGetter(selector[s]);
      }
    }
    selector = createStructuredSelector(selectMap);
  }

  const shouldUpdateStateProps = selector.length > 1;

  return function create(WrappedComponent) {
    class Container extends Component {
      constructor(props, context) {
        super(props, context);
        this.onChange = this.onChange.bind(this);
        this.updateStore = this.updateStore.bind(this);
        this.state = {
          appState: this.getAppState() || {},
        };
      }

      componentDidMount() {
        if (!this.unsubscribe) {
          this.unsubscribe = this.context.store.onChange(this.onChange);
        }
      }

      componentWillReceiveProps(nextProps) {
        let appState;
        if (pure) {
          let propsChanged = false;
          if (shouldUpdateStateProps) {
            propsChanged = !shallowEqual(nextProps, this.props);
          }
          if (propsChanged) {
            appState = this.getAppState(nextProps);
          }
        } else if (shouldUpdateStateProps) {
          appState = this.getAppState(nextProps);
        }
        if (appState) {
          this.setState({
            appState,
          });
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (pure) {
          const propsChanged = !shallowEqual(nextProps, this.props);
          if (propsChanged) {
            return true;
          }
          return !shallowEqual(nextState.appState, this.state.appState);
        }
        return true;
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      }

      onChange() {
        this.setState({
          appState: this.getAppState(),
        });
      }

      getAppState(props = this.props) {
        const store = this.context.store;
        const state = store.getState();
        return shouldUpdateStateProps ?
          selector(state, props) :
          selector(state);
      }

      updateStore(state) {
        this.context.store.setState(state);
      }

      render() {
        const {appState} = this.state;
        return (
          <WrappedComponent {...appState}
            store={this.context.store.getState()}
            updateStore={this.updateStore}
            {...this.props} ref="wrappedInstance"/>
        );
      }
    }

    Container.displayName = `Container(${getDisplayName(WrappedComponent)})`;
    Container.WrappedComponent = WrappedComponent;
    Container.contextTypes = {
      store: storeShape,
    };

    return hoistStatics(Container, WrappedComponent);
  };
}
