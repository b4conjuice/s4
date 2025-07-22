import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { getNotes } from '@/server/db/notes'

export const noteRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const notes = await getNotes()
    return notes
  }),
})
