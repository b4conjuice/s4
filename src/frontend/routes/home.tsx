import { PencilSquareIcon } from '@heroicons/react/20/solid'
import { format } from 'date-fns'
import {
  Menu as MenuRoot,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { NavLink as Link } from 'react-router'

import Swordle from '@/components/swordle'
import Mwt from '@/components/mwt'
import Sword from '@/components/sword'
import { Main, Title } from '@/components/ui'
import BookSearch from '@/components/book-search'
import { api } from '@/trpc/react'
import { transformScripturetoText, transformTextToScripture } from '@/lib/books'
import useHistory from '@/lib/useHistory'
import Menu from '@/components/menu'
import Daily from '@/components/daily'
import useOpenScriptureUrl from '@/lib/useOpenScriptureUrl'

export default function Home() {
  const { addHistory } = useHistory()
  const openScriptureUrl = useOpenScriptureUrl()
  const now = new Date()
  const today = format(now, 'yyyy/MM/dd')
  const { data: dtData } = api.sword.dt.useQuery({ date: today })
  const defaultCommands = []
  if (dtData?.scripture) {
    const dailyText = dtData.scripture
    const text = transformScripturetoText(dailyText)
    const scripture = transformTextToScripture(text)
    if (scripture !== '') {
      defaultCommands.push({
        id: 'dailyText',
        title: `DT: ${dailyText}`,
        action: () => {
          openScriptureUrl(scripture)
          addHistory(scripture)
        },
        bookName: scripture.bookName,
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
            <BookSearch defaultCommands={defaultCommands} />
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'>
          <MenuRoot>
            <MenuButton className='text-cb-yellow hover:text-cb-yellow/75'>
              <PencilSquareIcon className='h-6 w-6' />
            </MenuButton>
            <MenuItems
              className='bg-cb-dusty-blue/90 flex flex-col space-y-4 rounded p-4'
              anchor='bottom end'
            >
              <MenuItem>
                <Link
                  to='/notes/new'
                  className='text-cb-pink hover:text-cb-pink/75'
                >
                  new note
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to='/text' className='text-cb-pink hover:text-cb-pink/75'>
                  new scripture note
                </Link>
              </MenuItem>
            </MenuItems>
          </MenuRoot>
        </div>
      </footer>
    </>
  )
}
