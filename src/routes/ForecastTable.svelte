<script lang="ts">
  import ForecastTableCell from './ForecastTableCell.svelte'
  import type { FullWeatherData } from './weather'

  export let data: FullWeatherData[]
</script>

<table class="border-collapse border border-slate-500">
  <tbody>
    <tr>
      {#each data as item}
        <ForecastTableCell {item} />
      {/each}
    </tr>
  </tbody>
</table>
