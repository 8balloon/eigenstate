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

See the example above, which demonstrates all of these principles.

1. A method is defined with two parameters.

2. A method is called with one or zero arguments. An argument for the second parameter (`state`) is provided by Eigenstate. You may not provide this argument. yourself.

3. A method may update state by returning updated state data.

4. A method may invoke other methods, but a method that does so may not update state directly by returning updated state data. (See [here](https://github.com/8balloon/eigenstate#method-purity) for a deeper explanation)

## API

* `Store` (function) : Accepts a `stateDefinition` object and returns an Eigenstate store. The Eigenstate store is a function which returns an immutable `state` object when invoked.

  * **stateDefinition** (constructor parameter, object) : an object of `key: data | method | stateDefinition` pairs. Defines the Eigenstate store to be returned by `Store`. Data can be any JSON, and methods are described [here](https://github.com/8balloon/eigenstate#methods).

  * **.subscribe** (store property, function) : A function that accepts a function, `subscriber`. The `subscriber` is called on every method invocation with an `invocationDetails` object. To unsubscribe a `subscriber`, invoke the function returned by `<store>.subscribe`

* **Provider** (React component) : Provides store state to its children. Must be passed a `store` property to work. Provides state data and methods to its child component via the child component's `props`.

* **connect** (function) : accepts a React component, and returns a `connect()`ed version of that component. The `connect`ed version has access to state from the nearest `Provider` store via its `props`, as though it was that `Provider`'s direct child. This is useful for integrating with [React Router](https://github.com/ReactTraining/react-router).

* **verboseLogger** (function) : an `onMethodListener` that logs useful information about method invocations to the console. Use by subscribing it to a store, like this:

  `const yourStore = Store({ ... }); yourStore.subscribe(verboseLogger)`

## Relevant concepts

#### Method purity

Methods may be pure XOR impure.

Methods that return updated state data are called *pure methods*.

Methods that invoke other methods are called *impure methods*. Async code goes in impure methods.

Eigenstate will throw an error it finds you using a method that is pure *and* impure.

This pure vs impure distinction is the central dogma of Eigenstate. Being forced to separate methods by purity will give you the separate benefits of functional code (for clean application logic) and procedural code (for Ajax calls, animations, and so forth).

#### Store composition

Stores are constructed with a `stateDefinition` parameter. `stateDefinition`s are easy to compose, like this:

```js
const counterStateDef = { ... }
const gridStateDef = { ... }
const applicationStore = ({
  counter: counterStateDef,
  grid: gridStateDef,
  ...
})

const ApplicationView = (props) => (
  <div id="application">
    <CounterView {...props.counter} />
    <GridView {...props.grid} />
  </div>
)

ReactDOM.render(<Provider store={applicationStore}> <ApplicationView> </Provider>, ...)
```

Methods are passed **local state**, that is, state at their level in their state object tree. So in the above example, `CounterView` will behave in the same manner if it were used like this:

```js
<Provider store={Store(counterStateDef)}> <CounterView /> </Provider>
```

#### Optimization

Eigenstate state is always immutable. This means that a `===` comparison will never return true if state has changed. This is useful for your React components' `shouldComponentUpdate` functions. Here is an example `shouldComponentUpdate` that makes use of immutable state:

```js
//TodoList component
shouldComponentUpdate: function(nextProps) {
  return this.props.todoItems !== nextProps.todoItems //where todoItems is a complex data structure
}
```

If you implement this across your application, it will never re-render needlessly, making it very fast.

#### Effects

Functions returned from methods are called "effects", and are executed after the view component of your application has completely updated. They are meant for kicking off imperative side effects, like a non-React animation or (in the worst case) imperative DOM mutations. They should be used as sparingly as possible. Do not get them mixed up with impure methods; effects have nothing to do with asynchronous code (callbacks).

## Advanced Example

See [here](https://github.com/8balloon/frontend-boilerplate/tree/master/src).

This is a React Router setup that implements multiple routes in a single page. It demonstrates how to compose `stateDefinition`s and views through composition. It is a part of a larger [boilerplate](https://github.com/8balloon/frontend-boilerplate), which incorporates Webpack and SASS.
