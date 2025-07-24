import { useRef } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
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
import useHistory from '@/lib/useHistory'
import Menu from '@/components/menu'
import Daily from '@/components/daily'

export default function Home() {
  const { addHistory } = useHistory()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const now = new Date()
  const today = format(now, 'yyyy/MM/dd')
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
            <Daily />
            {/* <Swordle /> */}
            {/* <Mwt /> */}
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
          <Menu />
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
