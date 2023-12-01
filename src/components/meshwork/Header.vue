<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { reactive } from "vue";
import { useMeshWorkStore } from "./context.ts";
const meshwork = useMeshWorkStore();
interface Mark {
  style: CSSProperties;
  label: string;
}

type Marks = Record<number, Mark | string>;
const marks = reactive<Marks>({
  10: '3年',
  30: '年',
  60: '半年',
  90:'季',
  120:'月',
});
const GAP = 30;
const MARKARR = [10,30,60,90,120];
const MARKLENGTH = MARKARR.length - 1;
const handleSliderMove = (isAdd:boolean) => {
  const baseIndex = MARKARR.includes(meshwork.sliderValue) ? MARKARR.indexOf(meshwork.sliderValue) : Math.ceil(meshwork.sliderValue / GAP);
  const ceilIndex = baseIndex === MARKLENGTH ? MARKLENGTH : baseIndex + 1;
  const floorIndex = baseIndex === 0 ? 0 : baseIndex - 1;
  return meshwork.sliderValue = isAdd ? MARKARR[ceilIndex] : MARKARR[floorIndex];
}
</script>
<template>
  <div class="mt-52 w-full py-5 flex justify-center border bg-green-50">
    <ElButton class="!text-xl" @click="handleSliderMove(false)">-</ElButton>
    <ElSlider class="!w-80 px-4" v-model="meshwork.sliderValue" :marks="marks" :min="10" :max="120" :show-tooltip="false"/>
    <ElButton class="!text-xl" @click="handleSliderMove(true)">+</ElButton>
  </div>
</template>

<style scoped>

</style>