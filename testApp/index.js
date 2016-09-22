//include css
function requireAll(r) { r.keys().forEach(r) }
requireAll(require.context('./', true, /s?css$/));

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import updates from './updates'
import middleware from './middleware'
import Counter from './components/Counter'

import { Provider } from '../src'

ReactDOM.render(
  <Provider updates={updates} middleware={middleware}>
    <Counter />
  </Provider>,
  document.getElementById('react-root')
)
