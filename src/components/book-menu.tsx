import { BookOpenIcon } from '@heroicons/react/20/solid'
import { Menu as MenuRoot, MenuButton, MenuItems } from '@headlessui/react'

import BookNav from '@/components/book-nav'
import ChapterNav from '@/components/chapter-nav'

export default function BookMenu({
  currentBookIndex,
  bookNumber,
  chapters,
  currentChapter,
}: {
  currentBookIndex?: number
  bookNumber?: string
  chapters?: number
  currentChapter?: number
}) {
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
