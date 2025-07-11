import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import requestMeetingLinks from '@/lib/requestMeetingLinks'
import requestDailyText from '@/lib/requestDailyText'

type MWTResponse =
  | {
      success: boolean
      date: string
      url: string
      week: string
      mw: string
      mwTitle: string
      wt: string
      wtTitle: string
    }
  | undefined

type DTResponse =
  | {
      comment: string
      dailyText: string
      date: string
      scripture: string
      success: boolean
      text: string
    }
  | undefined

export const swordRouter = createTRPCRouter({
  mwt: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      const date = String(input.date).replace(/-/g, '/')
      const data: MWTResponse = await requestMeetingLinks(date)
      return data
    }),
  dt: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      const date = String(input.date).replace(/-/g, '/')
      const data: DTResponse = await requestDailyText(date)
      return data
    }),
})
