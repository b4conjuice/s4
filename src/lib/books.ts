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

const books = Object.keys(booksAndChaptersMap)

const bookIndex = (bookName: string) =>
  books.findIndex(b => b === bookName.replace(' ', ' ')) + 1

function getBookLink(bibleText: string) {
  return `https://www.jw.org/finder?srcid=jwlshare&wtlocale=E&prefer=lang&pub=nwtsty&bible=${bibleText}`
}

function transformScripturetoText(scripture: string) {
  const [bookName, bookChapterVerse] = scripture.split(' ')
  const [bookChapter, bookVerse] = bookChapterVerse?.split(':') ?? []

  if (!bookName || !bookChapter) {
    return ''
  }
  const bookNumber = books.indexOf(bookName) + 1
  const verse = bookVerse ? String(bookVerse).padStart(3, '0') : '001'
  const bibleText = `${String(bookNumber).padStart(2, '0')}${String(bookChapter).padStart(3, '0')}${verse}`
  return bibleText
}

export default books
export { bookIndex, booksAndChaptersMap, getBookLink, transformScripturetoText }
