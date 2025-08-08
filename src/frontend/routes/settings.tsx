import { RadioGroup, Field, Radio, Label } from '@headlessui/react'
import { useLocalStorage } from '@uidotdev/usehooks'

import { Main, Title } from '@/components/ui'
import Menu from '@/components/menu'
import type { ScriptureUrl } from '@/lib/types'
import { getScriptureUrl, transformScripturetoText } from '@/lib/books'
import Button from '@/components/ui/button'
import BookSearch from '@/components/book-search'

const scriptureUrlTypes = [
  { id: 'jwlibrary', text: 'jwlibrary' },
  { id: 'jworg', text: 'jworg' },
  { id: 'wol', text: 'wol' },
]

export default function SettingsPage() {
  const [scriptureUrlType, setScriptureUrlType] = useLocalStorage<ScriptureUrl>(
    's4-scripture-url-type',
    'jwlibrary'
  )
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>settings</Title>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            <RadioGroup
              value={scriptureUrlType}
              onChange={setScriptureUrlType}
              aria-label='scriptureUrlType'
              className='flex flex-col space-y-2'
            >
              {scriptureUrlTypes.map(({ id: s, text }) => (
                <Field key={s} className='flex items-center gap-2'>
                  <Radio
                    value={s}
                    className='group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-blue-400'
                  >
                    <span className='invisible size-2 rounded-full bg-white group-data-checked:visible' />
                  </Radio>
                  <Label>{text}</Label>
                </Field>
              ))}
            </RadioGroup>
            <div className='flex flex-col justify-between space-y-4'>
              <h2>test Gen 1:1</h2>
              <Button
                href={getScriptureUrl(
                  transformScripturetoText('Gen 1:1'),
                  scriptureUrlType
                )}
              >
                Gen 1:1
              </Button>
              <BookSearch
                onSelectBook={scripture => {
                  const text = transformScripturetoText(scripture)
                  const scriptureUrl = getScriptureUrl(text, scriptureUrlType)
                  window.open(scriptureUrl)
                }}
                disableAddToHistory
              />
            </div>
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'></div>
      </footer>
    </>
  )
}
