import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StateProvider } from './StateProvider.jsx'
import * as serviceWorker from "./serviceWorker"
import reducer, { initialState } from './reducer.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </ErrorBoundary>
  </StrictMode>
);




serviceWorker.unregistered()




















