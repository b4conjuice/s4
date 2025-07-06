import { useRef } from 'react'
import { NavLink as Link } from 'react-router'
import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import Swordle from '@/components/swordle'
import Mwt from '@/components/mwt'
import Sword from '@/components/sword'
import { Main, Title } from '@/components/ui'
import BookSearch from '@/components/book-search'

export default function Home() {
  const searchRef = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>s4 ⚔️</Title>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            <Swordle />
            <Mwt />
            {/* <Sword /> */}
            <BookSearch searchRef={searchRef} />
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
