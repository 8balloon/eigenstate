![Eigenstate](assets/logo.png)

# Eigenstate

Eigenstate is a state-management library for [React.js](https://facebook.github.io/react/) that provides support for *methods*.

Methods, like [Redux](https://github.com/reactjs/redux) actions, are predictable and easy to test. The advantage is that they require no boilerplate, switch statements, special middleware, or sync/async code-splitting to provide complete functionality.

## Features

* Pure functional / asynchronous [methods](https://github.com/8balloon/eigenstate#methods-in-depth)
* Synchronous-sequential update batching (so it's fast)
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
    setTimeout(() => state.increment(amount), delay)
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

Methods are how you alter your state data. They may be pure xor impure.

**Pure methods alter state and do nothing else.**

Look at the "increment" and "changeColor" methods in the example above to see how to perform state data updates. You should build your application logic into pure methods.

**Impure methods call pure methods with the results of asynchronous actions.**

Look at the method "delayedIncrement" in the example above.

**Methods must be defined with two parameters, and called with one or zero parameters.**

* The second parameter, ```state```, is provided automatically. Look at all of the example methods above; they all use the ```state``` parameter to do useful stuff.

## API

* **Provider** : a React component. Provides access to state data and methods to its child via ```props```. Supports the following properties:

  * **stateDef** (required) : the ```stateDef``` property must be an object of ```key: data | method | stateDef``` pairs. The Provider uses the ```stateDef``` property to generate state data and methods. Data can be any JSON, and methods are described in the section above.

  * **onInvoke** (optional) : function called with details on every method invocation.

  * **interface** (optional) : called once with ```stateInterface```, which will always contain the latest state data and methods.

* **connect** : a function that accepts and returns a React component. A ```connect()```ed component can use state from the nearest nearest ```Provider``` via props, as if it were that Provider's direct child. This is useful for integrating with [React Router](https://github.com/ReactTraining/react-router).

* **logVerbosely** : logs information on method invocations and state changes in the console. See the example for how to use.

* **effects** : A function returned from an impure method is an ```effect```. Effects are executed after the view component of your application has completely updated. Use sparingly.

<!-- TODO: include example with:
* React router
* Nested stateDefs
* interface
* connect
* effects

Maybe react router pages-within-a-page + smart scrolling?
-->

## Pro tips

* Put your application logic in pure methods. Pure methods are pure functions, so they are easy to test.

* Annotate your methods with a ```// pure``` or an ```// impure``` comment to keep them distinct. 
