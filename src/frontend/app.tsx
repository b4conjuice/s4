import { BrowserRouter, Route, Routes } from 'react-router'
import { ToastContainer } from 'react-toastify'

import HomePage from '@/frontend/routes/home'
import HistoryPage from '@/frontend/routes/history'
import TextPage from '@/frontend/routes/text'
import NotesPage from '@/frontend/routes/notes'
import NewNotePage from '@/frontend/routes/new-note'
import NotePage from '@/frontend/routes/note'
import BooksPage from '@/frontend/routes/books'
import BookPage from '@/frontend/routes/book'
import ChapterPage from '@/frontend/routes/chapter'
import SettingsPage from '@/frontend/routes/settings'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/history' element={<HistoryPage />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/books' element={<BooksPage />} />
          <Route path='/books/:book' element={<BookPage />} />
          <Route path='/books/:book/:chapter' element={<ChapterPage />} />
          <Route path='/notes' element={<NotesPage />} />
          <Route path='/notes/new' element={<NewNotePage />} />
          <Route path='/notes/:id' element={<NotePage />} />
          <Route path='/text/:text' element={<TextPage />} />
          <Route
            path='/text/:text/new'
            element={<NewNotePage noteType='scripture' />}
          />
          <Route path='/text/:text/:id' element={<NotePage />} />
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
