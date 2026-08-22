import { useRef } from 'react'
import { NavLink as Link, useNavigate } from 'react-router'
import { SignedIn, useAuth } from '@clerk/nextjs'
import {
  ArrowDownOnSquareIcon,
  ChevronLeftIcon,
} from '@heroicons/react/20/solid'
import { useLocalStorage } from '@uidotdev/usehooks'

import BookSearch from '@/components/book-search'
import { api } from '@/trpc/react'
import { Main } from '@/components/ui'
import TopNav from '@/components/top-nav'
import { transformScripturetoText, transformTextToScripture } from '@/lib/books'
import ScriptureList from '@/components/scripture-list'
import { SCRIPTURE_LIST_TAGS } from '@/lib/common'

const TABS = ['default', 'edit'] as const
type Tab = (typeof TABS)[number]

export default function NewListPage() {
  const utils = api.useUtils()
  const { mutateAsync: saveNote } = api.note.save.useMutation({
    onSuccess: async () => {
      await utils.note.getAll.invalidate()
    },
    onMutate: async newNote => {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.note.get.cancel()

      // Get the data from the queryCache
      const prevData = utils.note.get.getData()

      // Return the previous data so we can revert if something goes wrong
      return { prevData }
    },
  })
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const { isSignedIn } = useAuth()

  const [list, setList] = useLocalStorage<{
    title: string
    items: string[]
  }>('s4-new-list', { title: '', items: [] })
  const title = list.title ?? ''
  const items = list.items ?? []
  const canSave = isSignedIn && list.title !== '' && items.length > 0

  return (
    <>
      <TopNav title='new list' />
      <Main className='flex flex-col'>
        <div className='flex flex-col gap-4 px-4'>
          <p>login to save list</p>
          <input
            className='bg-cobalt text-cb-white'
            type='text'
            value={title}
            onChange={e => {
              setList({
                ...list,
                title: e.target.value,
              })
            }}
            placeholder='title'
          />
          {items.length > 0 ? (
            <ScriptureList list={items} />
          ) : (
            <p>no scriptures yet</p>
          )}
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex flex-col space-y-2 px-2 pt-2 pb-6'>
        <BookSearch
          searchRef={searchRef}
          onSelectBook={scripture => {
            const bibleParam = transformScripturetoText(scripture)
            setList({
              ...list,
              items: [...items, bibleParam],
            })
          }}
          showRecentCommands
          placeholder='add scripture'
        />
        <div className='flex items-center justify-between'>
          <div className='flex space-x-4'>
            <Link
              to='/lists'
              className='text-cb-yellow hover:text-cb-yellow/75'
            >
              <ChevronLeftIcon className='h-6 w-6' />
            </Link>
          </div>
          <div className='flex space-x-4'>
            <SignedIn>
              <button
                className='text-cb-yellow hover:text-cb-yellow flex w-full justify-center disabled:pointer-events-none disabled:opacity-25'
                type='button'
                onClick={async () => {
                  if (list) {
                    const body = items.join('\n\n')
                    const listTitle = `= ${list.title}`
                    const newNote = {
                      title: listTitle,
                      body,
                      text: listTitle + '\n\n' + body,
                      list: items,
                      tags: SCRIPTURE_LIST_TAGS,
                    }
                    const id = await saveNote(newNote)
                    setList({
                      title: '',
                      items: [],
                    })
                    await navigate(`/lists/${id}`)
                  }
                }}
                disabled={!canSave}
              >
                <ArrowDownOnSquareIcon className='h-6 w-6' />
              </button>
            </SignedIn>
          </div>
        </div>
      </footer>
    </>
  )
}
