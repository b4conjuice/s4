import { useRef, useState } from 'react'
import { NavLink as Link, useNavigate } from 'react-router'
import { SignedIn } from '@clerk/nextjs'
import {
  ArrowDownOnSquareIcon,
  ChevronLeftIcon,
} from '@heroicons/react/20/solid'

import { saveNote } from '@/server/db/notes'
import BookSearch from '@/components/book-search'
import { getBookLink, transformScripturetoText } from '@/lib/books'
import useLocalStorage from '@/lib/useLocalStorage'

export default function NewNote() {
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useLocalStorage('s4-new-note', '')
  const [currentSelectionStart, setCurrentSelectionStart] = useState(0)
  const [currentSelectionEnd, setCurrentSelectionEnd] = useState(0)

  const readOnly = false // !user || user.username !== note?.author
  const hasChanges = text !== ''
  const canSave = !readOnly && !(!hasChanges || text === '')
  return (
    <>
      <textarea
        className='border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-light-blue h-full w-full flex-grow focus:ring-0'
        value={text}
        onChange={e => {
          setText(e.target.value)
        }}
        onKeyUp={e => {
          const target = e.target as HTMLTextAreaElement
          const selectionStart = Number(target.selectionStart)
          const selectionEnd = Number(target.selectionEnd)
          setCurrentSelectionStart(selectionStart)
          setCurrentSelectionEnd(selectionEnd)
        }}
        onFocus={e => {
          const target = e.target as HTMLTextAreaElement
          const selectionStart = Number(target.selectionStart)
          const selectionEnd = Number(target.selectionEnd)
          setCurrentSelectionStart(selectionStart)
          setCurrentSelectionEnd(selectionEnd)
        }}
        onClick={e => {
          const target = e.target as HTMLTextAreaElement
          const selectionStart = Number(target.selectionStart)
          const selectionEnd = Number(target.selectionEnd)
          setCurrentSelectionStart(selectionStart)
          setCurrentSelectionEnd(selectionEnd)
        }}
      />
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
