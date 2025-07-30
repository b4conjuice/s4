import { NavLink as Link } from 'react-router'

import books from '@/lib/books'

export default function BookNav({
  currentBookIndex,
}: {
  currentBookIndex?: number
}) {
  return (
    <ul className='grid grid-cols-6 gap-2'>
      {books.map((bookName, index) => {
        const bookNumber = index + 1
        const shortBookName = bookName.replace('.', '').slice(0, 3)
        return (
          <li key={index} className='group'>
            {index === currentBookIndex ? (
              <span>{shortBookName}</span>
            ) : (
              <Link
                to={`/books/${bookNumber}`}
                className='text-cb-pink hover:text-cb-pink/75'
              >
                {shortBookName}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}
