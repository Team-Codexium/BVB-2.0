import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { BattleProvider } from './contexts/BattleContext.jsx'
import { RapperProvider } from './contexts/ArtistContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BattleProvider>
        <RapperProvider>
          <AuthProvider>

            <App />
          </AuthProvider>
        </RapperProvider>
      </BattleProvider>
    </BrowserRouter>
  </StrictMode>,
)
