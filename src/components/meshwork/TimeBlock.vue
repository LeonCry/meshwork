<script setup lang="ts">
  defineProps<{
    blockWidth: number;
    text: number | string;
  }>();
</script>

<template>
  <div class="h-full bg-amber-100 border-l border-gray-500 inline-block items-end border-box" :style="{width:blockWidth + 'px'}">
    <span class="pl-2 leading-[40px]"> {{text}} </span>
  </div>
</template>

<style scoped>
.border-box {
  box-sizing: border-box;
}
</style>