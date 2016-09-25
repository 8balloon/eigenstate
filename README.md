# Eigenstate

Eigenstate is an object-oriented alternative to [Redux](https://github.com/reactjs/redux).

It provides the same functionality as a Redux store, actions, action-creators, reducers, and middleware via a single, simplified state object. No configuration with React or other packages is required.

## how to use

Define your state methods and values in an object, and pass that to a ```Provider```. Eigenstate does the rest.

Here is a working example of an Eigenstate application. See if you can figure out how to add a "clear count" feature.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'eigenstate'

/*
Your application's state definition object
*/
const CounterStateDef = {
  //a value
  count: 0,
  //a method
  increment: (amount, state) => ({ count: state.count + amount })
}

/*
Your application's view component.
When used as a child of the Eigenstate Provider, it will have access to your state methods and values via "props"
*/
const CounterView = (props) => (
  <div id="counter">
    <div id="count">{ props.count }</div>
    <div id="incrementer" onClick={() => props.increment(1)}> INCREMENT </div>
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

A state definition is an object made up of ```key: method``` and ```key: value``` pairs.

**Values** can be any JSON value (objects, arrays, numbers, strings, Booleans, and null). Access state values via ```props.<key>``` from your application view.

**Methods** are functions that can do one of two things.
1. Return new state values in the form of ```{ key: value }``` objects.
2. Call other state methods via their second parameter.

Like values, you can access methods via ```props.<key>``` from your application view.

## complete example

```js
//"multiple counters" example

import { Provider } from 'eigenstate'

const stateDef = {

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

//view
const Counters = (props) => ( ... )

ReactDOM.render(
  <Provider stateDef={stateDef}>
    <Counters />
  </Provider>,
  document.getElementById('react-root')  
)
```

## methods in-depth


Changes should either RETURN A VALUE or TRIGGER OTHER CHANGES. They should never do both -- in fact, if Eigenstate catches one of your change functions doing both, it will throw an error. (Explain why?)
OPERATION vs PROCEDURE
CHANGE vs EVENT
METHODS vs VALUES

## eigenstate / onEvent / onChange

## nested state

## @connect

## future direction
If anyone likes Eigenstate, I'll factor out its core so it can be used in other applications.
Also, going to think about making embeddable in React applications. (May be a no-go.)


Eigenstate was formerly [Switchless](https://github.com/8balloon/switchless).
