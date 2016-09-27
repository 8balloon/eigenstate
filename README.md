# Eigenstate

Eigenstate is an object-oriented alternative to [Redux](https://github.com/reactjs/redux).

Eigenstate allows you to define *values* and *methods* in a *state definition* object. This object is used to provide the same functionality as a Redux store, actions, action-creators, reducers, and middleware. No configuration with React or other packages is required.

## how to use

Define your state methods and values in an object, and pass that to a ```Provider```. Eigenstate does the rest.

Here is a working example of an Eigenstate application. If you only want to read about the concepts, you can skip ahead to the [architecture overview](https://github.com/8balloon/eigenstate#architecture-overview), but it's recommended that you read these examples first.

```js
/*
A simple counter application.
See if you can figure out how to implement a "clear count" feature!
*/
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'eigenstate'

/*
Your application's state definition.
This state definition has 1 value and 1 method.
*/
const CounterStateDef = {
  count: 0,
  increment: (amount, state) => ({ count: state.count + amount })
}

/*
Your application's view component.
When used as a child of the Eigenstate Provider, it will have access to your state values and methos via "props"
*/
const CounterView = (props) => (
  <div className="counter">
    <div className="count">{ props.count }</div>
    <div className="incrementer" onClick={() => props.increment(1)}> INCREMENT </div>
  </div>
)

/*
Eigenstate's Provider creates your state object for you.
It passes access to your state methods and values via "props"
*/
ReactDOM.render(
  <Provider stateDef={CounterStateDef}>
    <CounterView />
  </Provider>,
  document.getElementById('react-root')  
)
```

As the above example demonstrates, a state definition is a simple object. It's made up of key: value and key: method pairs.

**Values** can be any valid JSON (objects, arrays, numbers, strings, Booleans, and null). Your application view can consume them via ```props.<key>```, as demonstrated above.

**Methods** are functions that return updated state values. Like values, you can access methods via ```props.<key>``` from your application view.

Methods also have the option to asynchronously call other methods. Here is an example which demonstrates this capacity, along with a detailed breakdown:

```js
/*
State definition for a "multiple counters" application.
A count is displayed across a variable number of counters.
*/
const countersStateDef = {

  //values
  count: 0,
  numCounters: 1,

  //synchronous methods
  incrementCount: (amount, state) => ({count: state.count + amount}),
  addCounter: (_, state) => ({numCounters: state.numCounters + 1}),
  removeCounter: (_, state) => {
    if (state.numCounters > 0) {
      return { numCounters: state.numCounters - 1 }
    }
  },
  //asynchronous method
  delayedIncrement: (payload, state) => {
    const { incrementAmount, delayMS } = payload
    setTimeout(() => {
      state.incrementCount(incrementAmount)
    }, delayMS)
  }
}

/* Use state methods and values here, like in the first example. */
const Counters = (props) => ( ... )

ReactDOM.render(
  <Provider stateDef={countersStateDef}>
    <Counters />
  </Provider>,
  document.getElementById('react-root')  
)
```

Let's break down our state definition object.

*count*: This is the value to be displayed across all of our counters.

*numCounters*: This is the number of counters upon which *count* is to be displayed.

*incrementCount*: This method returns the new count value given a numeric parameter. It is important to note that it returns **ONLY** the values it wants to update: *count*. Since it doesn't affect the value of *numCounters*, *numCounters* is left out of the return value. (Redux users: take note.)

*addCounter*: This method increments the number of counters by 1. It doesn't need an argument from its caller to figure out what *numCounters* should be, and we're acknowledging that by making its first parameter an underscore character.

*removeCounter*: If the value of *numCounters* is already zero, this method returns nothing, since there's no update that needs to happen.

*delayedIncrement*: This method is illustrates the asynchronous capacity of Eigenstate; it waits *delayMS* milliseconds, and then calls the *incrementCount* method with *incrementAmount*. It could call other methods if it wanted, but here we have reason to.

Note that the arguments to *delayedIncrement* are wrapped in a single *payload* parameter. This is because Eigenstate methods only support being called with a single parameter; the second parameter (*state*) is provided automatically.

## architecture overview

NOTE: it is recommended that you first read the [how to use](https://github.com/8balloon/eigenstate#how-to-use) section of this document before reading about the architecture. Eigenstate is very simple to use, and is easier to understand it in the abstract after seeing it in action.

* Eigenstate provides a **Provider** React component, which controls access to your application state.

* The **Provider** accepts a state definition property, ```stateDef```. This property must be in the form ```{keys: values and/or updates}```.

  * This state definition is used to generate an Eigenstate state object, the values and methods of which are provided to the Provider's children via ```props```.

* **Values** are any valid JSON (objects, arrays, numbers, strings, Booleans, and null). Eigenstate will error if it detects non-JSON values.

* **Methods** are functions that update your application state. They can be composed in two ways: as **synchronous operations**, or as **asynchronous procedures**.

  * **Synchronous operations** return updated state values in the form ```{key: updatedValue}```. These values are immediately incorporated into application state, and then passed to your application via Provider children props.

  * **Asynchronous procedures** call other methods via their second parameter (*state*).

  * Methods may only be called with a single argument. Eigenstate provides the second ("state") argument automatically, and will error if you try to provide it yourself.

  * Eigenstate doesn't allow methods to be in a mixed synchronous / asynchronous form. It will throw an error if it detects a method which both calls another method and returns a value

    * Mixed methods are disallowed because they can lead to an inconsistent state. This is possible because the value of *state* in the original method may be inconsistent with the value of *state* in the internal method, which could lead to non-deterministic behavior. Avoid this scenario by ensuring that your methods are either synchronous operations XOR asynchronous procedures.


## TODO

## cool extra stuff

### nested state (combine first two examples via composition)

### eigenstate / onEvent / onUpdate

CHANGE vs EVENT

### @connect

## addendum
If anyone likes Eigenstate, I'll factor out its core so it can be used in other applications.

Eigenstate was formerly [Switchless](https://github.com/8balloon/switchless).
