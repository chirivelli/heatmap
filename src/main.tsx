import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'
import { SupabaseProvider } from '@/db/SupabaseProvider.tsx'
import App from '@/App.tsx'
import '@/index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SupabaseProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </SupabaseProvider>
    </ClerkProvider>
  </StrictMode>,
)
