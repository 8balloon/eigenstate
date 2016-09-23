//include css
function requireAll(r) { r.keys().forEach(r) }
requireAll(require.context('./', true, /s?css$/));

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import updates from './updates'
import middleware from './middleware'
import Components from './components'

import { Provider } from '../src'

ReactDOM.render(
  <Provider updates={updates} middleware={middleware}>
    <Components />
  </Provider>,
  document.getElementById('react-root')
)
