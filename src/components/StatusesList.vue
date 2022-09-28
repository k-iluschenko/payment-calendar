<template>
  <div class="cursor " v-for="key of Object.keys(statuses)" :key="key" @click="() => isShowHandler(key)">
    <status-item :isShow='isShow[key]' :color="colors[key]" :status="statuses[key]" :lessonsList="lessonsList[key]">
    </status-item>
  </div>
</template>

<script setup lang="ts">
import { colors } from '@/data/constants';
import type { IStatuses, IData } from '@/types';
import { ref } from 'vue';
import StatusItem from './StatusItem.vue'

interface IShow {
  [key: string]: boolean;
}

let isShow = ref<IShow>({})
const isShowHandler = (key: string): void => {
  isShow.value[key] = !isShow.value[key]
}

const statusesListProps = defineProps<{
  statuses: IStatuses,
  lessonsList: IData,
}>()

</script>

<style scoped lang="scss">
.cursor {
  cursor: pointer;
}
</style>