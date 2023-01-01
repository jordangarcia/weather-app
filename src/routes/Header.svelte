<script lang="ts">
	import { DateTime } from 'luxon';
	import type { PageData } from './$types';

	export let data: PageData;
	export let onPrevDay: () => void;
	export let onNextDay: () => void;
	export let dateSelected: DateTime;

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
</script>

<section class="flex flex-col justify-center items-center top bg-yellow-500 h-12 ">
	<div class="flex flex-row items-center gap-2">
		<button
			on:click={onPrevDay}
			disabled={!canGoPrev}
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">prev</button
		>
		<h3 class="text-xl">
			{dateSelected.toFormat('LLL dd')}
		</h3>

		<button
			on:click={onNextDay}
			disabled={!canGoNext}
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">next</button
		>
	</div>
</section>
