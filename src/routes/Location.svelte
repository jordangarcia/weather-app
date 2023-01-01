<script lang="ts">
	import { chunk } from 'lodash';
	import ForecastTable from './ForecastTable.svelte';
	import type { FullWeatherData } from './weather';

	export let name: string;
	export let forecast: FullWeatherData[];
</script>

<h1 class="text-3xl mb-2">
	{name}
</h1>

<div class="overflow-x-auto max-w-full pb-4">
	{#each chunk(forecast, 4) as data}
		<ForecastTable {data} />
	{/each}
</div>
