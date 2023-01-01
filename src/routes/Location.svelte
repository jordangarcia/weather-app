<script lang="ts">
  import ForecastHour from './ForecastHour.svelte'
  import type { FullWeatherData } from './weather'

  export let name: string
  export let forecast: FullWeatherData[]
</script>

<div class="flex flex-col location pb-8 items-center px-4 sm:px-0">
  <h1 class="text-3xl mb-2">
    {name}
  </h1>

  <div class="flex flex-col overflow-x-auto max-w-full">
    <div
      class="flex flex-row mx-auto justify-center md:justify-start flex-shrink-0 flex-wrap sm:flex-nowrap"
    >
      {#each forecast as hour}
        <ForecastHour item={hour} />
      {/each}
    </div>
  </div>
</div>
