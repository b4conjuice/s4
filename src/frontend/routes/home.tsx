import { useRef } from 'react'
import { NavLink as Link } from 'react-router'
import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { format } from 'date-fns'

import Swordle from '@/components/swordle'
import Mwt from '@/components/mwt'
import Sword from '@/components/sword'
import { Main, Title } from '@/components/ui'
import BookSearch from '@/components/book-search'
import { api } from '@/trpc/react'
import { getBookLink, transformScripturetoText } from '@/lib/books'

export default function Home() {
  const searchRef = useRef<HTMLInputElement | null>(null)
  const now = new Date()
  const today = format(now, 'yyyy-MM-dd')
  const { data: dtData } = api.sword.dt.useQuery({ date: today })
  const defaultCommands = []
  if (dtData !== undefined) {
    const scripture = dtData.scripture ?? 'dailyText'
    const bibleText = transformScripturetoText(scripture)
    defaultCommands.push({
      id: 'dailyText',
      title: `DT: ${scripture}`,
      action: () => {
        const bookLink = getBookLink(bibleText)
        window.open(bookLink)
      },
    })
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
            />
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue flex items-center justify-between px-2 pt-2 pb-4'>
        <div className='flex space-x-4'>
          <Link
            to='/history'
            className='text-cb-yellow hover:text-cb-yellow/75'
          >
            <ChevronLeftIcon className='h-6 w-6' />
          </Link>
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
    </>
  )
}
