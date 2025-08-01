import CommandPalette from '@/components/command-palette'
import Button from '@/components/ui/button'
import books, { booksAndChaptersMap } from '@/lib/books'
import useLocalStorage from '@/lib/useLocalStorage'
import copyToClipboard from '@/lib/copyToClipboard'
import useHistory from '@/lib/useHistory'

export default function Sword({
  excludeCommandPalette,
  onClick,
}: {
  excludeCommandPalette?: boolean
  onClick?: (args?: unknown) => void
}) {
  const [swordText, setSwordText] = useLocalStorage('sword-text', '1:1')
  const { addHistory } = useHistory()

  const bookNumber = swordText?.split(':')[0]
  const bookChapter = swordText?.split(':')[1]
  const bookName = swordText
    ? books[Number(swordText.split(':')[0]) - 1]
    : undefined
  const bookChapters = bookName ? (booksAndChaptersMap[bookName] ?? 1) : 1
  const verse = '001'
  const bibleText = `${bookNumber}${(bookChapter ?? '').padStart(3, '0')}${verse}`

  const chapterLink = `https://www.jw.org/finder?srcid=jwlshare&wtlocale=E&prefer=lang&bible=${bibleText}&pub=nwtsty`
  const bookWithChapter = `${bookName} ${bookChapter}`
  const scripture = {
    bookName: bookName ?? '',
    bookNumber: Number(bookNumber),
    chapter: Number(bookChapter),
  }
  return (
    <div className='flex flex-col space-y-4'>
      <ul className='flex-grow space-y-4'>
        {[].map(({ chapterLink, bookChapter }) => (
          <li key={chapterLink}>
            <Button
              onClick={() => {
                window.open(chapterLink)
              }}
            >
              {bookChapter}
            </Button>
          </li>
        ))}
      </ul>
      <a
        className='block w-full translate-y-[-4px] transform rounded-lg bg-[#5a3e84] p-3 text-center text-lg duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms] hover:ease-[cubic-bezier(.3,.7,.4,1.5)] disabled:pointer-events-none disabled:opacity-25'
        href={chapterLink}
        target='_blank'
        onClick={() => {
          copyToClipboard(bookWithChapter)
          if (onClick) {
            onClick(bookWithChapter)
          }
          addHistory(scripture)
        }}
      >
        {bookWithChapter}
      </a>
      <div className='flex'>
        <select
          className='bg-cobalt w-full p-4'
          value={swordText?.split(':')[0]}
          onChange={e => {
            const newLookupText = `${e.target.value}:1`
            setSwordText(newLookupText)
          }}
        >
          {books.map((book, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {book}
            </option>
          ))}
        </select>
        <select
          className='bg-cobalt w-full p-4'
          value={swordText?.split(':')[1]}
          onChange={e => {
            const [bookNumber] = swordText.split(':')
            const newSequence = `${bookNumber}:${e.target.value}`
            setSwordText(newSequence)
          }}
        >
          {Array.from(
            {
              length: bookChapters,
            },
            (_, i) => i + 1
          ).map(ch => (
            <option key={ch} value={ch}>
              {ch}
            </option>
          ))}
        </select>
      </div>
      {!excludeCommandPalette && (
        <CommandPalette
          commands={[
            {
              id: `go-text`,
              title: `go text`,
              action: () => {
                addHistory(scripture)
                window.open(chapterLink, '_blank')
              },
            },
            ...books.map((book, index) => ({
              id: `lookup-${book}`,
              title: `lookup ${book}`,
              action: () => {
                setSwordText(`${index + 1}:1`)
              },
            })),
            ...Array.from(
              {
                length: bookChapters,
              },
              (_, i) => i + 1
            ).map(bookChapter => {
              return {
                id: `lookup-${bookName}-${bookChapter}`,
                title: `lookup ${bookName} ${bookChapter}`,
                action: () => {
                  setSwordText(`${bookNumber}:${bookChapter}`)
                },
              }
            }),
          ]}
        />
      )}
    </div>
  )
}
