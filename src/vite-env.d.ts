/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_ENV: string
    readonly VITE_DEMO_MODE: string
    readonly VITE_APP_VERSION: string
    readonly VITE_APP_NAME: string
    readonly VITE_APP_DESCRIPTION: string
    readonly VITE_API_BASE_URL: string
    readonly VITE_SALESFORCE_ENDPOINT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
