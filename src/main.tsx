import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { detectFallbackReason, FALLBACK_MESSAGES } from './lib/capabilities'
import { useGameStore } from './store/gameStore'
import './styles.css'
import './theme/theme.css'

const reason = detectFallbackReason()
if (reason) useGameStore.getState().setMode('2d', FALLBACK_MESSAGES[reason])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
