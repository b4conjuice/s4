import { useRef, useState } from 'react'
import { NavLink as Link } from 'react-router'
import {
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'

import { Main, Title } from '@/components/ui'
import BookSearch from '@/components/book-search'
import Modal from '@/components/modal'
import Button from '@/components/ui/button'
import { openBookLink } from '@/lib/books'
import useHistory from '@/lib/useHistory'

export default function History() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const { history, clear } = useHistory()
  const searchRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>history ⚔️</Title>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            <ul className='divide-cb-dusty-blue divide-y overflow-y-auto'>
              {history?.map(({ chapterLink, bookChapter }, index) => (
                <li key={index} className='py-4'>
                  <Link
                    to={chapterLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-cb-pink hover:text-cb-pink/75 truncate'
                  >
                    {bookChapter}
                  </Link>
                </li>
              ))}
            </ul>
            <BookSearch searchRef={searchRef} onSelectBook={openBookLink} />
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Link to='/' className='text-cb-yellow hover:text-cb-yellow/75'>
            <ChevronLeftIcon className='h-6 w-6' />
          </Link>
        </div>
        <div className='flex space-x-4'>
          <button
            className='text-red-700 hover:text-red-700/75'
            type='button'
            onClick={() => {
              setIsConfirmModalOpen(true)
            }}
          >
            <TrashIcon className='h-6 w-6' />
          </button>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75'
            type='button'
            onClick={() => {
              searchRef?.current?.focus()
            }}
          >
            <MagnifyingGlassIcon className='h-6 w-6' />
          </button>
        </div>
      </footer>
      <Modal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title='are you sure you want to clear history?'
      >
        <div className='flex space-x-4'>
          <Button
            onClick={() => {
              clear()
              setIsConfirmModalOpen(false)
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
