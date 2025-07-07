import { useState, useEffect, useRef } from 'react'
import { NavLink as Link } from 'react-router'
import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import Fuse from 'fuse.js'

import { Main, Title } from '@/components/ui'
import useLocalStorage from '@/lib/useLocalStorage'
import type { HistoryEntry } from '@/lib/types'
import books, { booksAndChaptersMap } from '@/lib/books'

type Command = {
  id: string
  title: string
  subtitle?: string
  action: (args?: unknown) => void | Promise<unknown>
}

function CommandPalette({
  commands,
  placeholder = 'search commands',
  ref,
  selectedBook,
  setSelectedBook,
}: {
  commands: Command[]
  placeholder?: string
  hideLaunchButton?: boolean
  ref: React.RefObject<HTMLInputElement | null>
  selectedBook: string | null
  setSelectedBook: (selectedBook: string | null) => void
}) {
  const [query, setQuery] = useState('')

  // TODO: add option to disable this
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        ref.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeydown)
    return () => {
      window.removeEventListener('keydown', onKeydown)
    }
  }, [ref])

  const fuse = new Fuse(commands, {
    keys: ['id', 'title', { name: 'name', weight: 2 }],
  })

  const filteredCommands = !query
    ? []
    : fuse.search(query.toLowerCase()).map(({ item }) => item)
  return (
    <>
      <Combobox
        as='div'
        onChange={(command: Command) => {
          if (command?.action) {
            void command.action()
          }
        }}
        className='divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5'
        virtual={{
          options: filteredCommands,
        }}
      >
        <div className='flex items-center space-x-2 px-4'>
          <MagnifyingGlassIcon className='h-6 w-6 text-gray-500' />
          {selectedBook && (
            <div className='text-cb-pink font-semibold'>{selectedBook}</div>
          )}
          <ComboboxInput
            ref={ref}
            onChange={e => {
              setQuery(e.target.value)
            }}
            className='placholder-gray-400 h-12 w-full border-0 bg-transparent text-gray-800 focus:ring-0 focus:outline-0'
            placeholder={placeholder}
          />
        </div>
        {/* {filteredCommands.length > 0 && (
          <ComboboxOptions
            static
            className='max-h-40 overflow-y-auto py-4 text-sm'
          >
            {filteredCommands.map(command => (
              <ComboboxOption key={command.id} value={command}>
                {({ active }) => (
                  <div
                    className={`space-x-1 px-4 py-2 ${
                      active ? 'bg-indigo-600' : 'bg-white'
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        active ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {command.title}
                    </span>
                    {command.subtitle && (
                      <span
                        className={`${
                          active ? 'text-indigo-200' : 'text-gray-400'
                        }`}
                      >
                        - {command.subtitle}
                      </span>
                    )}
                  </div>
                )}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )} */}

        {/* Viritual  */}
        {filteredCommands.length > 0 && (
          <ComboboxOptions
            static
            className='max-h-40 overflow-y-auto py-4 text-sm'
          >
            {({ option: command }: { option: Command }) => (
              <ComboboxOption
                key={command.id}
                value={command}
                className='w-full'
              >
                {({ active }) => (
                  <div
                    className={`space-x-1 px-4 py-2 ${
                      active ? 'bg-indigo-600' : 'bg-white'
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        active ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {command.title}
                    </span>
                    {command.subtitle && (
                      <span
                        className={`${
                          active ? 'text-indigo-200' : 'text-gray-400'
                        }`}
                      >
                        - {command.subtitle}
                      </span>
                    )}
                  </div>
                )}
              </ComboboxOption>
            )}
          </ComboboxOptions>
        )}
        {query && filteredCommands.length === 0 && (
          <p className='p-4 text-sm text-gray-500'>no results found</p>
        )}
      </Combobox>
    </>
  )
}

export default function History() {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    's4-history',
    []
  )
  const [selectedBook, setSelectedBook] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)

  const selectBookCommands = books.map(book => ({
    id: `select-${book}`,
    title: `${book}`,
    action: () => {
      setSelectedBook(book)
    },
  }))
  const goBookCommands =
    selectedBook !== null
      ? Array.from(
          {
            length: booksAndChaptersMap[selectedBook] ?? 1,
          },
          (_, i) => i + 1
        ).map(bookChapter => {
          const verse = '001'
          const bookNumber = books.findIndex(b => b === selectedBook) + 1
          const bookName = selectedBook
          const bibleText = `${bookNumber}${String(bookChapter).padStart(3, '0')}${verse}`

          const chapterLink = `https://www.jw.org/finder?srcid=jwlshare&wtlocale=E&prefer=lang&bible=${bibleText}&pub=nwtsty`
          const bookWithChapter = `${bookName} ${bookChapter}`
          return {
            id: `go-${bookName}-${bookChapter} - ${bibleText}`,
            title: `go ${bookName} ${bookChapter} - ${bibleText}`,
            action: () => {
              setHistory([
                ...history,
                {
                  bibleText,
                  chapterLink,
                  bookChapter: bookWithChapter,
                },
              ])
              window.open(chapterLink, '_blank')
            },
          }
        })
      : []
  const allGoBookCommands = books
    .map((bookName, index) => {
      const bookNumber = index + 1
      const bookChapters = bookName ? (booksAndChaptersMap[bookName] ?? 1) : 1

      return Array.from(
        {
          length: bookChapters,
        },
        (_, i) => i + 1
      ).map(bookChapter => {
        const verse = '001'
        const bibleText = `${bookNumber}${String(bookChapter).padStart(3, '0')}${verse}`

        const chapterLink = `https://www.jw.org/finder?srcid=jwlshare&wtlocale=E&prefer=lang&bible=${bibleText}&pub=nwtsty`
        const bookWithChapter = `${bookName} ${bookChapter}`
        return {
          id: `go-${bookName}-${bookChapter} - ${bibleText}`,
          title: `${bookName} ${bookChapter}`,
          action: () => {
            setHistory([
              ...history,
              {
                bibleText,
                chapterLink,
                bookChapter: bookWithChapter,
              },
            ])
            window.open(chapterLink)
          },
        }
      })
    })
    .flat()
  const commands = [
    // ...selectBookCommands,
    // ...goBookCommands,
    ...allGoBookCommands,
  ]
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
          <CommandPalette
            commands={commands}
            placeholder='search books'
            ref={searchRef}
            selectedBook={selectedBook}
            setSelectedBook={setSelectedBook}
          />
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue flex items-center justify-between px-2 pt-2 pb-4'>
        <div className='flex space-x-4'>
          <Link to='/' className='text-cb-yellow hover:text-cb-yellow/75'>
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
