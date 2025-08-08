import {
  ArrowPathIcon,
  BookOpenIcon,
  PencilSquareIcon,
} from '@heroicons/react/20/solid'
import { NavLink as Link } from 'react-router'
import { SignedIn, SignedOut } from '@clerk/nextjs'

import Menu from '@/components/menu'
import { Main } from '@/components/ui'
import { api } from '@/trpc/react'
import TopNav from '@/components/top-nav'
import { getScriptureUrl, transformTextToScripture } from '@/lib/books'

function Notes() {
  const {
    data: notes,
    isFetching,
    refetch,
  } = api.note.getAllScriptureNotes.useQuery({
    random: true,
  })
  if (isFetching) {
    return (
      <>
        <Main className='flex flex-col'>
          <ul className='h-screen snap-y snap-mandatory overflow-auto'>
            <li className='group flex h-screen w-full snap-start'>
              <textarea
                className='group-odd:border-cobalt group-odd:bg-cobalt group-even:bg-cb-dark-blue group-even:border-cb-dark-blue caret-cb-yellow h-full flex-grow overflow-hidden'
                defaultValue=''
                readOnly
              />
            </li>
          </ul>
        </Main>
        <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
          <div className='flex space-x-4'>
            <Menu />
          </div>
          <div className='flex space-x-4'></div>
        </footer>
      </>
    )
  }

  return (
    <>
      <Main className='flex flex-col'>
        <ul className='h-screen snap-y snap-mandatory overflow-auto'>
          {notes?.map(note => {
            const scripture = transformTextToScripture(note.scripture)
            if (!scripture) {
              return null
            }
            const scriptureAsString = scripture.asString
            const scriptureUrl = getScriptureUrl(note.scripture)
            return (
              <li
                key={note.id}
                className='group relative h-screen w-full snap-start'
              >
                <textarea
                  className='group-odd:border-cobalt group-odd:bg-cobalt group-even:bg-cb-dark-blue group-even:border-cb-dark-blue caret-cb-yellow h-full w-full flex-grow overflow-hidden'
                  defaultValue={note.text}
                  readOnly
                />
                <footer className='sticky bottom-16 flex justify-between px-2'>
                  <div className='flex space-x-4'>
                    <a
                      href={scriptureUrl}
                      target='_blank'
                      className='text-cb-yellow hover:text-cb-yellow/75'
                    >
                      {scriptureAsString}
                    </a>
                  </div>
                  <div className='flex space-x-4'>
                    <Link
                      to={`/text/${note.scripture}`}
                      className='text-cb-yellow hover:text-cb-yellow/75'
                    >
                      <BookOpenIcon className='h-6 w-6' />
                    </Link>
                    <Link
                      to={`/notes/${note.id}`}
                      className='text-cb-yellow hover:text-cb-yellow/75'
                    >
                      <PencilSquareIcon className='h-6 w-6' />
                    </Link>
                  </div>
                </footer>
              </li>
            )
          })}
        </ul>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'>
          <button
            type='button'
            className='text-cb-yellow hover:text-cb-yellow/75'
            onClick={async () => {
              void refetch()
            }}
          >
            <ArrowPathIcon className='h-6 w-6' />
          </button>
        </div>
      </footer>
    </>
  )
}

export default function ScrollPage() {
  return (
    <>
      <SignedOut>
        <TopNav title='scroll' />
      </SignedOut>
      <SignedIn>
        <Notes />
      </SignedIn>
      <SignedOut>
        <p>sign in to view your notes</p>
      </SignedOut>
      <SignedOut>
        <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
          <div className='flex space-x-4'>
            <Menu />
          </div>
          <div className='flex space-x-4'></div>
        </footer>
      </SignedOut>
    </>
  )
}
