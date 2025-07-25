<<<<<<< HEAD
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
=======
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
>>>>>>> 5628913b9fe5647f65c620d00b2b3d263d7fd596
