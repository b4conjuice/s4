import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import Fuse from 'fuse.js'

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
  defaultCommands,
  placeholder = 'search commands',
  ref,
}: {
  commands: Command[]
  defaultCommands: Command[]
  placeholder?: string
  ref: React.RefObject<HTMLInputElement | null>
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
    ? defaultCommands
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
        className='bg-cb-white divide-y divide-gray-100 overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/5'
        virtual={{
          options: filteredCommands,
        }}
        immediate
      >
        <div className='flex items-center space-x-2 px-4'>
          <MagnifyingGlassIcon className='h-6 w-6 text-gray-500' />
          <ComboboxInput
            ref={ref}
            onChange={e => {
              setQuery(e.target.value)
            }}
            className='placholder-gray-400 h-12 w-full border-0 bg-transparent text-gray-800 focus:ring-0 focus:outline-0'
            placeholder={placeholder}
          />
        </div>

        <ComboboxOptions className='max-h-40 overflow-y-auto py-4 text-sm empty:invisible'>
          {({ option: command }: { option: Command }) => (
            <ComboboxOption value={command} className='w-full'>
              {({ active }) => (
                <div
                  className={`space-x-1 px-4 py-2 ${
                    active ? 'bg-sword-purple' : 'bg-cb-white'
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
        {query && filteredCommands.length === 0 && (
          <p className='p-4 text-sm text-gray-500'>no results found</p>
        )}
      </Combobox>
    </>
  )
}

export default function BookSearch({
  searchRef,
  showRecentCommands,
  defaultCommands = [],
}: {
  searchRef: React.RefObject<HTMLInputElement | null>
  showRecentCommands?: boolean
  defaultCommands?: Command[]
}) {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    's4-history',
    []
  )

  const commands = books
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
          id: `go-${bibleText}`,
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

  const recentCommands =
    history?.slice(-3).map(({ bibleText, chapterLink, bookChapter }) => ({
      id: `go-${bibleText}`,
      title: `${bookChapter}`,
      action: () => {
        setHistory([
          ...history,
          {
            bibleText,
            chapterLink,
            bookChapter,
          },
        ])
        window.open(chapterLink)
      },
    })) ?? []

  const seenIds = new Set()
  const uniqueRecentCommands = []

  for (const obj of recentCommands) {
    const id = obj.id
    if (!seenIds.has(id)) {
      seenIds.add(id)
      uniqueRecentCommands.push(obj)
    }
  }

  return (
    <>
      <CommandPalette
        commands={commands}
        defaultCommands={
          showRecentCommands
            ? [...defaultCommands, ...uniqueRecentCommands]
            : [...defaultCommands]
        }
        placeholder='search books'
        ref={searchRef}
      />
    </>
  )
}
