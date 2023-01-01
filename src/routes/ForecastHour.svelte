<script lang="ts">
  import { round } from 'lodash'
  import { DateTime } from 'luxon'
  import {
    getCategoryEmoji,
    getGradientColor,
    rainToMMPerHour,
    SCORE_MAP,
    tempCtoF,
    windToMPH,
  } from './helpers'
  import type { FullWeatherData } from './weather'

  export let item: FullWeatherData

  $: emojis = Object.entries(item.scores)
    .filter(([key, score]) => score < 4)
    .map(([key, value]) => getCategoryEmoji(key))
    .filter((a) => !!a)
    .join(' ')

  const rainDescription = {
    0: 'heavy',
    1: 'medium',
    2: 'light',
    3: 'drizzle',
    4: 'none',
  }
</script>

<div class="flex flex-col items-center mb-4" style="margin-right: 2px;">
  <h3 class="text-center flex flex-col w-16 items-center justify-center">
    {DateTime.fromISO(item.time).toFormat('h:mma')}
  </h3>
  <div class="flex flex-col border border-slate-600 w-20">
    <header class="flex-1 p-2" style="background: {getGradientColor(item.scores.overall_score)}">
      <!-- <h3 class="text-center flex flex-col w-16 items-center justify-center">
        {DateTime.fromISO(item.time).toFormat('h:mma')}
      </h3> -->
      <div class="flex flex-row items-center justify-center" style="height: 32px">
        <span class="text-lg font-bold">
          {round(tempCtoF(item.weather.Tair), 0)}º
        </span>
      </div>
      <div class="flex flex-row items-center justify-center" style="height: 32px">
        {#if emojis}
          <span class="text-2xl">
            {emojis}
          </span>
        {/if}
      </div>
    </header>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <section
      class="p-2 bg-white border-t border-slate-600 flex flex-col items-center"
      on:click={() => console.log(item)}
    >
      <!-- <div class="flex flex-row justify-between">
        <span> 🌡: </span>
        {round(tempCtoF(item.weather.Tair), 0)}f
      </div> -->
      <div class="flex flex-row justify-between text-xs">
        <!-- <span> 💨: </span> -->
        {round(windToMPH(item.weather.wind), 0)} mph
      </div>
      <div class="flex flex-col justify-between text-xs items center">
        <span
          >{rainDescription[item.scores.rain_score]}{#if item.scores.rain_score < 4} 🌧{/if}
        </span>
      </div>
      <!-- <div class="flex flex-col justify-between text-sm items center">
        <span>{round(rainToMMPerHour(item.weather.rain), 1)}mm/h</span>
      </div> -->
      <div class="flex flex-col overflow-auto">
        <!-- <pre>{JSON.stringify(item, null, ' ')}</pre> -->
      </div>
    </section>
  </div>
</div>
