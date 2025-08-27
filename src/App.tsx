import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router'

import { HeatmapApp } from '@/components/HeatmapApp'
import { Root } from '@/components/Root'

const router = createBrowserRouter([
  { path: '/', Component: Root },
  { path: '/app', Component: HeatmapApp },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
