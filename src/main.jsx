import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'; // Import du BrowserRouter
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Envelopper avec BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
