webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(185);


/***/ },

/***/ 185:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _reactDataBinding = __webpack_require__(12);
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(183);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var User = (0, _reactDataBinding.createContainer)({
	  // specify data need to be concerned
	  myUser: 'user'
	}, {
	  mapStoreProps: function mapStoreProps(store) {
	    return {
	      // actions
	      changeUser: function changeUser() {
	        store.setState({
	          user: _extends({}, store.getState().user, {
	            name: 'updated: ' + Date.now()
	          })
	        });
	      }
	    };
	  }
	})(function (_ref) {
	  var myUser = _ref.myUser;
	  var changeUser = _ref.changeUser;
	
	  return _react2['default'].createElement(
	    'a',
	    { href: '#', onClick: changeUser },
	    myUser.name,
	    ' at ',
	    myUser.location
	  );
	});
	
	var App = (0, _reactDataBinding.createRootContainer)({
	  // initial app data
	  user: {
	    name: 'initial',
	    location: 'china'
	  }
	})(function () {
	  return _react2['default'].createElement(User, null);
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(App, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=stateless-user.js.map