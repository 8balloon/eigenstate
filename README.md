![Eigenstate](assets/logo.png)

# Eigenstate

Eigenstate is a state-management library for [React.js](https://facebook.github.io/react/) that provides support for *methods*.

Methods, like [Redux](https://github.com/reactjs/redux) reducers, are predictable and easy to test. The advantage is that they require no boilerplate, switch statements, special middleware, or sync/async code-splitting to provide complete functionality.

## Features

* Functional / asynchronous [methods](https://github.com/8balloon/eigenstate#methods)
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
    setTimeout(function asyncCallback() { state.increment(amount) }, delay)
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

Methods are how you alter your state data. They can work with synchronous or asynchronous code.

**Methods must be defined with two parameters, and called with one or zero parameters.**

The second parameter, ```state```, is provided automatically. Look at each of the methods in the example above; they all use the ```state``` parameter to do useful stuff.

**Methods may alter state by returning updated state data.**

Look at the methods ```increment``` and ```changeColor``` in the example above. Each of them alters state by returning updated state data. Your view component will receive updated state via ```props```.

**Methods may invoke other methods. This is how Eigenstate supports asynchronous code.**

Asynchronous actions like ```$.ajax``` or ```setTimeout``` can't return values directly, because they use callbacks. In order to update state, invoke methods from within the callback function.

Look at the method ```delayedIncrement``` in the example above. It demonstrates how to asynchronously invoke another method from within a callback.

**Separate methods by purity.**

*Pure methods* alter state by returning updated state data. Do not invoke other methods.

*Impure methods* create side effects by doing things like executing asynchronous code and invoking other methods.

Keeping these methods separate will greatly improve the clarity and reliability of your code. The rationale for this technique is detailed in the section on [optimization](https://github.com/8balloon/eigenstate#optimization)

## API

* **Provider** : a React component. Provides access to state data and methods to its child via ```props```. Supports the following properties:

  * **stateDef** (required) : the ```stateDef``` property must be an object of ```key: data | method | stateDef``` pairs. The Provider uses the ```stateDef``` property to generate state data and methods. Data can be any JSON, and [methods](https://github.com/8balloon/eigenstate#methods) are described in the section above.

  * **onInvoke** (optional) : function called with details on every method invocation.

  * **interface** (optional) : called once with ```stateInterface```, which will always contain the latest state data and methods.

* **connect** : a function that accepts and returns a React component. A ```connect()```ed component can use state from the nearest nearest ```Provider``` via props, as if it were that Provider's direct child. This is useful for integrating with [React Router](https://github.com/ReactTraining/react-router).

* **logVerbosely** : logs information on method invocations and state changes in the console. See the example for how to use.

* **effects** : A function returned from a method is an ```effect```. Effects are executed after the view component of your application has completely updated. You should only use effects if you need to do something after your *view* component has updated, as opposed to after your *state* has updated.

## Advanced Example

See [here](https://github.com/8balloon/eigenstate/blob/master/test/CompleteExample/index.jsx).

This is a React Router setup that implements multiple routes in a single page.
It shows how to compose state objects and views into larger state objects and views via composition.
On route change, it scrolls to the route's corresponding element on the page.

The purpose of this example is to demonstrate the Eigenstate API and give an idea as to how you can incorporate Eigenstate into a larger architecture. It is not well-factored in itself.

## Optimization

TODO
