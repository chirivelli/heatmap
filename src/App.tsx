import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router'

import { RootLayout } from '@/routes/root/layout'
import { Home } from '@/routes/root/home'
import { Index } from '@/routes/root'

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'home', Component: Index },
      // { path: 'app', Component: HeatmapApp },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
