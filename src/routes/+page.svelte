<script lang="ts">
	import { round } from 'lodash';
	import { DateTime } from 'luxon';
	import type { PageData } from './$types';
	import { rainToMMPerHour, tempCtoF, windToMPH } from './helpers';
	import type { FullWeatherData } from './weather';

	export let data: PageData;

	export let dateSelected: DateTime = DateTime.now();
	function prevDay() {
		dateSelected = dateSelected.plus({ days: -1 });
	}
	function nextDay() {
		dateSelected = dateSelected.plus({ days: 1 });
	}

	const START_HOUR = 6;
	const END_HOUR = 22;
	// reactive shit
	export let filterByDateSelected: (item: FullWeatherData) => boolean;
	export let canGoPrev: boolean;
	export let canGoNext: boolean;

	$: canGoPrev = data.weather[0].forecast.some(
		(item) =>
			DateTime.fromISO(item.time).toFormat('LLL dd') ===
			dateSelected.plus({ days: -1 }).toFormat('LLL dd')
	);
	$: canGoNext = data.weather[0].forecast.some(
		(item) =>
			DateTime.fromISO(item.time).toFormat('LLL dd') ===
			dateSelected.plus({ days: 1 }).toFormat('LLL dd')
	);

	$: filterByDateSelected = (item: FullWeatherData) => {
		const sameDay =
			DateTime.fromISO(item.time).toFormat('LLL dd') === dateSelected.toFormat('LLL dd');
		const hour = DateTime.fromISO(item.time).hour;
		return sameDay && hour >= START_HOUR && hour <= END_HOUR;
	};
</script>

<section>
	<section class="flex flex-col justify-center items-center top bg-yellow-500 h-12 ">
		<div class="flex flex-row items-center gap-2">
			<button
				on:click={prevDay}
				disabled={!canGoPrev}
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">prev</button
			>
			<h3 class="text-xl">
				{dateSelected.toFormat('LLL dd')}
			</h3>

			<button
				on:click={nextDay}
				disabled={!canGoNext}
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">next</button
			>
		</div>
	</section>
	<section class="content p-4">
		{#each data.weather as item}
			<h1 class="text-3xl mb-2">
				{item.id}
			</h1>

			<div class="overflow-x-auto max-w-full pb-4">
				<table class="border-collapse border border-slate-500">
					{#each item.forecast.filter(filterByDateSelected) as f}
						<th class="border border-slate-600 p-2">
							<h3 class="text-center">
								{DateTime.fromISO(f.time).toFormat('h:mma')}
							</h3>
						</th>
					{/each}
					<tbody>
						<tr>
							{#each item.forecast.filter(filterByDateSelected) as f}
								<td class="border border-slate-600  p-2">
									<div class="flex flex-col w-20">
										<div class="flex flex-row justify-between">
											<span> 🌡 </span>
											{round(tempCtoF(f.weather.Tair), 0)}f
										</div>
										<div class="flex flex-row justify-between">
											<span> 💨 </span>
											{round(windToMPH(f.weather.wind), 0)}mph
										</div>
										<div class="flex flex-row justify-between">
											<span> 🌧 </span>
											{round(rainToMMPerHour(f.weather.rain), 2)}mm/h
										</div>
									</div>
								</td>
							{/each}
						</tr>
					</tbody>
				</table>
			</div>
		{/each}
	</section>
</section>

<style>
	pre {
		width: '100%';
		max-width: '100%';
		overflow-x: 'auto';
	}
	section {
		/* display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6; */
	}

	h1 {
		width: 100%;
	}
</style>
