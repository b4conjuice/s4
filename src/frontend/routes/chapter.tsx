import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { Main, Title } from '@/components/ui'
import books, {
  booksAndChaptersMap,
  getBookLink,
  transformScripturetoText,
} from '@/lib/books'
import Menu from '@/components/menu'
import BookSearch from '@/components/book-search'
import BookNav from '@/components/book-nav'
import ChapterNav from '@/components/chapter-nav'

export default function Chapter() {
  const { book, chapter: chapterParam } = useParams()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()
  if (!book) {
    return <Main className='flex flex-col p-4'>book param is required</Main>
  }
  const currentBookIndex = Number(book) - 1
  const chapter = Number(chapterParam)
  const bookName = books[currentBookIndex]
  if (!bookName) {
    return (
      <Main className='flex flex-col p-4'>book not found for book {book}</Main>
    )
  }
  const chapters = booksAndChaptersMap[bookName] ?? 1
  const text = transformScripturetoText({
    bookName,
    chapter,
  })
  const bookLink = getBookLink(text)
  const versesWithNotes = [] // TODO

  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>
            <button
              type='button'
              onClick={() => {
                window.open(bookLink)
              }}
              className='text-cb-pink hover:text-cb-pink/75 hover:cursor-pointer'
            >
              {bookName} {chapter}
            </button>
          </Title>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            <div className='flex flex-grow flex-col space-y-4'>
              <BookNav currentBookIndex={currentBookIndex} />
              <ChapterNav
                bookNumber={book}
                chapters={chapters}
                currentChapter={chapter}
              />
            </div>
            <BookSearch
              searchRef={searchRef}
              onSelectBook={async scripture => {
                const { bookNumber, chapter, verse } = scripture
                if (verse) {
                  const text = transformScripturetoText(scripture)
                  await navigate(`/text/${text}`)
                } else {
                  await navigate(`/books/${bookNumber}/${chapter}`)
                }
              }}
            />
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75'
            type='button'
            onClick={() => {
              searchRef?.current?.focus()
            }}
          >
            <MagnifyingGlassIcon className='h-6 w-6' />
          </button>
        </div>
      </footer>
    </>
  )
}
