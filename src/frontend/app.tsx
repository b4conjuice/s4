import { BrowserRouter, Route, Routes } from 'react-router'

import HomePage from '@/frontend/routes/home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
