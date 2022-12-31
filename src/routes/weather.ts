import { DateTime } from 'luxon';

type Timestamp = number;
type MetersPerSecond = number;
type Degrees = number;
type TempInCelsius = number;
// kilogram meter-2 second-1
type RainfallRate = number;

type WeatherDataResponse = {
	wind: [Timestamp, MetersPerSecond][];
	wind_from_direction: [Timestamp, Degrees][];
	rain: [Timestamp, RainfallRate][];
	Tair: [Timestamp, TempInCelsius][];
};

type ISOTimeString = string;

export type WeatherDatum = {
	wind: MetersPerSecond;
	wind_from_direction: Degrees;
	rain: RainfallRate;
	Tair: TempInCelsius;
};

export type WeatherAtTime = {
	time: ISOTimeString;
	weather: WeatherDatum;
};

export type FullWeatherData = WeatherAtTime & {
	prev_rainfal: RainfallRate[];
	score: number;
};

export const getUrl = (params: {
	latitude: string;
	longitude: string;
	time_start: string;
	time_zone: string;
	time_end: string;
}) => {
	const p = new URLSearchParams({
		format: 'json',
		dataset: 'weather_forecast_wrf_oa',
		vectors: 'Uwind:Vwind:wind:from',
		...params
	});
	p.append('var', 'Uwind');
	p.append('var', 'Vwind');
	p.append('var', 'rain');
	p.append('var', 'Tair');
	return p.toString();
	// const url = encodeURIComponent(`/cgi-bin/get_data.py?${p.toString()}`);
	// return `https://www.pacioos.hawaii.edu/cgi-bin/get_response.py?type=application/json&url=${url}`;
};

export const fetchWeatherData = async (params: {
	latitude: string;
	longitude: string;
	time_start: string;
	time_zone: string;
	time_end: string;
}): Promise<FullWeatherData[]> => {
	const p = new URLSearchParams({
		format: 'json',
		dataset: 'weather_forecast_wrf_oa',
		vectors: 'Uwind:Vwind:wind:from',
		...params
	});
	p.append('var', 'Uwind');
	p.append('var', 'Vwind');
	p.append('var', 'rain');
	p.append('var', 'Tair');

	const url = encodeURIComponent(`/cgi-bin/get_data.py?${p.toString()}`);
	const req = await fetch(
		`https://www.pacioos.hawaii.edu/cgi-bin/get_response.py?type=application/json&url=${url}`
	);
	const res = (await req.json()) as WeatherDataResponse;

	const weather: { [timestamp: string]: WeatherDatum } = {};
	const consolidate = (key: keyof WeatherDatum) => (arr: [Timestamp, number]) => {
		const timestamp = DateTime.fromMillis(arr[0]).setZone('HST').toISO();
		if (!weather[timestamp]) {
			weather[timestamp] = {} as WeatherDatum;
		}

		weather[timestamp][key] = arr[1];
	};

	res.wind.forEach(consolidate('wind'));
	res.wind_from_direction.forEach(consolidate('wind_from_direction'));
	res.rain.forEach(consolidate('rain'));
	res.Tair.forEach(consolidate('Tair'));

	const weatherValues = Object.values(weather);
	const fullWeatherData = Object.entries(weather).map(([time, weather], ind) => {
		return {
			time,
			weather: {
				...weather,
				prev_rainfal: weatherValues
					.slice(ind - 3, ind)
					.map((v) => v?.rain)
					.reverse()
			},
			score: 0
		};
	});

	// discount the first 3 since that's for collecting rainfall data
	return fullWeatherData.slice(3);
};
