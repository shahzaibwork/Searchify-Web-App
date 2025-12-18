import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import './index.css'
import App from './App.tsx'
import { store, persistor } from './redux/store.ts'

createRoot(document.getElementById('root')!).render(

  <PersistGate persistor={persistor}>
    
    <Provider store = { store }>

      {/* <StrictMode> */}
        <App />
      {/* </StrictMode>, */}

    </Provider>

  </PersistGate>
)
