import { useLocalStorage } from '@uidotdev/usehooks'

// const MIDWEEK_DAY_NUMBER_KEY = 'sfour-midweek-day-number'
const MIDWEEK_DAY_NUMBER_KEY = 'midweekday'

export default function useMidweekDayNumber() {
  const [midweekDayNumber, setMidweekDayNumber] = useLocalStorage<
    number | undefined
  >(MIDWEEK_DAY_NUMBER_KEY, undefined)
  return [midweekDayNumber, setMidweekDayNumber]
}
