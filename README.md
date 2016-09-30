# Eigenstate

Eigenstate is a [Flux](https://facebook.github.io/flux/) alternative. Eigenstate supports *methods*, which are flexible, user-defined functions that transform application state.

Eigenstate methods require less repetitive code than analogous state-control mechanisms, such as [Redux](https://github.com/reactjs/redux) actions. Methods can be used synchronously or asynchronously, no setup required.

Eigenstate comes pre-configured for React, and has no other dependencies. It has a much smaller APPI than comparable libraries, and is easy to set up, debug, and embed.

## features

* Pure functional / asynchronous state methods
* Listenable "action" and "update" events
* Synchronous update batching (so it's fast)
* Composable state objects

## how to use

Define application state *methods* and *values* in an object, and pass that to a ```Provider```. Eigenstate does the rest.

Here's an example Eigenstate application.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'eigenstate'

/*
Your application state definition.
Eigenstate will convert this into a state object, which you will be able to access from your view component.
*/
const stateDef = {
  // a value
  count: 0,
  // a pure functional method
  increment: (amount, state) => ({ count: state.count + amount }),
  // an asynchronous method
  delayedIncrement: (payload, state) => {
    const { amount, delay } = payload
    setTimeout(() => state.increment(amount), delay)
  }
}

/*
Your application's view component.
It will be wrapped with the Eigenstate Provider, it will have access to values and methods via "props"
*/
const View = (props) => (
  <div className="counter">
    { props.count }
    <div onClick={() => props.increment(1)}> INCREMENT </div>
    <div onClick={() => props.delayedIncrement({ amount: 5, delay: 1000 })}>
      DELAYED INCREMENT
    </div>
  </div>
)

/*
This is a real example of a working application.
See if you can add a "reset count" feature!
*/
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
import { Provider, logAction} from '../../src'

const isMinSize = ({rows, columns}) => rows.length <= 1 && columns.length <= 1

const gridStateDef = {

  rows: [null, null, null],
  columns: [null, null, null],

  addRow: (_, state) => ({ rows: [].concat(state.rows, [null]) }),
  addColumn: (_, state) => ({ columns:[].concat(state.columns, [null]) }),
  gridClearTick: (_, state) => ({
    rows: state.rows.slice(0, -1),
    columns: state.columns.slice(0, -1)
  }),

  gridClear: (_, state) => {
    state.gridClearTick()
    if ( !isMinSize(state) ) setTimeout(() => state.gridClear(), 100)
  }
}

const GridView = (props) => {
  return (
    <div className="grid">
      { props.rows.map((_, rowIndex) => (
          <div key={rowIndex}>
            { props.columns.map((_, columnIndex) => (
                '(' + rowIndex + ':' + columnIndex + ')'
              )).join(' ')
            }
          </div>
        ))
      }
      <div onClick={props.addRow}>Add row</div>
      <div onClick={props.addColumn}>Add column</div>
      <div onClick={props.gridClear}>Clear grid</div>
    </div>
  )
}

ReactDOM.render(
  <Provider stateDef={gridStateDef} onAction={logAction}>
    <GridView />
  </Provider>,
  document.getElementById('react-root')  
)
```

underscores

*incrementCount*: This method returns the new count value given a numeric parameter. It is important to note that it returns **ONLY** the values it wants to update: *count*. Since it doesn't affect the value of *numCounters*, *numCounters* is left out of the return value. (Redux users: take note.)

*removeCounter*: If the value of *numCounters* is already zero, this method returns nothing, since there's no update that needs to happen.

*delayedIncrement*: This method is illustrates the asynchronous capacity of Eigenstate; it waits *delayMS* milliseconds, and then calls the *incrementCount* method with *incrementAmount*. It could call other methods if it wanted, but here we have reason to.

Note that the arguments to *delayedIncrement* are wrapped in a single *payload* parameter. This is because Eigenstate methods only support being called with a single parameter; the second parameter (*state*) is provided automatically.

## API

NOTE: it is recommended that you read the examples before diving into the API directly.

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


## advanced features

### nested state (combine first two examples via composition)

### eigenstate / onAction / onUpdate

ACTION vs UPDATE
ADDRESS SIDE EFFECTS (maybe: procedures vs updates?)
eigenstate for redux users? (focus on actions)
React-router example
"Synchronous updates will be batched"
"Pure" methods?

API
Provider
  * stateDef
    * values
    * methods
  * onAction
  * onUpdate
  * eigenstate
logAction
connect

### @connect

Eigenstate was formerly [Switchless](https://github.com/8balloon/switchless).
