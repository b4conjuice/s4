import { NavLink as Link, useParams } from 'react-router'

import books from '@/lib/books'

export default function BookNav({
  currentBookIndex,
}: {
  currentBookIndex?: number
}) {
  const { chapter: chapterParam, text } = useParams()
  return (
    <ul className='grid grid-cols-6 gap-2'>
      {books.map((bookName, index) => {
        const bookNumber = index + 1
        const shortBookName = bookName.replace('.', '').slice(0, 4)
        return (
          <li key={index} className='group'>
            {index === currentBookIndex ? (
              chapterParam || text ? (
                <Link
                  to={`/books/${bookNumber}`}
                  className='text-cb-light-blue hover:text-cb-light-blue/75'
                >
                  {shortBookName}
                </Link>
              ) : (
                <span>{shortBookName}</span>
              )
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
