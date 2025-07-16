import { useRef, useState } from 'react'
import { NavLink as Link } from 'react-router'
import { Bars2Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { format } from 'date-fns'

import Swordle from '@/components/swordle'
import Mwt from '@/components/mwt'
import Sword from '@/components/sword'
import { Main, Title } from '@/components/ui'
import BookSearch from '@/components/book-search'
import { api } from '@/trpc/react'
import {
  getBookLink,
  transformScripturetoText,
  transformTextToScripture,
} from '@/lib/books'
import Modal from '@/components/modal'
import useHistory from '@/lib/useHistory'

export default function Home() {
  const { addHistory } = useHistory()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const now = new Date()
  const today = format(now, 'yyyy-MM-dd')
  const { data: dtData } = api.sword.dt.useQuery({ date: today })
  const defaultCommands = []
  if (dtData !== undefined) {
    const dailyText = dtData.scripture ?? 'dailyText'
    const bibleText = transformScripturetoText(dailyText)
    const scripture = transformTextToScripture(bibleText)
    if (scripture !== '') {
      defaultCommands.push({
        id: 'dailyText',
        title: `DT: ${dailyText}`,
        action: () => {
          const bookLink = getBookLink(bibleText)
          addHistory(scripture)
          window.open(bookLink)
        },
      })
    }
  }
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>s4 ⚔️</Title>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            <Swordle />
            <Mwt />
            {/* <Sword /> */}
            <BookSearch
              searchRef={searchRef}
              defaultCommands={defaultCommands}
              onSelectBook={scripture => {
                const text = transformScripturetoText(scripture)
                const chapterLink = getBookLink(text)
                window.open(chapterLink)
              }}
            />
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <button
            type='button'
            className='text-cb-yellow hover:text-cb-yellow/75'
            onClick={() => {
              setIsMenuOpen(true)
            }}
          >
            <Bars2Icon className='h-6 w-6' />
          </button>
        </div>
        <div className='flex space-x-4'>
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
      <Modal isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
        <ul className='divide-cb-dusty-blue flex flex-col space-y-4 divide-y'>
          <li>
            <Link to='/history' className='text-cb-pink hover:text-cb-pink/75'>
              history
            </Link>
          </li>
          <li>
            <Link to='/books' className='text-cb-pink hover:text-cb-pink/75'>
              books
            </Link>
          </li>
        </ul>
      </Modal>
    </>
  )
}
