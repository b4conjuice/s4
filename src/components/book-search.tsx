import { useState, useEffect, useRef } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import Fuse from 'fuse.js'

import type { Scripture } from '@/lib/types'
import books, {
  booksAndChaptersMap,
  transformScripturetoText,
  transformTextToScripture,
} from '@/lib/books'
import useHistory from '@/lib/useHistory'
import useOpenScriptureUrl from '@/lib/useOpenScriptureUrl'

type Command = {
  id: string
  title: string
  action: (args?: unknown) => void | Promise<unknown>
  bookName: string
}

const SHORTCUT_KEY = 'k'

function CommandPalette({
  commands,
  defaultCommands,
  placeholder = 'search commands',
  ref,
  createCustomCommand,
  initialQuery,
}: {
  commands: Command[]
  defaultCommands: Command[]
  placeholder?: string
  ref: React.RefObject<HTMLInputElement | null>
  createCustomCommand?: (query: string) => Command | null
  initialQuery?: string
}) {
  const [query, setQuery] = useState(initialQuery ?? '')
  useEffect(() => {
    setQuery(initialQuery ?? '')
  }, [initialQuery])

  // TODO: add option to disable this
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === SHORTCUT_KEY && (e.metaKey || e.ctrlKey)) {
        ref.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeydown)
    return () => {
      window.removeEventListener('keydown', onKeydown)
    }
  }, [ref])

  const fuse = new Fuse(commands, {
    keys: ['bookName', 'id', 'title'],
  })

  const customCommand =
    createCustomCommand && query !== '' ? createCustomCommand(query) : null
  const filteredCommands = [
    ...(query.length > 0 && customCommand ? [customCommand] : []),
    ...(!query
      ? defaultCommands
      : fuse.search(query.toLowerCase()).map(({ item }) => item)),
  ]
  return (
    <>
      <Combobox
        as='div'
        onChange={(command: Command) => {
          if (command?.action) {
            void command.action()
          }
        }}
        className='divide-cb-dusty-blue bg-cb-blue ring-cb-blue focus-within:ring-cb-light-blue divide-y overflow-hidden rounded-xl shadow-2xl ring-1'
        virtual={{
          options: filteredCommands,
        }}
        immediate
      >
        {({ activeOption }) => (
          <>
            <div className='flex items-center space-x-2 px-4'>
              <MagnifyingGlassIcon className='text-cb-yellow h-6 w-6' />
              <ComboboxInput
                ref={ref}
                value={query}
                onChange={e => {
                  setQuery(e.target.value)
                }}
                className='placeholder-cb-yellow/75 h-12 w-full border-0 bg-transparent focus:ring-0 focus:outline-0'
                placeholder={placeholder}
                onKeyDown={e => {
                  if (e.key === 'Tab' && query.length > 0) {
                    e.preventDefault()
                    if (activeOption) {
                      const title = (activeOption as Command).title
                      setQuery(title)
                    }
                  }
                }}
              />
            </div>

            <ComboboxOptions className='max-h-40 overflow-y-auto pt-[1px] text-sm not-empty:pt-0 empty:invisible'>
              {({ option: command }: { option: Command }) => (
                <ComboboxOption
                  value={command}
                  className='data-focus:bg-sword-purple data-focus:text-cb-yellow w-full'
                >
                  <div className='flex items-center space-x-1 px-4 py-2'>
                    <div className='flex-grow'>
                      <span className='font-medium'>{command.title}</span>
                    </div>
                  </div>
                </ComboboxOption>
              )}
            </ComboboxOptions>
            {query && filteredCommands.length === 0 && (
              <p className='p-4 text-sm text-gray-500'>no results found</p>
            )}
          </>
        )}
      </Combobox>
    </>
  )
}

const RECENT_COMMANDS_COUNT = 25
const UNIQUE_RECENT_COMMANDS_COUNT = 10

export default function BookSearch({
  searchRef: initialSearchRef,
  showRecentCommands,
  defaultCommands = [],
  onSelectBook: initialOnSelectBook,
  initialQuery,
  disableAddToHistory,
}: {
  searchRef?: React.RefObject<HTMLInputElement | null>
  showRecentCommands?: boolean
  defaultCommands?: Command[]
  onSelectBook?: (scripture: Scripture) => void
  initialQuery?: string
  disableAddToHistory?: boolean
}) {
  const openScriptureUrl = useOpenScriptureUrl()
  const onSelectBook = initialOnSelectBook ?? openScriptureUrl
  const internalSearchRef = useRef<HTMLInputElement | null>(null)
  const searchRef = initialSearchRef ?? internalSearchRef
  const { history, addHistory } = useHistory()

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
        const scripture: Scripture = {
          bookName: bookName,
          bookNumber: bookNumber,
          chapter: bookChapter,
        }
        const text = transformScripturetoText(scripture)
        return {
          id: `go-${text}`,
          title: `${bookName} ${bookChapter}`,
          action: async () => {
            if (!disableAddToHistory) {
              addHistory(scripture)
            }
            if (onSelectBook) {
              onSelectBook(scripture)
            }
          },
          bookName: scripture.bookName,
        }
      })
    })
    .flat()

  const createCustomCommand = (query: string) => {
    const text = transformScripturetoText(query)
    if (text === '') {
      return null
    }
    const scripture = transformTextToScripture(text)
    if (scripture === '') {
      return null
    }
    const customCommand: Command = {
      id: `custom-go-${text}`,
      title: scripture.asString ?? '',
      action: async () => {
        if (!disableAddToHistory) {
          addHistory(scripture)
        }
        if (onSelectBook) {
          onSelectBook(scripture)
        }
      },
      bookName: scripture.bookName,
    }
    return customCommand
  }

  const recentCommands =
    history?.slice(0, RECENT_COMMANDS_COUNT).map(({ scripture }) => ({
      id: `go-${scripture.text}`,
      title: `${scripture.asString}`,
      action: () => {
        if (onSelectBook) {
          onSelectBook(scripture)
        }
      },
      bookName: scripture.bookName,
    })) ?? []

  const seenIds = new Set()
  const uniqueRecentCommands = [] // recent history may have duplicates

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
            ? [
                ...defaultCommands,
                ...uniqueRecentCommands.slice(0, UNIQUE_RECENT_COMMANDS_COUNT),
              ]
            : [...defaultCommands]
        }
        placeholder='search books'
        ref={searchRef}
        createCustomCommand={createCustomCommand}
        initialQuery={initialQuery}
      />
    </>
  )
}
