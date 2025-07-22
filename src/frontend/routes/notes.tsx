import { NavLink as Link } from 'react-router'
import { PencilSquareIcon } from '@heroicons/react/20/solid'

import { Main } from '@/components/ui'
import Menu from '@/components/menu'
import TopNav from '@/components/top-nav'
import NoteList from '@/components/note-list'
import { api } from '@/trpc/react'
import NoteListSkeleton from '@/components/note-list-skeleton'

export default function Notes() {
  const { data: notes, isFetching } = api.note.getAll.useQuery()
  return (
    <>
      <TopNav title='notes' />
      <Main className='flex flex-col px-2'>
        <div className='flex flex-grow flex-col space-y-4'>
          {isFetching ? <NoteListSkeleton /> : <NoteList notes={notes ?? []} />}
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'>
          <Link
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            to='/notes/new'
          >
            <PencilSquareIcon className='h-6 w-6' />
          </Link>
        </div>
      </footer>
    </>
  )
}
