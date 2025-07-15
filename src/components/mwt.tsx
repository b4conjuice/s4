import { useEffect, useState } from 'react'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
import { getDay, format, add } from 'date-fns'
import Balancer from 'react-wrap-balancer'

import Modal from '@/components/modal'
import Button from '@/components/ui/button'
import { api } from '@/trpc/react'
import useLocalStorage from '@/lib/useLocalStorage'
import { MEETING_LINKS_URL } from '@/lib/common'

// day of week
// 0 = sunday
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Settings = ({
  midweekDayNumber,
  setMidweekDayNumber,
}: {
  midweekDayNumber?: number
  setMidweekDayNumber: (midweekDayNumber: number | undefined) => void
}) => {
  const [day, setDay] = useState<number | undefined>(midweekDayNumber)
  useEffect(() => {
    setDay(midweekDayNumber)
  }, [midweekDayNumber])
  return (
    <form className='space-y-3'>
      <label>when is your midweek meeting?</label>
      <select
        className='bg-cobalt w-full'
        value={day}
        onChange={e => {
          setDay(Number(e.target.value))
        }}
      >
        <option>select day</option>
        {days.map((day, index) => (
          <option key={index} value={index}>
            {day}
          </option>
        ))}
      </select>
      <Button
        className='disabled:pointer-events-none disabled:opacity-25'
        type='submit'
        onClick={e => {
          e.preventDefault()
          setMidweekDayNumber(day)
        }}
        disabled={midweekDayNumber === day}
      >
        save
      </Button>
    </form>
  )
}

const ExternalLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className='group bg-cb-dark-blue w-full cursor-pointer rounded-lg border-none text-center text-lg'
  >
    <span className='block translate-y-[-4px] transform rounded-lg bg-[#5a3e84] p-3 text-lg duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms] hover:ease-[cubic-bezier(.3,.7,.4,1.5)]'>
      <Balancer>{children}</Balancer>
    </span>
  </a>
)

export default function Mwt() {
  const [midweekDayNumber, setMidweekDayNumber] = useLocalStorage<
    number | undefined
  >('midweekday', undefined)
  const [showModal, setShowModal] = useState(false)
  const now = new Date()
  const thisWeekDate = format(now, 'yyyy/w')
  const nextWeekDate = format(add(now, { weeks: 1 }), 'yyyy/w')
  const todayText = format(now, 'MMM dd, yyyy')
  const todaysDayOfWeek = getDay(now)

  const { data: thisWeekData } = api.sword.mwt.useQuery({ date: thisWeekDate })
  const { data: nextWeekData } = api.sword.mwt.useQuery({ date: nextWeekDate })

  const finishedMidweek = todaysDayOfWeek > Number(midweekDayNumber)
  const week = thisWeekData?.week
  const mwUrl = thisWeekData?.mw
  const mwTitle = thisWeekData?.mwTitle
  const wtUrl = thisWeekData?.wt
  const wtTitle = thisWeekData?.wtTitle
  const nextWeek = nextWeekData?.week
  const mwUrlNextWeek = nextWeekData?.mw
  const mwTitleNextWeek = nextWeekData?.mwTitle

  const midweekDay =
    typeof midweekDayNumber === 'number' ? days[midweekDayNumber] : null
  return (
    <div className='flex flex-col'>
      <div className='flex justify-end space-x-4'>
        <button
          type='button'
          onClick={() => {
            setShowModal(true)
          }}
        >
          <Cog6ToothIcon className='h-6 w-6' />
        </button>
        <a
          href='https://github.com/b4conjuice/mwt'
          target='_blank'
          rel='noopener noreferrer'
        >
          <svg
            // https://lucide.dev/icon/github
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'></path>
            <path d='M9 18c-4.51 2-5-2-7-2'></path>
          </svg>
        </a>
      </div>
      <div className='flex flex-col items-center space-y-4'>
        <p>{todayText}</p>
        <p>Midweek Day: {midweekDay ?? 'not set'}</p>
        <ExternalLink href={`${MEETING_LINKS_URL}${thisWeekDate}`}>
          {!finishedMidweek && 'mw/'}wt
        </ExternalLink>
        <h2>{week}</h2>
        {!finishedMidweek && (
          <ExternalLink href={mwUrl ?? ''}>{mwTitle}</ExternalLink>
        )}
        {wtTitle && <ExternalLink href={wtUrl ?? ''}>{wtTitle}</ExternalLink>}

        {finishedMidweek && (
          <>
            <ExternalLink href={`${MEETING_LINKS_URL}${nextWeekDate}`}>
              mw
            </ExternalLink>
            <h2>{nextWeek}</h2>

            <ExternalLink href={mwUrlNextWeek ?? ''}>
              {mwTitleNextWeek}
            </ExternalLink>
          </>
        )}
      </div>
      <Modal isOpen={showModal} setIsOpen={setShowModal} title='settings'>
        <Settings
          midweekDayNumber={midweekDayNumber}
          setMidweekDayNumber={setMidweekDayNumber}
        />
      </Modal>
    </div>
  )
}
