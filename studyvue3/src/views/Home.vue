<script setup lang="ts">
import { useCounterStore } from '@/store/counter'
import { getImgUrl } from '@/utils/tools'

const counterStore = useCounterStore()
const { count, doubleCount } = storeToRefs(counterStore)
const add = () => {
  counterStore.add()
}

const { x, y } = useMouse()

const logoImg = getImgUrl('logo.png')
</script>

<template>
  <div class="root">
    <img :src="logoImg" />
    <my-title></my-title>
    <div class="count">count: {{ count }}</div>
    <div class="double">double: {{ doubleCount }}</div>
    <n-button type="primary" @click="add" size="large">ADD</n-button>
    <n-card title="useMouse" style="width: 500px; margin-top: 50px"> {{ x }} ---- {{ y }} </n-card>
  </div>
</template>

<style scoped lang="scss">
.root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #894276;

  .title {
    color: #fff;
    margin-bottom: 40px;
  }

  .count,
  .double,
  .add {
    color: #fff;
    margin-bottom: 20px;
    font-size: 20px;
  }

  .add {
    cursor: pointer;
    padding: 10px 50px;
    border-radius: 40px;
    background-color: #cc87a6;
    user-select: none;

    &:hover {
      background-color: #7e1671;
    }
  }
}
</style>
