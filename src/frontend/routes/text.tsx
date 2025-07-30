import { NavLink as Link, useParams } from 'react-router'
import { PencilSquareIcon } from '@heroicons/react/20/solid'

import { Main, Title } from '@/components/ui'
import {
  booksAndChaptersMap,
  getBookLink,
  transformTextToScripture,
} from '@/lib/books'
import { api } from '@/trpc/react'
import NoteListSkeleton from '@/components/note-list-skeleton'
import NoteList from '@/components/note-list'
import Menu from '@/components/menu'
import BookMenu from '@/components/book-menu'

export default function Text() {
  const { text } = useParams()
  if (!text) {
    return <Main className='flex flex-col p-4'>`text` is required</Main>
  }
  const scripture = transformTextToScripture(text)
  if (!scripture) {
    return (
      <Main className='flex flex-col p-4'>
        no scripture found for text {text}
      </Main>
    )
  }
  const { data: notes, isFetching } = api.note.getScriptureNotes.useQuery({
    text,
  })
  const bookLink = getBookLink(text)
  const chapters = booksAndChaptersMap[scripture.bookName] ?? 1
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>
            <a
              className='text-cb-pink hover:text-cb-pink/75 hover:cursor-pointer'
              href={bookLink}
              target='_blank'
            >
              {scripture.asString}
            </a>
          </Title>
          <div className='flex flex-grow flex-col space-y-4'>
            {isFetching ? (
              <NoteListSkeleton />
            ) : (
              <NoteList notes={notes ?? []} />
            )}
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
          <BookMenu
            currentBookIndex={scripture.bookNumber - 1}
            bookNumber={String(scripture.bookNumber)}
            chapters={chapters}
            currentChapter={Number(scripture.chapter)}
          />
        </div>
        <div className='flex space-x-4'>
          <Link
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            to='new'
          >
            <PencilSquareIcon className='h-6 w-6' />
          </Link>
        </div>
      </footer>
    </>
  )
}
