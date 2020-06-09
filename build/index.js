import React from 'https://cdn.pika.dev/react'
import ReactDOM from 'https://cdn.pika.dev/react-dom'
import { createGlobalStyle } from 'https://cdn.pika.dev/styled-components'

import App from './app.js'

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
