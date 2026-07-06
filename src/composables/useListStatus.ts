import { computed, type Ref } from 'vue'

export const useListStatus = <T>(items: Ref<T[]>, isLoading: Ref<boolean>) => {
  const hasItems = computed(() => items.value.length > 0)
  const isEmpty = computed(() => !isLoading.value && !hasItems.value)
  const isInitialLoading = computed(() => {
    return isLoading.value && !hasItems.value
  })
  const isTableLoading = computed(() => {
    return isLoading.value && hasItems.value
  })

  return {
    hasItems,
    isEmpty,
    isInitialLoading,
    isTableLoading,
  }
}
