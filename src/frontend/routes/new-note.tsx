import { useRef } from 'react'
import { NavLink as Link, useNavigate, useParams } from 'react-router'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import {
  ArrowDownOnSquareIcon,
  ChevronLeftIcon,
} from '@heroicons/react/20/solid'
import { useLocalStorage } from '@uidotdev/usehooks'

import {
  saveNote,
  saveRelatedScriptureNote,
  saveScriptureNote,
} from '@/server/db/notes'
import BookSearch from '@/components/book-search'
import { transformTextToScripture } from '@/lib/books'
import { Main } from '@/components/ui'
import TopNav from '@/components/top-nav'
import useOpenScriptureUrl from '@/lib/useOpenScriptureUrl'
import useTextarea from '@/lib/useTextarea'
import Textarea from '@/components/textarea'

export default function NewNote({ noteType }: { noteType?: string }) {
  const { text: scriptureText } = useParams()
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [text, setText] = useLocalStorage('s4-new-note', '')
  const textarea = useTextarea({ text, setText })
  const { insertText } = textarea

  const readOnly = false // !user || user.username !== note?.author
  const hasChanges = text !== ''
  const canSave = !readOnly && !(!hasChanges || text === '')
  const openScriptureUrl = useOpenScriptureUrl()
  return (
    <>
      <SignedOut>
        <TopNav title='new note' />
      </SignedOut>
      <Main className='flex flex-col'>
        <div className='flex flex-grow flex-col space-y-4'>
          <SignedOut>
            <p className='px-4'>sign in to save notes</p>
          </SignedOut>
          <div className='flex flex-grow flex-col'>
            <Textarea {...textarea} />

            <footer className='bg-cb-dusty-blue sticky bottom-0 flex flex-col space-y-2 px-2 pt-2 pb-6'>
              <BookSearch
                searchRef={searchRef}
                onSelectBook={scripture => {
                  const scriptureAsString =
                    scripture.asString ??
                    `${scripture.bookName} ${scripture.chapter}`
                  insertText(scriptureAsString)

                  openScriptureUrl(scripture)
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
                  <SignedIn>
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
                        const isScriptureNote =
                          noteType === 'scripture' &&
                          scriptureText !== undefined
                        if (isScriptureNote) {
                          console.log('creating scripture note')
                        }
                        const id = await (isScriptureNote
                          ? saveScriptureNote(newNote)
                          : saveNote(newNote))
                        if (isScriptureNote && scriptureText) {
                          const scripture =
                            transformTextToScripture(scriptureText)
                          if (scripture) {
                            await saveRelatedScriptureNote({
                              noteId: id,
                              text: scriptureText,
                            })
                          }
                        }
                        setText('')
                        await navigate(
                          isScriptureNote
                            ? `/text/${scriptureText}/${id}`
                            : `/notes/${id}`
                        )
                      }}
                      disabled={!canSave}
                    >
                      <ArrowDownOnSquareIcon className='h-6 w-6' />
                    </button>
                  </SignedIn>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </Main>
    </>
  )
}
