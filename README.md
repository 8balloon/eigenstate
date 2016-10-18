![Eigenstate](assets/logo.png)

# Eigenstate

Eigenstate is a state-management library for [React.js](https://facebook.github.io/react/) that provides support for *methods*.

Methods, like [Redux](https://github.com/reactjs/redux) reducers, are predictable and easy to test. The advantage is that they do not require action creators, switch statements, or middleware to provide complete functionality.

## Features

* Pure functional / asynchronous [methods](https://github.com/8balloon/eigenstate#methods)
* Tiny, flexible [API](https://github.com/8balloon/eigenstate#API) (1/2 the size of Redux + React Redux)
* Synchronous-sequential update batching (so it's [fast](https://github.com/8balloon/eigenstate#speed-and-optimization))
* Automatic immutable state (so it's [optimizable](https://github.com/8balloon/eigenstate#speed-and-optimization))

## 3 Easy Steps (but seriously)

1. Create a ```Store``` object with state data and methods.

2. Write your React.js view component, using state data and methods via ```props```.

3. Connect your store and your view with the ```Provider```.

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

The second parameter, ```state```, is provided automatically. Look at each of the methods in the example above; they all use the ```state``` parameter to do useful stuff.

**Methods may update state by returning new state data.**

Look at the methods ```increment``` and ```changeColor``` in the example above. Each of them updates state by returning new state data. The view component updates accordingly, using state through ```props```.

**Methods may be pure XOR impure. Async code goes in impure methods.**

Methods may update state by returning updated state data. Methods that do this are called *pure* methods. The methods ```increment``` and ```changeColor``` in the example above are pure methods.

Methods may invoke other methods. Methods that do this are called *impure* methods. The method ```delayedIncrement``` in the example above is an impure method.

Methods have to be pure or impure. They can't be both. Try to use pure methods as much as you can; since they are pure functions, they are easy to test and reason about. You should use impure methods when you have to use asynchronous code (callbacks), like ```$.ajax``` or ```setTimeout``` require you to do.

**Methods may return "effects"**

Functions returned from methods are called "effects", and are executed after the view component of your application has completely updated. Effects may not invoke methods. They are intended only for side-effects, like kicking off a non-React animation, or (in the worst case) imperative DOM mutations.

## API

* **Store** (function) : Accepts a ```stateDefinition``` object and returns an Eigenstate store. The Eigenstate store is also a function, which returns an immutable ```state``` object when invoked.

  * **stateDefinition** (required ```Store``` parameter) : an object of ```key: data | method | stateDefinition``` pairs. Defines the store which is returned by ```Store```. Data can be any JSON, and methods are described [here](https://github.com/8balloon/eigenstate#methods).

  * **<store>.onMethod** (function) : A function that accepts a function, ```onMethodListener```. The ```onMethodListener``` is called on every method invocation with an ```invocationDetails``` object. To unsubscribe an ```onMethodListener```, invoke the function returned by ```<store>.onMethod```

  * **<store>.onUpdate** (function) : A function that accepts a function, ```onUpdateListener```. The ```onUpdateListener``` is called every time the state completes an update, and is passed an immutable ```state``` object. To unsubscribe an ```onUpdateListener```, invoke the function returned by ```<store>.onUpdate```

* **Provider** (React component) : Provides store state to its children. Must be passed a ```store``` property to work. Provides state data and methods to its child component via the child component's ```props```.

* **connect** (function) : accepts a React component, and returns a ```connect()```ed version of that component. The ```connect```ed version has access to state from the nearest ```Provider``` store via its ```props```, as though it was that ```Provider```'s direct child. This is useful for integrating with [React Router](https://github.com/ReactTraining/react-router).

* **logVerbosely** (function) : an ```onMethodListener``` that logs information on method invocations to the console. Use it like this:

```js
const yourStore = Store({ ... })

yourStore.onMethod(logVerbosely) // congratulations -- you've set up logging!

ReactDOM.render(<Provider store={yourStore}>...)
```

## Advanced Example

See [here](https://github.com/8balloon/eigenstate/blob/master/test/CompleteExample/index.jsx).

This is a React Router setup that implements multiple routes in a single page. It shows how to compose ```stateDefinition```s and views into larger ```stateDefinition```s and views via composition. On route change, it scrolls to the route's corresponding element on the page.

## Relevant concepts

#### Method purity

The pure vs impure distinction is the central dogma of Eigenstate. It's sort of like React's props vs state distinction. While you might be able to write your application without the pure XOR impure rule, it will help you structure your state transformations across the lifecycle of your application.

There are a few subtle reasons for this distinction, but the big obvious one is that it allows you to have the separate benefits of functional code (for clean application logic) and procedural code (for Ajax calls and animations).

Pro tip: annotate your methods with ```// pure``` or ```// impure``` comments to keep them explicitly differentiated :)

#### Speed and Optimization

If an Eigenstate method calls several other methods in a row, like this:

```js
=> { state.someSyncMethod(); state.anotherSyncMethod() }
```

...then the updated state will not be passed to the relevant ```Provider```'s child component until all of the updates are completed. This is what is meant by synchronous-sequential update batching; there is no point in triggering a React ```render``` if another state update is going to occur immediately afterwards, so Eigenstate will do all of its calculations before passing along state. This means you should get the best possible unoptimized performance of your application.

If you need (or want) to make your application even faster, Eigenstate's immutable state will help immensely. Every time a method returns new state data, that data is used to construct a new, immutable ```state``` object. This means that you can compare state in your React components' ```shouldComponentUpdate``` functions using the ```===``` operator, like this:

```js
//TodoList component
shouldComponentUpdate: function(nextProps) {
  return this.props.todoItems !== nextProps.todoItems //where todoItems is a complex data structure
}
```

#### Store composition <!--revisions stopped here-->

The easiest way to use multiple stores is to compose them into a larger one, like this:

```js
const counterStateDef = { ... }
const gridStateDef = { ... }
const applicationStateDef = {
  counter: counterStateDef,
  grid: gridStateDef,
  ...
}

const ApplicationView = (props) => (
  <div id="application">
    <CounterView {...props.counter} />
    <GridView {...props.grid} />
  </div>
)

ReactDOM.render(<Provider stateDef={applicationStateDef}><ApplicationView></Provider>, ...)
```

Methods are passed **local state**, that is, state at their level in their state object tree. So in this example, ```CounterView``` will behave in the same manner if it were used like this:

```js
<Provider stateDef={counterStateDef}> <CounterView /> </Provider>
```

#### Embeddability and event emission

The Provider properties ```interface``` and ```onInvoke``` are supported to allow for easy embeddability and external control of an Eigenstate application. State may be read and methods may be invoked from outside of the Eigenstate application via ```interface```. ```onInvoke``` can also be used to send messages from the Eigenstate application to an outside application, like this:

```js
ReactDOM.render(
  <Provider stateDef={stateDef}
    interface={(stateInterface) => {
      stateInterface.initializeFormDefaults(otherApplication.getFormDefaults())
    }}
    onInvoke={(invocationDetails) => {
      const { key, payload } = invocationDetails
      if (key === 'submitFormData') { // key is the invoked method's key
        otherApplication.handleFormData(payload)
      }
    }
  }>
    <View />
  </Provider,
  document.getElementById("eigenstate-form-application")
)
```
