import { NavLink as Link, useNavigate, useParams } from 'react-router'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'

import { Main, Title } from '@/components/ui'
import books, { booksAndChaptersMap } from '@/lib/books'

export default function Book() {
  const { book } = useParams()
  const navigate = useNavigate()

  const bookIndex = Number(book) - 1
  const bookName = books[bookIndex]
  if (!bookName) {
    return (
      <Main className='flex flex-col p-4'>book not found for book {book}</Main>
    )
  }
  const chapters = booksAndChaptersMap[bookName] ?? 1
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>{bookName}</Title>
          <div className='flex flex-grow flex-col space-y-4'>
            <ul className='grid grid-cols-6 gap-2'>
              {books.map((bookName, index) => {
                const currentBookIndex = index
                const shortBookName = bookName.replace('.', '').slice(0, 3)
                return (
                  <li key={index} className='group'>
                    {currentBookIndex === bookIndex ? (
                      <span>{shortBookName}</span>
                    ) : (
                      <Link
                        to={`/books/${currentBookIndex}`}
                        className='text-cb-pink hover:text-cb-pink/75'
                      >
                        {shortBookName}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
            <ul className='grid grid-cols-6 gap-2'>
              {Array.from(
                {
                  length: chapters,
                },
                (_, i) => i + 1
              ).map((bookChapter: number) => {
                return (
                  <li key={bookChapter}>
                    <Link
                      to={`/books/${book}/${bookChapter}`}
                      className='text-cb-pink hover:text-cb-pink/75 py-4 group-first:pt-0'
                    >
                      {bookChapter}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75'
            onClick={async () => {
              await navigate(-1)
            }}
          >
            <ChevronLeftIcon className='h-6 w-6' />
          </button>
        </div>
        <div className='flex space-x-4'></div>
      </footer>
    </>
  )
}
