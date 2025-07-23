import { useEffect, useRef, useState } from 'react'
import {
  NavLink as Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router'
import { SignedIn, useAuth } from '@clerk/nextjs'
import {
  ArrowDownOnSquareIcon,
  ChevronLeftIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import { useDebounce } from '@uidotdev/usehooks'

import { saveNote } from '@/server/db/notes'
import BookSearch from '@/components/book-search'
import { getBookLink, transformScripturetoText } from '@/lib/books'
import Textarea from '@/components/textarea'
import useTextarea from '@/lib/useTextarea'
import { api } from '@/trpc/react'
import { Main } from '@/components/ui'
import Modal from '@/components/modal'
import Button from '@/components/ui/button'

const TABS = ['default', 'settings'] as const
type Tab = (typeof TABS)[number]

export default function Note() {
  const { id } = useParams()
  const { data: note, refetch } = api.note.get.useQuery({ id: Number(id) })
  const utils = api.useUtils()
  const { mutate: deleteNote } = api.note.deleteNote.useMutation({
    onSuccess: async () => {
      await utils.note.getAll.invalidate()
    },
  })
  const { text: initialText } = note ?? {}
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const textarea = useTextarea({ initialText })
  const {
    text,
    setText,
    currentSelectionStart,
    currentSelectionEnd,
    textAreaRef,
  } = textarea
  const { isSignedIn } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') as Tab
  const [tab, setTab] = useState<Tab | null>(initialTab ?? 'default')
  useEffect(() => {
    if (note) {
      if (tab !== 'default') {
        setSearchParams(`tab=${tab}`)
      } else {
        void navigate(`/notes/${note.id}`)
      }
    }
  }, [tab])
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const readOnly = false // !user || user.username !== note?.author
  const hasChanges = text !== (note?.text ?? '')
  const canSave = !readOnly && !(!hasChanges || text === '')

  const debouncedText = useDebounce(text, 500)

  useEffect(() => {
    async function updateNote() {
      if (note) {
        const [title, ...body] = text.split('\n\n')
        const newNote = {
          ...note,
          id: note.id,
          text,
          title: title ?? '',
          body: body.join('\n\n'),
        }

        await saveNote(newNote)
        await refetch()
        await utils.note.getAll.invalidate()
      }
    }
    if (isSignedIn && canSave) {
      void updateNote()
    }
  }, [debouncedText])

  return (
    <>
      <Main className='flex flex-col'>
        {tab === 'settings' ? (
          <>
            <h2 className='px-2'>settings</h2>
            <button
              className='flex w-full justify-center py-2 disabled:pointer-events-none disabled:opacity-25'
              disabled={!note}
              onClick={() => {
                setIsConfirmModalOpen(true)
              }}
            >
              <TrashIcon className='h-6 w-6 text-red-600' />
            </button>
          </>
        ) : (
          <Textarea {...textarea} />
        )}
      </Main>
      <SignedIn>
        <footer className='bg-cb-dusty-blue sticky bottom-0 flex flex-col space-y-2 px-2 pt-2 pb-6'>
          <BookSearch
            searchRef={searchRef}
            onSelectBook={scripture => {
              const scriptureText = transformScripturetoText(scripture)
              // const chapterLink =
              //   bookLinkType === 'jw' // TODO: add bookLinkType
              //     ? getBookLink(scriptureText)
              //     : getBookLink2(scripture) // TODO: add getBookLink2
              const scriptureLink = getBookLink(scriptureText)

              const scriptureAsString =
                scripture.asString ??
                `${scripture.bookName} ${scripture.chapter}`

              const INSERT = scriptureAsString
              const newText =
                text.substring(0, currentSelectionStart) +
                INSERT +
                text.substring(currentSelectionEnd, text.length)

              if (textAreaRef.current) {
                textAreaRef.current.focus()
                textAreaRef.current.value = newText

                textAreaRef.current.setSelectionRange(
                  currentSelectionStart + 1,
                  currentSelectionStart + 1
                )
              }

              setText(newText)

              window.open(scriptureLink)
            }}
            showRecentCommands
          />
          <div className='flex items-center justify-between'>
            <div className='flex space-x-4'>
              <Link
                to='/notes'
                className='text-cb-yellow hover:text-cb-yellow/75'
              >
                <ChevronLeftIcon className='h-6 w-6' />
              </Link>
            </div>
            <div className='flex space-x-4'>
              <button
                className='text-cb-yellow hover:text-cb-yellow/75 disabled:text-cb-light-blue disabled:pointer-events-none'
                type='button'
                onClick={() => {
                  setTab('settings')
                }}
                disabled={tab === 'settings'}
              >
                <Cog6ToothIcon className='h-6 w-6' />
              </button>
              <button
                className='text-cb-yellow hover:text-cb-yellow/75 disabled:text-cb-light-blue disabled:pointer-events-none'
                type='button'
                onClick={() => {
                  setTab('default')
                }}
                disabled={tab === 'default'}
              >
                <PencilSquareIcon className='h-6 w-6' />
              </button>
              <button
                className='text-cb-yellow hover:text-cb-yellow flex w-full justify-center disabled:pointer-events-none disabled:opacity-25'
                type='button'
                onClick={async () => {
                  if (note) {
                    const [title, ...body] = text.split('\n\n')
                    const newNote = {
                      ...note,
                      id: note.id,
                      text,
                      title: title ?? '',
                      body: body.join('\n\n'),
                    }
                    await saveNote(newNote)
                    await refetch()
                  } else {
                    const [title, ...body] = text.split('\n\n')
                    const newNote = {
                      text,
                      title: title ?? '',
                      body: body.join('\n\n'),
                      list: [],
                      tags: [],
                    }
                    const id = await saveNote(newNote)
                    setText('')
                    await navigate(`/notes/${id}`)
                  }
                }}
                disabled={!canSave}
              >
                <ArrowDownOnSquareIcon className='h-6 w-6' />
              </button>
            </div>
          </div>
        </footer>
      </SignedIn>
      <Modal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title='are you sure you want to delete?'
      >
        <div className='flex space-x-4'>
          <Button
            onClick={async () => {
              if (note) {
                const id = note.id ?? undefined
                if (id) {
                  deleteNote({ id: Number(id) })
                }
                setIsConfirmModalOpen(false)
                await navigate('/notes')
              }
            }}
          >
            yes
          </Button>
          <Button
            onClick={() => {
              setIsConfirmModalOpen(false)
            }}
          >
            no
          </Button>
        </div>
      </Modal>
    </>
  )
}
