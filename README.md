![Eigenstate](assets/logo.png)

# Eigenstate

Eigenstate is a state container for [React.js](https://facebook.github.io/react/) that provides support for *methods*.

Methods, like [Redux](https://github.com/reactjs/redux) reducers, are predictable and easy to test. The advantage is that they do not require action creators, switch statements, or middleware to provide complete functionality.

## Features

* Tiny, flexible [API](https://github.com/8balloon/eigenstate#API) -- about half the size of Redux + React Redux.
* Support for pure functional / asynchronous [methods](https://github.com/8balloon/eigenstate#methods).
* Immutable state -- always, automatically.

## 3 Easy Steps (but seriously)

1. Create a `Store` containing state data and methods.

2. Write your React.js view component, using state data and methods via `props`.

3. Connect store and view with the `Provider`.

```js
/*
A working app to demonstrate sync and async functionality + logging.
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

Methods are how you update your state data.

**Methods are defined with two parameters, and called with one or zero arguments.**

The second parameter, `state`, is provided automatically. Look at each of the methods in the example above; they all use the `state` parameter to do useful stuff.

**Methods may update state by returning new state data.**

Look at the methods `increment` and `changeColor` in the example above. Each of them updates state by returning new state data. The view component updates accordingly, using state through `props`.

**Methods may be pure XOR impure. Async code goes in impure methods.**

Methods may update state by returning updated state data. Methods that do this are called *pure* methods. The methods `increment` and `changeColor` in the example above are pure methods.

Methods may invoke other methods. Methods that do this are called *impure* methods. The method `delayedIncrement` in the example above is an impure method.

Methods have to be pure or impure. They can't be both. Try to use pure methods as much as you can; since they are pure functions, they are easy to test and reason about. You should use impure methods when you have to use asynchronous code (callbacks), like `$.ajax` or `setTimeout` require you to do.

**Methods may return "effects"**

Functions returned from methods are called "effects", and are executed after the view component of your application has completely updated. They are meant for kicking off imperative side effects, like a non-React application or (in the worst case) imperative DOM mutations. Do not get them mixed up with impure methods, which are how you handle callbacks / asynchronous code.

## API

* **Store** (function) : Accepts a `stateDefinition` object and returns an Eigenstate store. The Eigenstate store is also a function, which returns an immutable `state` object when invoked.

  * constructor param: **stateDefinition** (required `Store` parameter) : an object of `key: data | method | stateDefinition` pairs. Defines the store which is returned by `Store`. Data can be any JSON, and methods are described [here](https://github.com/8balloon/eigenstate#methods).

  * store property: **.subscribe** (function) : A function that accepts a function, `subscriber`. The `subscriber` is called on every method invocation with an `invocationDetails` object. To unsubscribe a `subscriber`, invoke the function returned by `<store>.subscribe`

* **Provider** (React component) : Provides store state to its children. Must be passed a `store` property to work. Provides state data and methods to its child component via the child component's `props`.

* **connect** (function) : accepts a React component, and returns a `connect()`ed version of that component. The `connect`ed version has access to state from the nearest `Provider` store via its `props`, as though it was that `Provider`'s direct child. This is useful for integrating with [React Router](https://github.com/ReactTraining/react-router).

* **verboseLogger** (function) : an `onMethodListener` that logs information on method invocations to the console. Subscribe it to a store to use, like this:

  `const yourStore = Store({ ... }); yourStore.subscribe(verboseLogger)`

## Advanced Example

See [here](https://github.com/8balloon/frontend-boilerplate/tree/master/src).

This is a React Router setup that implements multiple routes in a single page. It demonstrates how to compose `stateDefinition`s and views through composition. It is a part of a larger [boilerplate](https://github.com/8balloon/frontend-boilerplate), which also incorporates Webpack and SASS.

## Relevant concepts

#### Method purity

The pure vs impure distinction is the central dogma of Eigenstate. Being forced to separate these types of method will give you the separate benefits of functional code (for clean application logic) and procedural code (for Ajax calls and animations).

Pro tip: annotate your methods with `// pure` or `// impure` comments to keep them explicitly differentiated :)

#### Optimization

Eigenstate state is always immutable. This means you can use it in your React components' `shouldComponentUpdate` functions using the `===` operator, like this:

```js
//TodoList component
shouldComponentUpdate: function(nextProps) {
  return this.props.todoItems !== nextProps.todoItems //where todoItems is a complex data structure
}
```

If you implement this across your application, it will never re-render needlessly.

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

Methods are passed **local state**, that is, state at their level in their state object tree. So in this example, `CounterView` will behave in the same manner if it were used like this:

```js
<Provider store={Store(counterStateDef)}> <CounterView /> </Provider>
```
