import { NavLink as Link } from 'react-router'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import { SignedIn, SignedOut } from '@clerk/nextjs'

import { Main } from '@/components/ui'
import Menu from '@/components/menu'
import TopNav from '@/components/top-nav'
import { api } from '@/trpc/react'
import NoteListSkeleton from '@/components/note-list-skeleton'
import { SCRIPTURE_LIST_TAGS } from '@/lib/common'

function ScriptureLists() {
  const { data: lists, isFetching } = api.note.getAll.useQuery()
  if (isFetching) {
    return (
      <ul className='divide-cb-dusty-blue divide-y'>
        {Array.from(
          {
            length: 15,
          },
          (_, i) => i + 1
        ).map((note, index) => (
          <li key={index} className='group flex h-[56px] space-x-2'>
            <div className='text-cb-pink hover:text-cb-pink/75 flex grow items-center justify-between py-4 group-first:pt-0'></div>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <ul className='divide-cb-dusty-blue divide-y'>
      {(lists ?? [])
        .filter(note =>
          SCRIPTURE_LIST_TAGS.every(tag => note.tags?.includes(tag))
        )
        .map(note => (
          <li key={note.id} className='group flex space-x-2'>
            <Link
              to={`/lists/${note.id}`}
              className='text-cb-pink hover:text-cb-pink/75 flex grow items-center justify-between py-4 group-first:pt-0'
            >
              <div>
                <div>{note.title}</div>
              </div>
            </Link>
          </li>
        ))}
    </ul>
  )
}

export default function ListsPage() {
  return (
    <>
      <TopNav title='lists' />
      <Main className='flex grow flex-col gap-4 px-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <SignedIn>
            <ScriptureLists />
          </SignedIn>
          <SignedOut>
            <p>login to see your lists</p>
          </SignedOut>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'>
          <Link
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            to='/lists/new'
          >
            <PencilSquareIcon className='h-6 w-6' />
          </Link>
        </div>
      </footer>
    </>
  )
}
