![Eigenstate](assets/logo.png)

# Eigenstate

Eigenstate is a state-management library for [React.js](https://facebook.github.io/react/) that provides support for *methods*.

Methods, like [Redux](https://github.com/reactjs/redux) reducers, are predictable and easy to test. The advantage is that they require no boilerplate, switch statements, or special middleware to provide complete functionality.

## Features

* Pure functional / asynchronous [methods](https://github.com/8balloon/eigenstate#methods)
* Synchronous-sequential update batching
* Immutable state (always, automatically)
* Tiny, flexible [API](https://github.com/8balloon/eigenstate#API)

## 3 Easy Steps (but seriously)

1. Define your state's data and methods in a ```stateDef``` object.

2. Compose your view component as usual, using state data and methods via ```props```.

3. Tie state and view together with the ```Provider```.

```js
/*
A working app to demonstrate sync and async functionality + logging.
*/
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, logVerbosely } from 'eigenstate'

/*
1
*/
const stateDef = {
  count: 0,
  color: 'red',
  increment: (amount, state) => ({ count: state.count + amount }),
  delayedIncrement: (payload, state) => {
    const { amount, delay } = payload
    setTimeout(function callback() { state.increment(amount) }, delay)
  },
  changeColor: (_, state) => ({ color: state.color === 'red' ? 'blue' : 'red' })
}

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
  <Provider stateDef={stateDef} onInvoke={logVerbosely}>
    <View />
  </Provider>,
  document.getElementById('react-root')  
)
```

## Methods

Methods are how you alter your state data.

**Methods must be defined with two parameters, and called with one or zero parameters.**

The second parameter, ```state```, is provided automatically. Look at each of the methods in the example above; they all use the ```state``` parameter to do useful stuff.

**Methods may alter state by returning updated state data.**

Look at the methods ```increment``` and ```changeColor``` in the example above. Each of them alters state by returning updated state data. Your view component receives updated state via ```props```.

**Methods may be pure XOR impure. Put asynchronous code in impure methods.**

Methods may alter state by returning updated state data, or they may invoke other methods. You can use method invocations in asynchronous code, like ```$.ajax``` or ```setTimeout``` callbacks. Look at the method ```delayedIncrement``` in the example above to see this in action.

Just remember that your methods may call other methods XOR return updated state data. Attempting to do both will result in an error.

## API

* **Provider** : a React component. Provides access to state data and methods to its child via ```props```. Supports the following properties:

  * **stateDef** (required) : the ```stateDef``` property must be an object of ```key: data | method | stateDef``` pairs. The Provider uses the ```stateDef``` property to generate state data and methods. Data can be any JSON, and [methods](https://github.com/8balloon/eigenstate#methods) are described in the section above.

  * **onInvoke** (optional) : function called on every method invocation with ```invocationDetails```.

  * **interface** (optional) : function called when Eigenstate initializes. Passed ```stateInterface```, a function which returns an immutable snapshot of the Provider's state object when invoked.

* **connect** : a function that accepts and returns a React component. A ```connect()```ed component can use state from the its nearest ```Provider``` ancestor via props, as if it were that Provider's direct child. This is useful for integrating with [React Router](https://github.com/ReactTraining/react-router).

* **logVerbosely** : logs information on method invocations and state changes in the console. See the 1-2-3 example for how to use. It's highly recommended :)

* **effects** : A function returned from a method is an ```effect```. Effects are executed after the view component of your application has completely updated. Effects are not allowed to invoke methods, and will error if they attempt to do so. They are intended only for side-effects, like kicking off a non-React animation, or (in the worst case) imperative DOM mutations.

## Advanced Example

See [here](https://github.com/8balloon/eigenstate/blob/master/test/CompleteExample/index.jsx).

This is a React Router setup that implements multiple routes in a single page.
It shows how to compose state objects and views into larger state objects and views via composition.
On route change, it scrolls to the route's corresponding element on the page.

The purpose of this example is to demonstrate the Eigenstate API and give an idea as to how you can incorporate Eigenstate into a larger architecture. It is not well-factored in itself.

## Relevant concepts

#### Method purity

The pure/impure distinction is the central dogma of Eigenstate (sort of like React's props/state distinction). If a method invokes another method *and* returns state data, Eigenstate will throw an error. This feature prevents you from mixing functional and procedural code. You are encouraged to annotate your methods with a ```// pure``` or ```// impure``` comment.

#### Multiple or hierarchical state objects

The easiest way to use multiple state objects is to compose them into a larger one, like this:

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

#### Optimization

Eigenstate state is always immutable. This empowers you to use React's ```shouldComponentUpdate``` to speed up your application.

Eigenstate also batches synchronous-sequential updates, so invoking several pure methods in succession (like ```state.firstPureMethod(); state.secondPureMethod()```) will only trigger a single re-render of your application view.
