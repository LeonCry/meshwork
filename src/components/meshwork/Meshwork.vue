<script setup lang="ts">
import { useMeshWorkStore } from "./context.ts";
import {storeToRefs} from "pinia";
const meshwork = useMeshWorkStore();
const { upText,downText,upWidth,downWidth,totalWidth,dayWidth } = storeToRefs(meshwork);
console.log(dayWidth);
</script>

<template>
  <Header />
  <div class="h-96 border mt-2 bg-green-50 overflow-x-auto">
<!--    上方的时间span 年-月 -->
    <div class="h-10 border-b" :style="{width:totalWidth + 'px'}">
      <TimeBlock v-for="(item,index) in upText" :key="index" :block-width="upWidth[index]" :text="item" />
    </div>
<!--    下方的时间span 月-日-->
    <div class="h-10 border-b" :style="{width:totalWidth + 'px'}">
      <TimeBlock v-for="(item,index) in downText" :key="index" :block-width="downWidth[index]" :text="item" />
    </div>
  </div>
</template>

<style scoped>

</style>