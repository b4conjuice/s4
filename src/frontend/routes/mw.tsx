import { useState } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'
import {
  ArrowTopRightOnSquareIcon,
  Cog6ToothIcon,
} from '@heroicons/react/20/solid'

import Textarea from '@/components/textarea'
import useTextarea from '@/lib/useTextarea'
import Menu from '@/components/menu'
import { MWLink } from '@/components/mwt-links'
import Modal from '@/components/modal'
import SelectNote from '@/components/select-note'
import { api } from '@/trpc/react'

export default function MWPage() {
  const [isSelectNoteModalOpen, setIsSelectNoteModalOpen] = useState(false)
  const [mwNoteId, setMwNoteId] = useLocalStorage<number | null>(
    's4-mw-note-id',
    null
  )
  // const { data: mwNote } = api.note.get.useQuery({ id: mwNoteId ?? undefined })

  const [text, setText] = useLocalStorage('s4-mw-text', '')
  // const textarea = useTextarea({
  //   text: mwNoteId !== null ? text : mwNote?.text,
  //   setText,
  // })
  const textarea = useTextarea({ text, setText })
  return (
    <>
      <main className='flex grow flex-col'>
        <Textarea {...textarea} textareaProps={{ placeholder: 'mw' }} />
      </main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:text-cb-light-blue disabled:pointer-events-none'
            type='button'
            onClick={() => {
              setIsSelectNoteModalOpen(true)
            }}
          >
            <Cog6ToothIcon className='h-6 w-6' />
          </button>
          <MWLink className='text-cb-yellow hover:text-cb-yellow/75'>
            <ArrowTopRightOnSquareIcon className='h-6 w-6' />
          </MWLink>
        </div>
      </footer>
      <Modal
        isOpen={isSelectNoteModalOpen}
        setIsOpen={setIsSelectNoteModalOpen}
      >
        <SelectNote
          onNoteSelect={note => {
            if (note.id !== undefined) {
              setMwNoteId(note.id)
              setIsSelectNoteModalOpen(false)
            }
          }}
        />
      </Modal>
    </>
  )
}
