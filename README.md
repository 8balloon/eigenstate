# Eigenstate

Eigenstate is a state management tool for [React](https://facebook.github.io/react/index.html).

Eigenstate allows you to define your state along with all possible changes it may undergo. This makes it extremely powerful and intuitive.

## how to use

Define your state + changes in an object, and pass that to a ```Provider```. Eigenstate does the rest.

```js
import { Provider } from 'eigenstate'

const stateDef = {
  count: 0,
  increment: (payload, state) => ({count: state.count + payload})
}

const Counter = (props) => (
  <div onClick={() => props.increment(10)}>
    {props.count}
  </div>
)

ReactDOM.render(
  <Provider stateDef={stateDef}>
    <Counter />
  </Provider>,
  document.getElementById('react-root')  
)
```

Does it look like we're missing something? Well, we're not. Here's a more complex example.

```js
const state = {
  rows: 'xxx',
  columns: '012',
  addRow: (payload, state) => ({rows: state.rows + 'x'}),
  addColumn: (payload, state) => ({columns: state.columns + state.columns.length % 10}),
  removeRow: (payload, state) => ({rows: state.rows.slice(0, -1)}),
  removeColumn: (payload, state) => ({columns: state.columns.slice(0, -1)})
}

const Grid = (props) => {
  console.log("GRIDPROPS:", props)
  return (
    <div>
      <div onClick={props.addRow}>Add row</div>
      <div onClick={props.addColumn}>Add column</div>
      {
        props.rows.split('').map((char, idx) => (
          <div key={idx}>{props.columns}</div>
        ))
      }
      <div onClick={props.removeRow}>Remove row</div>
      <div onClick={props.removeColumn}>Remove column</div>
    </div>
  )
}

ReactDOM.render(
  <Provider changes={state}>
    <Grid />
  </Provider>,
  document.getElementById('react-root')
)
```

## intermediate features

### logging / middleware

Switchless supports middleware. Switchless middleware is a function that gets invoked after updates are called, but before they are executed.

Middleware has several uses, which are covered later. Here we will focus on logging.

Here is an example of a logging Switchless middleware. For each update that is called, this middleware logs the update key and update payload before letting update execution continue.

```js
function updateLogger(executeUpdate, payload, extras) {

  const { key, getState } = extras

  console.log("UPDATE KEY:", key)
  console.log("PAYLOAD:", payload)

  executeUpdate(payload)

  console.log("NEXT STATE:", getState())
}
```

If this middleware looks useful to you, feel free to use it. In fact, we actually include it as part of Switchless -- it's the ```updateLogger```. You can use it like this:

```js
import { Provider, updateLogger } from 'switchless'

...

ReactDOM.render(
  <Provider updates={updates} middleware={updateLogger}>
    <Counter />
  </Provider>,
  ...
)
```

You can find more details on middleware in the *advanced features* section.

### update-functions in-depth

Updates can take a few forms.

#### **Reducers** ```(payload, oldState) => newState```

Reducers are your bread and butter. Use them for updates which don't involve AJAX calls or other asynchronous actions.

If an update has a return value, Switchless will assume it is a Reducer. Don't do anything in a Reducer besides returning the new state of the application. In other words, Reducers should be pure functions.

#### **Procedures** ```(payload, state, updates) => void```

If you need to make an AJAX call or perform another asynchronous action, use a Procedure. Procedures can trigger other updates via the ```updates``` parameter, which works just like ```props.updates```. Use the ```updates``` parameter in asynchronous callbacks, like this:

```js
function ajaxProcedure(payload, state, updates) {

  $.ajax({   //jQuery? What is this, 2008?
    url: payload,
    success: function(result) {
      updates.doSomethignWithAjaxResponse(callbackParams)
    }
  })
}
```

If you write an update that has an undefined return value, Switchless will assume it is a Procedure. Procedures should **NOT** return anything.

#### **the \__init__ update** ```(null | undefined) => initialState```

As outlined in *getting started*, the ```__init__``` update is called to get the initial state of your application. It is passed no parameters.

We'll detail further uses of the ```__init__``` update in the *advanced features* section. (Spoiler: you can use it via middleware to interface with other applications.)

### Reducer/Procedure wrappers

It is very important that Reducers don't have side-effects, and that Procedures don't return anything. If Reducers or Procedures break their contracts, you can end up with inconsistent state updates. This is a *very bad thing*. In fact, it defeats the whole point of a state container.

If you want force your Reducers and Procedures to act responsibly, wrap them, like this:

```js
import { Reducer, Procedure } from 'switchless'

const updates = {

  __init__: function() { return { count: 0 } },

  incrementCount: Reducer(function(payload, state) {

    return { count: state.count + payload }
  }),

  slowIncrement: Procedure(function(payload, state, updates) {

    setTimeout(() => updates.incrementCount(payload), 1000)
  })
}
```

Wrapped Reducers and Procedures will throw descriptive errors if they break their contracts. This will let you know if Reducers or Procedures are written incorrectly, which will help you to write correct Switchless applications. Additionally, wrapping an update function makes its type explicit! Isn't that sweet?

## advanced features

### passing control / "Objectifying" your Switchless app

If you want to embed your Switchless application in another, non-React application, read on.

While you should never use middleware to kick off updates directly, middleware has access to an ```extras.updates``` parameter. This parameter may be used to trigger updates, just like ```updates``` in Procedures, or ```props.updates``` in your view.

You may find it useful to let non-Switchless JavaScript entities trigger updates on your Switchless application. The best way to do this is via custom Switchless middleware. Here's an example of such middleware; notice how it leverages existing middleware:

```js
import { updateLogger } from 'switchless'

function yourCustomControlPassingMiddleware(executeUpdate, payload, extras) {

  const { key, updates, getState } = extras

  if (key === '__init__') {

    yourOtherApplication.passSwitchlessUpdatesAndStateGetter({
      updates,
      getState
    })
  }

  updateLogger(executeUpdate, payload, extras)
}
```

In the example above, ```yourOtherApplication``` is passed the ability to trigger updates and read state from your Switchless app. This happens as soon as the Switchless application loads, which is when the ```__init__``` update is triggered.




**COMING SOON**
nested updates. (Mention __init__ conflicts)






## sample React application

The purpose of this application is to show off the full Switchless API. Once you're comfortable with the idea of Switchless, this should provide enough reference for you to build a complete, full-featured application.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'switchless'

const updates = {

  __init__: function() {

    return { count: 0 }
  },

  incrementCount: function(payload, state) {

    return { count: state.count + payload }
  },

  slowIncrement: function(payload, state, updates) {

    setTimeout(() => updates.incrementCount(payload), 1000)
  }
}

const Counter = (props) => {
 return (
   <div className="counter">
     <div className="count">
       {props.count}
     </div>
     <div className="fastIncrement" onClick={() => props.updates.incrementCount(1)}>
       small fast increment
     </div>
     <div className="slowIncrement" onClick={() => props.updates.slowIncrement(5)}>
       big slow increment
     </div>
   </div>
 )
}

ReactDOM.render(
  <Provider updates={updates}>
    <Counter />
  </Provider>,
  document.getElementById('react-root')
)
```

## future direction
If anyone likes Eigenstate, I'll factor out its core so it can be used in other applications.
Also, going to think about making embeddable in React applications. (May be a no-go.)


Eigenstate was formerly [Switchless](https://github.com/8balloon/switchless).
