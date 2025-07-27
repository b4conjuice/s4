import { useState, type Dispatch, type SetStateAction } from 'react'
import {
  ArrowUpTrayIcon,
  CalendarIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudArrowDownIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/20/solid'
import { add, addDays, format, getDay, isToday, subDays } from 'date-fns'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { toast } from 'react-toastify'

import books, {
  booksAndChaptersMap,
  getBookLink,
  transformScripturetoText,
  transformTextToScripture,
} from '@/lib/books'
import Modal from '@/components/modal'
import { api } from '@/trpc/react'
import useLocalStorage from '@/lib/useLocalStorage'
import Button from '@/components/ui/button'

type StreakInfo = {
  streak: number
  maxStreak: number
  total: number
  lastRead: string | null
  bookAndChapter: string | undefined
  buttonType: 'sequential' | 'dailyText'
  sequence: string
}

const incrementStreak = ({
  streakInfo,
  setStreakInfo,
}: {
  streakInfo: StreakInfo
  setStreakInfo: Dispatch<SetStateAction<StreakInfo | undefined>>
}) => {
  const { streak, total, lastRead } = streakInfo
  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
  const readToday = lastRead === today
  if (!readToday) {
    const newStreakInfo = { ...streakInfo }
    newStreakInfo.total = total + 1
    const readYesterday = lastRead === yesterday
    newStreakInfo.lastRead = today
    if (readYesterday) {
      newStreakInfo.streak = streak + 1
      if (newStreakInfo.streak > newStreakInfo.maxStreak) {
        newStreakInfo.maxStreak = newStreakInfo.streak
      }
    } else {
      newStreakInfo.streak = 1
    }
    setStreakInfo(newStreakInfo)
  }
}

function DTButton({
  now,
  streakInfo,
  setStreakInfo,
}: {
  now: Date
  streakInfo: StreakInfo
  setStreakInfo: Dispatch<SetStateAction<StreakInfo | undefined>>
}) {
  const lastRead = streakInfo?.lastRead ?? null
  const today = format(new Date(), 'yyyy-MM-dd')
  const readToday = lastRead === today
  const url = `https://www.jw.org/finder?srcid=jwlshare&wtlocale=E&prefer=lang&alias=daily-text&date=${format(now, 'yyyyMMdd')}`
  const dateString = format(now, 'M.d.yy')
  return (
    <>
      <a
        className='bg-cb-dark-blue group w-full cursor-pointer rounded-lg border-none text-center text-lg'
        href={url}
        target='_blank'
        onClick={() => {
          incrementStreak({ streakInfo, setStreakInfo })
        }}
      >
        <span
          className={`bg-sword-purple block translate-y-[-4px] transform rounded-lg p-3 text-lg duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms] hover:ease-[cubic-bezier(.3,.7,.4,1.5)] ${
            readToday ? 'text-cb-yellow' : 'text-gray-100'
          }`}
        >
          open daily text for {dateString}
          {readToday ? ' again' : ''}
        </span>
      </a>
    </>
  )
}

function SkeletonButton({ children }: { children: React.ReactNode }) {
  return (
    <span className='bg-cb-dark-blue group w-full flex-5/6 rounded-lg border-none text-center text-lg'>
      <span className='bg-sword-purple block translate-y-[-4px] transform animate-pulse rounded-lg p-3 text-lg text-gray-100 duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)]'>
        <span className='invisible'>{children}</span>
      </span>
    </span>
  )
}

function DTChapterButton({
  now,
  streakInfo,
  setStreakInfo,
}: {
  now: Date
  streakInfo: StreakInfo
  setStreakInfo: Dispatch<SetStateAction<StreakInfo | undefined>>
}) {
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const [showButton, setShowButton] = useState(false)
  const { data, isLoading } = api.sword.dt.useQuery({
    date: format(now, 'yyyy/MM/dd'),
  })
  if (!showButton) {
    return (
      <div className='flex gap-4'>
        <div className='flex-5/6'>
          <DTButton
            now={now}
            streakInfo={streakInfo}
            setStreakInfo={setStreakInfo}
          />
        </div>
        <Button
          onClick={() => {
            setShowButton(true)
          }}
          className='flex-1/6'
        >
          <CloudArrowDownIcon className='mx-auto h-6 w-6' />
        </Button>
      </div>
    )
  }
  if (isLoading || !data) {
    return (
      <>
        <div className='flex gap-4'>
          <SkeletonButton>read daily text</SkeletonButton>
          <Button
            onClick={async () => {
              await copyToClipboard(dailyText)
              toast.success('copied daily text')
            }}
            className='flex-1/6 disabled:pointer-events-none disabled:opacity-25'
            disabled={isLoading}
          >
            <DocumentDuplicateIcon className='mx-auto h-6 w-6' />
          </Button>
        </div>
      </>
    )
  }
  const dailyText = data.dailyText
  const dailyTextScripture = data.scripture
  const text = transformScripturetoText(dailyTextScripture)
  const scripture = transformTextToScripture(text)
  const url = getBookLink(text)
  const bookAndChapter = scripture ? scripture.asString : ''
  const lastRead = streakInfo?.lastRead ?? null
  const today = format(new Date(), 'yyyy-MM-dd')
  const readToday = lastRead === today
  return (
    <div className='flex gap-4'>
      <a
        className='bg-cb-dark-blue group w-full flex-5/6 cursor-pointer rounded-lg border-none text-center text-lg'
        href={url}
        target='_blank'
        onClick={() => {
          incrementStreak({ streakInfo, setStreakInfo })
        }}
      >
        <span
          className={`bg-sword-purple block translate-y-[-4px] transform rounded-lg p-3 text-lg duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms] hover:ease-[cubic-bezier(.3,.7,.4,1.5)] ${
            readToday ? 'text-cb-yellow' : 'text-gray-100'
          }`}
        >
          read daily text: {bookAndChapter}
          {readToday ? ' again' : ''}
        </span>
      </a>
      <Button
        onClick={async () => {
          await copyToClipboard(dailyText)
          toast.success('copied daily text')
        }}
        className='flex-1/6 disabled:pointer-events-none disabled:opacity-25'
        disabled={isLoading}
      >
        <DocumentDuplicateIcon className='mx-auto h-6 w-6' />
      </Button>
    </div>
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

function SequenceButton({
  streakInfo,
  setStreakInfo,
}: {
  streakInfo: StreakInfo
  setStreakInfo: Dispatch<SetStateAction<StreakInfo | undefined>>
}) {
  const lastRead = streakInfo?.lastRead ?? null
  const today = format(new Date(), 'yyyy-MM-dd')
  const readToday = lastRead === today

  const sequence = streakInfo?.sequence ?? '1:1'
  const prevSequence = getPrevSequence(sequence)
  const [bookNumber, chapter] = (readToday ? prevSequence : sequence).split(':')
  const text = `${bookNumber}${(chapter ?? '').padStart(3, '0')}001`
  const bookAndChapter = `${books[Number(bookNumber) - 1]} ${chapter}`
  const url = getBookLink(text)
  return (
    <a
      className='bg-cb-dark-blue group w-full cursor-pointer rounded-lg border-none text-center text-lg'
      href={url}
      target='_blank'
      onClick={() => {
        if (!readToday) {
          const newStreakInfo = { ...streakInfo }
          const newSequence = getNextSequence(sequence)
          newStreakInfo.sequence = newSequence
          incrementStreak({ streakInfo: newStreakInfo, setStreakInfo })
        }
      }}
    >
      <span
        className={`bg-sword-blue block translate-y-[-4px] transform rounded-lg p-3 text-lg duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms] hover:ease-[cubic-bezier(.3,.7,.4,1.5)] ${
          readToday ? 'text-cb-yellow' : 'text-gray-100'
        }`}
      >
        read chapter: {bookAndChapter}
        {readToday ? ' again' : ''}
      </span>
    </a>
  )
}

function MWTButton({
  week,
  url,
  title,
  isLoading,
  children,
}: {
  week: string
  url: string
  title: string
  isLoading: boolean
  children: React.ReactNode
}) {
  const [showButton, setShowButton] = useState(false)
  if (!showButton) {
    return (
      <div className='flex gap-4'>
        <div className='flex-5/6'>
          <a
            className='bg-cb-dark-blue group w-full cursor-pointer rounded-lg border-none text-center text-lg'
            href={`https://wol.jw.org/en/wol/meetings/r1/lp-e/${week}`}
            target='_blank'
          >
            <span className='bg-sword-purple block translate-y-[-4px] transform rounded-lg p-3 text-lg text-gray-100 duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms] hover:ease-[cubic-bezier(.3,.7,.4,1.5)]'>
              {children}
            </span>
          </a>
        </div>
        <Button
          onClick={() => {
            setShowButton(true)
          }}
          className='flex-1/6'
        >
          <CloudArrowDownIcon className='mx-auto h-6 w-6' />
        </Button>
      </div>
    )
  }
  return (
    <>
      <div className='flex gap-4'>
        {isLoading ? (
          <SkeletonButton>{children}</SkeletonButton>
        ) : (
          <a
            className='bg-cb-dark-blue group w-full flex-5/6 cursor-pointer rounded-lg border-none text-center text-lg'
            href={url}
            target='_blank'
            // onClick={() => {
            //   incrementStreak({ streakInfo, setStreakInfo })
            // }}
          >
            <span className='bg-sword-purple block translate-y-[-4px] transform rounded-lg p-3 text-lg text-gray-100 duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms] hover:ease-[cubic-bezier(.3,.7,.4,1.5)]'>
              {title}
            </span>
          </a>
        )}
        <Button
          onClick={async () => {
            // await copyToClipboard(dailyText)
            // toast.success('copied daily text')
          }}
          className='flex-1/6 disabled:pointer-events-none disabled:opacity-25'
          disabled={isLoading}
        >
          <DocumentDuplicateIcon className='mx-auto h-6 w-6' />
        </Button>
      </div>
    </>
  )
}

function MWTButtons({
  now,
  midweekDayNumber,
}: {
  now: Date
  midweekDayNumber: number | undefined
}) {
  const thisWeek = format(now, 'yyyy/w')
  const nextWeek = format(add(now, { weeks: 1 }), 'yyyy/w')
  const todaysDayOfWeek = getDay(now)
  const finishedMidweek = todaysDayOfWeek > Number(midweekDayNumber)

  const { data: thisWeekData, isLoading: thisWeekIsLoading } =
    api.sword.mwt.useQuery({ date: thisWeek })
  const { data: nextWeekData, isLoading: nextWeekIsLoading } =
    api.sword.mwt.useQuery({ date: nextWeek })
  return (
    <>
      {!finishedMidweek && (
        <MWTButton
          week={thisWeek}
          url={thisWeekData?.mw ?? ''}
          title={thisWeekData?.mwTitle ?? ''}
          isLoading={thisWeekIsLoading}
        >
          mw
        </MWTButton>
      )}
      <MWTButton
        week={thisWeek}
        url={thisWeekData?.wt ?? ''}
        title={thisWeekData?.wtTitle ?? ''}
        isLoading={thisWeekIsLoading}
      >
        wt
      </MWTButton>
      {finishedMidweek && (
        <MWTButton
          week={nextWeek}
          url={nextWeekData?.mw ?? ''}
          title={nextWeekData?.mwTitle ?? ''}
          isLoading={nextWeekIsLoading}
        >
          mw
        </MWTButton>
      )}
    </>
  )
}

const statisticsLabels = {
  total: 'total',
  streak: 'current streak',
  maxStreak: 'max streak',
}

const buttonTypes = [
  { id: 'dailyText', text: 'Daily Text' },
  { id: 'sequential', text: 'Gen-Rev' },
]

// day of week
// 0 = sunday
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Daily() {
  const now = new Date()
  const [selectedDate, setSelectedDate] = useState(now)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [importText, setImportText] = useState('')
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const [streakInfo, setStreakInfo] = useLocalStorage<StreakInfo>(
    's4-streak-info',
    {
      streak: 0,
      maxStreak: 0,
      total: 0,
      lastRead: null,
      bookAndChapter: undefined,
      buttonType: 'dailyText',
      sequence: '1:1',
    }
  )
  const statistics: Record<string, number> = {
    streak: streakInfo?.streak ?? 0,
    maxStreak: streakInfo?.maxStreak ?? 0,
    total: streakInfo?.total ?? 0,
  }
  const buttonType = streakInfo?.buttonType ?? 'dailyText'
  const sequence = streakInfo?.sequence ?? '1:1'
  const sequenceBookName = sequence
    ? books[Number(sequence.split(':')[0]) - 1]
    : undefined
  const sequenceChapters = sequenceBookName
    ? (booksAndChaptersMap[sequenceBookName] ?? 1)
    : 1

  const [midweekDayNumber, setMidweekDayNumber] = useLocalStorage<
    number | undefined
  >('midweekday', undefined)
  return (
    <>
      <div className='flex flex-col space-y-4'>
        <div className='flex justify-end space-x-4'>
          <button
            type='button'
            onClick={() => {
              setIsExportModalOpen(true)
            }}
          >
            <ArrowUpTrayIcon className='h-6 w-6' />
          </button>
          <button
            type='button'
            onClick={() => {
              setIsStatisticsModalOpen(true)
            }}
          >
            <ChartBarIcon className='h-6 w-6' />
          </button>
          <button
            type='button'
            onClick={() => {
              setIsSettingsModalOpen(true)
            }}
          >
            <Cog6ToothIcon className='h-6 w-6' />
          </button>
        </div>
        <h2>swordle</h2>
        {buttonType === 'sequential' ? (
          <SequenceButton
            streakInfo={streakInfo}
            setStreakInfo={setStreakInfo}
          />
        ) : (
          <DTChapterButton
            now={selectedDate}
            streakInfo={streakInfo}
            setStreakInfo={setStreakInfo}
          />
        )}
        <h2>mwt</h2>
        <MWTButtons now={selectedDate} midweekDayNumber={midweekDayNumber} />
      </div>
      <Modal
        isOpen={isSettingsModalOpen}
        setIsOpen={setIsSettingsModalOpen}
        title='settings'
      >
        <select
          className='bg-cobalt w-full p-4'
          value={buttonType}
          onChange={e => {
            const newStreakInfo = { ...streakInfo }
            newStreakInfo.buttonType = e.target.value as
              | 'dailyText'
              | 'sequential'
            setStreakInfo(newStreakInfo)
          }}
        >
          {buttonTypes.map(bType => (
            <option key={bType.id} value={bType.id}>
              {bType.text}
            </option>
          ))}
        </select>
        {buttonType === 'sequential' ? (
          <div className='flex'>
            <select
              className='bg-cobalt w-full p-4'
              value={sequence?.split(':')[0]}
              onChange={e => {
                const [, chapter] = sequence.split(':')
                const newSequence = `${e.target.value}:${chapter}`
                const newStreakInfo = { ...streakInfo }
                newStreakInfo.sequence = newSequence
                setStreakInfo(newStreakInfo)
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
                const newStreakInfo = { ...streakInfo }
                newStreakInfo.sequence = newSequence
                setStreakInfo(newStreakInfo)
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
        ) : (
          <div className='flex gap-4'>
            <input
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={e => {
                const newDate = e.target.value
                const [newYear, newMonth, newDay] = newDate.split('-')
                const dateAsDate = new Date(
                  Number(newYear),
                  Number(newMonth) - 1,
                  Number(newDay)
                )
                setSelectedDate(dateAsDate)
              }}
              type='date'
              className='bg-cb-blue focus:border-cb-light-blue border-cb-blue flex-grow rounded border-1 text-center ring-0 outline-none focus:ring-0'
            />
            <div className='flex flex-grow gap-3'>
              <button
                type='button'
                className='text-cb-yellow hover:text-cb-yellow/75 bg-cb-dusty-blue flex flex-grow items-center justify-center rounded'
                onClick={() => {
                  setSelectedDate(subDays(selectedDate, 1))
                }}
              >
                <ChevronLeftIcon className='h-6 w-6' />
              </button>
              <button
                type='button'
                className='text-cb-yellow hover:text-cb-yellow/75 bg-cb-dusty-blue flex flex-grow items-center justify-center rounded disabled:pointer-events-none disabled:opacity-25'
                onClick={() => {
                  setSelectedDate(new Date())
                }}
                disabled={isToday(selectedDate)}
              >
                <CalendarIcon className='h-6 w-6' />
              </button>
              <button
                type='button'
                className='text-cb-yellow hover:text-cb-yellow/75 bg-cb-dusty-blue flex flex-grow items-center justify-center rounded'
                onClick={() => {
                  setSelectedDate(addDays(selectedDate, 1))
                }}
              >
                <ChevronRightIcon className='h-6 w-6' />
              </button>
            </div>
          </div>
        )}
        <hr className='border-cb-white/25' />
        <label className='block'>when is your midweek meeting?</label>
        <select
          className='bg-cobalt w-full'
          value={midweekDayNumber}
          onChange={e => {
            setMidweekDayNumber(Number(e.target.value))
          }}
        >
          <option>select day</option>
          {days.map((day, index) => (
            <option key={index} value={index}>
              {day}
            </option>
          ))}
        </select>
      </Modal>
      <Modal
        isOpen={isStatisticsModalOpen}
        setIsOpen={setIsStatisticsModalOpen}
        title='statistics'
      >
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
      <Modal
        isOpen={isExportModalOpen}
        setIsOpen={setIsExportModalOpen}
        title='import/export statistics'
      >
        <Button
          onClick={async () => {
            await copyToClipboard(btoa(JSON.stringify(statistics)))
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
            const newStatistics = JSON.parse(atob(importText)) as Record<
              string,
              number
            >
            const {
              streak: importedStreak,
              maxStreak: importedMaxStreak,
              total: importedTotal,
            } = newStatistics
            const newStreakInfo = { ...streakInfo }
            if (importedStreak) {
              newStreakInfo.streak = importedStreak
            }
            if (importedMaxStreak) {
              newStreakInfo.maxStreak = importedMaxStreak
            }
            if (importedTotal) {
              newStreakInfo.total = importedTotal
            }
            setStreakInfo(newStreakInfo)
            toast.success('updated statistics')
            setImportText('')
          }}
          disabled={!importText}
          className='disabled:pointer-events-none disabled:opacity-25'
        >
          import
        </Button>
      </Modal>
    </>
  )
}
