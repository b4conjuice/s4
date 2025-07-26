import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { deleteNote, getNote, getNotes, saveNote } from '@/server/db/notes'

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
})
