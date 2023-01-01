import { error } from '@sveltejs/kit'
import { DateTime } from 'luxon'

import { fetchWeatherData, getUrl } from '../../weather'
import { LOCATIONS } from '../../../locationData'
import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
  const loc = LOCATIONS.find((l) => l.id === params.location)
  console.log('finding', params.location, loc)
  if (!loc) {
    throw error(404, 'Not found')
  }

  const today = DateTime.now()
  const now = today.minus({ days: 3 }).startOf('day').minus({ hours: 3 })
  const end = now.plus({ days: 7 }).endOf('day')
  const timeParams = {
    time_start: now.toUTC().toISO(),
    time_end: end.toUTC().toISO(),
    time_zone: 'UTC',
  }

  const location = {
    ...loc,
    forecast: await fetchWeatherData({
      ...timeParams,
      ...loc,
    }),
    url: getUrl({ ...timeParams, ...loc }),
  }

  return {
    location,
    today,
  }
}) satisfies PageLoad

// export const prerender = true;
