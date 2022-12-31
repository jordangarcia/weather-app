import { DateTime } from 'luxon';
import { fetchWeatherData, getUrl } from './weather';

import type { PageLoad } from './$types';

type Locations = 'koolani';

type Location = {
	id: string;
	latitude: string;
	longitude: string;
};

const LOCATIONS: Location[] = [
	{
		id: 'koolani',
		latitude: '21.292881',
		longitude: '-157.849152'
	},
	{
		id: 'paki',
		latitude: '21.271560',
		longitude: '-157.815752'
	},
	{
		id: 'moana loa',
		latitude: '21.347716',
		longitude: '-157.900106'
	},
	{
		id: 'mahiko',
		latitude: '21.338502',
		longitude: '-158.036160'
	}
];

export const load = (async ({ params }) => {
	const now = DateTime.now().minus({ days: 2 }).startOf('day').minus({ hours: 3 });
	const end = now.plus({ days: 7 });
	const timeParams = {
		time_start: now.toUTC().toISO(),
		time_end: end.toUTC().toISO(),
		time_zone: 'UTC'
	};

	const locations = await Promise.all(
		LOCATIONS.map(async (loc) => {
			return {
				...loc,
				forecast: await fetchWeatherData({
					...timeParams,
					...loc
				}),
				url: getUrl({ ...timeParams, ...loc })
			};
		})
	);

	return {
		weather: locations
	};
}) satisfies PageLoad;

// export const prerender = true;
