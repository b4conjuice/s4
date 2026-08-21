import { NavLink as Link } from 'react-router'

import { transformTextToScripture } from '@/lib/books'

export default function ScriptureList({ list }: { list: string[] }) {
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
          <li key={index} className='group flex space-x-2'>
            <Link
              to={`/text/${bibleParam}`}
              className='text-cb-pink hover:text-cb-pink/75 flex grow items-center justify-between py-4 group-first:pt-0'
            >
              <div>
                <div>{scripture.asString}</div>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
