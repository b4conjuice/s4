import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import {
  deleteNote,
  deleteScriptureNote,
  getAllScriptureNotes,
  getNote,
  getNotes,
  getScriptureNote,
  getScriptureNotes,
  getUniqueNoteTexts,
  saveNote,
} from '@/server/db/notes'

export const noteRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const notes = await getNotes()
    return notes
  }),
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const note = await getNote(input.id)
      return note
    }),
  getScriptureNote: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const scriptureNote = await getScriptureNote(input.id)
      return scriptureNote ?? null
    }),
  getAllScriptureNotes: publicProcedure
    .input(z.object({ random: z.boolean().optional() }))
    .query(async ({ input }) => {
      const notes = await getAllScriptureNotes({ random: input.random })
      return notes
    }),
  getScriptureNotes: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const notes = await getScriptureNotes(input.text)
      return notes
    }),
  getUniqueNoteTexts: publicProcedure
    .input(z.object({ bookChapterText: z.string() }))
    .query(async ({ input }) => {
      const texts = await getUniqueNoteTexts(input.bookChapterText)
      return texts
    }),
  save: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        text: z.string(),
        title: z.string(),
        body: z.string(),
        list: z.array(z.string()),
        tags: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const note = await saveNote(input)
      console.log({ note })
      return note
    }),
  deleteNote: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteNote(input.id)
    }),
  deleteScriptureNote: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteScriptureNote(input.id)
    }),
})
