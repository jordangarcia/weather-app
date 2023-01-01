import { DateTime } from 'luxon'
import { fetchWeatherData, getUrl } from './weather'

import type { PageLoad } from './$types'
import { LOCATIONS } from '../locationData'

export const load = (async ({ params }) => {
  const today = DateTime.now().minus({ days: 13 })
  const now = today.minus({ days: 3 }).startOf('day').minus({ hours: 3 })
  const end = now.plus({ days: 7 }).endOf('day')
  const timeParams = {
    time_start: now.toUTC().toISO(),
    time_end: end.toUTC().toISO(),
    time_zone: 'UTC',
  }

  const locations = await Promise.all(
    LOCATIONS.map(async (loc) => {
      return {
        ...loc,
        forecast: await fetchWeatherData({
          ...timeParams,
          ...loc,
        }),
        url: getUrl({ ...timeParams, ...loc }),
      }
    })
  )

  return {
    weather: locations,
    today,
  }
}) satisfies PageLoad

// export const prerender = true;
