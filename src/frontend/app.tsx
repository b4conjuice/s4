import { BrowserRouter, Route, Routes } from 'react-router'
import { ToastContainer } from 'react-toastify'

import HomePage from '@/frontend/routes/home'
import HistoryPage from '@/frontend/routes/history'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/history' element={<HistoryPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        autoClose={2000}
        theme='dark'
        toastClassName='bg-cb-off-blue text-cb-white rounded-lg'
        pauseOnFocusLoss={false}
      />
    </>
  )
}
