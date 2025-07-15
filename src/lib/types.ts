export type HistoryEntry = {
  bibleText: string
  chapterLink: string
  bookChapter: string
}

export type Scripture = {
  text?: string
  bookName: string // TODO: rename to book for simplicity, but maybe not to distiuguish from bookNumber
  bookNumber: number
  chapter: number
  verse?: number
  asString?: string
}
