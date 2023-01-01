<script lang="ts">
  import { DateTime } from 'luxon'
  import type { FullWeatherData } from './weather'

  export let forecast: FullWeatherData[]
  export let onPrevDay: () => void
  export let onNextDay: () => void
  export let dateSelected: DateTime

  $: canGoPrev = forecast.some(
    (item) =>
      DateTime.fromISO(item.time).toFormat('LLL dd') ===
      dateSelected.plus({ days: -1 }).toFormat('LLL dd')
  )
  $: canGoNext = forecast.some(
    (item) =>
      DateTime.fromISO(item.time).toFormat('LLL dd') ===
      dateSelected.plus({ days: 1 }).toFormat('LLL dd')
  )
</script>

<section class="flex flex-col justify-center items-center top bg-slate-500 h-12 ">
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
