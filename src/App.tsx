import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { HeatmapApp } from '@/components/HeatmapApp'

function App() {
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <HeatmapApp />
      </SignedIn>
    </>
  )
}

export default App
