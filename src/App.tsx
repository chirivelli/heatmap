import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router'

import { RootLayout } from '@/routes/root/layout'
import { IndexPage } from '@/routes/root'

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
