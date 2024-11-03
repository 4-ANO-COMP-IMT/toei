/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_USER_URL: string
    readonly VITE_LOGIN_URL: string
    readonly VITE_ARTWORK_URL: string
    readonly VITE_COUNTER_URL: string
    readonly VITE_QUERY_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}