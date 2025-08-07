import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/system'
import { Toaster } from 'sonner'
import { startMockWorker } from './mocks/browser'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')

if (!rootElement) {
    throw new Error('Root element not found')
}

// Start MSW in development
startMockWorker().then(() => {
    createRoot(rootElement).render(
        <StrictMode>
            <HeroUIProvider>
                <App />
                <Toaster richColors closeButton />
            </HeroUIProvider>
        </StrictMode>,
    )
})