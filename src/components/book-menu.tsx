import { BookOpenIcon } from '@heroicons/react/20/solid'
import { Menu as MenuRoot, MenuButton, MenuItems } from '@headlessui/react'
import { useParams } from 'react-router'

import BookNav from '@/components/book-nav'
import ChapterNav from '@/components/chapter-nav'
import books, {
  booksAndChaptersMap,
  transformTextToScripture,
} from '@/lib/books'

export default function BookMenu({
  currentBookIndex: initialCurrentBookIndex,
  bookNumber: initialBookNumber,
  chapters: initialChapters,
  currentChapter: initialCurrentChapter,
}: {
  currentBookIndex?: number
  bookNumber?: string
  chapters?: number
  currentChapter?: number
}) {
  const { book: bookParam, chapter: chapterParam, text } = useParams()
  const scripture = text ? transformTextToScripture(text) : undefined
  const bookNumberFromParams = scripture
    ? scripture.bookNumber
    : Number(bookParam)
  const bookIndexFromParams = bookNumberFromParams - 1
  const currentBookIndex = initialCurrentBookIndex ?? bookIndexFromParams

  const bookNumber = initialBookNumber ?? String(bookNumberFromParams)

  const bookName = scripture
    ? scripture.bookName
    : books[bookNumberFromParams - 1]
  const chaptersFromParams = scripture
    ? booksAndChaptersMap[scripture.bookName]
    : bookParam && bookName
      ? booksAndChaptersMap[bookName]
      : undefined
  const chapters = initialChapters ?? chaptersFromParams

  const chapterFromParams = scripture ? scripture.chapter : Number(chapterParam)
  const currentChapter = initialCurrentChapter ?? chapterFromParams

  return (
    <MenuRoot>
      <MenuButton className='text-cb-yellow hover:text-cb-yellow/75'>
        <BookOpenIcon className='h-6 w-6' />
      </MenuButton>

      <MenuItems
        className='bg-cb-dusty-blue/90 text-cb-white flex flex-col space-y-4 rounded p-4'
        anchor='bottom start'
      >
        <BookNav currentBookIndex={currentBookIndex} />
        {bookNumber !== undefined && chapters !== undefined && (
          <ChapterNav
            bookNumber={bookNumber}
            chapters={chapters}
            currentChapter={currentChapter}
          />
        )}
      </MenuItems>
    </MenuRoot>
  )
}
