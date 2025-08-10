import { useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { Main, Title } from '@/components/ui'
import books, {
  booksAndChaptersMap,
  transformScripturetoText,
} from '@/lib/books'
import Menu from '@/components/menu'
import BookSearch from '@/components/book-search'
import ChapterNav from '@/components/chapter-nav'
import { api } from '@/trpc/react'
import BookMenu from '@/components/book-menu'
import useGetScriptureUrl from '@/lib/useGetScriptureUrl'

export default function Chapter() {
  const { book, chapter: chapterParam } = useParams()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()
  const bookChapterText = `${String(book).padStart(2, '0')}${String(chapterParam).padStart(3, '0')}` // TODO: refactor from books.ts
  const { data: texts, isFetching } = api.note.getUniqueNoteTexts.useQuery({
    bookChapterText,
  })
  const getScriptureUrl = useGetScriptureUrl()
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
  const scriptureUrl = getScriptureUrl(text)
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>
            <a
              href={scriptureUrl}
              target='_blank'
              className='text-cb-pink hover:text-cb-pink/75 hover:cursor-pointer'
            >
              {bookName} {chapter}
            </a>
          </Title>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            <div className='flex flex-grow flex-col space-y-4'>
              <ChapterNav
                bookNumber={book}
                chapters={chapters}
                currentChapter={chapter}
              />
            </div>
            {isFetching || !texts ? (
              <p>loading...</p>
            ) : texts.length > 0 ? (
              <ul className='divide-cb-dusty-blue divide-y'>
                {texts.map(text => {
                  const verse = Number(text.slice(5, 8)) // TODO: refactor from books.ts
                  return (
                    <li key={text} className='group flex space-x-2'>
                      <Link
                        to={`/text/${text}`}
                        className='text-cb-pink hover:text-cb-pink/75 flex grow items-center justify-between py-4 group-first:pt-0'
                      >
                        <div>
                          {bookName} {chapter}:{verse}
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p>no verses found</p>
            )}
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
              initialQuery={`${bookName} ${chapter}:`}
            />
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
          <BookMenu />
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
