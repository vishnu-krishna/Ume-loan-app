import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/system'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')

if (!rootElement) {
    throw new Error('Root element not found')
}

createRoot(rootElement).render(
    <StrictMode>
        <HeroUIProvider>
            <App />
        </HeroUIProvider>
    </StrictMode>,
)