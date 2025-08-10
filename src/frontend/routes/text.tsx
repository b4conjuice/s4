import { NavLink as Link, useNavigate, useParams } from 'react-router'
import { PencilSquareIcon } from '@heroicons/react/20/solid'

import { Main, Title } from '@/components/ui'
import {
  getScriptureUrl,
  transformScripturetoText,
  transformTextToScripture,
} from '@/lib/books'
import { api } from '@/trpc/react'
import NoteListSkeleton from '@/components/note-list-skeleton'
import NoteList from '@/components/note-list'
import Menu from '@/components/menu'
import BookMenu from '@/components/book-menu'
import BookSearch from '@/components/book-search'

export default function Text() {
  const { text } = useParams()
  const navigate = useNavigate()
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
  const scriptureUrl = getScriptureUrl(text)
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>
            <a
              className='text-cb-pink hover:text-cb-pink/75 hover:cursor-pointer'
              href={scriptureUrl}
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
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex flex-col space-y-2 px-2 pt-2 pb-6'>
        <BookSearch
          onSelectBook={async scripture => {
            const { bookNumber, chapter, verse } = scripture
            if (verse) {
              const text = transformScripturetoText(scripture)
              await navigate(`/text/${text}`)
            } else {
              await navigate(`/books/${bookNumber}/${chapter}`)
            }
          }}
          showRecentCommands
        />
        <div className='flex items-center justify-between'>
          <div className='flex space-x-4'>
            <Menu />
            <BookMenu />
          </div>
          <div className='flex space-x-4'>
            <Link
              className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
              to='new'
            >
              <PencilSquareIcon className='h-6 w-6' />
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
