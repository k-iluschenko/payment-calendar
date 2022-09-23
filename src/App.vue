<script setup lang="ts">
import { colors, STATUSES, monthList } from './data/constants'
import { RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { format, getMonth, getYear, getDaysInMonth, isSaturday, isWednesday } from 'date-fns'

import dataRaw09 from './data/09.json'
import dataRaw10 from './data/10.json'
import dataRaw11 from './data/11.json'

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
const currentMonth = getMonth(new Date())
const currentYear = getYear(new Date())
const daysInMonth = getDaysInMonth(new Date(currentYear, currentMonth))

const datesList: IDates = {}

for (let month = startMonth - 1; month <= currentMonth + 2; month++) {
  datesList[month] = []
  for (let i = 1; i <= daysInMonth; i++) {
    const d: Date = new Date(currentYear, month, i);
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
  // dates: {
  //   start: new Date(2022, 9 - 1, 17),
  //   end: new Date(2023, 7 - 1, 31),
  //   weekdays: [4, 7]
  // },
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

// const lessonsCount = {
//   paid: ,
//   unPaid: ,
//   visited: ,
//   missed: ,
// }

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
    case 8: data = { ...data09 };
      break;
    case 9: data = {...data10};
      break;
    case 10: data = {...data11};
      break;
    default: data
  }
  return data
}


</script>

<template>
  <header>
    <div class="wrapper">
      <v-calendar :columns="4" :rows="2"
        :attributes='attrs' />
    </div>
  </header>

  <!-- <RouterView /> -->
  <div :style="{'display': 'flex'}">
    <div v-for="dates of datesList" :key="dates.toString()" :style="{'margin-right': '20px'}">
      {{monthList[getMonth(new Date(dates[0]))]}} ({{900 * getData(getMonth(new
      Date(dates[0])))['paid'].length}}р.)
      <div v-for="key of Object.keys(status)" :key="key">
        <span :style="{display: 'inline-block', width: '10px', height: '10px', backgroundColor: colors[key]}"></span>
        {{status[key]}} : {{getData(getMonth(new Date(dates[0])))[key].length }}
        <p v-for="date of getData(getMonth(new Date(dates[0])))[key]" :key="date.toString()">{{format(new
        Date(date), 'dd.MM.yyyy')}}</p>
      </div>
    </div>
  </div>


</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}



@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
