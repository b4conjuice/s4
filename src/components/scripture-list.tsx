import { NavLink as Link } from 'react-router'
import {
  ArrowTopRightOnSquareIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/20/solid'

import { transformTextToScripture } from '@/lib/books'
import useOpenScriptureUrl from '@/lib/useOpenScriptureUrl'
import type { Scripture } from '@/lib/types'

export default function ScriptureList({
  list,
  onSelectScripture,
}: {
  list: string[]
  onSelectScripture?: (scripture: Scripture) => void
}) {
  const openScriptureUrl = useOpenScriptureUrl()
  return (
    <ul className='divide-cb-dusty-blue divide-y'>
      {list.map((bibleParam, index) => {
        const scripture = transformTextToScripture(bibleParam)
        if (scripture === '') {
          return (
            <li key={index} className='group flex space-x-2'>
              <Link
                to={`/text/${bibleParam}`}
                className='text-cb-pink hover:text-cb-pink/75 flex grow items-center justify-between py-4 group-first:pt-0'
              >
                <div>
                  <div>{bibleParam}</div>
                </div>
              </Link>
            </li>
          )
        }
        return (
          <li key={index} className='flex space-x-2 py-4 first:pt-0'>
            <Link
              to={`/text/${bibleParam}`}
              className='text-cb-pink hover:text-cb-pink/75 flex grow items-center justify-between'
            >
              <div>
                <div>{scripture.asString}</div>
              </div>
            </Link>
            <button
              className='text-cb-pink hover:text-cb-pink/75 disabled:pointer-events-none disabled:opacity-25'
              type='button'
              onClick={() => {
                openScriptureUrl(scripture)
              }}
            >
              <ArrowTopRightOnSquareIcon className='h-6 w-6' />
            </button>
            {onSelectScripture && (
              <button
                className='text-cb-pink hover:text-cb-pink/75 disabled:pointer-events-none disabled:opacity-25'
                type='button'
                onClick={() => {
                  onSelectScripture(scripture)
                }}
              >
                <EllipsisVerticalIcon className='h-6 w-6' />
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
