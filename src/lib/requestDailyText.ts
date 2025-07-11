import * as cheerio from 'cheerio'

const DAILY_TEXT_URL = 'https://wol.jw.org/en/wol/dt/r1/lp-e/'

export default async function requestDailyText(date: string) {
  const url = `${DAILY_TEXT_URL}${date}`
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${response.status} ${response.statusText}`
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const dailyTextSelector = `.todayItems .todayItem.pub-es`
    const dailyTextElement = $(dailyTextSelector).text()

    if (dailyTextElement !== '') {
      const dt = $(`${dailyTextSelector} header h2`).text()
      const text = $(`${dailyTextSelector} p.themeScrp`).text()
      const comment = $(`${dailyTextSelector} .sb`).text()
      const dailyText = `${dt}\n${text}\n${comment}`
      const scripture = $(`${dailyTextSelector} p.themeScrp a`).text()

      return {
        success: true,
        date: dt,
        text,
        comment,
        dailyText,
        scripture,
      }
    } else {
      throw new Error(`Could not find dailyTextElement for date ${date}`)
    }
  } catch (error) {
    console.error('Error: ', error)
  }
}
