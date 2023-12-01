<script setup lang="ts">
import { useMeshWorkStore } from "./context.ts";

const meshwork = useMeshWorkStore();
console.log(meshwork);
</script>

<template>
  <Header />
  <div class="w-full h-96 border mt-2 bg-green-50">
<!--    上方的时间span 年-月 -->
    <div class="h-10 border-b">
      <TimeBlock :block-width="80" :text="1" />
      <TimeBlock :block-width="80" :text="1" />
    </div>
<!--    下方的时间span 月-日-->
    <div class="h-10 border-b">

    </div>
  </div>
</template>

<style scoped>

</style>