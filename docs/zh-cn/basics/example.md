# Example

以购物车为例，我们看下主要的代码。

### 目录

```
.
├── common
│   └── lib.js
├── components
│   ├── Cart.jsx
│   ├── ProductItem.jsx
│   └── ProductList.jsx
├── containers
│   ├── App.jsx
│   ├── CartContainer.jsx
│   └── ProductsContainer.jsx
├── entry
│   └── index.jsx
└── style
    └── style.less
```

### Containers

> store 的初始化、订阅、操作都应该在 container 中完成

#### `<App />`
```javascript
import React from 'react';
import { createRootContainer } from 'react-data-binding';
import ProductsContainer from './ProductsContainer';
import CartContainer from './CartContainer';

class App extends React.Component {
  render() {
    return (
      <div style={{padding: 20, marginLeft: 100}}>
        <ProductsContainer />
        <CartContainer />
      </div>
    );
  }
}

// 初始化 store
export default createRootContainer({
  products: [
    { id: 1, name: '商品 A', price: 400 },
    { id: 2, name: '商品 B', price: 500 },
    { id: 3, name: '商品 C', price: 600 },
  ],
  itemsInCart: [],
})(App);
```

#### `<ProductsContainer />`
```javascript
import React from 'react';
import { createContainer } from 'react-data-binding';
import ProductList from '../components/ProductList';

class ProductsContainer extends React.Component {
  addToCart(product) {
    // 通过 getStoreState 获取 itemsInCart，并更新
    // 此处不订阅 itemsInCart 原因是订阅后，
    // 当 itemsInCart 变化时 container 会刷新，
    // 而 ProductsContainer 下的组件实际展示不依赖 itemsInCart
    const itemsInCart = this.props.getStoreState().itemsInCart.concat([product]);
    this.props.setStoreState({
      itemsInCart: itemsInCart,
    });
  }
  render() {
    return <ProductList {...this.props} onAddToCart={this.addToCart.bind(this)}/>;
  }
}

ProductsContainer.propTypes = {
  products: React.PropTypes.array,
  getStoreState: React.PropTypes.func,
  setStoreState: React.PropTypes.func,
};

// 订阅 products
export default createContainer({
  products: 'products',
})(ProductsContainer);
```

#### `<CartContainer />`
```javascript
import React from 'react';
import { createContainer } from 'react-data-binding';
import Cart from '../components/Cart';

class CartContainer extends React.Component {
  clearCart() {
    this.props.setStoreState({
      itemsInCart: [],
    });
  }
  render() {
    return <Cart {...this.props} onCartClear={this.clearCart.bind(this)}/>;
  }
}

CartContainer.propTypes = {
  setStoreState: React.PropTypes.func,
};

// 订阅 itemsInCart
export default createContainer({
  itemsInCart: 'itemsInCart',
})(CartContainer);
```

### Components

components 下的代码是非常普通的 React 组件，这里就不再贴出来了。