# Switchless

Switchless is a smart state container for [React](https://facebook.github.io/react/index.html). It helps you define and control your application's state.

Switchless helps you write applications that are easy to set up, extend, and test.

## purpose

Switchless was born out of frustration with Redux. Redux is great, but it is hard/verbose to set up, requires you to write repetitive action creators and parsers, and presumes the use of "complementary packages". (If you've never used Redux, you can read about it [here](https://github.com/reactjs/redux).)

Switchless comes fully configured for React, so no wiring is required. Its simple ```key:update``` model provides a simpler alternative to Redux actions, which is just as powerful. This means no ```switch``` statements or "type" strings -- you only write updates.

## the gist / getting started

Switchless lets you control your state via updates. Updates are functions which return a new application state.

Updates generally look like this: ```(payload, state) => newState```. (If you're coming from Redux, this will look familiar.)

To use Switchless, you've got to put your updates in an ```updates``` object, which is a collection of ```key:update``` pairs.

To define your initial application state, define a function on the special key ```__init__```.

```js
/*
State + updates for a simple counter application
*/
const updates = {

  __init__: function() {

    return { count: 0 }
  },
  incrementCount: function(payload, state) {

    return { count: state + payload}
  }
}
```

Make your state and updates available to the rest of your application by passing them to the Switchless ```<Provider>```, like this:

```js
/*
Component + rendering for a simple counter application
*/
import { Provider } from 'switchless'

const Counter = (props) => (
  <div className="counter" onClick={() => props.updates.incrementCount(1)}>
    {props.count}
  </div>
)

ReactDOM.render(
  <Provider updates={updates}>
    <Count />
  </Provider>,
  ...
)
```

Combine the two examples above, and you have a functioning Switchless application! And all in ~25 lines of code.

## intermediate features

### logging / middleware

Switchless supports middleware. Switchless middleware is a function that gets invoked after updates are called, but before they are executed.

Middleware has several uses, which are covered later. Here we will focus on logging.

Here is an example of a logging Switchless middleware. For each update that is called, this middleware logs the update key and update payload before letting update execution continue.

```js
function verboseLogger(executeUpdate, payload, extras) {

  const { key, getState } = extras

  console.log("UPDATE KEY:", key)
  console.log("PAYLOAD:", payload)

  executeUpdate(payload)

  console.log("NEXT STATE:", getState())
}
```

If this middleware looks useful to you, feel free to use it. In fact, we actually include it as part of Switchless -- it's the ```verboseLogger```. You can use it like this:

```js
import { Provider, verboseLogger } from 'switchless'

...

ReactDOM.render(
  <Provider updates={updates} middleware={verboseLogger}>
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
import { verboseLogger } from 'switchless'

function yourCustomControlPassingMiddleware(executeUpdate, payload, extras) {

  const { key, updates, getState } = extras

  if (key === '__init__') {

    yourOtherApplication.passSwitchlessUpdatesAndStateGetter({
      updates,
      getState
    })
  }

  verboseLogger(executeUpdate, payload, extras)
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
