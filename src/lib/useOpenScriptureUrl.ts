import { transformScripturetoText } from '@/lib/books'
import type { Scripture } from '@/lib/types'
import useScriptureUrlType from '@/lib/useScriptureUrlType'
import useGetScriptureUrl from '@/lib/useGetScriptureUrl'

export default function useOpenScriptureUrl() {
  const { scriptureUrlType } = useScriptureUrlType()
  const getScriptureUrl = useGetScriptureUrl()

  const openScriptureUrl = (scripture: Scripture) => {
    const text = transformScripturetoText(scripture)
    const scriptureUrl = getScriptureUrl(text)
    const target =
      scriptureUrlType === 'jwlibrary'
        ? '_self'
        : scriptureUrlType === 'wol' || scriptureUrlType === 'jworg'
          ? '_blank'
          : '_blank'
    window.open(scriptureUrl, target)
  }
  return openScriptureUrl
}
