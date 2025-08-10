import { getScriptureUrl } from '@/lib/books'
import useScriptureUrlType from '@/lib/useScriptureUrlType'

export default function useGetScriptureUrl() {
  const { scriptureUrlType } = useScriptureUrlType()

  return (bibleParam: string) => getScriptureUrl(bibleParam, scriptureUrlType)
}
