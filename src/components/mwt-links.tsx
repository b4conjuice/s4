import { add, format, getDay } from 'date-fns'

import { getMeetingsUrl } from '@/lib/mwt'
import useMidweekDayNumber from '@/lib/useMidweekDayNumber'

export function MWLink({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const [midweekDayNumber] = useMidweekDayNumber()
  const now = new Date()
  const todaysDayOfWeek = getDay(now)
  const finishedMidweek = todaysDayOfWeek > Number(midweekDayNumber)
  const thisWeek = format(now, 'yyyy/w')
  const nextWeek = format(add(now, { weeks: 1 }), 'yyyy/w')
  const week = finishedMidweek ? nextWeek : thisWeek
  return (
    <a
      className={className ?? 'text-cb-pink hover:text-cb-pink/75'}
      href={getMeetingsUrl(week)}
      target='_blank'
    >
      {children ?? 'mw'}
    </a>
  )
}

export function WTLink({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <a
      className={className ?? 'text-cb-pink hover:text-cb-pink/75'}
      href={getMeetingsUrl()}
      target='_blank'
    >
      {children ?? 'wt'}
    </a>
  )
}
