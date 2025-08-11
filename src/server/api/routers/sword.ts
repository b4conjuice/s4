import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import requestMeetingLinks from '@/lib/requestMeetingLinks'
import requestDailyText from '@/lib/requestDailyText'
import { redis } from '@/lib/redis'

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

const LAST_FETCH_TIMESTAMP_KEY = 'dt:last_fetch_timestamp'
const CACHED_DT_KEY = 'dt:cached_data'

export const swordRouter = createTRPCRouter({
  mwt: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      const data: MWTResponse = await requestMeetingLinks(input.date)
      return data
    }),
  dt: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      const data: DTResponse = await requestDailyText(input.date)
      return data
    }),
  dtDaily: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      const lastFetchDate = await redis.get<string>(LAST_FETCH_TIMESTAMP_KEY)
      const cachedDt = await redis.get<DTResponse>(CACHED_DT_KEY)
      if (lastFetchDate && cachedDt && lastFetchDate === input.date) {
        console.log('serving daily data from redis cache')
        return cachedDt
      }

      const data: DTResponse = await requestDailyText(input.date)
      await redis.set(LAST_FETCH_TIMESTAMP_KEY, input.date)
      await redis.set(CACHED_DT_KEY, data)

      return data
    }),
})
