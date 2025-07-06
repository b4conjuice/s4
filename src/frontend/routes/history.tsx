import { NavLink as Link } from 'react-router'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'

import { Main, Title } from '@/components/ui'
import useLocalStorage from '@/lib/useLocalStorage'
import type { HistoryEntry } from '@/lib/types'

export default function History() {
  const [history] = useLocalStorage<HistoryEntry[]>('sword-history', [])
  console.log({ history })
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>history ⚔️</Title>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            <ul className='divide-cb-dusty-blue divide-y'>
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
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue flex items-center justify-between px-2 pt-2 pb-4'>
        <div className='flex space-x-4'>
          <Link to='/' className='text-cb-yellow hover:text-cb-yellow/75'>
            <ChevronLeftIcon className='h-6 w-6' />
          </Link>
        </div>
        <div className='flex space-x-4'></div>
      </footer>
    </>
  )
}
