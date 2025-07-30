import { useRef } from 'react'
import { NavLink as Link, useNavigate } from 'react-router'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { Main, Title } from '@/components/ui'
import books, { transformScripturetoText } from '@/lib/books'
import BookSearch from '@/components/book-search'
import Menu from '@/components/menu'

export default function Books() {
  const searchRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>books</Title>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            <ul className='grid grid-cols-6 gap-2'>
              {books.map((bookName, index) => {
                const shortBookName = bookName.replace('.', '').slice(0, 3)
                return (
                  <li key={index} className='group'>
                    <Link
                      to={`/books/${index + 1}`}
                      className='text-cb-pink hover:text-cb-pink/75'
                    >
                      {shortBookName}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <BookSearch
              searchRef={searchRef}
              onSelectBook={async scripture => {
                const { bookNumber, chapter, verse } = scripture
                if (verse) {
                  const text = transformScripturetoText(scripture)
                  await navigate(`/text/${text}`)
                } else {
                  await navigate(`/books/${bookNumber}/${chapter}`)
                }
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
