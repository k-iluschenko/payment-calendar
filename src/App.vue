<script setup lang="ts">
import { colors, STATUSES, monthList } from './data/constants'
import { RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { format, getMonth, getYear, getDaysInMonth, isSaturday, isWednesday } from 'date-fns'

import dataRaw09 from './data/09.json'
import dataRaw10 from './data/10.json'
import dataRaw11 from './data/11.json'
import ReloadPWA from './ReloadPWA.vue'

interface IStatuses {
  [key: string]: string;
}

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

interface IData {
  [key: string]: Array<string>
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
    postponed: []
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

let isShow = ref(false)
const isShowHandler = (): void => {
  isShow.value = !isShow.value
}

</script>

<template>
  <!-- <span @click="get">test request</span> -->
  <ReloadPWA/>
  <div class="wrapper">
    <section class="calendar">
      <v-calendar :attributes='attrs' @update:from-page="CurrentMonthYear" />
    </section>
    <section :style="{'display': 'flex'}">
      <div :style="{'margin-right': '20px'}">
        {{monthList[currentMonth]}} ({{900 * getData(currentMonth)['paid'].length}}р.)
        <div v-for="key of Object.keys(status)" :key="key" @click="isShowHandler">
          <span :style="{display: 'inline-block', width: '10px', height: '10px', backgroundColor: colors[key]}"></span>
          {{status[key]}} : {{getData(currentMonth)[key].length }}
          <div v-show="isShow" class="dates">
            <p v-for="date of getData(currentMonth)[key]" :key="date.toString()">{{format(new
          Date(date), 'dd.MM.yyyy')}}</p>
          </div>
        </div>
      </div>
    </section>
  </div>

</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
}

.calendar {
  margin-right: 20px;
}

</style>
