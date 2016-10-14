import React from 'react'
import ReactDOM from 'react-dom'
import { hashHistory, Router, Route, Link } from 'react-router'
import { Provider, connect } from '../../src'
import { counterState, CounterView } from '../Counter'
import { gridState, GridView } from '../Grid'

/*
This state object is composed of a counter state object and a grid state object,
which will be passed to CounterView and GridView (see CompleteExampleView)
*/
const completeExampleState = {

  // stateDefs
  counter: counterState,
  grid: gridState,

  location: null, //data

  //pure
  storeLocation: (location, state) => ({ location }),

  //impure
  handleNewLocation: (nextLocation, state) => {

    // the && is in case location has not yet been initialized
    if ( state.location === null || ( state.location.key !== nextLocation.key ) ) {

      state.storeLocation(nextLocation)

      // reset scrolling on every route change
      window.scrollTo(0, 0)

      return () => { // an Effect to be executed after the View has updated.
        switch (nextLocation.pathname) {
          case '/counter':
            document.getElementById('counter').scrollIntoView(true)
            break;
          case '/grid':
            document.getElementById('grid').scrollIntoView(true)
            break;
        }
      }
    }
  }
}

const CompleteExampleView = connect((props) => (
  <div id="root">
    <div id="navigation">
      <Link to="/home">Home</Link>
      <Link to="/counter">Counter Example</Link>
      <Link to="/grid">Grid Example</Link>
    </div>
    <div id="home" style={{paddingTop: '100%', paddingBottom: '100%'}}>
      <img id="banner" src="http://fakeCDN.com/fakeHeroBanner" />
      <CounterView {...props.counter} />
      <GridView {...props.grid} />
    </div>
  </div>
))

// Passing new route location info into state via a method.
const handleLocationChanges = (stateInterface) => {
  hashHistory.listen((location) => {
    stateInterface().handleNewLocation(location)
  })
}

/*
We are creating /home, /counter, and /grid routes so that handleLocationChanges
picks up on route location changes and can scroll to corresponding elements.
*/
const CompleteExample = () => {
  ReactDOM.render(
    <Provider stateDef={completeExampleState} interface={handleLocationChanges}>
      <Router history={hashHistory}>
        <Route path="/" component={CompleteExampleView}>
          <Route path="/home" />
          <Route path="/counter" />
          <Route path="/grid" />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('react')
  )
}

export default CompleteExample
