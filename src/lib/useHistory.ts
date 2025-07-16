import useLocalStorage from '@/lib/useLocalStorage'
import type { HistoryEntry } from '@/lib/types'

export default function useHistory() {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    's4-history',
    []
  )
  function addHistory(entry: HistoryEntry) {
    setHistory([entry, ...history])
  }
  function clearHistory() {
    setHistory([])
  }
  return { history, clearHistory, addHistory }
}
