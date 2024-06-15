// 由于使用了unplugin-auto-import插件
// 所以不需要导入相关模块可以直接使用
export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)

  // getters
  const doubleCount = computed(() => count.value * 2)

  // actions
  const add = () => {
    count.value++
  }

  // 需要手动返回
  return { count, doubleCount, add }
})
