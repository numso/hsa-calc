import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'

import App from './app'

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Cascadia';
  }
`

const el = document.getElementById('app')
ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  el
)
