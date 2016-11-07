![Eigenstate](assets/logo.png)

# Eigenstate

Eigenstate is a complete, modular state management framework for [React.js](https://facebook.github.io/react/). It provides support for *methods*.

Methods, like [Redux](https://github.com/reactjs/redux) reducers, are predictable and easy to test. The advantage is that they do not require action creators, switch statements, or middleware to provide complete functionality. They are also very simple to write.

## Features

* Tiny, flexible [API](https://github.com/8balloon/eigenstate#API) -- half the size of Redux + React Redux.
* Support for pure functional / asynchronous [methods](https://github.com/8balloon/eigenstate#methods).
* Immutable state -- always, automatically.

## 3 Easy Steps (but seriously)

1. Create a `Store` containing state data and methods.

2. Write your React.js view component, using state data and methods via `props`.

3. Connect store and view with the `Provider`.

```js
/*
A fully working app demonstrating synchronous and asynchronous functionality.
*/
import React from 'react'
import ReactDOM from 'react-dom'
import { Store, Provider } from 'eigenstate'

/*
1
*/
const store = Store({
  count: 0,
  color: 'red',
  increment: (amount, state) => ({ count: state.count + amount }),
  delayedIncrement: (payload, state) => {
    const { amount, delay } = payload
    setTimeout(function callback() { state.increment(amount) }, delay)
  },
  changeColor: (_, state) => ({ color: state.color === 'red' ? 'blue' : 'red' })
})

/*
2
*/
const View = (props) => (
  <div id="counter" style={{backgroundColor: props.color}}>
    { props.count }
    <div onClick={() => props.increment(1)}> INCREMENT </div>
    <div onClick={() => props.delayedIncrement({ amount: 10, delay: 1000 })}>
      SLOW INCREMENT
    </div>
    <div onClick={props.changeColor}> CHANGE COLOR </div>
  </div>
)

/*
3
*/
ReactDOM.render(
  <Provider store={store}>
    <View />
  </Provider>,
  document.getElementById('react-root')  
)
```

## Methods

The example above demonstrates all of these principles.

1. A method is defined with two parameters, and is called with at most one argument. An argument for the second parameter (`state`) is provided automatically.

2. A method may update state by returning updated state data.

3. A method may invoke other methods. **Caveat**: if a method calls another method, it's not allowed to return anything. (See [here](https://github.com/8balloon/eigenstate#method-purity) for a deeper explanation)

## API

* `Store` (function) : Accepts a `stateDefinition` object and returns an Eigenstate store. The Eigenstate store is a function which returns an immutable `state` object when invoked.

  * **stateDefinition** (constructor parameter, object) : an object of `key: data | method` pairs. Defines the Eigenstate state to be returned by `Store`. Data can be any JSON, and methods are described [here](https://github.com/8balloon/eigenstate#methods).

  * **.subscribe** (store property, function) : A function that accepts a function, `subscriber`. The `subscriber` is called on every method invocation with an `invocationDetails` object. To unsubscribe a `subscriber`, invoke the function returned by `<store>.subscribe`

  * **Provider** (React component) : Provides store state to its children. Must be passed a `store` property to work. Provides state data and methods to its child component via the child component's `props`.

* **connect** (function) : accepts a React component and returns a `connect()`ed version of that component. The `connect`ed version has access to the nearest `Provider`'s state through `props`. (This comes in handy with [React Router](https://github.com/ReactTraining/react-router).)

* **verboseLogger** (function) : an `onMethodListener` that logs useful information about method invocations to the console. Use by subscribing it to a store, like this:

  `const yourStore = Store({ ... }); yourStore.subscribe(verboseLogger)`

## Relevant concepts

#### Optimization

Eigenstate state is always immutable. This means that a `===` comparison will return `false` if state has changed. This is useful for your React components' `shouldComponentUpdate` functions. Here is an example `shouldComponentUpdate` that makes use of immutable state:

```js
//TodoList component
shouldComponentUpdate: function(nextProps) {
  return this.props.todoItems !== nextProps.todoItems //where todoItems is a complex data structure
}
```

If you implement this across your application, it will never re-render needlessly, making it very fast.

#### Method purity

Methods may be pure XOR impure. Methods that update state directly by returning data are *pure*, while methods that invoke other methods are *impure*.

Async methods go in impure methods. If Eigenstate catches you trying to update state directly from an impure method by returning data, it will throw an error.

This pure vs impure distinction is the central dogma of Eigenstate. Forcing you to separate methods by purity gives you the separate benefits of functional code (for clean application logic) and procedural code (for Ajax calls, and other async things, like animations).

#### Multiple Stores

You may pass multiple stores to a `Provider`, provided that the stores are namespaced, like so:

```js
<Provider store={{
  counter: counterStore,
  grid: gridStore
}}>
  <View />
</Provider>
```

In this example, state from `counterStore` and `gridStore` will be accessible from the view via `props.counter` and `props.gridStore` respectively.

#### Effects

Functions returned from methods are called "effects", and are executed after the view component of your application has completely updated. Use sparingly.

## Advanced Example

See [here](https://github.com/8balloon/frontend-boilerplate/tree/master/src).

This is a React Router setup that implements multiple routes in a single page. It demonstrates how to compose `stateDefinition`s and views through composition. It is a part of a larger [boilerplate](https://github.com/8balloon/frontend-boilerplate), which incorporates Webpack and SASS.
