# 设计

react-data-binding 不仅能够帮助我们解决**组件间的数据共享**问题，它更是一种**管理 React 应用状态**的解决方案。
接下来我们结合具体的例子来看下：

### 场景分析

这是一个`购物车的场景`，我们有一个商品列表，可以选择喜欢的商品加入购物车，购物车有清空功能。  
针对这样一个场景，我们简单拆分成这么几个组件：![](https://os.alipayobjects.com/rmsportal/WMoVHoEaAxQoCtg.png)

### 初始化全局数据

我们将应用中所有的状态放在全局 store 上，并通过 createRootContainer 来初始化这个全局的 store.
![](https://os.alipayobjects.com/rmsportal/tALcJwvaUAHEPNS.png)

所以第一步，我们需要创建一个 rootContainer，并初始化全局 store. 以购物车为例，我们创建一个 App 组件：
```javascript
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

/*
  此处调用 createRootContainer:
  createRootContainer(storeData)(Component)
  storeData is a plain object
  Component is a react component
*/
export default createRootContainer({
  products: [
    { id: 1, name: '商品 A', price: 400 },
    { id: 2, name: '商品 B', price: 500 },
    { id: 3, name: '商品 C', price: 600 },
  ],
  itemsInCart: [],
})(App);

```

### 订阅数据

完成了 createRootContainer 之后，我们有了一个全局的 store，接下来可以去订阅 store 上的数据了。  
这个过程我们需要 container，通过 container 我们就可以订阅 rootContainer 上的数据了。
![](https://os.alipayobjects.com/rmsportal/JSFoHkRKMUUruIT.png)

以代码为例，我们给 Cart 增加一个 container：
```javascript
class CartContainer extends React.Component {
  render() {
    return <Cart {...this.props} />;
  }
}

// createContainer(data)(Component)
export default createContainer({
  itemsInCart: 'itemsInCart', // 订阅 store 上的 itemsInCart 数据
})(CartContainer);
```

同样的，ProductsContainer：
```javascript
class ProductsContainer extends React.Component {
  render() {
    return <ProductList {...this.props} />;
  }
}

// createContainer(data)(Component)
export default createContainer({
  products: 'products', // 订阅 store 上的 products 数据
})(ProductsContainer);
```

### 更新数据

> 我们推荐只在 container 中操作 store.

* 添加产品到购物车
  * 我们在 ProductsContainer 上增加了添加到购物车的方法，并将其通过 props 传递了给 ProductItem.  
* 清空数据
  * 同时在 CartContainer 上增加了清空购物车方法，并将其传递给 Cart.  

<br>
代码如下：

```javascript
class ProductsContainer extends React.Component {
  addToCart(product) {
    // 添加产品到购物车
    const itemsInCart = this.props.getStoreState().itemsInCart.concat([product]);
    this.props.setStoreState({
      itemsInCart: itemsInCart,
    });
  }
  render() {
    return <ProductList {...this.props} onAddToCart={this.addToCart.bind(this)}/>;
  }
}

class CartContainer extends React.Component {
  clearCart() {
    // 清空购物车
    this.props.setStoreState({
      itemsInCart: [],
    });
  }
  render() {
    return <Cart {...this.props} onCartClear={this.clearCart.bind(this)}/>;
  }
}
```

**API**
* `this.props.getStoreState`，用于获取 store 上的数据(订阅的数据用于展示，其他数据可用该方法获取)
* `this.props.setStoreState`，用于更新 store 上的数据，那些订阅了 store 上相关数据的 container 会随着 store 的更新而 rerender。

### 设计概览

![](https://os.alipayobjects.com/rmsportal/iAoVGwOYLDlBwMd.png)
