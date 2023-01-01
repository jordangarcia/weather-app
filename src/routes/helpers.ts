import { round } from 'lodash';
import type { Score, WeatherAtTimeWithPrevRainfall } from './weather';

export const tempCtoF = (temp: number) => {
	return (temp * 9) / 5 + 32;
};

export const windToMPH = (mps: number) => {
	return mps * 2.23694;
};

// A measure of rainfall intensity shown as the amount of rain that would fall over the course of an hour.
// Rainfall can be categorized as
// light (< 0.1 in/h) (< 2.5 mm/h),
// medium (0.1-0.3 in/h) (2.5-7.6 mm/h),
// heavy (> 0.3 in/h) (> 7.6 mm/h), or
// violent (> 2.0 in/h) (> 50 mm/h)
export const rainToMMPerHour = (rain: number) => {
	return rain * 3600;
};

const formatWeather = (item: WeatherAtTimeWithPrevRainfall) => {
	return {
		wind: windToMPH(item.wind),
		rain: rainToMMPerHour(item.rain),
		temp: tempCtoF(item.Tair),
		prev_rainfall: item.prev_rainfall.map(rainToMMPerHour),
	};
};

const tempScore = (temp: number): Score => {
	// temp_score
	// 65-82 F = 4
	// 60-65, 83-88 F = 3
	// 55-60, 89-94 F = 2
	// 40-55, 95+ F = 1
	// < 40 or > 103 = 0
	const ranges = [
		[-Infinity, 39, 0],
		[40, 55, 1],
		[55, 60, 2],
		[60, 66, 3],
		[66, 83, 4],
		[83, 89, 3],
		[89, 95, 2],
		[95, 102, 1],
		[102, Infinity, 0],
	];
	const found = ranges.find(([min, max]) => temp >= min && temp <= max);

	if (!found) {
		return 0;
	}

	return found[2] as Score;
};

const rainfallScore = (rain: number): Score => {
	// rain_score
	// 0-0.1 in/h = 4
	// 0.1-0.3 in/h = 3
	// 0.3-1.0 in/h = 2
	// 1.0+ in/h = 1
	// light (< 0.1 in/h) (< 2.5 mm/h),
	// medium (0.1-0.3 in/h) (2.5-7.6 mm/h),
	// heavy (> 0.3 in/h) (> 7.6 mm/h), or
	// violent (> 2.0 in/h) (> 50 mm/h)
	const score = rain < 0.1 ? 4 : rain < 0.5 ? 3 : rain < 2.5 ? 2 : rain < 7.5 ? 1 : 0;
	return score;
};

const windScore = (wind: number): Score => {
	// wind_score
	// 0-8 mph = 4
	// 8-12 mph = 3
	// 12-16 mph = 2
	// 16+ mph = 1
	// 30+ mph = 0
	return wind < 8 ? 4 : wind < 12 ? 3 : wind < 16 ? 2 : wind < 30 ? 1 : 0;
};
const computeOverallScore = (scores: {
	wind_score: Score;
	temp_score: Score;
	rain_score: Score;
	prev_rainfall_score: Score;
}): Score => {
	const minScore = Math.min(...Object.values(scores));
	if (minScore < 3) {
		return minScore as Score;
	}
	return round(
		(scores.wind_score + scores.temp_score + scores.rain_score + scores.prev_rainfall_score) / 4,
		0
	) as Score;
};

export const computeScores = (item: WeatherAtTimeWithPrevRainfall) => {
	const { wind, rain, temp, prev_rainfall } = formatWeather(item);

	const wind_score = windScore(wind);
	const temp_score = tempScore(temp);
	const rain_score = rainfallScore(rain);
	const prev_rainfall_score = Math.min(
		...prev_rainfall.map((rainfall, ind) => {
			// rain=3 3 hours ago -> 4
			// rain=2 3 hours ago -> 4
			// rain=1 3 hours ago -> 3
			// rain=0 3 hours ago -> 1

			// rain=3 2 hours ago -> 4
			// rain=2 2 hours ago -> 3
			// rain=1 2 hours ago -> 2
			// rain=0 2 hours ago -> 1

			// rain=3 1 hours ago -> 3
			// rain=2 1 hours ago -> 2
			// rain=1 1 hours ago -> 1
			// rain=0 1 hours ago -> 0
			const score = rainfallScore(rainfall);

			// max at 4
			return Math.min(
				4,
				score +
					ind +
					// if its not raining, assume in the hour prev rain can go up by 1
					(rain === 4 ? 1 : 0)
			);
		})
	) as Score;

	const overall_score: Score = computeOverallScore({
		wind_score,
		temp_score,
		rain_score,
		prev_rainfall_score,
	});

	return {
		wind_score,
		temp_score,
		rain_score,
		prev_rainfall_score,
		overall_score,
	};
};

export const getGradientColor = (value: Score, opacity = 0.8) => {
	const hue = 120 - 30 * (4 - value);
	return `hsl(${hue}, 100%, 50%)`;
};

export const SCORE_MAP = {
	4: '🤙',
	3: '🟢',
	2: '🟠',
	1: '🔴',
	0: '⛔️',
};
