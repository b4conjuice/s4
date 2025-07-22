import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { getNote, getNotes } from '@/server/db/notes'

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
})
