import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import {
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/solid'
import { format } from 'date-fns/format'
import { subDays } from 'date-fns/subDays'
import { toast } from 'react-toastify'

import Title from '@/components/ui/title'
import Modal from '@/components/modal'
import Button from '@/components/ui/button'
import books, { bookIndex, booksAndChaptersMap } from '@/lib/books'
import useLocalStorage from '@/lib/useLocalStorage'
import copyToClipboard from '@/lib/copyToClipboard'
import { api } from '@/trpc/react'

type Statistics = {
  streak: number
  maxStreak: number
  total: number
}

const DailyTextButton = ({
  scripture,
  today,
  yesterday,
  streak,
  setStreak,
  maxStreak,
  setMaxStreak,
  total,
  setTotal,
  lastRead,
  setLastRead,
  bookAndChapter: savedBookAndChapter,
  readToday,
}: {
  scripture: string
  today: string
  yesterday: string
  streak: number
  setStreak: (streak: number) => void
  maxStreak: number
  setMaxStreak: (maxStreak: number) => void
  total: number
  setTotal: (total: number) => void
  lastRead: string | null
  setLastRead: (lastRead: string) => void
  bookAndChapter: string | undefined
  readToday: boolean
}) => {
  const [bookAndChapter] = scripture
    ? scripture.split(':')
    : [savedBookAndChapter]
  const [book, chapter] = (bookAndChapter ?? '').split(' ')
  const bookNumber = bookIndex(book ?? '')
  const bibleText = `${bookNumber}${(chapter ?? '').padStart(3, '0')}001`

  const chapterLink = `https://www.jw.org/finder?srcid=jwlshare&wtlocale=E&prefer=lang&bible=${bibleText}&pub=nwtsty`
  return (
    <a
      className='bg-cb-dark-blue group w-full cursor-pointer rounded-lg border-none text-center text-lg'
      href={chapterLink}
      target='_blank'
      rel='noopener noreferrer'
      onClick={() => {
        if (!readToday) {
          setTotal(total + 1)
          const readYesterday = lastRead === yesterday
          setLastRead(today)

          if (readYesterday) {
            const currentStreak = streak + 1
            setStreak(currentStreak)
            if (currentStreak > maxStreak) {
              setMaxStreak(currentStreak)
            }
          } else {
            setStreak(1)
          }
        }
      }}
    >
      <span
        className={`block translate-y-[-4px] transform rounded-lg bg-[#5a3e84] p-3 text-lg duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms] hover:ease-[cubic-bezier(.3,.7,.4,1.5)] ${
          readToday ? 'text-cb-yellow' : 'text-gray-100'
        }`}
      >
        read chapter: {bookAndChapter}
        {readToday ? ' again' : ''}
      </span>
    </a>
  )
}

const getNextSequence = (sequence: string) => {
  const [bookNumberAsString, chapterAsString] = sequence.split(':')
  const bookNumber = Number(bookNumberAsString)
  const chapter = Number(chapterAsString)
  const bookNumberIndex = bookNumber - 1
  const bookName = books[bookNumberIndex]
  const chapters = bookName ? booksAndChaptersMap[bookName] : 1
  const nextChapter = chapters && chapter >= chapters ? 1 : chapter + 1
  const nextBookNumber =
    chapters && chapter >= chapters
      ? (bookNumber + 1) % books.length
      : bookNumber
  const next = `${nextBookNumber}:${nextChapter}`
  return next
}
const getPrevSequence = (sequence: string) => {
  const [bookNumberAsString, chapterAsString] = sequence.split(':')
  const bookNumber = Number(bookNumberAsString)
  const chapter = Number(chapterAsString)
  const prevBookNumberIndex = bookNumber - 2
  const prevBookName = books[prevBookNumberIndex]
  const prevChapters = prevBookName ? booksAndChaptersMap[prevBookName] : 1
  const prevChapter = chapter === 1 ? prevChapters : chapter - 1
  const prevBookNumber = chapter === 1 ? bookNumber - 1 : bookNumber
  const prev =
    prevBookNumber === 0 ? `66:22` : `${prevBookNumber}:${prevChapter}`
  return prev
}

const SequentialButton = ({
  today,
  yesterday,
  streak,
  setStreak,
  maxStreak,
  setMaxStreak,
  total,
  setTotal,
  lastRead,
  setLastRead,
  readToday,
  sequence,
  setSequence,
}: {
  today: string
  yesterday: string
  streak: number
  setStreak: (streak: number) => void
  maxStreak: number
  setMaxStreak: (maxStreak: number) => void
  total: number
  setTotal: (total: number) => void
  lastRead: string | null
  setLastRead: (lastRead: string) => void
  readToday: boolean
  sequence: string
  setSequence: (sequence: string) => void
}) => {
  const prevSequence = getPrevSequence(sequence)
  const [bookNumber, chapter] = (readToday ? prevSequence : sequence).split(':')
  const bibleText = `${bookNumber}${(chapter ?? '').padStart(3, '0')}001`
  const bookAndChapter = `${books[Number(bookNumber) - 1]} ${chapter}`

  const chapterLink = `https://www.jw.org/finder?srcid=jwlshare&wtlocale=E&prefer=lang&bible=${bibleText}&pub=nwtsty`
  return (
    <a
      className='bg-cb-dark-blue group w-full cursor-pointer rounded-lg border-none text-center text-lg'
      href={chapterLink}
      target='_blank'
      rel='noopener noreferrer'
      onClick={() => {
        if (!readToday) {
          setSequence(getNextSequence(sequence))
          setTotal(total + 1)
          const readYesterday = lastRead === yesterday
          setLastRead(today)

          if (readYesterday) {
            const currentStreak = streak + 1
            setStreak(currentStreak)
            if (currentStreak > maxStreak) {
              setMaxStreak(currentStreak)
            }
          } else {
            setStreak(1)
          }
        }
      }}
    >
      <span
        className={`block translate-y-[-4px] transform rounded-lg bg-[#4a6da7] p-3 text-lg duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms] hover:ease-[cubic-bezier(.3,.7,.4,1.5)] ${
          readToday ? 'text-cb-yellow' : 'text-gray-100'
        }`}
      >
        read chapter: {bookAndChapter}
        {readToday ? ' again' : ''}
      </span>
    </a>
  )
}

const statisticsLabels = {
  total: 'total',
  streak: 'current streak',
  maxStreak: 'max streak',
}

type StasticsType = Record<string, number>

const Statistics = ({
  statistics,
  isOpen,
  setIsOpen,
}: {
  statistics: StasticsType
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title='statistics'>
      <div className='grid grid-cols-3'>
        {Object.entries(statisticsLabels).map(([key, label]) => (
          <div key={key}>
            <div className='text-cb-pink text-center text-4xl'>
              {statistics[key]}
            </div>
            <div className='text-cb-light-blue text-center'>{label}</div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

const buttonTypes = [
  { id: 'dailyText', text: 'Daily Text' },
  { id: 'sequential', text: 'Gen-Rev' },
]

const Home = () => {
  const now = new Date()
  const today = format(now, 'yyyy-MM-dd')
  const yesterday = format(subDays(now, 1), 'yyyy-MM-dd')
  const { data } = api.sword.dt.useQuery({ date: today })
  const [streak, setStreak] = useLocalStorage('swordle-streak', 0)
  const [maxStreak, setMaxStreak] = useLocalStorage('swordle-maxStreak', 0)
  const [total, setTotal] = useLocalStorage('swordle-total', 0)
  const [lastRead, setLastRead] = useLocalStorage<string | null>(
    'swordle-lastRead',
    null
  )
  const [bookAndChapter, setBookAndChapter] = useLocalStorage<
    string | undefined
  >('swordle-bookAndChapter', undefined)
  const [buttonType, setButtonType] = useLocalStorage(
    'swordle-buttonType',
    'sequential'
  )
  const [sequence, setSequence] = useLocalStorage('swordle-sequence', '1:1')

  useEffect(() => {
    if (data?.scripture) {
      const [latestBookAndChapter] = data.scripture.split(':')
      if (latestBookAndChapter !== bookAndChapter) {
        setBookAndChapter(latestBookAndChapter)
      }
    }
  }, [data, bookAndChapter, setBookAndChapter])
  const readToday = lastRead === today
  const [isOpen, setIsOpen] = useState(readToday || false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [importText, setImportText] = useState('')
  useEffect(() => {
    setIsOpen(readToday)
  }, [readToday])

  const sequenceBookName = sequence
    ? books[Number(sequence.split(':')[0]) - 1]
    : undefined
  const sequenceChapters = sequenceBookName
    ? (booksAndChaptersMap[sequenceBookName] ?? 1)
    : 1
  return (
    <div className='flex flex-col'>
      <div className='flex justify-end space-x-4'>
        <button type='button' onClick={() => setIsExportDialogOpen(true)}>
          <ArrowUpTrayIcon className='h-6 w-6' />
        </button>
        <button type='button' onClick={() => setIsOpen(true)}>
          <ChartBarIcon className='h-6 w-6' />
        </button>
        <button type='button' onClick={() => setIsSettingsDialogOpen(true)}>
          <Cog6ToothIcon className='h-6 w-6' />
        </button>
      </div>
      <div className='flex flex-grow flex-col items-center justify-center space-y-4'>
        <Title>swordle</Title>
        {(data ?? bookAndChapter) &&
          (buttonType === 'dailyText' ? (
            <DailyTextButton
              scripture={data?.scripture ?? ''}
              today={today}
              yesterday={yesterday}
              streak={streak}
              setStreak={setStreak}
              maxStreak={maxStreak}
              setMaxStreak={setMaxStreak}
              total={total}
              setTotal={setTotal}
              lastRead={lastRead}
              setLastRead={setLastRead}
              bookAndChapter={bookAndChapter}
              readToday={readToday}
            />
          ) : (
            <SequentialButton
              {...data}
              today={today}
              yesterday={yesterday}
              streak={streak}
              setStreak={setStreak}
              maxStreak={maxStreak}
              setMaxStreak={setMaxStreak}
              total={total}
              setTotal={setTotal}
              lastRead={lastRead}
              setLastRead={setLastRead}
              readToday={readToday}
              sequence={sequence}
              setSequence={setSequence}
            />
          ))}
        <Statistics
          statistics={{
            streak,
            maxStreak,
            total,
          }}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <Modal
          isOpen={isSettingsDialogOpen}
          setIsOpen={setIsSettingsDialogOpen}
          title='settings'
        >
          <Button href='/lookup' className='block' internal>
            lookup
          </Button>
          <Button href='/sword' className='block' internal>
            sword
          </Button>
          <select
            className='bg-cobalt w-full p-4'
            value={buttonType}
            onChange={e => {
              setButtonType(e.target.value)
            }}
          >
            {buttonTypes.map(bType => (
              <option key={bType.id} value={bType.id}>
                {bType.text}
              </option>
            ))}
          </select>

          {buttonType === 'sequential' && (
            <div className='flex'>
              <select
                className='bg-cobalt w-full p-4'
                value={sequence?.split(':')[0]}
                onChange={e => {
                  const [, chapter] = sequence.split(':')
                  const newSequence = `${e.target.value}:${chapter}`
                  setSequence(newSequence)
                }}
              >
                {books.map((book, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {book}
                  </option>
                ))}
              </select>
              <select
                className='bg-cobalt w-full p-4'
                value={sequence?.split(':')[1]}
                onChange={e => {
                  const [bookNumber] = sequence.split(':')
                  const newSequence = `${bookNumber}:${e.target.value}`
                  setSequence(newSequence)
                }}
              >
                {Array.from(
                  {
                    length: sequenceChapters,
                  },
                  (_, i) => i + 1
                ).map(ch => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Modal>
        <Modal
          isOpen={isExportDialogOpen}
          setIsOpen={setIsExportDialogOpen}
          title='import/export statistics'
        >
          <Button
            onClick={() => {
              copyToClipboard(
                btoa(
                  JSON.stringify({
                    streak,
                    maxStreak,
                    total,
                  })
                )
              )
              toast.success('copied export code to clipboard')
            }}
          >
            export
          </Button>
          <hr className='border-cb-white/25' />
          <textarea
            className='bg-cobalt w-full p-4'
            value={importText}
            onChange={e => {
              setImportText(e.target.value)
            }}
          />
          <Button
            onClick={() => {
              const statistics = JSON.parse(atob(importText)) as Statistics
              const {
                streak: importedStreak,
                maxStreak: importedMaxStreak,
                total: importedTotal,
              } = statistics
              setStreak(importedStreak ?? streak)
              setMaxStreak(importedMaxStreak ?? maxStreak)
              setTotal(importedTotal ?? total)
              toast.success('updated statistics')
              setImportText('')
            }}
            disabled={!importText}
            className='disabled:pointer-events-none disabled:opacity-25'
          >
            import
          </Button>
        </Modal>
      </div>
    </div>
  )
}

export default Home
