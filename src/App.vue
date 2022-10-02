<script setup lang="ts">
import { colors, STATUSES, monthList } from './data/constants'
import { ref, watch } from 'vue'
import { format, getMonth, getYear, getDaysInMonth, isSaturday, isWednesday } from 'date-fns'

import dataRaw09 from './data/09.json'
import dataRaw10 from './data/10.json'
import dataRaw11 from './data/11.json'
import ReloadPWA from './ReloadPWA.vue'
import StatusesList from './components/StatusesList.vue'
import type { IStatuses, IData } from '@/types'
import Title from './components/Title.vue'

type DateType = Date | string
interface IDates {
  [key: string]: Array<DateType>
}

type Data = {
  paid: string[];
  unPaid: string[];
  visited: string[];
  missed: string[];
  postponed: string[];
}

// const timer = setInterval(() => {
//   localStorage.setItem('status', JSON.stringify(status))
//   localStorage.setItem('dates', JSON.stringify(dates))
//   localStorage.setItem('missed', JSON.stringify(missed))
//   localStorage.setItem('paid', JSON.stringify(paid))
//   localStorage.setItem('visited', JSON.stringify(visited))
//   localStorage.setItem('unPaid', JSON.stringify(unPaid))
//   localStorage.setItem('postponed', JSON.stringify(postponed))
// }, 30000)

// onUnmounted(() => {
//   clearInterval(timer)
// })

let status: IStatuses
const json = localStorage.getItem('status')

if (json && json === JSON.stringify(STATUSES)) {
  status = JSON.parse(json)
} else {
  status = { ...STATUSES }
}

const data09: IData = dataRaw09
const data10: IData = dataRaw10
const data11: IData = dataRaw11

const data: IData = Object.keys(dataRaw09).reduce((obj: IData, key: string) => {
  obj[key] = [...data09[key], ...data10[key], ...data11[key]]
  return obj
}, {})
console.log(data);

const dates: IDates = Object.keys(data).reduce((obj: IDates, key: string) => {
  obj[key] = data[key].map((d: string) => new Date(d))
  return obj
}, {})


const startMonth = 9 // Сентябрь
const nowMonth = getMonth(new Date())
const nowYear = getYear(new Date())

const daysInMonth = getDaysInMonth(new Date(nowYear, nowMonth))

const datesList: IDates = {}

for (let month = startMonth - 1; month <= nowMonth + 2; month++) {
  datesList[month] = []
  for (let i = 1; i <= daysInMonth; i++) {
    const d: Date = new Date(nowYear, month, i);
    if (isWednesday(d) || isSaturday(d))
      datesList[month].push(format(d, 'yyyy-MM-dd'))
  }
}

console.log(datesList);

const postponed = {
  highlight: {
    color: colors.postponed,
    contentStyle: { color: colors.postponed },
  },
  dates: dates.postponed,
  popover: {
    label: status.postponed,
  },
  order: 2,
}

const missed = {
  highlight: {
    color: colors.missed,
    contentStyle: { color: colors.missed }
  },
  dates: dates.missed,
  popover: {
    label: status.missed,
  },
}

const paid = {
  dot: colors.paid,
  dates: dates.paid,
  popover: {
    label: status.paid,
  },
}

const visited = {
  highlight: {
    color: colors.visited,
    contentStyle: { color: colors.visited },
  },
  dates: dates.visited,
  popover: {
    label: status.visited,
  },
}

const unPaid = {
  highlight: colors.unPaid,
  dates: dates.unPaid,
  popover: {
    label: status.unPaid,
  },
  excludeDates: [
    ...dates.paid,
    ...dates.visited,
    ...dates.missed,
    ...dates.postponed
  ]
}

const attrs = [
  paid,
  visited,
  unPaid,
  missed,
  postponed,
]

const getData = (id: number): IData => {
  let data: IData = {
    paid: [],
    unPaid: [],
    visited: [],
    missed: [],
    postponed: [],
  }
  switch (id) {
    case 9: data = { ...data09 };
      break;
    case 10: data = { ...data10 };
      break;
    case 11: data = { ...data11 };
      break;
    default: data
  }
  return data
}

const get = async () => {
  const res = await fetch('https://silver-elk-toga.cyclic.app/')
  const json = await res.json()
}

let currentMonth = ref(0)
let currentYear = ref(0)
const CurrentMonthYear = (page: { month: number, year: number }): void => {
  currentMonth.value = page.month
  currentYear.value = page.year
}

watch(currentMonth, (currentMonth) => {
  totalCost.value = 900 * getData(currentMonth)['paid'].length
  
})
let totalCost = ref(900 * getData(currentMonth.value)['paid'].length)


</script>

<template>
  <!-- <span @click="get">test request</span> -->
  <ReloadPWA />
  <div class="wrapper">
    <section class="calendar">
      <v-calendar :attributes='attrs' @update:from-page="CurrentMonthYear" />
    </section>
    <section :style="{'display': 'flex'}">
      <div :style="{'margin-right': '20px'}">
        <Title>
          {{monthList[currentMonth]}}
          <span>(Оплачено {{totalCost}}р.)</span>
        </Title>
        <StatusesList :statuses='status' :lessonsList="getData(currentMonth)"></StatusesList>
      </div>
    </section>
  </div>

</template>

<style scoped lang="scss">
.calendar {
  margin-bottom: 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
