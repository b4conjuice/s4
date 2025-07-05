import { BrowserRouter, Route, Routes } from 'react-router'
import { ToastContainer } from 'react-toastify'

import HomePage from '@/frontend/routes/home'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        autoClose={2000}
        toastClassName='bg-cb-off-blue text-cb-white rounded-lg'
        pauseOnFocusLoss={false}
      />
    </>
  )
}
