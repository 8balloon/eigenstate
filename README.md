# Eigenstate

Eigenstate is a [Redux](https://github.com/reactjs/redux) alternative.

Redux requires you to explicitly create actions, pass them through middleware for asynchronous effects, and parse them via a root reducer to trigger state changes. Eigenstate does all of this for you, letting you call reducers and asynchronous procedures directly via *methods*.

Besides being simpler, this allows you to organize your code by concept rather than sync/async distinctions.

## features

* Pure functional / asynchronous state changes
* Listenable "action" and "update" events
* Synchronous update batching (so it's fast)
* Composable state objects and methods

## how to use + example 1

Define your state's *methods* and *values* in an object, and pass that to a ```Provider```. The ```Provider``` provides access to these methods and values via ```props```, as shown in the example below.

See if you can understand the example before reading the explanation underneath.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'eigenstate'

// 1
const stateDef = {
  count: 0,
  increment: (amount, state) => ({ count: state.count + amount }),
  delayedIncrement: (payload, state) => {
    const { amount, delay } = payload
    setTimeout(() => state.increment(amount), delay)
  }
}

// 2
const View = (props) => (
  <div className="counter">
    { props.count }
    <div onClick={() => props.increment(1)}> INCREMENT </div>
    <div onClick={() => props.delayedIncrement({ amount: 5, delay: 1000 })}>
      DELAYED INCREMENT
    </div>
  </div>
)

// 3
ReactDOM.render(
  <Provider stateDef={stateDef}>
    <View />
  </Provider>,
  document.getElementById('react-root')  
)
```

1. This is your state definition. It has 1 value (stateDef.count), 1 pure method (stateDef.increment) and 1 impure method (stateDef.delayedIncrement).

2. This is the view component. It is wrapped with an Eigenstate ```Provider``` in 3, and uses the state value (props.count) and state methods (props.increment and props.delayedIncrement).

3. This is how state information is passed to the view component.

Notice how the view calls methods using only a single argument. This is because Eigenstate supports only one invocation argument; the second argument (```state```) is provided automatically. The ```state``` a method sees is always the most recent application state.

## methods in-depth

Methods are how you change your state. They come in two flavors.

  * **pure method** : Methods that return a value, and do nothing else. These are how transform state.

  * **impure methods** : Methods that do other things, like making AJAX calls and calling pure methods with the results of those calls. They should never return a state value.

**Methods must be pure XOR impure.** If Eigenstate detects that a method returns a value but has a side effect, it will throw an error.

**Methods may only be called with a single argument.** Eigenstate will pass the second argument for you. You can fit as much data as you want in a single argument object, so this should never be an issue. (You can see this in example 1, in the onClick handler on the "DELAYED INCREMENT" button.)

## example 2

This example is a grid that you can add rows or columns to, and can shrink down to 1x1 with a shrink animation.

```js
// 1
import { Provider, logVerbosely } from 'eigenstate'

const isMinSize = ({rows, columns}) => rows.length <= 1 && columns.length <= 1

// 2
const gridStateDef = {

  rows: [null, null, null],
  columns: [null, null, null],

  addRow: (_, state) => ({ rows: [].concat(state.rows, [null]) }),
  addColumn: (_, state) => ({ columns:[].concat(state.columns, [null]) }),
  clearTick: (_, state) => ({
    rows: state.rows.slice(0, -1),
    columns: state.columns.slice(0, -1)
  }),
  clear: (_, state) => {
    state.clearTick()
    if ( !isMinSize(state) ) setTimeout(() => state.clear(), 100)
  }
}

// 3
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
      <div onClick={props.addRow}> ADD ROW </div>
      <div onClick={props.addColumn}> ADD COLUMN </div>
      <div onClick={props.clear}> CLEAR GRID </div>
    </div>
  )
}

// 4
ReactDOM.render(
  <Provider stateDef={gridStateDef} onUpdate={logVerbosely}>
    <GridView />
  </Provider>,
  document.getElementById('react-root')  
)
```

1. We're importing Eigenstate's default logger, ```logVerbosely```. We'll use it in 5 to log all updates.
2. This state definition uses arrays to represent the row count and column count. It has three pure methods and one impure method. You'll notice that the pure methods return new state values; the impure method calls a pure method every 0.1 seconds until the grid is cleared.
3. Just like in example 1, the view consumes state via ```props``` to show the grid, as well as 3 buttons which allow you to add rows or columns, or to clear the grid using the "gridStateDef.clear" animation.
4. This is how you use a logger. A logger is just an onUpdate handler. You can see onUpdate detailed in the [API](https://github.com/8balloon/eigenstate#API)

## API

* **Provider** : a React component. A Provider provides state values and methods to its children. It requires the following properties:

  * **stateDef** (required) : an object of ```key: value```, ```key: method```, and/or ```key: <stateDef>``` pairs. The stateDef property is used by the Provider to generate state, which is passed to the children of the Provider. See ["stateDef"](https://github.com/8balloon/eigenstate#stateDef).

    * **<value>** : any valid JSON. See ["values"](https://github.com/8balloon/eigenstate#values).

    * **<method>** : a function, which may be pure or impure, as discussed the section ["methods"](https://github.com/8balloon/eigenstate#methods).

  * **onAction** (optional) : a function to be after every method invocation. ```onAction``` is called before the returned values of the invocation (if any) are applied to state. It is passed an ```action``` object, which contains details of the invocation and its result. See ["onAction"](https://github.com/8balloon/eigenstate#onAction).

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
