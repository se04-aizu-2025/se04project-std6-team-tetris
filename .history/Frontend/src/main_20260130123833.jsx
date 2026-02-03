import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import sortTestEngine from './components/test_engine/sortTestEngine.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <sortTestEngine />
  </StrictMode>,
)
