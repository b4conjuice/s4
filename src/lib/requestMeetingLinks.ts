import * as cheerio from 'cheerio'

import { MEETING_LINKS_URL } from '@/lib/common'

export default async function requestMeetingLinks(date: string) {
  const url = `${MEETING_LINKS_URL}${date}`
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${response.status} ${response.statusText}`
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const meetingLinkSelector = `.todayItems > .todayItem > .itemCaption > .linkCard > a.jwac`
    const meetingLinkElements = $(meetingLinkSelector)
    if (meetingLinkElements) {
      const weekElement = $(
        '.todayItems > .todayItem:nth-child(1) > .itemData > header > h1'
      )
      const week = weekElement.text()
      const mwElement = $(
        '.todayItems > .todayItem:nth-child(1) > .itemCaption > .linkCard > a.jwac'
      )
      const mwReading = $(
        '.todayItems > .todayItem:nth-child(1) > .itemData > header > h2'
      )
      const wtElement = $('.todayItems > .todayItem:nth-child(2) > .itemData a')
      const baseUrl = 'https://wol.jw.org'
      return {
        success: true,
        date,
        url,
        week,
        mw: `${baseUrl}${mwElement.attr('href')}`,
        mwTitle: mwReading.text(),
        wt: `${baseUrl}${wtElement.attr('href')}`,
        wtTitle: wtElement.text(),
      }
    } else {
      throw new Error(`Could not find meetingLinkElements for date ${date}`)
    }
  } catch (error) {
    console.error('Error: ', error)
  }
}
