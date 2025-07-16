import useLocalStorage from '@/lib/useLocalStorage'
import type { HistoryEntry } from '@/lib/types'

export default function useHistory() {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    's4-history',
    []
  )
  function add(entry: HistoryEntry) {
    setHistory([entry, ...history])
  }
  function clear() {
    setHistory([])
  }
  return { history, clear, add }
}
