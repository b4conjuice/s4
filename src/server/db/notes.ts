'use server'

import 'server-only'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { and, eq, inArray, like, sql } from 'drizzle-orm'

import { type Note } from '@/lib/types'
import { db } from '@/server/db'
import { notes, scriptureNotes } from '@/server/db/schema'

const BOOK_TAG = '📖'
const SWORD_TAG = '⚔️'

export async function saveNote(note: Note) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const isList = note.title.startsWith('= ')
  const list = isList ? note.body.split('\n').filter(item => item !== '') : []

  const tags = note?.tags ?? []
  const newTags = tags.includes(BOOK_TAG) ? tags : [...tags, BOOK_TAG]

  const newNotes = await db
    .insert(notes)
    .values({
      ...note,
      list,
      author: user.userId,
      tags: newTags,
    })
    .onConflictDoUpdate({
      target: notes.id,
      set: {
        text: note.text,
        title: note.title,
        body: note.body,
        list,
        tags: newTags,
      },
    })
    .returning()
  if (!newNotes || newNotes.length < 0) {
    throw new Error('something went wrong')
  }
  const newNote = newNotes[0]
  if (!newNote) {
    throw new Error('something went wrong')
  }
  revalidatePath(`/notes/${newNote.id}`)
  return newNote.id
}

export async function saveScriptureNote(note: Note) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const isList = note.title.startsWith('= ')
  const list = isList ? note.body.split('\n').filter(item => item !== '') : []

  const tags = note?.tags ?? []
  const newTags = [
    ...tags,
    ...(tags.includes(BOOK_TAG) ? [] : [BOOK_TAG]),
    ...(tags.includes(SWORD_TAG) ? [] : [SWORD_TAG]),
  ]

  const newNotes = await db
    .insert(notes)
    .values({
      ...note,
      list,
      author: user.userId,
      tags: newTags,
    })
    .onConflictDoUpdate({
      target: notes.id,
      set: {
        text: note.text,
        title: note.title,
        body: note.body,
        list,
        tags: newTags,
      },
    })
    .returning()
  if (!newNotes || newNotes.length < 0) {
    throw new Error('something went wrong')
  }
  const newNote = newNotes[0]
  if (!newNote) {
    throw new Error('something went wrong')
  }

  revalidatePath(`/notes/${newNote.id}`)
  return newNote.id
}

export async function saveRelatedScriptureNote({
  noteId,
  text,
}: {
  noteId: number
  text: string
}) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const relatedScriptureNote = {
    noteId,
    text,
  }

  await db
    .insert(scriptureNotes)
    .values(relatedScriptureNote)
    .onConflictDoUpdate({
      target: scriptureNotes.noteId,
      set: {
        noteId,
        text,
      },
    })
}

export async function getNotes() {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const notes = await db.query.notes.findMany({
    where: (model, { eq }) => eq(model.author, user.userId),
    orderBy: (model, { desc }) => desc(model.updatedAt),
  })
  return notes
}

export async function getNote(id: number) {
  const note = await db.query.notes.findFirst({
    where: (model, { eq }) => and(eq(model.id, id)),
  })

  return note
}

export async function getScriptureNote(id: number) {
  const scriptureNote = await db.query.scriptureNotes.findFirst({
    where: (model, { eq }) => eq(model.noteId, id),
  })

  return scriptureNote
}

export async function getAllScriptureNotes({ random }: { random?: boolean }) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const sNotes = await db.query.scriptureNotes.findMany()
  const scriptureNoteIds = sNotes.map(note => note.noteId)
  const foundNotes = await (random
    ? db
        .select()
        .from(notes)
        .where(inArray(notes.id, scriptureNoteIds))
        .orderBy(sql`RANDOM()`)
    : db.select().from(notes).where(inArray(notes.id, scriptureNoteIds)))
  return foundNotes.map(note => ({
    ...note,
    scripture: sNotes.find(sNote => sNote.noteId === note.id)?.text,
  }))
}

export async function getScriptureNotes(text: string) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const scriptureNotes = await db.query.scriptureNotes.findMany({
    where: (model, { eq }) => eq(model.text, text),
  })
  const scriptureNoteIds = scriptureNotes.map(note => note.noteId)
  const foundNotes = await db
    .select()
    .from(notes)
    .where(inArray(notes.id, scriptureNoteIds))
  return foundNotes
}

export async function getUniqueNoteTexts(bookChapterText: string) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const matchingNotes: { text: string }[] = await db
    .selectDistinct({ text: scriptureNotes.text })
    .from(scriptureNotes)
    .where(like(scriptureNotes.text, `${bookChapterText}%`))

  return matchingNotes.map(note => note.text)
}

export async function deleteNote(id: number, currentPath = '/') {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  // TODO: somehow check if note is related to an item in a different table

  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.author, user.userId)))
  revalidatePath(currentPath)
}

export async function deleteScriptureNote(id: number, currentPath = '/') {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  await db.delete(scriptureNotes).where(and(eq(scriptureNotes.noteId, id)))

  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.author, user.userId)))

  console.log('deleted', id)
  revalidatePath(currentPath)
}

export async function getTags() {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const notes = await getNotes()

  const allTags = notes
    ? [
        ...new Set(
          notes.reduce((allTagsFoo: string[], note: Note) => {
            const { tags } = note
            const noteTags = tags ? [...tags] : []
            return [...allTagsFoo, ...noteTags]
          }, [])
        ),
      ]
    : []

  return allTags
}
