import type { Scripture, ScriptureUrl } from '@/lib/types'

const booksAndChaptersMap: Record<string, number> = {
  'Gen.': 50,
  'Ex.': 40,
  'Lev.': 27,
  'Num.': 36,
  'Deut.': 34,
  'Josh.': 24,
  'Judg.': 21,
  Ruth: 4,
  '1 Sam.': 31,
  '2 Sam.': 24,
  '1 Ki.': 22,
  '2 Ki.': 25,
  '1 Chron.': 29,
  '2 Chron.': 36,
  Ezra: 10,
  'Neh.': 13,
  Esther: 10,
  Job: 42,
  'Ps.': 150,
  'Prov.': 31,
  'Eccl.': 12,
  'Song of Sol.': 8,
  'Isa.': 66,
  'Jer.': 52,
  'Lam.': 5,
  'Ezek.': 48,
  'Dan.': 12,
  'Hos.': 14,
  Joel: 3,
  Amos: 9,
  'Obad.': 1,
  Jonah: 4,
  'Mic.': 7,
  'Nah.': 3,
  'Hab.': 3,
  'Zeph.': 3,
  'Hag.': 2,
  'Zech.': 14,
  'Mal.': 4,
  'Matt.': 28,
  Mark: 16,
  Luke: 24,
  John: 21,
  Acts: 28,
  'Rom.': 16,
  '1 Cor.': 16,
  '2 Cor.': 13,
  'Gal.': 6,
  'Eph.': 6,
  'Phil.': 4,
  'Col.': 4,
  '1 Thess.': 5,
  '2 Thess.': 3,
  '1 Tim.': 6,
  '2 Tim.': 4,
  Titus: 3,
  'Philem.': 1,
  'Heb.': 13,
  'Jas.': 5,
  '1 Pet.': 5,
  '2 Pet.': 3,
  '1 John': 5,
  '2 John': 1,
  '3 John': 1,
  Jude: 1,
  'Rev.': 22,
}

const books = Object.keys(booksAndChaptersMap) // TODO: rename to bookNames to be more explicit
const normalizeBookName = (bookName: string) =>
  bookName.replace(' ', ' ').toLowerCase()
const normalizedBookNames = books.map(normalizeBookName)

const bookIndex = (bookName: string) =>
  books.findIndex(b => b === bookName.replace(' ', ' ')) + 1

export function getScriptureUrl(
  bibleText: string,
  scriptureUrl: ScriptureUrl = 'jwlibrary'
) {
  const scripture = transformTextToScripture(bibleText)
  const { bookNumber, chapter, verse } = scripture as Scripture
  const wolBibleText = `${bookNumber}/${chapter}/${verse ?? 1}`

  switch (scriptureUrl) {
    case 'jwlibrary':
      return `jwlibrary://view/finder?srcid=jwlshare&wtlocale=E&prefer=lang&pub=nwtsty&bible=${bibleText}`
    case 'jworg':
      return `https://www.jw.org/finder?srcid=jwlshare&wtlocale=E&prefer=lang&pub=nwtsty&bible=${bibleText}`
    case 'wol':
      return `https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/${wolBibleText}`
    default:
      return `jwlibrary://view/finder?srcid=jwlshare&wtlocale=E&prefer=lang&pub=nwtsty&bible=${bibleText}`
  }
}

function openBookLink(scripture: Scripture) {
  const text = transformScripturetoText(scripture)
  const scriptureUrl = getScriptureUrl(text)
  window.open(scriptureUrl)
}

function findBookIndex(bookName: string) {
  const normalizedBookName = normalizeBookName(bookName)
  const bookIndexWithNoChanges = normalizedBookNames.indexOf(normalizedBookName)
  if (bookIndexWithNoChanges > -1) {
    return bookIndexWithNoChanges
  }
  if (!normalizedBookName.includes('.')) {
    const bookNameWithPeriodAdded = `${normalizedBookName}.`
    const bookIndexWithPeriodAdded = normalizedBookNames.indexOf(
      bookNameWithPeriodAdded
    )
    if (bookIndexWithPeriodAdded > -1) {
      return bookIndexWithPeriodAdded
    }
  }
  return -1
}

function transformScripturetoText(scripture: string | Partial<Scripture>) {
  const defaultVerse = '001'
  if (typeof scripture === 'string') {
    const scriptureSplit = scripture.split(' ')
    const bookChapterVerse = scriptureSplit.pop() // get last item
    const bookName = scriptureSplit.join(' ')
    const [bookChapter, bookVerse] = bookChapterVerse?.split(':') ?? []

    if (!bookName || !bookChapter) {
      console.log(
        `transformScripturetoText: invalid scripture string '${scripture}': must follow this format: <bookName> <chapter>`
      )
      return ''
    }
    const bookIndex = findBookIndex(bookName)
    if (bookIndex < 0) {
      console.log(`transformScripturetoText: bookName '${bookName}' not found`)
      return ''
    }
    const bookNumber = bookIndex + 1
    const verse = bookVerse ? String(bookVerse).padStart(3, '0') : defaultVerse
    const bibleText = `${String(bookNumber).padStart(2, '0')}${String(bookChapter).padStart(3, '0')}${verse}`
    return bibleText
  } else {
    const { bookName, chapter, verse } = scripture
    if (!bookName || !chapter) {
      if (!bookName && !chapter) {
        console.log(
          'transformScripturetoText: scripture object is missing bookName and chapter'
        )
      } else {
        if (!bookName) {
          console.log(
            'transformScripturetoText: scripture object is missing bookName'
          )
        } else {
          console.log(
            'transformScripturetoText: scripture object is missing chapter'
          )
        }
      }
      return ''
    }
    const bookNumber = books.indexOf(bookName) + 1 // TODO: check if bookNumber is on `scripture`
    const bibleText = `${String(bookNumber).padStart(2, '0')}${String(chapter).padStart(3, '0')}${verse ? `${verse}`.padStart(3, '0') : defaultVerse}`
    return bibleText
  }
}

function transformTextToScripture(text: string) {
  if (text.length !== 8) {
    console.log(
      `transformTextToScripture: invalid text ${text}: text must be 8 characters`
    )
    return ''
  }
  const bookNumber = Number(text.slice(0, 2))
  const chapter = Number(text.slice(2, 5))
  const verse = Number(text.slice(5, 8))
  const bookName = books[bookNumber - 1]
  if (!bookName) {
    console.log(
      `transformTextToScripture: bookName not found, invalid bookNumber ${bookNumber} (first 3 characters of text)`
    )
    return ''
  }
  const scripture: Scripture = {
    text,
    bookName,
    bookNumber,
    chapter,
    verse,
    asString: `${bookName} ${chapter}:${verse}`,
  }
  return scripture
}

export default books
export {
  bookIndex,
  booksAndChaptersMap,
  openBookLink,
  transformScripturetoText,
  transformTextToScripture,
}
