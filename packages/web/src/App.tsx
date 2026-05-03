import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router'

import { IndexPage } from '@/routes/root'
import { RootLayout } from '@/routes/root/layout'

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [{ index: true, Component: IndexPage }],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
