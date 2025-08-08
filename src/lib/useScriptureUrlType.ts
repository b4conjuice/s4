import useLocalStorage from '@/lib/useLocalStorage'
import type { ScriptureUrl } from '@/lib/types'

export const scriptureUrlTypes = ['jwlibrary', 'jworg', 'wol']

export default function useScriptureUrlType() {
  const [scriptureUrlType, setScriptureUrlType] = useLocalStorage<ScriptureUrl>(
    's4-scripture-url-type',
    'jwlibrary'
  )
  return { scriptureUrlType, setScriptureUrlType }
}
