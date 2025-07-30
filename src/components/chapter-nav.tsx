import { Link } from 'react-router'

export default function ChapterNav({
  bookNumber,
  chapters,
  currentChapter,
}: {
  bookNumber: string
  chapters: number
  currentChapter?: number
}) {
  return (
    <ul className='grid grid-cols-6 gap-2'>
      {Array.from(
        {
          length: chapters,
        },
        (_, i) => i + 1
      ).map((bookChapter: number) => {
        return (
          <li key={bookChapter}>
            {bookChapter === currentChapter ? (
              <span>{bookChapter}</span>
            ) : (
              <Link
                to={`/books/${bookNumber}/${bookChapter}`}
                className='text-cb-pink hover:text-cb-pink/75 py-4 group-first:pt-0'
              >
                {bookChapter}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}
