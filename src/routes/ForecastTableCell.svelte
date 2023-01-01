<script lang="ts">
  import { round } from 'lodash-es'
  import { rainToMMPerHour, tempCtoF, windToMPH } from './helpers'
  import type { FullWeatherData } from './weather'

  export let item: FullWeatherData
</script>

<td class="border border-slate-600  p-2">
  <div class="flex flex-col w-24">
    <div class="flex flex-row justify-between">
      <span> 🌡: </span>
      {round(tempCtoF(item.weather.Tair), 0)}f
    </div>
    <div class="flex flex-row justify-between">
      <span> 💨: </span>
      {round(windToMPH(item.weather.wind), 0)}mph
    </div>
    <div class="flex flex-row justify-between">
      <span> 🌧: </span>
      {round(rainToMMPerHour(item.weather.rain), 2)}mm/h
    </div>
    <div class="flex flex-col overflow-auto">
      <pre>{JSON.stringify(item, null, ' ')}</pre>
    </div>
  </div>
</td>
