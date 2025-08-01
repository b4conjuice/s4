import { useState } from 'react'
import { NavLink as Link } from 'react-router'
import {
  AdjustmentsHorizontalIcon,
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  ListBulletIcon,
  Squares2X2Icon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import {
  Menu as MenuRoot,
  MenuButton,
  MenuItems,
  RadioGroup,
  Field,
  Radio,
  Label,
} from '@headlessui/react'
import { format } from 'date-fns'
import { useLocalStorage } from '@uidotdev/usehooks'

import { Main, Title } from '@/components/ui'
import Modal from '@/components/modal'
import Button from '@/components/ui/button'
import books, { booksAndChaptersMap } from '@/lib/books'
import useHistory from '@/lib/useHistory'
import Menu from '@/components/menu'

type View = 'list' | 'book-chapter'
const defaultView: View = 'list'
type Filter = 'all' | 'in-history' | 'not-in-history'
const defaultFilter: Filter = 'all'

const filters: { id: Filter; text: string }[] = [
  { id: 'all', text: 'all' },
  { id: 'in-history', text: 'in history' },
  { id: 'not-in-history', text: 'not in history' },
]

export default function History() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [view, setView] = useLocalStorage<View>('s4-history-view', defaultView)
  const [filter, setFilter] = useLocalStorage<Filter>(
    's4-history-filter',
    defaultFilter
  )
  const { history, clearHistory } = useHistory()
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <div className='flex items-center justify-between'>
            <Title>history</Title>
            <button
              className='text-red-700 hover:text-red-700/75'
              type='button'
              onClick={() => {
                setIsConfirmModalOpen(true)
              }}
            >
              <TrashIcon className='h-6 w-6' />
            </button>
          </div>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            {view === 'book-chapter' ? (
              <ul className='divide-cb-dusty-blue divide-y'>
                {books
                  .filter(bookName => {
                    if (filter === 'all') {
                      return true
                    }
                    if (filter === 'in-history') {
                      return history?.some(
                        entry => entry.scripture.bookName === bookName
                      )
                    }
                    if (filter === 'not-in-history') {
                      const chapters = bookName
                        ? (booksAndChaptersMap[bookName] ?? 1)
                        : 1
                      return !Array.from(
                        {
                          length: chapters,
                        },
                        (_, i) => i + 1
                      ).every(bookChapter =>
                        history?.some(
                          entry =>
                            entry.scripture.bookName === bookName &&
                            entry.scripture.chapter === bookChapter
                        )
                      )
                    }
                    return true
                  })
                  .map((bookName, index) => {
                    const chapters = bookName
                      ? (booksAndChaptersMap[bookName] ?? 1)
                      : 1
                    return (
                      <li
                        key={index}
                        className='flex flex-col space-y-2 py-4 first:pt-0 last:pb-0'
                      >
                        <span>{bookName}</span>
                        <ul className='grid grid-cols-6 gap-2'>
                          {Array.from(
                            {
                              length: chapters,
                            },
                            (_, i) => i + 1
                          ).map((bookChapter: number) => {
                            const matchingHistoryEntry = history?.find(
                              ({ scripture }) =>
                                scripture.bookName === bookName &&
                                scripture.chapter === bookChapter
                            )
                            const url = matchingHistoryEntry?.url
                            return (
                              <li key={bookChapter}>
                                {!url ? (
                                  <span>{bookChapter}</span>
                                ) : (
                                  <Link
                                    to={url}
                                    className='text-cb-pink hover:text-cb-pink/75 py-4 group-first:pt-0'
                                  >
                                    {bookChapter}
                                  </Link>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </li>
                    )
                  })}
              </ul>
            ) : (
              <ul className='divide-cb-dusty-blue divide-y'>
                {history?.map(({ scripture, url, date }, index) => {
                  const booksUrl = scripture.verse
                    ? `/text/${scripture.text}`
                    : `/books/${scripture.bookNumber}/${scripture.chapter}`
                  return (
                    <li
                      key={index}
                      className='group flex items-center justify-between py-4 first:pt-0 last:pb-0'
                    >
                      <div>
                        <div>{scripture.asString}</div>
                        <div className='text-cb-white/50 text-sm'>
                          {format(date, 'MMM d, yyyy')}
                        </div>
                      </div>
                      <div className='flex space-x-4'>
                        <Link
                          to={booksUrl}
                          className='text-cb-pink hover:text-cb-pink/75 block truncate'
                        >
                          <BookOpenIcon className='h-6 w-6' />
                        </Link>
                        <Link
                          to={url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-cb-pink hover:text-cb-pink/75 block truncate'
                        >
                          <ArrowTopRightOnSquareIcon className='h-6 w-6' />
                        </Link>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'>
          {view === 'book-chapter' && (
            <MenuRoot>
              <MenuButton className='text-cb-yellow hover:text-cb-yellow/75'>
                <AdjustmentsHorizontalIcon className='h-6 w-6' />
              </MenuButton>
              <MenuItems
                className='text-cb-white bg-cb-dusty-blue/90 flex flex-col space-y-4 rounded p-4'
                anchor='bottom end'
              >
                <RadioGroup
                  value={filter}
                  onChange={setFilter}
                  aria-label='filter'
                  className='flex flex-col space-y-2'
                >
                  {filters.map(({ id: f, text }) => (
                    <Field key={f} className='flex items-center gap-2'>
                      <Radio
                        value={f}
                        className='group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-blue-400'
                      >
                        <span className='invisible size-2 rounded-full bg-white group-data-checked:visible' />
                      </Radio>
                      <Label>{text}</Label>
                    </Field>
                  ))}
                </RadioGroup>
              </MenuItems>
            </MenuRoot>
          )}
          <button
            className='text-cb-yellow hover:text-cb-yellow/75'
            type='button'
            onClick={() => {
              setView(view === 'list' ? 'book-chapter' : 'list')
            }}
          >
            {view === 'book-chapter' ? (
              <ListBulletIcon className='h-6 w-6' />
            ) : (
              <Squares2X2Icon className='h-6 w-6' />
            )}
          </button>
        </div>
      </footer>
      <Modal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title='are you sure you want to clear history?'
      >
        <div className='flex space-x-4'>
          <Button
            onClick={() => {
              clearHistory()
              setIsConfirmModalOpen(false)
            }}
          >
            yes
          </Button>
          <Button
            onClick={() => {
              setIsConfirmModalOpen(false)
            }}
          >
            no
          </Button>
        </div>
      </Modal>
    </>
  )
}
