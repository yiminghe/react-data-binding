# RootContainer

RootContainer，负责初始化全局 store。

* 如何初始化
  ```javascript
  /*
  createRootContainer(storeData)(Component)
  storeData is a plain object
  Component is a react component
  */
  createRootContainer({
    user: { name: 'chris', age: 30 }
  })(App)
  ```

#### Example

以购物车为例，我们有产品列表、购物车列表，这些数据都可以通过 rootContainer 初始化，如下：
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

export default createRootContainer({
  products: [
    { id: 1, name: '商品 A', price: 400 },
    { id: 2, name: '商品 B', price: 500 },
    { id: 3, name: '商品 C', price: 600 },
  ],
  itemsInCart: [],
})(App);
```

#### RootContainer & Store

在 Roof 应用中，我们建议只有**一个 rootContainer**，它初始化的 store 应当是全局的、唯一的。  
Store 中的数据只是简单的键值对，当你订阅或者更新它的数据时，都是“键”为准，以上面代码为例：
```
createRootContainer({
  products: [
    { id: 1, name: '商品 A', price: 400 },
    { id: 2, name: '商品 B', price: 500 },
    { id: 3, name: '商品 C', price: 600 },
  ],
  itemsInCart: [],
})(App)
```

你可以订阅和修改的数据有：
* products
* itemsInCart
