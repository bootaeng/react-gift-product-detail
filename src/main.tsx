import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './Root'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider, Global } from '@emotion/react'
import { theme } from './styles/theme'
import { globalReset } from './styles/reset'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Global styles={globalReset} />
        <Root />
      </ThemeProvider>
    </React.StrictMode>
  )
}
