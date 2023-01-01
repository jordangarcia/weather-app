<script lang="ts">
	import { round } from 'lodash';
	import { DateTime } from 'luxon';
	import ForecastTableCell from './ForecastTableCell.svelte';
	import {
		computeScores,
		getGradientColor,
		rainToMMPerHour,
		SCORE_MAP,
		tempCtoF,
		windToMPH,
	} from './helpers';
	import type { FullWeatherData } from './weather';

	export let data: FullWeatherData[];
</script>

<table class="border-collapse border border-slate-500">
	{#each data as item}
		<th
			class="border border-slate-600 p-2"
			style="background: {getGradientColor(item.scores.overall_score)}"
		>
			<h3 class="text-center">
				{SCORE_MAP[item.scores.overall_score]}
				{DateTime.fromISO(item.time).toFormat('h:mma')}
			</h3>
		</th>
	{/each}
	<tbody>
		<tr>
			{#each data as item}
				<ForecastTableCell {item} />
			{/each}
		</tr>
	</tbody>
</table>
