<script lang="ts">
	import { DateTime } from 'luxon';
	import type { PageData } from './$types';
	import Header from './Header.svelte';
	import Location from './Location.svelte';
	import type { FullWeatherData } from './weather';

	export let data: PageData;

	let dateSelected: DateTime = data.today;

	const START_HOUR = 7;
	const END_HOUR = 22;
	// reactive shit
	$: filterByDateSelected = (item: FullWeatherData) => {
		const sameDay =
			DateTime.fromISO(item.time).toFormat('LLL dd') === dateSelected.toFormat('LLL dd');
		const hour = DateTime.fromISO(item.time).hour;
		return sameDay && hour >= START_HOUR && hour <= END_HOUR;
	};
</script>

<section>
	<Header
		{data}
		{dateSelected}
		onPrevDay={() => {
			dateSelected = dateSelected.plus({ days: -1 });
		}}
		onNextDay={() => {
			dateSelected = dateSelected.plus({ days: 1 });
		}}
	/>

	<section class="content p-4">
		{#each data.weather as location}
			<Location name={location.id} forecast={location.forecast.filter(filterByDateSelected)} />
		{/each}
	</section>
</section>
