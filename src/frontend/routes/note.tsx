import { useEffect, useRef } from 'react'
import { NavLink as Link, useNavigate, useParams } from 'react-router'
import { SignedIn, useAuth } from '@clerk/nextjs'
import {
  ArrowDownOnSquareIcon,
  ChevronLeftIcon,
} from '@heroicons/react/20/solid'
import { useDebounce } from '@uidotdev/usehooks'

import { saveNote } from '@/server/db/notes'
import BookSearch from '@/components/book-search'
import { getBookLink, transformScripturetoText } from '@/lib/books'
import Textarea from '@/components/textarea'
import useTextarea from '@/lib/useTextarea'
import { api } from '@/trpc/react'

export default function Note() {
  const { id } = useParams()
  const { data: note, refetch } = api.note.get.useQuery({ id: Number(id) })
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
      }
    }
    if (isSignedIn && canSave) {
      void updateNote()
    }
  }, [debouncedText])

  return (
    <>
      <Textarea {...textarea} />
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
    </>
  )
}
