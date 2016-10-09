![Eigenstate](assets/logo.png)

# Eigenstate

Eigenstate is a state-management library for [React.js](https://facebook.github.io/react/) that provides support for *methods*.

Methods, like [Redux](https://github.com/reactjs/redux) actions, are predictable and easy to test. The advantage is that they require no boilerplate, switch statements, special middleware, or sync/async code-splitting to provide complete functionality.

## features

* Pure functional / asynchronous [methods](https://github.com/8balloon/eigenstate#methods-in-depth)
* Virtual state + sequential update batching (so it's fast)
* Tiny, flexible [API](https://github.com/8balloon/eigenstate#API)

## easy as 1-2-3

1. Define your state's data and methods in a ```stateDef``` object.

2. Compose your view component as usual, using state data and methods via ```props```.

3. Tie state and view together with the ```Provider```.

```js
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
      DELAYED INCREMENT
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

## methods in-depth

Methods are how you alter your state data.

**Methods are defined with two parameters, and called with one parameter.**

* The second parameter, ```state```, is provided automatically, and contains all state data and methods.

* You may provide the first parameter in your method call.

**Methods may be pure or impure and not both.**

* *Pure methods* return updated state data, and have no side effects.

* *Impure methods* make asynchronous calls and call pure methods with results.

**Pure methods alter state data, and impure methods call pure methods.**

In the example above, ```increment``` and ```changeColor``` are pure methods, and ```delayedIncrement``` is an impure method. The pure methods accomplish something through returning updated state data. The impure method works by invoking the former.

This is how Eigenstate applications are structured. It is recommended that you annotate your methods with a ```// pure``` or an ```// impure``` comment to keep them distinct. And remember, there is nothing "bad" about impure methods :)

*MAGIC FEATURE*: If a method returns a function, 1) it is still an impure method, because that function won't be incorporated into state, and 2) that function will be executed AFTER your view component's update has completed.

## API

* **Provider** : a React component. Provides state data and methods to its child via ```props```. Supports the following properties:

  * **stateDef** (required) : the stateDef property must be an object of ```key: data | method | stateDef``` pairs. State generated from the stateDef object is provided by the Provider to its children. Data is any valid JSON, and methods are described [here](https://github.com/8balloon/eigenstate#methods-in-depth).

  * **onInvoke** (optional) : if you pass a function to the Provider via this property, it will be called with after every state change. It is passed a ```change``` object which contains details on a method invocation.

  * **interface** (optional) : if you pass a function to a Provider with this property, it will be called after state has been initialized. It is passed a ```stateInterface``` object which can be used to access state and call methods. Example: ```console.log(stateInterface.count); stateInterface.increment(); console.log(stateInterface.count)```

* **connect** : a function that accepts and returns a React component. A ```connect()```ed component will have access to the nearest ```Provider```'s state via props when it is instantiated.

* **logVerbosely** : a function which will log information on state method invocations if used like this: ```<Provider stateDef={whatever} onInvoke={logVerbosely}>```.

<!-- TODO; include multiple-routed-pages-in-one-page-example
## complete example

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, logVerbosely } from 'eigenstate'
import { Router, Route, browserHistory, Link } from 'react-router'
import { colorCounterStateDef, ColorCounterView } from './README.md/1-2-3-example'

const stateDef = {

  counter: colorCounterStateDef,

  currentRouteLocation: null



/*TO USE:
* You can compose state definitions. State methods are always passed a ```state``` which corresponds to their local definition state.
* onInvoke && logVerbosely
* eigenstate
* connect
* effects
*/

```
-->
