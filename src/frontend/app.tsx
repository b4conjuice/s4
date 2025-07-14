import { BrowserRouter, Route, Routes } from 'react-router'
import { ToastContainer } from 'react-toastify'

import HomePage from '@/frontend/routes/home'
import HistoryPage from '@/frontend/routes/history'
import NotesPage from '@/frontend/routes/notes'
import BooksPage from '@/frontend/routes/books'
import BookPage from '@/frontend/routes/book'
import ChapterPage from '@/frontend/routes/chapter'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/books' element={<BooksPage />} />
          <Route path='/books/:book' element={<BookPage />} />
          <Route path='/books/:book/:chapter' element={<ChapterPage />} />
          <Route path='/text/:text' element={<NotesPage />} />
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
