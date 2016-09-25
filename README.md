# Eigenstate

Eigenstate is an object-oriented alternative to [Redux](https://github.com/reactjs/redux).

It provides the same functionality as a Redux store, actions, action-creators, reducers, and middleware via a single, simplified state object. No configuration with React or other packages is required.

## how to use

Create values and methods in a state definition object, and pass that to a ```Provider```. Eigenstate does the rest.

Here is an example, followed by a more rigorous definition of a state object.

```js
import { Provider } from 'eigenstate'

/*
Your application's state definition object
*/
const CounterStateDef = {
  //a value
  count: 0,
  //a method
  increment: (amount, state) => ({ count: state.count + 1 })
}

/*
Your application's view component.
It will have access to the state method and value you defined via "props"
*/
const CounterView = (props) => (
  <div id="counter" onClick={() => props.increment(1)}>
    {props.count}
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

A state definition is an object comprised of ```key:property``` pairs, where a property may be either a method or a value.

**Values** can be any JSON value -- That means objects, arrays, numbers, strings, Booleans, and null. You can access values via ```props.<key>``` from your application view.

**Methods** are functions that can do one of two things.
1. Return new state values.
2. Call other state methods.

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
const Counters = (props) => (
  <div id="counter-app">
    <div id="counters">
      {(function() {
        var counters = []
        for (var i = 0; i < props.numCounters; i++) {
          counters.push(
            <div className="counter" key={i}>
              { props.count }
            </div>
          )
        }
        return counters
      })()}
    </div>  
    <div id="counter-controllers">
      <div onClick={props.addCounter}> add a counter </div>
      <div onClick={props.removeCounter}> remove a counter </div>
      <div onClick={() => props.incrementCount(5)}> small, fast increment </div>
      <div onClick={() => props.delayedIncrement({
        incrementAmount: 20,
        delayMS: 1000
      })}> big, slow increment </div>
    </div>
  </div>
)

ReactDOM.render(
  <Provider stateDef={stateDef}>
    <Counters />
  </Provider>,
  document.getElementById('react-root')  
)
```

## methods in-depth


Changes should either RETURN A VALUE or TRIGGER OTHER CHANGES. They should never do both -- in fact, if Eigenstate catches one of your change functions doing both, it will throw an error. (Explain why?)


## onChange / onLoad

## nested state

## @connect

## future direction
If anyone likes Eigenstate, I'll factor out its core so it can be used in other applications.
Also, going to think about making embeddable in React applications. (May be a no-go.)


Eigenstate was formerly [Switchless](https://github.com/8balloon/switchless).
