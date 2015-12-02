# Container

Container，负责订阅并更新 store(由 RootContainer 初始化) 上的数据。

* 如何订阅数据
  ```javascript
  /// 首先，假设你已经有了一个 rootContainer:
  createRootContainer({
    user: { name: 'chris', age: 30 }
  })(App)
  ...

  /// 然后你需要做的就是订阅需要的数据，取名叫 myUser 或者随便什么
  /*
  createContainer(data)(Component)
  */
  @createContainer({
    myUser: 'user', // 'user' 指向 rootContainer 上的数据
  })
  ```
* 如何更新数据
  ```javascript
  // 在 container 的 props 上可以拿到 setStoreState
  // setStoreState 和 setState 类似，它用于更新 rootContainer 上的 store(数据)
  this.props.setStoreState({
    user: Object.assign({}, this.props.user, {age: 31})
  })
  ```

#### Example

还是以购物车为例，我们的购物车订阅了全局  store 上的 itemsInCart，并在 clearCart 方法中有清空了 itemsInCart.
```javascript
class CartContainer extends React.Component {
  clearCart() {
    this.props.setStoreState({  // 更新全局 store 上的数据
      itemsInCart: [],
    });
  }
  render() {
    return <Cart {...this.props} onCartClear={this.clearCart.bind(this)}/>;
  }
}

export default @createContainer({
  itemsInCart: 'itemsInCart', // 指定需要订阅的 store 上的数据
})(CartContainer)
```

#### Immutable

从上面的代码中我们可以看到，我们在更新数据时采用了这样的写法：
```
this.props.setStoreState({
  user: Object.assign({}, this.props.user, {age: 31})
})
this.props.setStoreState({  // 更新全局 store 上的数据
  itemsInCart: [],
});
```

这么做是故意的，从设计上来说，我们的全局 store 是不可变的(Immutable)，你要更新它，只有像 `user: Object.assign({}, this.props.user, {age: 31})` 这样，重新 assign 一个对象给它，而不是改变原有对象的值。

> 进一步说明(Todo)
