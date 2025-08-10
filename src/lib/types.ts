export type HistoryEntry = {
  scripture: Scripture
  date: Date
  url: string
}

export type Scripture = {
  text: string // TODO: rename to bibleParam
  bookName: string
  bookNumber: number
  chapter: number
  verse: number
  asString?: string
}

import { type scriptureUrlTypes } from '@/lib/useScriptureUrlType'
export type ScriptureUrl = (typeof scriptureUrlTypes)[number]

export type Note = {
  id?: number
  text: string
  title: string
  body: string
  author?: string
  list: string[]
  tags: string[]
}

export type ScriptureNote = {
  scripture: string
} & Note
