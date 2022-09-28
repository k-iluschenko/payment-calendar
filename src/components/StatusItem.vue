<template>
    <div>
        <span :style="{display: 'inline-block', width: '10px', height: '10px', backgroundColor: color}"></span>
        {{status}} : {{lessonsList.length }}
        <div v-show="isShow" class="dates">
            <p v-for="date of lessonsList" :key="date.toString()">{{format(new
            Date(date), 'dd.MM.yyyy')}}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const statusItemProps = defineProps<{
    color: string,
    status: string,
    lessonsList: string[],
    isShow: boolean,
}>()


</script>

<style scoped lang="scss">

</style>