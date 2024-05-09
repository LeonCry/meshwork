<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { reactive } from 'vue'
import { useMeshWorkStore } from './context.ts'
const meshwork = useMeshWorkStore()
interface Mark {
  style: CSSProperties
  label: string
}

type Marks = Record<number, Mark | string>
const marks = reactive<Marks>({
  0: '3年',
  30: '年',
  60: '半年',
  90: '季',
  120: '月',
})
const GAP = 30
const MARK_ARR = [0, 30, 60, 90, 120]
const MARK_LENGTH = MARK_ARR.length - 1
const handleSliderMove = (isAdd: boolean) => {
  const baseIndex = MARK_ARR.includes(meshwork.sliderValue) ? MARK_ARR.indexOf(meshwork.sliderValue) : isAdd ? Math.floor(meshwork.sliderValue / GAP) : Math.ceil(meshwork.sliderValue / GAP)
  const ceilIndex = baseIndex === MARK_LENGTH ? MARK_LENGTH : baseIndex + 1
  const floorIndex = baseIndex === 0 ? 0 : baseIndex - 1
  return (meshwork.sliderValue = isAdd ? MARK_ARR[ceilIndex] : MARK_ARR[floorIndex])
}
</script>
<template>
  <div class="mt-52 w-full py-5 flex justify-center border bg-green-50">
    <ElButton class="!text-xl" @click="handleSliderMove(false)">-</ElButton>
    <ElSlider class="!w-80 px-4 slider" v-model="meshwork.sliderValue" :marks="marks" :min="0" :max="120" :show-tooltip="true" :step="2" :format-tooltip="() => '时间缩放标尺'" />
    <ElButton class="!text-xl" @click="handleSliderMove(true)">+</ElButton>
  </div>
</template>

<style scoped>
.slider:deep(.el-slider__button) {
  width: 15px;
  height: 15px;
}
.slider:deep(.el-slider__bar) {
  background-color: var(--el-slider-runway-bg-color);
}
</style>
