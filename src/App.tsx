import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router'

import { RootLayout } from '@/routes/root/layout'
import { Home } from '@/routes/root/index'
import { HeatmapApp } from '@/components/HeatmapApp'

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'app', Component: HeatmapApp },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
