# Eigenstate

Eigenstate is a [Flux](https://facebook.github.io/flux/) alternative. It provides application state control via state objects and state methods which are easy to define and reason about.

Eigenstate has a much smaller, simpler API than comparable libraries, such as Redux + React Redux + Redux Thunk. It has no dependencies beyond React, and its file size is also significantly smaller than comparable libraries.

Eigenstate applications require less repetitive code, and are easy to set up, debug, and embed. 

## features

* Composable state objects
* Pure functional / asynchronous state methods
* Listenable "action" and "update" events
* Synchronous update batching (so it's fast)

## how to use + examples

Define application state *methods* and *values* in an object, and pass that to a ```Provider```. Eigenstate does the rest.

Here's a tiny example application that uses Eigenstate. (If you've already read the examples, the concepts are [here](https://github.com/8balloon/eigenstate#architecture-overview).)

```js
// minimal React + Eigenstate counter application
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'eigenstate'

// state definition with 1 value and 1 method
const stateDef = {
  count: 0,
  increment: (amount, state) => ({ count: state.count + amount })
}

// state values and methods are passed to your view via "props"
const View = (props) => (
  <div className="counter">
    { props.count }
    <div onClick={() => props.increment(1)}> COUNT UP </div>
  </div>
)

// see if you can add a "reset" feature to this application!
ReactDOM.render(
  <Provider stateDef={stateDef}>
    <View />
  </Provider>,
  document.getElementById('react-root')  
)
```

As shown in the example above, a state definition is a simple object. It's made up of ```key: value``` and ```key: method``` pairs.

**Values** are your application data in JSON form. This means that they can be objects, arrays, numbers, strings, Booleans, or null. Values are passed to the child of a ```Provider``` by their keys, as demonstrated above; the "count" value is accessed in the "counter" div via "props.count".

**Methods** are functions you can call to update your state's values. Like values, you can use methods in your view components via ```props.<key>```. This is demonstrated above: the "increment" method is used in the onClick handler in the div with the content "COUNT UP".

Methods can work two ways; they can work as shown above (returning updated state values), or they can do things that have side effects, like calling other methods, or performing asynchronous actions. Here is an example which demonstrates both capacities:

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

### eigenstate / onAction / onUpdate

ACTION vs UPDATE
ADDRESS SIDE EFFECTS (maybe: procedures vs updates?)
eigenstate for redux users? (focus on actions)
React-router example
"Synchronous updates will be batched"

API
Provider
  * stateDef
    * values
    * methods
  * onAction
  * onUpdate
logAction
connect

### @connect

## addendum
If anyone likes Eigenstate, I'll factor out its core so it can be used in other applications.

Eigenstate was formerly [Switchless](https://github.com/8balloon/switchless).
