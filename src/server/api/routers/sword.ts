import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import fetcher from '@/lib/fetcher'

type MWTResponse = {
  success: boolean
  date: string
  url: string
  week: string
  mw: string
  mwTitle: string
  wt: string
  wtTitle: string
}

type DTResponse = {
  comment: string
  dailyText: string
  date: string
  scripture: string
  success: boolean
  text: string
}

export const swordRouter = createTRPCRouter({
  mwt: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      const data = await fetcher<MWTResponse>(
        `https://api.dlopez.app/api/sword/mwt/${input.date}`
      )
      return data
    }),
  dt: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      const data: DTResponse = await fetcher(
        `https://api.dlopez.app/api/sword/dt/${input.date}`
      )
      return data
    }),
})
