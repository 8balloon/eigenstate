# Eigenstate

Eigenstate is a [Flux](https://facebook.github.io/flux/) alternative. Eigenstate supports *methods*, which are flexible, user-defined functions that transform application state.

Eigenstate methods require less repetitive code than analogous state-control mechanisms, such as [Redux](https://github.com/reactjs/redux) actions. Methods can be used synchronously or asynchronously, no setup required.

Eigenstate comes pre-configured for React, and has no other dependencies. It is easy to set up, debug, and embed.

## features

* Asynchronous / pure functional state changes
* Listenable "action" and "update" events
* Synchronous update batching (so it's fast)
* Composable state objects and methods

## how to use

Define application state *methods* and *values* in an object, and pass that to a ```Provider```. ```Provider``` will give your view component access to values and methods via ```props```, as shown in the example below.

This the heart of Eigenstate. If you need to extend control of your application state, you can do so via a few other properties and exports, as detailed in the section on Eigenstate's complete [API](https://github.com/8balloon/eigenstate#API).

## example

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'eigenstate'

/*
Your application's state definition.
Application state is automatically passed to methods via their second parameter.
*/
const stateDef = {
  // a value
  count: 0,
  // a pure functional method
  increment: (amount, state) => ({ count: state.count + amount }),
  // an asynchronous method that calls another method
  delayedIncrement: (payload, state) => {
    const { amount, delay } = payload
    setTimeout(() => state.increment(amount), delay)
  }
}

/*
Your application's view component.
It will be provided access to state via "props", as shown next
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

## advanced example

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

## Eigenstate for Redux users

motivation, "action" model differences

Eigenstate was formerly [Switchless](https://github.com/8balloon/switchless).

## API

NOTE: it is recommended that you read the examples before diving into the API directly.

* **Provider** : a React component. A Provider provides state values and methods to its children. It requires the following properties:

  * **stateDef** (required) : an object of ```key: value```, ```key: method```, and/or ```key: <stateDef>``` pairs. The stateDef property is used by the Provider to generate state, which is passed to the children of the Provider. See ["stateDef"](https://github.com/8balloon/eigenstate#stateDef).

    * **<value>** : any valid JSON. See ["values"](https://github.com/8balloon/eigenstate#values).

    * **<method>** : a function, which may be pure or impure, as discussed the section ["methods"](https://github.com/8balloon/eigenstate#methods).

  * **onAction** (optional) : a function to be after every method invocation. ```onAction``` is called before the returned values of the invocation (if any) are applied to state. It is passed an ```action``` object, which contains details of the invocation and its result. See ["onAction"](https://github.com/8balloon/eigenstate#onAction).

  * **onUpdate** (optional) : a method that is called after state updates have been passed to the rest of your application via the Provider's children's props. It is passed ```state, actions[]```, where state is the state passed to the Provider's children's props, and actions contains the actions performed since the last update. See ["onUpdate"](https://github.com/8balloon/eigenstate#onUpdate).

  * **eigenstate** (optional) : a method that is called after state has been initialized. It is passed a function, ```getState```, which returns the latest application state when invoked. See ["eigenstate"](https://github.com/8balloon/eigenstate#eigenstate).

* **connect** : a function that accepts a component class, and returns a version of that class that will have access to an ancestor's state via ```props```. See ["connect"](https://github.com/8balloon/eigenstate#connect).

* **logAction** : a function which will log actions in a verbose, legible way if passed to the Provider as an ```onAction``` property. See ["logAction"](https://github.com/8balloon/eigenstate#logAction).


### stateDef

nested state (combine first two examples via composition)

### values

### methods
  * **pure method** : a function with signature ```(payload, state) => values```, where ```values``` is an object of ```key: value``` pairs.
ADDRESS SIDE EFFECTS (maybe: procedures vs updates?)

  * **Methods** are functions that update your application state. They can be composed in two ways: as **synchronous operations**, or as **asynchronous procedures**.

  * **Synchronous operations** return updated state values in the form ```{key: updatedValue}```. These values are immediately incorporated into application state, and then passed to your application via Provider children props.

  * **Asynchronous procedures** call other methods via their second parameter (*state*).

  * Methods may only be called with a single argument. Eigenstate provides the second ("state") argument automatically, and will error if you try to provide it yourself.

  * Eigenstate doesn't allow methods to be in a mixed synchronous / asynchronous form. It will throw an error if it detects a method which both calls another method and returns a value

  * Mixed methods are disallowed because they can lead to an inconsistent state. This is possible because the value of *state* in the original method may be inconsistent with the value of *state* in the internal method, which could lead to non-deterministic behavior. Avoid this scenario by ensuring that your methods are either synchronous operations XOR asynchronous procedures.

### onAction

### onUpdate

Synchronous updates are batched"


### eigenstate
This can be used by parent applications, or for other purposes, and provides an interface by which your entire Eigenstate application can act as a singular object.

### connect

### logAction
