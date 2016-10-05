# Eigenstate

Eigenstate is a state-management library for [React.js](https://facebook.github.io/react/) that provides support for *methods*.

Methods are analogous to [Redux](https://github.com/reactjs/redux) actions, but without the need for repetitive boilerplate, switch statements, or special middleware for asynchronous code.

Eigenstate is pre-configured for React, and has no other dependencies. Eigenstate methods are easy to write and test.

## features

* Pure functional / asynchronous [methods](https://github.com/8balloon/eigenstate#methods)
* Sequential update batching (so it's fast)
* Tiny, flexible [API](https://github.com/8balloon/eigenstate#API)

## easy as 1-2-3

1. Define state data and methods in a ```stateDef``` object.

2. Compose your view component, using data and methods via ```props```.

3. Tie state and view together with the Eigenstate ```Provider```.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'eigenstate'

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
      DELAYED INCREMENT
    </div>
    <div onClick={props.changeColor}> CHANGE COLOR </div>
  </div>
)

/*
3
*/
ReactDOM.render(
  <Provider stateDef={stateDef}>
    <View />
  </Provider>,
  document.getElementById('react-root')  
)
```

## methods

Methods are how you alter your state data.

**Methods are defined with two parameters, and called with one parameter.**

* You may provide the first parameter in your method call. The payload may be any JSON value.

* The second parameter, ```state```, is provided automatically, and contains all state data and methods.

**Methods may be pure or impure and not both.**

* *Pure methods* return update state data, and have no side effects.

* Impure methods make asynchronous calls and call pure methods with results.

**Pure methods alter state data, and impure methods call pure methods.**

In the example above, ```increment``` is a pure method, and ```delayedIncrement``` is an impure method. The former works by returning updated state data. The latter works by invoking the former.

This is how you structure your Eigenstate application. It is recommended that you annotate your pure methods with a ```// pure``` comment and your impure methods with an ```// impure``` comment. And remember, there is nothing "bad" about impure methods :)

## complete example


* You can compose state definitions. State methods are always passed a ```state``` which corresponds to their local definition state.
* onUpdate && logVerbosely
* eigenstate
* connect
* effects

```js

```

1. We're importing Eigenstate's default logger, ```logVerbosely```. We'll use it in 5 to log all updates.
2. This state definition uses arrays to represent the row count and column count. It has three pure methods and one impure method. You'll notice that the pure methods return new state values; the impure method calls a pure method every 0.1 seconds until the grid is cleared.
3. Just like in example 1, the view consumes state via ```props``` to show the grid, as well as 3 buttons which allow you to add rows or columns, or to clear the grid using the "gridStateDef.clear" animation.
4. This is how you use a logger. A logger is just an onUpdate handler. You can see onUpdate detailed in the [API](https://github.com/8balloon/eigenstate#API)

## API

* **Provider** : a React component. Provides state data and methods to its child via ```props```. Supports the following properties:

  * **stateDef** (required) : an object of ```key: datum```, ```key: method```, and/or ```key: <stateDef>``` pairs. The stateDef property is used by the Provider to generate state, which is passed to the children of the Provider. See ["stateDef"](https://github.com/8balloon/eigenstate#stateDef).

    * **<value>** : any valid JSON. See ["values"](https://github.com/8balloon/eigenstate#values).

    * **<method>** : a function, which may be pure or impure, as discussed the section ["methods"](https://github.com/8balloon/eigenstate#methods).

  * **onUpdate** (optional) : a method that is called after state updates have been passed to the rest of your application via the Provider's children's props. It is passed ```state, actions[]```, where state is the state passed to the Provider's children's props, and actions contains the actions performed since the last update. See ["onUpdate"](https://github.com/8balloon/eigenstate#onUpdate).

  * **eigenstate** (optional) : a method that is called after state has been initialized. It is passed a function, ```getState```, which returns the latest application state when invoked. See ["eigenstate"](https://github.com/8balloon/eigenstate#eigenstate).

* **connect** : a function that accepts a component class, and returns a version of that class that will have access to an ancestor's state via ```props```. See ["connect"](https://github.com/8balloon/eigenstate#connect).

* **logVerbosely** : a function which will log actions in a verbose, legible way if passed to the Provider as an ```onAction``` property. See ["logVerbosely"](https://github.com/8balloon/eigenstate#logVerbosely).


### stateDef

nested state (combine first two examples via composition)

### values


### onUpdate

Synchronous updates are batched"


### eigenstate
This can be used by parent applications, or for other purposes, and provides an interface by which your entire Eigenstate application can act as a singular object.

### connect

### logVerbosely

### effects
